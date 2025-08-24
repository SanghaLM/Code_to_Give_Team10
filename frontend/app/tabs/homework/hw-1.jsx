<<<<<<< HEAD
import React, { useState, useEffect } from "react";
=======
import React, { useState, useRef } from "react";
>>>>>>> 67f4064f4fc5ef39eb8f026a665b45f8c6a7eae9
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
  Animated,
  Alert,
  Image,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Speech from "expo-speech";
<<<<<<< HEAD
import { useUser } from '../../userContext';
import * as api from '../../api';
import { Audio } from 'expo-av';
import { Alert } from 'react-native';
=======
import { Audio } from "expo-av";
>>>>>>> 67f4064f4fc5ef39eb8f026a665b45f8c6a7eae9

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
  instructionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  instructionIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  instruction: {
    fontSize: 24,
    fontFamily: "BalsamiqSans_700Bold",
    color: "#000",
    textAlign: "left",
    flex: 1,
  },
  stepIndicator: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  stepDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#e0e0e0",
    marginHorizontal: 5,
  },
  stepDotActive: {
    backgroundColor: "#FF9500",
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  stepDotCompleted: {
    backgroundColor: "#4CAF50",
  },
  stepLine: {
    height: 2,
    flex: 1,
    backgroundColor: "#e0e0e0",
    marginHorizontal: 10,
  },
  stepLineCompleted: {
    backgroundColor: "#4CAF50",
  },
  mainContent: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
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
    width: "100%",
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
    marginBottom: 20,
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
    marginTop: 10,
    padding: 15,
    borderRadius: 12,
    minWidth: 200,
    alignItems: "center",
    alignSelf: "stretch",
    marginBottom: 10,
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
  introContainer: {
    backgroundColor: "#f0f8ff",
    borderRadius: 15,
    padding: 25,
    margin: 20,
    borderWidth: 2,
    borderColor: "#007AFF",
    alignItems: "center",
  },
  introTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#007AFF",
    textAlign: "center",
    fontFamily: "BalsamiqSans_400Regular",
    marginBottom: 15,
  },
  introText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    fontFamily: "BalsamiqSans_400Regular",
    lineHeight: 24,
    marginBottom: 20,
  },
  okButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    shadowColor: "#007AFF",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  okButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "BalsamiqSans_400Regular",
  },
});

export default function Hw1Screen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState("intro");
  const [audioPressed, setAudioPressed] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
<<<<<<< HEAD
  const { token, selectedChildId } = useUser();
  const [homeworkId, setHomeworkId] = useState(null);
  const [words, setWords] = useState([]);
  const [index, setIndex] = useState(0);
  const [recordingObj, setRecordingObj] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [lastScore, setLastScore] = useState(null);
  const [lastFeedback, setLastFeedback] = useState(null);

  useEffect(() => {
    // If homeworkId was passed as query param, use startHomework
    const hwId = router.params?.homeworkId;
    if (hwId && token) {
      (async () => {
        try {
          const data = await api.startHomework(hwId, token);
          // data.words available; we keep homeworkId for submit
          setHomeworkId(hwId);
          const w = data.words || [];
          setWords(w);
          setIndex(0);
          console.log('Started homework', data);
        } catch (err) {
          console.warn('Failed to start homework', err);
        }
      })();
    }
  }, [router.params, token]);
=======
  const [isRecording, setIsRecording] = useState(false);
  const [recordPressed, setRecordPressed] = useState(false);
  const [pronunciationFeedback, setPronunciationFeedback] = useState(null);
  const [hasAttempted, setHasAttempted] = useState(false);
  const [isPlayingRecording, setIsPlayingRecording] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);

  const recording = useRef(null);
  const recordingUri = useRef(null);
  const playbackSound = useRef(null);
