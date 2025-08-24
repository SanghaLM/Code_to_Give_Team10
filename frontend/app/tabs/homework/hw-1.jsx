import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
  Animated,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Speech from "expo-speech";
import { Audio } from "expo-av";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topSection: {
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  progressContainer: {
    flex: 1,
    marginLeft: 20,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#FF9500",
    width: "25%",
    borderRadius: 4,
  },
  moduleInfo: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "BalsamiqSans_400Regular",
  },
  instructionContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  instruction: {
    fontSize: 28,
    fontFamily: "BalsamiqSans_700Bold",
    color: "#000",
    textAlign: "center",
  },
  mainContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  contentCard: {
    backgroundColor: "#f8f9fa",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    minWidth: 280,
  },
  emojiContainer: {
    width: 160,
    height: 160,
    backgroundColor: "#fff",
    borderRadius: 80,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  emoji: {
    fontSize: 100,
  },
  wordContainer: {
    marginBottom: 25,
    alignItems: "center",
  },
  word: {
    fontSize: 42,
    fontFamily: "BalsamiqSans_700Bold",
    color: "#007AFF",
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  audioButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#FF9500",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#FF9500",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  audioButtonPressed: {
    backgroundColor: "#e6850e",
    transform: [{ scale: 0.95 }],
  },
  recordButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#FF3B30",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#FF3B30",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  recordButtonActive: {
    backgroundColor: "#ff6b6b",
    transform: [{ scale: 1.1 }],
  },
  recordButtonPressed: {
    backgroundColor: "#d12b20",
    transform: [{ scale: 0.95 }],
  },
  playButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#007AFF",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  playButtonPressed: {
    backgroundColor: "#0056b3",
    transform: [{ scale: 0.95 }],
  },
  playButtonDisabled: {
    backgroundColor: "#cccccc",
    shadowColor: "#cccccc",
  },
  feedbackContainer: {
    marginTop: 20,
    padding: 15,
    borderRadius: 12,
    minWidth: 200,
    alignItems: "center",
  },
  feedbackSuccess: {
    backgroundColor: "#e8f5e8",
    borderColor: "#4caf50",
    borderWidth: 2,
  },
  feedbackRetry: {
    backgroundColor: "#fff3e0",
    borderColor: "#ff9800",
    borderWidth: 2,
  },
  feedbackProcessing: {
    backgroundColor: "#e3f2fd",
    borderColor: "#2196f3",
    borderWidth: 2,
  },
  characterContainer: {
    marginBottom: 10,
  },
  character: {
    fontSize: 40,
    textAlign: "center",
  },
  feedbackText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "BalsamiqSans_400Regular",
    marginBottom: 5,
  },
  feedbackTextSuccess: {
    color: "#2e7d32",
  },
  feedbackTextRetry: {
    color: "#f57c00",
  },
  feedbackTextProcessing: {
    color: "#1976d2",
  },
  encouragementText: {
    fontSize: 14,
    fontStyle: "italic",
    textAlign: "center",
    fontFamily: "BalsamiqSans_400Regular",
  },
  bottomSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: "flex-end",
  },
  nextButton: {
    backgroundColor: "#34C759",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    shadowColor: "#34C759",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  nextButtonDisabled: {
    backgroundColor: "#cccccc",
    shadowColor: "#cccccc",
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "BalsamiqSans_400Regular",
  },
});

