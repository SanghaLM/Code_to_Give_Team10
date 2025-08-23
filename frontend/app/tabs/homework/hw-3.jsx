import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
  Animated,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Speech from "expo-speech";

export default function Hw3Screen() {
  const router = useRouter();
  const [selectedCloud, setSelectedCloud] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showTryAgain, setShowTryAgain] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentSpeaking, setCurrentSpeaking] = useState(null);
  const [shakeAnimation] = useState(new Animated.Value(0));
  const [celebrationAnimation] = useState(new Animated.Value(0));
  const [attempts, setAttempts] = useState(0);

  // Letters data
  const letters = [
    { letter: "F", color: "#FFB6C1", borderColor: "#FF69B4" },
    { letter: "K", color: "#DDA0DD", borderColor: "#9370DB" },
    { letter: "E", color: "#90EE90", borderColor: "#32CD32" }, // Correct answer
  ];

  const correctIndex = 2; // Letter E
  const targetLetter = "E";

  useEffect(() => {
    // Speak the instruction when component mounts
    speakText(`Find the letter ${targetLetter}`);
  }, []);

  const startCelebrationAnimation = () => {
    Animated.sequence([
      Animated.timing(celebrationAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(celebrationAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const startShakeAnimation = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const speakText = async (text, onComplete) => {
    try {
      await Speech.stop();
      setIsSpeaking(true);

      const options = {
        language: "en-US",
        pitch: 1.0,
        rate: 0.8,
      };

      Speech.speak(text, {
        ...options,
        onDone: () => {
          setIsSpeaking(false);
          setCurrentSpeaking(null);
          if (onComplete) onComplete();
        },
        onStopped: () => {
          setIsSpeaking(false);
          setCurrentSpeaking(null);
        },
        onError: (error) => {
          console.log("TTS Error:", error);
          setIsSpeaking(false);
          setCurrentSpeaking(null);
        },
      });
    } catch (error) {
      console.log("Speech error:", error);
      setIsSpeaking(false);
      setCurrentSpeaking(null);
    }
  };

  const handleCloudSelect = (index) => {
    setSelectedCloud(index);
    setAttempts((prev) => prev + 1);

    // Speak the selected letter
    setCurrentSpeaking(index);
    speakText(letters[index].letter);

    if (index === correctIndex) {
      // Correct answer!
      setIsCorrect(true);
      setShowTryAgain(false);
      startCelebrationAnimation();

      setTimeout(() => {
        speakText("Excellent! That's correct!");
      }, 1000);
    } else {
      // Wrong answer
      setIsCorrect(false);
      setShowTryAgain(true);
      startShakeAnimation();

      setTimeout(() => {
        speakText("Not quite right. Try again!");
      }, 500);
    }
  };

  const handleLetterPress = (index) => {
    setCurrentSpeaking(index);
    speakText(letters[index].letter);
  };

  const handleTryAgain = () => {
    setSelectedCloud(null);
    setIsCorrect(false);
    setShowTryAgain(false);
    speakText(`Try again! Find the letter ${targetLetter}`);
  };

  const handleNext = () => {
    Speech.stop();
    setTimeout(() => {
      router.push("/tabs/homework/hw-4");
    }, 1000);
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
              <View style={[styles.progressFill, { width: "75%" }]} />
            </View>
          </View>
        </View>
        <Text style={styles.moduleInfo}>Booklet 2, Module 4 - Letters</Text>
      </View>

      {/* Instruction */}
      <View style={styles.instructionContainer}>
        <Text style={styles.instruction}>
          Click the cloud with the letter{" "}
          <Text style={styles.highlightedLetter}>"{targetLetter}"</Text>
        </Text>

        {/* Instruction TTS Button */}
        <Pressable
          style={styles.instructionAudioButton}
          onPress={() => speakText(`Find the letter ${targetLetter}`)}
        >
          <Ionicons name="volume-high" size={20} color="#fff" />
          <Text style={styles.instructionAudioText}>Listen</Text>
        </Pressable>
      </View>

      {/* Main Content - Scrollable */}
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.mainContent,
            { transform: [{ translateX: shakeAnimation }] },
          ]}
        >
          <View style={styles.cloudsContainer}>
            {letters.map((letterData, index) => (
              <Pressable
                key={index}
                style={[
                  styles.cloud,
                  {
                    backgroundColor: letterData.color,
                    borderColor: letterData.borderColor,
                  },
                  selectedCloud === index && styles.selectedCloud,
                  isCorrect && selectedCloud === index && styles.correctCloud,
                ]}
                onPress={() => handleCloudSelect(index)}
              >
                <Text
                  style={[
                    styles.cloudLetter,
                    isCorrect &&
                      selectedCloud === index &&
                      styles.correctCloudLetter,
                  ]}
                >
                  {letterData.letter}
                </Text>

                {/* Individual TTS Button */}
                <Pressable
                  style={[
                    styles.miniAudioButton,
                    currentSpeaking === index && styles.speakingButton,
                  ]}
                  onPress={(e) => {
                    e.stopPropagation();
                    handleLetterPress(index);
                  }}
                >
                  <Ionicons name="volume-high" size={12} color="#fff" />
                </Pressable>
              </Pressable>
            ))}
          </View>

          {/* Feedback Messages */}
          {showTryAgain && (
            <View style={styles.tryAgainContainer}>
              <Text style={styles.tryAgainText}>Try again!</Text>
              <Pressable style={styles.tryAgainButton} onPress={handleTryAgain}>
                <Ionicons name="refresh" size={16} color="#fff" />
                <Text style={styles.tryAgainButtonText}>Try Again</Text>
              </Pressable>
            </View>
          )}

          {isCorrect && (
            <Animated.View
              style={[
                styles.correctContainer,
                {
                  transform: [
                    {
                      scale: celebrationAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.2],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Text style={styles.correctText}>Excellent! 🎉</Text>
            </Animated.View>
          )}

          {/* Progress Indicator */}
          <View style={styles.progressIndicator}>
            <Text style={styles.progressText}>Attempts: {attempts}</Text>
            {attempts > 0 && !isCorrect && (
              <Text style={styles.hintText}>
                💡 Look for the letter that sounds like "EEE"
              </Text>
            )}
          </View>
        </Animated.View>
      </ScrollView>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        <Pressable
          style={[styles.nextButton, !isCorrect && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={!isCorrect}
        >
          <Text
            style={[
              styles.nextButtonText,
              !isCorrect && styles.nextButtonTextDisabled,
            ]}
          >
            Next
          </Text>
          <Ionicons
            name="arrow-forward"
            size={20}
            color={!isCorrect ? "#999" : "#fff"}
          />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

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
    marginBottom: 20,
    alignItems: "center",
  },
  instruction: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    marginBottom: 15,
    fontFamily: "BalsamiqSans_400Regular",
  },
  highlightedLetter: {
    color: "#FF9500",
    fontSize: 32,
  },
  instructionAudioButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007AFF",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 5,
  },
  instructionAudioText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "BalsamiqSans_400Regular",
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  mainContent: {
    paddingHorizontal: 20,
  },
  cloudsContainer: {
    alignItems: "center",
    gap: 25,
    marginBottom: 30,
  },
  cloud: {
    width: 110,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: "relative",
  },
  selectedCloud: {
    borderWidth: 4,
    borderColor: "#007AFF",
    shadowColor: "#007AFF",
    shadowOpacity: 0.3,
  },
  correctCloud: {
    borderColor: "#34C759",
    backgroundColor: "#E8F5E8",
  },
  cloudLetter: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    fontFamily: "BalsamiqSans_400Regular",
  },
  correctCloudLetter: {
    color: "#34C759",
  },
  miniAudioButton: {
    position: "absolute",
    bottom: -5,
    right: -5,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#FF9500",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  speakingButton: {
    backgroundColor: "#ff6b35",
  },
  tryAgainContainer: {
    alignItems: "center",
    marginVertical: 20,
    padding: 20,
    backgroundColor: "#FFF0F0",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#FFB6B6",
  },
  tryAgainText: {
    fontSize: 20,
    color: "#FF6B6B",
    marginBottom: 15,
    fontFamily: "BalsamiqSans_400Regular",
  },
  tryAgainButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF6B6B",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    gap: 8,
  },
  tryAgainButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "BalsamiqSans_400Regular",
  },
  correctContainer: {
    alignItems: "center",
    marginVertical: 20,
    padding: 20,
    backgroundColor: "#E8F5E8",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#90EE90",
  },
  correctText: {
    fontSize: 24,
    color: "#34C759",
    fontWeight: "bold",
    fontFamily: "BalsamiqSans_400Regular",
  },
  progressIndicator: {
    alignItems: "center",
    marginVertical: 20,
  },
  progressText: {
    fontSize: 16,
    color: "#666",
    fontFamily: "BalsamiqSans_400Regular",
    marginBottom: 10,
  },
  hintText: {
    fontSize: 14,
    color: "#FF9500",
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
    backgroundColor: "#e9ecef",
    shadowOpacity: 0,
    elevation: 0,
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "BalsamiqSans_400Regular",
  },
  nextButtonTextDisabled: {
    color: "#999",
  },
});
