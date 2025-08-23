import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
  Animated,
  ScrollView,
  PanGestureHandler,
  State,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Speech from "expo-speech";

export default function Hw4Screen() {
  const router = useRouter();
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [tracedPaths, setTracedPaths] = useState([]);
  const [celebrationAnimation] = useState(new Animated.Value(0));
  const [progressAnimation] = useState(new Animated.Value(0));
  const [tracingProgress, setTracingProgress] = useState(0);

  const targetLetter = "A";

  // Letter A tracing points (simplified for demonstration)
  const letterPaths = [
    // Left stroke of A
    [
      { x: 100, y: 180 },
      { x: 105, y: 160 },
      { x: 110, y: 140 },
      { x: 115, y: 120 },
      { x: 120, y: 100 },
      { x: 125, y: 80 },
    ],
    // Right stroke of A
    [
      { x: 125, y: 80 },
      { x: 130, y: 100 },
      { x: 135, y: 120 },
      { x: 140, y: 140 },
      { x: 145, y: 160 },
      { x: 150, y: 180 },
    ],
    // Cross stroke of A
    [
      { x: 110, y: 130 },
      { x: 115, y: 130 },
      { x: 120, y: 130 },
      { x: 125, y: 130 },
      { x: 130, y: 130 },
      { x: 135, y: 130 },
    ],
  ];

  useEffect(() => {
    // Speak instruction when component mounts
    speakText(`Trace the letter ${targetLetter}`);
  }, []);

  const startCelebrationAnimation = () => {
    Animated.parallel([
      Animated.timing(celebrationAnimation, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(progressAnimation, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false,
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
          if (onComplete) onComplete();
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
  };

  const handleComplete = () => {
    setIsCompleted(true);
    setTracingProgress(100);
    startCelebrationAnimation();
    speakText("Excellent! You've traced the letter A perfectly!");
  };

  const handlePracticeTrace = () => {
    const currentProgress = Math.min(tracingProgress + 20, 80);
    setTracingProgress(currentProgress);

    if (currentProgress >= 60) {
      speakText("Great progress! Keep going!");
    } else {
      speakText("Good job! Continue tracing!");
    }
  };

  const handleReset = () => {
    setTracedPaths([]);
    setTracingProgress(0);
    setIsCompleted(false);
    celebrationAnimation.setValue(0);
    progressAnimation.setValue(0);
    speakText("Let's try tracing again!");
  };

  const handleFinish = () => {
    Speech.stop();
    setTimeout(() => {
      router.push("/tabs/homework/hw-end");
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
              <View style={[styles.progressFill, { width: "100%" }]} />
            </View>
          </View>
        </View>
        <Text style={styles.moduleInfo}>
          Booklet 2, Module 4 - Letter Tracing
        </Text>
      </View>

      {/* Instruction */}
      <View style={styles.instructionContainer}>
        <Text style={styles.instruction}>
          Trace the letter "{targetLetter}"
        </Text>

        {/* Instruction TTS Button */}
        <Pressable
          style={styles.instructionAudioButton}
          onPress={() => speakText(`Trace the letter ${targetLetter}`)}
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
        <View style={styles.mainContent}>
          {/* Tracing Area */}
          <View style={styles.tracingContainer}>
            <View style={styles.letterOutline}>
              {/* Background letter */}
              <Text style={styles.letterGuide}>{targetLetter}</Text>

              {/* Tracing dots pattern */}
              <View style={styles.tracingPattern}>
                {letterPaths.map((path, pathIndex) => (
                  <View key={pathIndex}>
                    {path.map((point, pointIndex) => (
                      <View
                        key={`${pathIndex}-${pointIndex}`}
                        style={[
                          styles.tracingDot,
                          {
                            position: "absolute",
                            left: point.x - 4,
                            top: point.y - 4,
                          },
                          tracingProgress > pathIndex * 30 + pointIndex * 5 &&
                            styles.tracedDot,
                        ]}
                      />
                    ))}
                  </View>
                ))}
              </View>

              {/* Progress overlay */}
              <Animated.View
                style={[
                  styles.progressOverlay,
                  {
                    opacity: progressAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 0.3],
                    }),
                  },
                ]}
              />
            </View>

            {/* Letter TTS Button */}
            <Pressable
              style={[
                styles.letterAudioButton,
                isSpeaking && styles.speakingButton,
              ]}
              onPress={() => speakText(`The letter ${targetLetter}`)}
            >
              <Ionicons name="volume-high" size={24} color="#fff" />
            </Pressable>
          </View>

          {/* Progress Indicator */}
          <View style={styles.progressIndicator}>
            <Text style={styles.progressText}>Tracing Progress</Text>
            <View style={styles.progressBarContainer}>
              <Animated.View
                style={[
                  styles.progressBarFill,
                  {
                    width: progressAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["0%", "100%"],
                    }),
                  },
                ]}
              />
            </View>
            <Text style={styles.progressPercentage}>
              {Math.round(tracingProgress)}%
            </Text>
          </View>

          {/* Action Buttons */}
          {!isCompleted && (
            <View style={styles.actionButtons}>
              <Pressable
                style={styles.practiceButton}
                onPress={handlePracticeTrace}
              >
                <Ionicons name="create-outline" size={20} color="#fff" />
                <Text style={styles.practiceButtonText}>Practice Stroke</Text>
              </Pressable>

              <Pressable style={styles.completeButton} onPress={handleComplete}>
                <Ionicons name="checkmark-circle" size={20} color="#fff" />
                <Text style={styles.completeButtonText}>Mark Complete</Text>
              </Pressable>
            </View>
          )}

          {/* Completion Message */}
          {isCompleted && (
            <Animated.View
              style={[
                styles.completionContainer,
                {
                  transform: [
                    {
                      scale: celebrationAnimation.interpolate({
                        inputRange: [0, 0.5, 1],
                        outputRange: [1, 1.2, 1],
                      }),
                    },
                  ],
                  opacity: celebrationAnimation,
                },
              ]}
            >
              <Ionicons name="trophy" size={40} color="#FFD700" />
              <Text style={styles.completedText}>
                Excellent! Letter traced! 🎉
              </Text>
              <Text style={styles.encouragementText}>
                You did a fantastic job tracing the letter A!
              </Text>
            </Animated.View>
          )}

          {/* Helper Tips */}
          <View style={styles.tipsContainer}>
            <Text style={styles.tipsTitle}>💡 Tracing Tips:</Text>
            <Text style={styles.tipText}>
              • Start at the top and follow the dotted line
            </Text>
            <Text style={styles.tipText}>
              • Take your time - accuracy is more important than speed
            </Text>
            <Text style={styles.tipText}>
              • The letter A has two slanted lines and one horizontal line
            </Text>
          </View>

          {/* Reset Button */}
          {(tracingProgress > 0 || isCompleted) && (
            <Pressable style={styles.resetButton} onPress={handleReset}>
              <Ionicons name="refresh" size={16} color="#666" />
              <Text style={styles.resetButtonText}>Start Over</Text>
            </Pressable>
          )}
        </View>
      </ScrollView>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        <Pressable
          style={[
            styles.finishButton,
            !isCompleted && styles.finishButtonDisabled,
          ]}
          onPress={handleFinish}
          disabled={!isCompleted}
        >
          <Text
            style={[
              styles.finishButtonText,
              !isCompleted && styles.finishButtonTextDisabled,
            ]}
          >
            Finish
          </Text>
          <Ionicons
            name="checkmark"
            size={20}
            color={!isCompleted ? "#999" : "#fff"}
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
  tracingContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  letterOutline: {
    width: 250,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    backgroundColor: "#f8f9fa",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#e9ecef",
    borderStyle: "dashed",
  },
  letterGuide: {
    fontSize: 120,
    fontWeight: "bold",
    color: "#e9ecef",
    fontFamily: "BalsamiqSans_400Regular",
    position: "absolute",
  },
  tracingPattern: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  tracingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF9500",
    opacity: 0.6,
  },
  tracedDot: {
    backgroundColor: "#34C759",
    opacity: 1,
    transform: [{ scale: 1.2 }],
  },
  progressOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#34C759",
    borderRadius: 18,
  },
  letterAudioButton: {
    marginTop: 15,
    width: 50,
    height: 50,
    borderRadius: 25,
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
  speakingButton: {
    backgroundColor: "#ff6b35",
  },
  progressIndicator: {
    alignItems: "center",
    marginBottom: 30,
    padding: 20,
    backgroundColor: "#f8f9fa",
    borderRadius: 15,
  },
  progressText: {
    fontSize: 16,
    color: "#666",
    fontFamily: "BalsamiqSans_400Regular",
    marginBottom: 10,
  },
  progressBarContainer: {
    width: 200,
    height: 8,
    backgroundColor: "#e9ecef",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 10,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#34C759",
    borderRadius: 4,
  },
  progressPercentage: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#34C759",
    fontFamily: "BalsamiqSans_400Regular",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 15,
    marginBottom: 30,
    justifyContent: "center",
  },
  practiceButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
    shadowColor: "#007AFF",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  practiceButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "BalsamiqSans_400Regular",
  },
  completeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#34C759",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
    shadowColor: "#34C759",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  completeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "BalsamiqSans_400Regular",
  },
  completionContainer: {
    alignItems: "center",
    marginVertical: 20,
    padding: 25,
    backgroundColor: "#E8F5E8",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#90EE90",
  },
  completedText: {
    fontSize: 24,
    color: "#34C759",
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
    textAlign: "center",
    fontFamily: "BalsamiqSans_400Regular",
  },
  encouragementText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    fontFamily: "BalsamiqSans_400Regular",
  },
  tipsContainer: {
    backgroundColor: "#FFF9E6",
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#FFE066",
    marginBottom: 20,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF9500",
    marginBottom: 10,
    fontFamily: "BalsamiqSans_400Regular",
  },
  tipText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
    fontFamily: "BalsamiqSans_400Regular",
  },
  resetButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "#f8f9fa",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    gap: 8,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  resetButtonText: {
    color: "#666",
    fontSize: 14,
    fontFamily: "BalsamiqSans_400Regular",
  },
  bottomSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: "flex-end",
  },
  finishButton: {
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
  finishButtonDisabled: {
    backgroundColor: "#e9ecef",
    shadowOpacity: 0,
    elevation: 0,
  },
  finishButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "BalsamiqSans_400Regular",
  },
  finishButtonTextDisabled: {
    color: "#999",
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "BalsamiqSans_400Regular",
  },
});