export default function Hw1Screen() {
  const router = useRouter();
  const [audioPressed, setAudioPressed] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordPressed, setRecordPressed] = useState(false);
  const [pronunciationFeedback, setPronunciationFeedback] = useState(null);
  const [hasAttempted, setHasAttempted] = useState(false);
  const [isPlayingRecording, setIsPlayingRecording] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);

  const recording = useRef(null);
  const recordingUri = useRef(null);
  const playbackSound = useRef(null);

  // Word and emoji pairs
  const currentWord = "panda";
  const currentEmoji = "🐼";

  // Initialize audio permissions
  const setupAudio = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
    } catch (error) {
      console.log("Failed to setup audio:", error);
    }
  };

  React.useEffect(() => {
    setupAudio();
  }, []);

  // Cleanup function for sound
  React.useEffect(() => {
    return () => {
      if (playbackSound.current) {
        playbackSound.current.unloadAsync();
      }
    };
  }, []);

  const handleNext = () => {
    // Stop any ongoing speech or playback before navigating
    Speech.stop();
    if (playbackSound.current) {
      playbackSound.current.stopAsync();
    }
    setTimeout(() => {
      router.push("/tabs/homework/hw-2");
    }, 1000);
  };

  const handleAudioPress = async () => {
    setAudioPressed(true);

    try {
      // Stop any ongoing speech first
      await Speech.stop();

      setIsSpeaking(true);

      // Configure TTS options
      const options = {
        language: "en-US",
        pitch: 1.0,
        rate: 0.8,
        voice: null, // Use default voice
      };

      // Speak the word
      Speech.speak(currentWord, {
        ...options,
        onDone: () => {
          setIsSpeaking(false);
        },
        onStopped: () => {
          setIsSpeaking(false);
        },
        onError: (error) => {
          console.log("TTS Error:", error);
          setIsSpeaking(false);
        },
      });
    } catch (error) {
      console.log("Speech error:", error);
      setIsSpeaking(false);
    }

    // Reset button state after animation
    setTimeout(() => {
      setAudioPressed(false);
    }, 200);
  };

  const startRecording = async () => {
    try {
      // Stop any ongoing speech first
      await Speech.stop();

      console.log("Starting recording...");
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission required",
          "Please grant microphone permission to record audio."
        );
        return;
      }

      // Stop any existing recording
      if (recording.current) {
        await recording.current.stopAndUnloadAsync();
        recording.current = null;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const recordingOptions = {
        android: {
          extension: ".m4a",
          outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
          audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
        },
        ios: {
          extension: ".m4a",
          outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEG4AAC,
          audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
      };

      const { recording: newRecording } = await Audio.Recording.createAsync(
        recordingOptions
      );
      recording.current = newRecording;
      setIsRecording(true);
      setPronunciationFeedback(null);
    } catch (error) {
      console.log("Failed to start recording:", error);
      Alert.alert(
        "Recording Error",
        "Failed to start recording. Please try again."
      );
    }
  };

  const stopRecording = async () => {
    console.log("Stopping recording...");
    setIsRecording(false);

    if (!recording.current) {
      return;
    }

    try {
      await recording.current.stopAndUnloadAsync();
      const uri = recording.current.getURI();
      recordingUri.current = uri;
      recording.current = null;
      setHasRecording(true);

      console.log("Recording stopped and stored at", uri);

      // Process the recording for pronunciation assessment
      await processPronunciation(uri);
    } catch (error) {
      console.log("Error stopping recording:", error);
    }
  };

  const handleRecordPress = async () => {
    if (isRecording) {
      await stopRecording();
    } else {
      await startRecording();
    }
  };

  const playRecording = async () => {
    if (!recordingUri.current) {
      Alert.alert("No Recording", "Please record your voice first!");
      return;
    }

    try {
      // Stop any current playback
      if (playbackSound.current) {
        await playbackSound.current.unloadAsync();
        playbackSound.current = null;
      }

      // Stop any ongoing speech
      await Speech.stop();

      console.log("Playing recording from:", recordingUri.current);
      setIsPlayingRecording(true);

      // Load and play the recorded audio
      const { sound } = await Audio.Sound.createAsync(
        { uri: recordingUri.current },
        { shouldPlay: true }
      );

      playbackSound.current = sound;

      // Set up playback completion callback
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setIsPlayingRecording(false);
        }
      });
    } catch (error) {
      console.log("Error playing recording:", error);
      setIsPlayingRecording(false);
      Alert.alert(
        "Playback Error",
        "Could not play your recording. Please try recording again."
      );
    }
  };

  const processPronunciation = async (audioUri) => {
    setHasAttempted(true);
    setPronunciationFeedback({
      type: "processing",
      message: "Let me listen...",
      character: "🤖",
      score: null,
    });

    try {
      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Kid-friendly pronunciation assessment simulation
      // In real implementation, you'd call Azure API and convert technical scores to kid-friendly feedback
      const pronunciationOutcomes = [
        {
          type: "perfect",
          message: "Perfect! You nailed it!",
          character: "🌟",
          encouragement: "Amazing job!",
        },
        {
          type: "great",
          message: "Great job! You said it really well!",
          character: "🎉",
          encouragement: "Keep it up!",
        },
        {
          type: "good",
          message: "Good try! Almost perfect!",
          character: "👍",
          encouragement: "You're getting better!",
        },
        {
          type: "tryAgain",
          message: "Close! Let's try once more!",
          character: "🐻",
          encouragement: "Listen and try again!",
        },
        {
          type: "needsPractice",
          message: "Let's practice together!",
          character: "🦉",
          encouragement: "Practice makes perfect!",
        },
      ];

      // Simulate realistic distribution (mostly positive for encouragement)
      const weights = [20, 30, 25, 15, 10]; // Perfect, Great, Good, Try Again, Needs Practice
      const randomValue = Math.random() * 100;
      let selectedOutcome;
      let cumulativeWeight = 0;

      for (let i = 0; i < pronunciationOutcomes.length; i++) {
        cumulativeWeight += weights[i];
        if (randomValue <= cumulativeWeight) {
          selectedOutcome = pronunciationOutcomes[i];
          break;
        }
      }

      // Fallback to "good" if somehow none selected
      if (!selectedOutcome) {
        selectedOutcome = pronunciationOutcomes[2];
      }

      setPronunciationFeedback({
        type:
          selectedOutcome.type === "tryAgain" ||
          selectedOutcome.type === "needsPractice"
            ? "retry"
            : "success",
        message: selectedOutcome.message,
        character: selectedOutcome.character,
        encouragement: selectedOutcome.encouragement,
        score: null,
      });
    } catch (error) {
      console.log("Error processing pronunciation:", error);
      setPronunciationFeedback({
        type: "retry",
        message: "Oops! Let's try that again!",
        character: "🤖",
        encouragement: "No worries!",
        score: null,
      });
    }
  };

  const renderEmoji = () => {
    return (
      <View style={styles.emojiContainer}>
        <Text style={styles.emoji}>{currentEmoji}</Text>
      </View>
    );
  };

  const renderFeedback = () => {
    if (!pronunciationFeedback) return null;

    const feedbackStyle =
      pronunciationFeedback.type === "success"
        ? styles.feedbackSuccess
        : pronunciationFeedback.type === "retry"
        ? styles.feedbackRetry
        : styles.feedbackProcessing;

    const textStyle =
      pronunciationFeedback.type === "success"
        ? styles.feedbackTextSuccess
        : pronunciationFeedback.type === "retry"
        ? styles.feedbackTextRetry
        : styles.feedbackTextProcessing;

    return (
      <View style={[styles.feedbackContainer, feedbackStyle]}>
        {pronunciationFeedback.character && (
          <View style={styles.characterContainer}>
            <Text style={styles.character}>
              {pronunciationFeedback.character}
            </Text>
          </View>
        )}
        <Text style={[styles.feedbackText, textStyle]}>
          {pronunciationFeedback.message}
        </Text>
        {pronunciationFeedback.encouragement && (
          <Text style={[styles.encouragementText, textStyle]}>
            {pronunciationFeedback.encouragement}
          </Text>
        )}
      </View>
    );
  };

  const canProceed = hasAttempted && pronunciationFeedback?.type === "success";

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Section */}
      <View style={styles.topSection}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </Pressable>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={styles.progressFill} />
            </View>
          </View>
        </View>
        <Text style={styles.moduleInfo}>Booklet 2, Module 4 - Fruits</Text>
      </View>

      {/* Instruction */}
      <View style={styles.instructionContainer}>
        <Text style={styles.instruction}>Listen, then say the word</Text>
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        <View style={styles.contentCard}>
          {/* Emoji */}
          {renderEmoji()}

          {/* Word */}
          <View style={styles.wordContainer}>
            <Text style={styles.word}>{currentWord}</Text>
          </View>

          {/* Button Row */}
          <View style={styles.buttonRow}>
            {/* Audio Button - Demo */}
            <Pressable
              style={[
                styles.audioButton,
                audioPressed && styles.audioButtonPressed,
                isSpeaking && { backgroundColor: "#ff6b35" },
              ]}
              onPress={handleAudioPress}
              onPressIn={() => setAudioPressed(true)}
              onPressOut={() => setAudioPressed(false)}
            >
              <Ionicons
                name={isSpeaking ? "volume-high" : "volume-high"}
                size={36}
                color="#fff"
              />
            </Pressable>

            {/* Record Button */}
            <Pressable
              style={[
                styles.recordButton,
                isRecording && styles.recordButtonActive,
                recordPressed && styles.recordButtonPressed,
              ]}
              onPress={handleRecordPress}
              onPressIn={() => setRecordPressed(true)}
              onPressOut={() => setRecordPressed(false)}
            >
              <Ionicons
                name={isRecording ? "stop-circle" : "mic"}
                size={36}
                color="#fff"
              />
            </Pressable>

            {/* Play Recording Button */}
            <Pressable
              style={[
                styles.playButton,
                !hasRecording && styles.playButtonDisabled,
                isPlayingRecording && {
                  backgroundColor: "#0056b3",
                  transform: [{ scale: 1.05 }],
                },
              ]}
              onPress={playRecording}
              disabled={!hasRecording}
            >
              <Ionicons
                name={isPlayingRecording ? "pause" : "play"}
                size={32}
                color="#fff"
              />
            </Pressable>
          </View>

          {/* Feedback */}
          {renderFeedback()}
        </View>
      </View>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        <Pressable
          style={[styles.nextButton, !canProceed && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={!canProceed}
        >
          <Text style={styles.nextButtonText}>Next</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
