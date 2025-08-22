"""
Report generator for English pronunciation practice.

- Collects student assessments (from the pronunciation assessment API).
- Stores per-session results (date, score, reference text, etc.).
- Generates weekly and monthly AI reports with stats and insights.
- Each report includes:
  * Total practice days (active days)
  * Total practice sessions (times)
  * Average / best / trend of scores
  * Estimated proficiency level
  * Motivational AI-style summary
- At week/month end, report is appended to student report history.

Dependencies: pandas, pydantic
pip install pandas pydantic

This module is designed to be used alongside the FastAPI backend.
You can persist session_data and report_history in a database (e.g., SQLite, MongoDB).
Here we use in-memory dicts for demonstration.
"""

import datetime
import statistics
from typing import Dict, List, Optional

import pandas as pd
from pydantic import BaseModel

# ----------------- Data Models -----------------

class SessionRecord(BaseModel):
    user_id: str
    date: datetime.date
    score: float
    reference_text: str
    duration_sec: float

class Report(BaseModel):
    user_id: str
    report_type: str  # "weekly" or "monthly"
    start_date: datetime.date
    end_date: datetime.date
    practice_days: int
    practice_times: int
    avg_score: float
    best_score: float
    level: str
    summary: str

# ----------------- In-memory Stores -----------------

# In production, replace with DB tables
session_data: Dict[str, List[SessionRecord]] = {}
report_history: Dict[str, List[Report]] = {}

# ----------------- Core Functions -----------------

def add_session(user_id: str, score: float, reference_text: str, duration_sec: float):
    today = datetime.date.today()
    record = SessionRecord(
        user_id=user_id,
        date=today,
        score=score,
        reference_text=reference_text,
        duration_sec=duration_sec,
    )
    session_data.setdefault(user_id, []).append(record)


import json
import datetime
from statistics import mean

# Mock database (replace with real DB if needed)
USER_DATA_FILE = "user_sessions.json"
REPORT_FILE = "user_reports.json"

# Learning stage mapping
grade_levels = {
    "kindergarten": "Kindergarten",
    "primary1": "Primary Grade 1",
    "primary2": "Primary Grade 2",
    "primary3": "Primary Grade 3",
    "primary4": "Primary Grade 4",
    "primary5": "Primary Grade 5",
    "primary6": "Primary Grade 6",
    "junior": "Junior High",
    "senior": "Senior High",
    "college": "College/Adult"
}

# Exam level mapping (IELTS/TOEFL/CEFR)
def get_exam_level(avg_score: float):
    if avg_score < 40:
        return "Beginner (≈ IELTS < 3.0, TOEFL < 30, CEFR A1)"
    elif avg_score < 50:
        return "Basic (≈ IELTS 3.0–4.5, TOEFL 30–45, CEFR A2)"
    elif avg_score < 60:
        return "Intermediate (≈ IELTS 5.0–5.5, TOEFL 46–59, CEFR B1)"
    elif avg_score < 75:
        return "Upper-Intermediate (≈ IELTS 6.0–6.5, TOEFL 60–78, CEFR B2)"
    elif avg_score < 90:
        return "Advanced (≈ IELTS 7.0–8.0, TOEFL 79–100, CEFR C1)"
    else:
        return "Expert (≈ IELTS > 8.0, TOEFL > 100, CEFR C2)"


def load_data(file):
    try:
        with open(file, "r", encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        return {}


def save_data(file, data):
    with open(file, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def add_session(user_id: str, score: float, grade: str):
    data = load_data(USER_DATA_FILE)
    if user_id not in data:
        data[user_id] = {"sessions": [], "grade": grade}
    data[user_id]["sessions"].append({
        "score": score,
        "timestamp": datetime.datetime.now().isoformat()
    })
    save_data(USER_DATA_FILE, data)


def generate_report(user_id: str, period: str = "weekly"):
    sessions_data = load_data(USER_DATA_FILE)
    reports_data = load_data(REPORT_FILE)

    if user_id not in sessions_data:
        return f"No data found for user {user_id}"

    grade = sessions_data[user_id].get("grade", "Unknown Grade")
    sessions = sessions_data[user_id]["sessions"]

    now = datetime.datetime.now()
    if period == "weekly":
        start_date = now - datetime.timedelta(days=7)
    elif period == "monthly":
        start_date = now - datetime.timedelta(days=30)
    else:
        return "Invalid period"

    period_sessions = [s for s in sessions if datetime.datetime.fromisoformat(s["timestamp"]) >= start_date]

    if not period_sessions:
        return f"No sessions in this {period} for user {user_id}"

    scores = [s["score"] for s in period_sessions]
    avg_score = mean(scores)
    max_score = max(scores)

    # Learning stage label
    grade_label = grade_levels.get(grade, grade)

    # Exam level label
    exam_level = get_exam_level(avg_score)

    # Combined stage and exam level label
    combined_label = f"{grade_label} + {exam_level}"

    report = {
        "user_id": user_id,
        "period": period,
        "generated_at": now.isoformat(),
        "grade_label": grade_label,
        "exam_level": exam_level,
        "combined_label": combined_label,
        "days_active": len(set([s["timestamp"][:10] for s in period_sessions])),
        "total_sessions": len(period_sessions),
        "average_score": round(avg_score, 2),
        "highest_score": round(max_score, 2),
        "summary": f"In this {period} period: You practiced on {len(set([s['timestamp'][:10] for s in period_sessions]))} days, with {len(period_sessions)} sessions. Average score: {round(avg_score, 2)}, Highest score: {round(max_score, 2)}. Learning stage: {grade_label}, Professional level: {exam_level}. Combined level: {combined_label}. Keep it up!"
    }

    if user_id not in reports_data:
        reports_data[user_id] = []
    reports_data[user_id].append(report)
    save_data(REPORT_FILE, reports_data)

    return report



# ----------------- Example Usage -----------------
if __name__ == "__main__":
    # Simulate sessions
    add_session("stu1", 82.5, "hello world", 2.5)
    add_session("stu1", 90.0, "good morning", 3.0)
    add_session("stu1", 70.0, "how are you", 2.2)

    weekly_report = generate_report("stu1", "weekly")
    monthly_report = generate_report("stu1", "monthly")

    print("Weekly Report:\n", weekly_report.json(indent=2))
    print("Monthly Report:\n", monthly_report.json(indent=2))
