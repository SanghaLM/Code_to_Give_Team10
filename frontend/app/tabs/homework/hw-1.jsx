import React, { useState } from "react";
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
            <Text style={styles.word}>{currentWord}</Text>
          </View>

          {/* Audio Button */}
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