>>>>>>> 67f4064f4fc5ef39eb8f026a665b45f8c6a7eae9

  const currentWord = "panda";
  const currentEmoji = "🐼";

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

  React.useEffect(() => {
    return () => {
      if (playbackSound.current) {
        playbackSound.current.unloadAsync();
      }
    };
  }, []);

  const handleNext = () => {
    Speech.stop();
    if (playbackSound.current) {
      playbackSound.current.stopAsync();
    }
    setTimeout(() => {
  router.push("/tabs/homework/hw-2");
    }, 1000);
  };

  const handleOkPress = () => {
    setCurrentStep("demo");
  };

  const handleAudioPress = async () => {
    setAudioPressed(true);

    try {
      await Speech.stop();
      setIsSpeaking(true);

      const options = {
        language: "en-US",
        pitch: 1.0,
        rate: 0.8,
        voice: null,
      };

      Speech.speak(currentWord, {
        ...options,
        onDone: () => {
          setIsSpeaking(false);
          if (currentStep === "demo") {
            setTimeout(() => {
              setCurrentStep("parent");
            }, 1000);
          }
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

    setTimeout(() => {
      setAudioPressed(false);
    }, 200);
  };

  const startRecording = async () => {
    try {
      await Speech.stop();

      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission required",
          "Please grant microphone permission to record audio."
        );
        return;
      }

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
      setHasAttempted(true);

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
      if (playbackSound.current) {
        await playbackSound.current.unloadAsync();
        playbackSound.current = null;
      }

      await Speech.stop();
      setIsPlayingRecording(true);

      const { sound } = await Audio.Sound.createAsync(
        { uri: recordingUri.current },
        { shouldPlay: true }
      );

      playbackSound.current = sound;

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
    const isParentStep = currentStep === "parent";

    setPronunciationFeedback({
      type: "processing",
      message: isParentStep
        ? "Checking parent pronunciation..."
        : "Let me listen...",
      character: "🤖",
      score: null,
    });

    await new Promise((resolve) => setTimeout(resolve, 2000));

    if (isParentStep) {
      setPronunciationFeedback({
        type: "success",
        message: "Perfect! Now help your child say it!",
        character: "👨‍👩‍👧‍👦",
        encouragement: "Great modeling!",
        score: null,
      });

      setTimeout(() => {
        setCurrentStep("child");
        setPronunciationFeedback(null);
        setHasRecording(false);
        setHasAttempted(false);
        recordingUri.current = null;
      }, 3000);
    } else {
      const outcomes = [
        {
          type: "perfect",
          message: "Perfect! You and your grown-up did great!",
          character: "🌟",
          encouragement: "Amazing teamwork!",
        },
        {
          type: "great",
          message: "Great job! Your grown-up helped you well!",
          character: "🎉",
          encouragement: "Keep practicing together!",
        },
        {
          type: "good",
          message: "Good try! Almost perfect!",
          character: "👍",
          encouragement: "You're learning together!",
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

      const weights = [20, 30, 25, 15, 10];
      const randomValue = Math.random() * 100;
      let cumulativeWeight = 0;
      let selectedOutcome = outcomes[0];

      for (let i = 0; i < outcomes.length; i++) {
        cumulativeWeight += weights[i];
        if (randomValue <= cumulativeWeight) {
          selectedOutcome = outcomes[i];
          break;
        }
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

      if (
        selectedOutcome.type !== "tryAgain" &&
        selectedOutcome.type !== "needsPractice"
      ) {
        setTimeout(() => {
          setCurrentStep("complete");
        }, 3000);
      }
    }
  };

  const getStepInfo = () => {
    switch (currentStep) {
      case "demo":
        return {
          instruction: "Listen, then say the word",
          showDemo: true,
          showRecord: false,
          showPlayback: false,
        };
      case "parent":
        return {
          instruction: "Parent, record yourself saying the word",
          showDemo: true,
          showRecord: true,
          showPlayback: hasRecording,
        };
      case "child":
        return {
          instruction: "Child, say the word with your grown-up!",
          showDemo: true,
          showRecord: true,
          showPlayback: hasRecording,
        };
      case "complete":
        return {
          instruction: "Great job, team! You did it!",
          showDemo: false,
          showRecord: false,
          showPlayback: false,
        };
      default:
        return { instruction: "Listen, then say the word" };
    }
  };

  const renderStepIndicator = () => {
    const steps = ["demo", "parent", "child", "complete"];
    const currentIndex = steps.indexOf(currentStep);

    return (
      <View style={styles.stepIndicator}>
        {steps.map((step, index) => (
          <React.Fragment key={step}>
            <View
              style={[
                styles.stepDot,
                index === currentIndex && styles.stepDotActive,
                index < currentIndex && styles.stepDotCompleted,
              ]}
            />
            {index < steps.length - 1 && (
              <View
                style={{
                  ...styles.stepLine,
                  ...(index < currentIndex && styles.stepLineCompleted),
                }}
              />
            )}
          </React.Fragment>
        ))}
      </View>
    );
  };

  const renderEmoji = () => {
    return (
      <View style={styles.emojiContainer}>
        <Text style={styles.emoji}>{currentEmoji}</Text>
      </View>
    );
  };

<<<<<<< HEAD
  // Minimal submit simulation — in the real app we'd upload recorded audio per-word and then call submit
  const handleFinishAndSubmit = async () => {
    if (!homeworkId || !selectedChildId || !token) {
      // Navigate to next screen or show info
      router.push('/tabs/homework/hw-2');
      return;
    }
    try {
      // In a full flow you'd upload files with FormData per word using api.uploadWordRecording
      const res = await api.submitHomework(homeworkId, selectedChildId, 30, token);
      console.log('Submit result', res);
      // Navigate to next screen or results
      router.push('/tabs/homework/hw-2');
    } catch (err) {
      console.error('Submit failed', err);
      router.push('/tabs/homework/hw-2');
    }
  };

  // Recording helpers
  const ensurePermissions = async () => {
    const { status } = await Audio.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Audio recording permission is required to submit homework');
      return false;
    }
    await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
    return true;
  };

  const startRecording = async () => {
    try {
      const ok = await ensurePermissions();
      if (!ok) return;
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await recording.startAsync();
      setRecordingObj(recording);
      setIsRecording(true);
    } catch (err) {
      console.error('startRecording error', err);
    }
  };

  const stopRecordingAndUpload = async () => {
    try {
      if (!recordingObj) return;
      await recordingObj.stopAndUnloadAsync();
      const uri = recordingObj.getURI();
      setIsRecording(false);
      setRecordingObj(null);
      console.log('Recorded uri', uri);

      // Upload to backend for current word
      const current = words[index];
      if (!current || !homeworkId || !selectedChildId) {
        Alert.alert('Missing data', 'Cannot upload without homework and student selected');
        return;
      }

      const formData = new FormData();
      const filename = uri.split('/').pop();
      formData.append('file', { uri, name: filename || `rec-${Date.now()}.m4a`, type: 'audio/m4a' });
      formData.append('studentId', selectedChildId);
      formData.append('isParent', 'false');

      const resp = await api.uploadWordRecording(homeworkId, current._id, formData, token);
      console.log('upload resp', resp);
      setLastScore(resp.score);
      setLastFeedback(resp.feedback);

      // Advance to next word after short delay
      setTimeout(() => {
        if (index + 1 < words.length) setIndex(index + 1);
        else handleFinishAndSubmit();
      }, 800);
    } catch (err) {
      console.error('stopRecordingAndUpload error', err);
      Alert.alert('Upload failed', String(err?.message || err));
      setIsRecording(false);
      setRecordingObj(null);
    }
  };
=======
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

  if (currentStep === "intro") {
    return (
      <SafeAreaView style={styles.container}>
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

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.introContainer}>
            <Text style={styles.introTitle}>👨‍👩‍👧‍👦 Parent & Child Activity</Text>
            <Text style={styles.introText}>
              This exercise works best when parent and child do it together!
              {"\n\n"}
              First, we'll listen to the word together. Then the parent will
              record themselves saying it clearly, so the child can learn the
              correct pronunciation.
              {"\n\n"}
              Ready to start?
            </Text>
            <Pressable style={styles.okButton} onPress={handleOkPress}>
              <Text style={styles.okButtonText}>Let's Begin!</Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const stepInfo = getStepInfo();
  const canProceed =
    currentStep === "complete" && pronunciationFeedback?.type === "success";
>>>>>>> 67f4064f4fc5ef39eb8f026a665b45f8c6a7eae9

  return (
    <SafeAreaView style={styles.container}>
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

      <View style={styles.instructionContainer}>
        <View style={styles.instructionRow}>
          <Image
            source={require("../../../assets/instructions/icon-1.jpeg")}
            style={styles.instructionIcon}
          />
          <Text style={styles.instruction}>{stepInfo.instruction}</Text>
        </View>
      </View>

      <ScrollView
        style={styles.mainContent}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderStepIndicator()}

        <View style={styles.contentCard}>
          {renderEmoji()}

          <View style={styles.wordContainer}>
            <Text style={styles.word}>{words[index]?.word || currentWord}</Text>
          </View>

<<<<<<< HEAD
          {/* Audio Button / Recording */}
          <View style={{ marginTop: 12, alignItems: 'center' }}>
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

            <View style={{ height: 12 }} />

            <Pressable
              style={[styles.nextButton, { backgroundColor: isRecording ? '#ef4444' : '#34C759', paddingVertical: 12 }]}
              onPress={isRecording ? stopRecordingAndUpload : startRecording}
            >
              <Text style={[styles.nextButtonText, { fontSize: 16 }]}>{isRecording ? 'Stop & Upload' : 'Record'}</Text>
            </Pressable>

            {lastScore != null && (
              <View style={{ marginTop: 12, alignItems: 'center' }}>
                <Text style={{ color: '#333' }}>Score: {lastScore}</Text>
                <Text style={{ color: '#666' }}>{lastFeedback}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
=======
          {currentStep !== "complete" && (
            <View style={styles.buttonRow}>
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

              {stepInfo.showRecord && (
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
              )}

              {stepInfo.showPlayback && (
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
              )}
            </View>
          )}

          {renderFeedback()}
        </View>
      </ScrollView>
>>>>>>> 67f4064f4fc5ef39eb8f026a665b45f8c6a7eae9

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
