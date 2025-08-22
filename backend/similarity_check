"""
FastAPI backend for English pronunciation assessment using Microsoft Azure Speech SDK.

Features
- Accepts user-uploaded audio (wav/mp3/m4a/webm) and a reference text (word/phrase/sentence).
- Uses Azure Pronunciation Assessment to compute overall score and detailed word / syllable / phoneme scores.
- Multi-syllable support: runs three granular assessments (Word, Syllable, Phoneme) and merges results.
- Returns clean JSON with alignment metadata (offset/duration in seconds), plus per-word breakdown.
- Sensible defaults, robust error handling, and easy to deploy.

Setup
1) Python 3.9+
2) pip install -r requirements:
   fastapi
   uvicorn[standard]
   azure-cognitiveservices-speech
   python-multipart
3) Set environment variables:
   AZURE_SPEECH_KEY=<your-key>
   AZURE_SPEECH_REGION=<your-region>  # e.g., eastus, westus2, westeurope

Run
   uvicorn main:app --reload --port 8000

Example (curl)
   curl -X POST "http://localhost:8000/assess" \
     -F "audio=@/path/to/recording.wav" \
     -F "text=photography is a wonderful hobby" \
     -F "language=en-US" \
     -F "proficiency=Intermediate"

Notes
- Audio is temporarily saved to disk and deleted after processing.
- For production, consider persistent storage, HTTPS, authentication, and request limits.
- Azure billing applies per assessment call.
"""

import json
import os
import tempfile
from typing import Any, Dict, List, Optional

from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.responses import JSONResponse
from pydantic import BaseModel

# Azure Speech SDK
try:
    import azure.cognitiveservices.speech as speechsdk
except Exception as e:
    raise RuntimeError(
        "azure-cognitiveservices-speech not installed.\n"
        "Run: pip install azure-cognitiveservices-speech"
    ) from e

app = FastAPI(title="Pronunciation Assessment API", version="1.0.0")


# ---------- Utilities ----------

def _speech_config(language: str) -> speechsdk.SpeechConfig:
    key = os.getenv("AZURE_SPEECH_KEY")
    region = os.getenv("AZURE_SPEECH_REGION")
    if not key or not region:
        raise HTTPException(status_code=500, detail="Azure speech credentials not configured.")
    cfg = speechsdk.SpeechConfig(subscription=key, region=region)
    cfg.speech_recognition_language = language
    # Optionally tune profanity filtering etc.:
    # cfg.set_profanity(speechsdk.ProfanityOption.Raw)
    return cfg


def _assess_once(
    audio_path: str,
    reference_text: str,
    language: str,
    granularity: speechsdk.PronunciationAssessmentGranularity,
    enable_miscue: bool = True,
    phoneme_alphabet: str = "Ipa",
    enable_prosody: bool = False,
) -> Dict[str, Any]:
    """Run a single Azure PA pass and return a parsed dict."""
    cfg = _speech_config(language)
    audio_cfg = speechsdk.AudioConfig(filename=audio_path)
    recognizer = speechsdk.SpeechRecognizer(speech_config=cfg, audio_config=audio_cfg)

    pa_cfg = speechsdk.PronunciationAssessmentConfig(
        reference_text=reference_text,
        grading_system=speechsdk.PronunciationAssessmentGradingSystem.HundredMark,
        granularity=granularity,
        enable_miscue=enable_miscue,
    )
    # Optional phoneme alphabet (Ipa/Sapi). Default is Ipa in most SDKs.
    try:
        pa_cfg.phoneme_alphabet = phoneme_alphabet
    except Exception:
        pass

    if enable_prosody and hasattr(pa_cfg, "enable_prosody_assessment"):
        try:
            pa_cfg.enable_prosody_assessment()
        except Exception:
            pass

    pa_cfg.apply_to(recognizer)

    result = recognizer.recognize_once()
    if result.reason != speechsdk.ResultReason.RecognizedSpeech:
        # Return diagnostics for easier debugging on client side
        raise HTTPException(
            status_code=400,
            detail={
                "message": "Recognition failed",
                "reason": str(result.reason),
                "no_match_details": getattr(result, "no_match_details", None),
                "cancellation_details": getattr(speechsdk.CancellationDetails.from_result(result), "reason", None)
                if result.reason == speechsdk.ResultReason.Canceled
                else None,
            },
        )

    pa_result = speechsdk.PronunciationAssessmentResult(result)

    # High-level scores
    out: Dict[str, Any] = {
        "pronunciationScore": pa_result.pronunciation_score,
        "accuracyScore": pa_result.accuracy_score,
        "fluencyScore": pa_result.fluency_score,
        "completenessScore": pa_result.completeness_score,
        "granularity": granularity.name if hasattr(granularity, "name") else str(granularity),
        "recognizedText": result.text,
        "offsetSec": getattr(result, "offset", 0) / 10_000_000.0,
        "durationSec": getattr(result, "duration", 0) / 10_000_000.0,
        "words": [],
    }

    # Word-level details (present in most granularities)
    for w in pa_result.words:
        word_item: Dict[str, Any] = {
            "word": w.word,
            "accuracyScore": w.accuracy_score,
            "errorType": w.error_type.name if hasattr(w.error_type, "name") else str(w.error_type),
            "offsetSec": getattr(w, "offset", 0) / 10_000_000.0,
            "durationSec": getattr(w, "duration", 0) / 10_000_000.0,
        }
        # Syllables (available if granularity is Syllable, sometimes included otherwise depending on SDK)
        if getattr(w, "syllables", None):
            word_item["syllables"] = [
                {
                    "syllable": s.syllable,
                    "accuracyScore": s.accuracy_score,
                    "offsetSec": getattr(s, "offset", 0) / 10_000_000.0,
                    "durationSec": getattr(s, "duration", 0) / 10_000_000.0,
                }
                for s in w.syllables
            ]
        # Phonemes (available if granularity is Phoneme)
        if getattr(w, "phonemes", None):
            word_item["phonemes"] = [
                {
                    "phoneme": p.phoneme,
                    "accuracyScore": p.accuracy_score,
                    "offsetSec": getattr(p, "offset", 0) / 10_000_000.0,
                    "durationSec": getattr(p, "duration", 0) / 10_000_000.0,
                }
                for p in w.phonemes
            ]
        out["words"].append(word_item)

    return out


