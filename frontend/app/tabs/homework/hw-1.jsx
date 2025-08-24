import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
  Image,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Speech from "expo-speech";
import { useUser } from '../../userContext';
import * as api from '../../api';
import { Audio } from 'expo-av';
import { Alert } from 'react-native';

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
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    fontFamily: "BalsamiqSans_400Regular",
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
    fontWeight: "bold",
    color: "#007AFF",
    textAlign: "center",
    fontFamily: "BalsamiqSans_400Regular",
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

  // Word and emoji pairs
  const currentWord = "panda";
  const currentEmoji = "🐼";

  const handleNext = () => {
    // Stop any ongoing speech before navigating
    Speech.stop();
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

  const renderEmoji = () => {
    return (
      <View style={styles.emojiContainer}>
        <Text style={styles.emoji}>{currentEmoji}</Text>
      </View>
    );
  };

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
        <Text style={styles.instruction}>Point and read</Text>
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        <View style={styles.contentCard}>
          {/* Emoji */}
          {renderEmoji()}

          {/* Word */}
          <View style={styles.wordContainer}>
            <Text style={styles.word}>{words[index]?.word || currentWord}</Text>
          </View>

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

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        <Pressable style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>Next</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