def _merge_results(results: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Merge multiple PA passes (Word/Syllable/Phoneme) by word token.
    Strategy: use the highest granularity details when present; keep separate overall scores.
    """
    merged: Dict[str, Any] = {
        "recognizedText": results[0].get("recognizedText"),
        "durationSec": results[0].get("durationSec"),
        "offsetSec": results[0].get("offsetSec"),
        "overall": {
            r["granularity"].lower(): {
                k: r[k]
                for k in [
                    "pronunciationScore",
                    "accuracyScore",
                    "fluencyScore",
                    "completenessScore",
                ]
            }
            for r in results
        },
        "words": [],
    }

    # Build word-index maps by token sequence
    word_maps: Dict[str, Dict[int, Dict[str, Any]]] = {}
    for r in results:
        key = r["granularity"].lower()
        word_maps[key] = {i: w for i, w in enumerate(r.get("words", []))}

    # Choose a baseline (word-level if available, else the first)
    baseline_key = "word" if "word" in word_maps else list(word_maps.keys())[0]
    baseline_map = word_maps[baseline_key]

    for idx, w in baseline_map.items():
        merged_item = dict(w)  # start with baseline details
        # enrich with syllables and phonemes when available
        if "syllable" in word_maps and idx in word_maps["syllable"]:
            sw = word_maps["syllable"][idx]
            if sw.get("syllables"):
                merged_item["syllables"] = sw["syllables"]
        if "phoneme" in word_maps and idx in word_maps["phoneme"]:
            pw = word_maps["phoneme"][idx]
            if pw.get("phonemes"):
                merged_item["phonemes"] = pw["phonemes"]
        merged["words"].append(merged_item)

    return merged


# ---------- Request/Response Models ----------

class AssessResponse(BaseModel):
    recognizedText: str
    durationSec: float
    offsetSec: float
    overall: Dict[str, Dict[str, float]]
    words: List[Dict[str, Any]]


# ---------- Routes ----------

@app.post("/assess", response_model=AssessResponse)
async def assess_pronunciation(
    audio: UploadFile = File(..., description="User recording file (wav/mp3/m4a/webm)"),
    text: str = Form(..., description="Reference text the learner attempted to say"),
    language: str = Form("en-US", description="BCP-47 locale, e.g., en-US, en-GB"),
    enable_prosody: bool = Form(False, description="If supported, include prosody (pitch, rhythm) assessment"),
    proficiency: str = Form("General", description="Optional label: Beginner/Intermediate/Advanced/General"),
) -> JSONResponse:
    """Assess pronunciation using Azure PA at Word/Syllable/Phoneme levels and merge results.

    Multi-syllable words are handled automatically by Azure; this endpoint aggregates all details per word.
    """
    if not text or not text.strip():
        raise HTTPException(status_code=400, detail="Reference text must not be empty.")

    # Persist upload to a temp file for SDK
    suffix = os.path.splitext(audio.filename or "upload.wav")[1].lower() or ".wav"
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            tmp.write(await audio.read())
            tmp_path = tmp.name
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to persist uploaded audio.")

    try:
        results: List[Dict[str, Any]] = []
        # Three granular passes; comment out any you don't need to save cost/latency
        results.append(
            _assess_once(
                tmp_path,
                text,
                language,
                speechsdk.PronunciationAssessmentGranularity.Word,
                enable_miscue=True,
                enable_prosody=enable_prosody,
            )
        )
        results.append(
            _assess_once(
                tmp_path,
                text,
                language,
                speechsdk.PronunciationAssessmentGranularity.Syllable,
                enable_miscue=True,
                enable_prosody=enable_prosody,
            )
        )
        results.append(
            _assess_once(
                tmp_path,
                text,
                language,
                speechsdk.PronunciationAssessmentGranularity.Phoneme,
                enable_miscue=True,
                enable_prosody=enable_prosody,
            )
        )
        merged = _merge_results(results)
        # Add some simple app-level scoring normalization examples (optional)
        # E.g., combine Azure overall scores into a single 0-100 for your UI
        o = merged.get("overall", {})
        combined = None
        try:
            # Weight word-level pronunciation more; tweak as you like
            combined = round(
                0.5 * o.get("word", {}).get("pronunciationScore", 0)
                + 0.3 * o.get("word", {}).get("accuracyScore", 0)
                + 0.1 * o.get("word", {}).get("fluencyScore", 0)
                + 0.1 * o.get("word", {}).get("completenessScore", 0),
                2,
            )
        except Exception:
            combined = None
        merged["overall"]["combined"] = {"score": combined, "proficiencyTag": proficiency}

        return JSONResponse(content=AssessResponse(**merged).model_dump())
    finally:
        try:
            os.remove(tmp_path)
        except Exception:
            pass


@app.get("/health")
async def health() -> Dict[str, str]:
    return {"status": "ok"}
