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

export default function HwEndScreen() {
  const router = useRouter();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [celebrationAnimation] = useState(new Animated.Value(0));
  const [scoreAnimation] = useState(new Animated.Value(0));
  const [statsAnimation] = useState(new Animated.Value(0));

  // Mock completion data
  const completionData = {
    totalQuestions: 4,
    correctAnswers: 4,
    score: 100,
    timeSpent: "3:45",
    attempts: 6,
    module: "Letters & Animals",
  };

  useEffect(() => {
    // Start animations when component mounts
    startCelebrationSequence();
    // Speak congratulations
    setTimeout(() => {
      speakText(
        "Congratulations! You have completed all the exercises with excellent results!"
      );
    }, 1000);
  }, []);

  const startCelebrationSequence = () => {
    // Stagger animations for a nice effect
    Animated.sequence([
      Animated.timing(celebrationAnimation, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scoreAnimation, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(statsAnimation, {
        toValue: 1,
        duration: 400,
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
        pitch: 1.1,
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

  const getScoreColor = (score) => {
    if (score >= 90) return "#34C759";
    if (score >= 70) return "#FF9500";
    return "#FF6B6B";
  };

  const getScoreEmoji = (score) => {
    if (score >= 90) return "🏆";
    if (score >= 70) return "🥈";
    return "🥉";
  };

  const getEncouragementMessage = (score) => {
    if (score >= 90) return "Outstanding performance! You're a star learner!";
    if (score >= 70) return "Great job! Keep up the good work!";
    return "Good effort! Practice makes perfect!";
  };

  const handleBackToTasks = () => {
    Speech.stop();
    setTimeout(() => {
      router.push("/tabs/task");
    }, 1000);
  };

  const handleReplayModule = () => {
    Speech.stop();
    speakText("Let's practice again!");
    setTimeout(() => {
      router.push("/tabs/homework/hw-1");
    }, 1000);
  };

  const handleShareResults = () => {
    speakText(
      `I scored ${completionData.score} percent on my learning module!`
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Section */}
      <View style={styles.topSection}>
        <Text style={styles.moduleInfo}>
          Booklet 2, Module 4 - {completionData.module}
        </Text>

        {/* TTS Button for results */}
        <Pressable
          style={[styles.ttsButton, isSpeaking && styles.speakingButton]}
          onPress={() =>
            speakText(
              `Congratulations! You scored ${completionData.score} percent!`
            )
          }
        >
          <Ionicons name="volume-high" size={16} color="#fff" />
          <Text style={styles.ttsButtonText}>Hear Results</Text>
        </Pressable>
      </View>

      {/* Main Content - Scrollable */}
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mainContent}>
          {/* Congratulations Section */}
          <Animated.View
            style={[
              styles.congratsContainer,
              {
                transform: [
                  {
                    scale: celebrationAnimation.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [0.8, 1.1, 1],
                    }),
                  },
                ],
                opacity: celebrationAnimation,
              },
            ]}
          >
            <View style={styles.trophyContainer}>
              <Ionicons name="trophy" size={60} color="#FFD700" />
              <Text style={styles.trophyEmoji}>
                {getScoreEmoji(completionData.score)}
              </Text>
            </View>
            <Text style={styles.congratsText}>Congratulations!</Text>
            <Text style={styles.completionText}>
              You've completed Module 4 - {completionData.module}
            </Text>
            <Text style={styles.encouragementText}>
              {getEncouragementMessage(completionData.score)}
            </Text>
          </Animated.View>

          {/* Score Section */}
          <Animated.View
            style={[
              styles.scoreContainer,
              {
                transform: [
                  {
                    translateY: scoreAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [50, 0],
                    }),
                  },
                ],
                opacity: scoreAnimation,
              },
            ]}
          >
            <Text style={styles.scoreLabel}>Your Score</Text>
            <View style={styles.scoreCircle}>
              <Text
                style={[
                  styles.scoreValue,
                  { color: getScoreColor(completionData.score) },
                ]}
              >
                {completionData.correctAnswers}/{completionData.totalQuestions}
              </Text>
              <Text
                style={[
                  styles.scorePercentage,
                  { color: getScoreColor(completionData.score) },
                ]}
              >
                {completionData.score}%
              </Text>
            </View>

            {/* Progress Ring */}
            <View style={styles.progressRing}>
              <Animated.View
                style={[
                  styles.progressRingFill,
                  {
                    transform: [
                      {
                        rotate: scoreAnimation.interpolate({
                          inputRange: [0, 1],
                          outputRange: [
                            "0deg",
                            `${(completionData.score / 100) * 360}deg`,
                          ],
                        }),
                      },
                    ],
                  },
                ]}
              />
            </View>
          </Animated.View>

          {/* Stats Section */}
          <Animated.View
            style={[
              styles.statsContainer,
              {
                transform: [
                  {
                    translateY: statsAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [30, 0],
                    }),
                  },
                ],
                opacity: statsAnimation,
              },
            ]}
          >
            <Text style={styles.statsTitle}>Session Summary</Text>

            <View style={styles.statItem}>
              <Ionicons name="checkmark-circle" size={24} color="#34C759" />
              <View style={styles.statTextContainer}>
                <Text style={styles.statLabel}>Questions Completed</Text>
                <Text style={styles.statValue}>
                  {completionData.totalQuestions} exercises
                </Text>
              </View>
              <Pressable
                style={styles.statTTSButton}
                onPress={() =>
                  speakText(
                    `${completionData.totalQuestions} exercises completed`
                  )
                }
              >
                <Ionicons name="volume-high" size={12} color="#666" />
              </Pressable>
            </View>

            <View style={styles.statItem}>
              <Ionicons name="time" size={24} color="#007AFF" />
              <View style={styles.statTextContainer}>
                <Text style={styles.statLabel}>Time Spent</Text>
                <Text style={styles.statValue}>{completionData.timeSpent}</Text>
              </View>
              <Pressable
                style={styles.statTTSButton}
                onPress={() =>
                  speakText(`Time spent: ${completionData.timeSpent}`)
                }
              >
                <Ionicons name="volume-high" size={12} color="#666" />
              </Pressable>
            </View>

            <View style={styles.statItem}>
              <Ionicons name="refresh" size={24} color="#FF9500" />
              <View style={styles.statTextContainer}>
                <Text style={styles.statLabel}>Total Attempts</Text>
                <Text style={styles.statValue}>
                  {completionData.attempts} tries
                </Text>
              </View>
              <Pressable
                style={styles.statTTSButton}
                onPress={() =>
                  speakText(`${completionData.attempts} attempts made`)
                }
              >
                <Ionicons name="volume-high" size={12} color="#666" />
              </Pressable>
            </View>

            <View style={styles.statItem}>
              <Ionicons name="star" size={24} color="#FFD700" />
              <View style={styles.statTextContainer}>
                <Text style={styles.statLabel}>Accuracy</Text>
                <Text style={styles.statValue}>
                  {Math.round(
                    (completionData.correctAnswers /
                      completionData.totalQuestions) *
                      100
                  )}
                  %
                </Text>
              </View>
              <Pressable
                style={styles.statTTSButton}
                onPress={() =>
                  speakText(
                    `${Math.round(
                      (completionData.correctAnswers /
                        completionData.totalQuestions) *
                        100
                    )} percent accuracy`
                  )
                }
              >
                <Ionicons name="volume-high" size={12} color="#666" />
              </Pressable>
            </View>
          </Animated.View>

          {/* Achievement Badges */}
          <View style={styles.badgesContainer}>
            <Text style={styles.badgesTitle}>Achievements Unlocked</Text>
            <View style={styles.badges}>
              {completionData.score === 100 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeEmoji}>🌟</Text>
                  <Text style={styles.badgeText}>Perfect Score</Text>
                </View>
              )}
              <View style={styles.badge}>
                <Text style={styles.badgeEmoji}>📚</Text>
                <Text style={styles.badgeText}>Module Complete</Text>
              </View>
              {completionData.attempts <= 4 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeEmoji}>⚡</Text>
                  <Text style={styles.badgeText}>Quick Learner</Text>
                </View>
              )}
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <Pressable style={styles.replayButton} onPress={handleReplayModule}>
              <Ionicons name="refresh" size={18} color="#007AFF" />
              <Text style={styles.replayButtonText}>Practice Again</Text>
            </Pressable>

            <Pressable style={styles.shareButton} onPress={handleShareResults}>
              <Ionicons name="share" size={18} color="#34C759" />
              <Text style={styles.shareButtonText}>Share Results</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        <Pressable style={styles.finishButton} onPress={handleBackToTasks}>
          <Text style={styles.finishButtonText}>Back to Tasks</Text>
          <Ionicons name="home" size={20} color="#fff" />
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
    alignItems: "center",
    paddingBottom: 10,
  },
  moduleInfo: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 15,
    fontFamily: "BalsamiqSans_400Regular",
  },
  ttsButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007AFF",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 5,
  },
  speakingButton: {
    backgroundColor: "#ff6b35",
  },
  ttsButtonText: {
    color: "#fff",
    fontSize: 12,
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
  congratsContainer: {
    alignItems: "center",
    marginBottom: 30,
    padding: 20,
    backgroundColor: "#f8f9ff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e6f0ff",
  },
  trophyContainer: {
    position: "relative",
    marginBottom: 15,
  },
  trophyEmoji: {
    position: "absolute",
    top: -10,
    right: -10,
    fontSize: 20,
  },
  congratsText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
    textAlign: "center",
    fontFamily: "BalsamiqSans_400Regular",
  },
  completionText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 8,
    fontFamily: "BalsamiqSans_400Regular",
  },
  encouragementText: {
    fontSize: 14,
    color: "#007AFF",
    textAlign: "center",
    fontStyle: "italic",
    fontFamily: "BalsamiqSans_400Regular",
  },
  scoreContainer: {
    alignItems: "center",
    marginBottom: 30,
    padding: 25,
    backgroundColor: "#f0f8f0",
    borderRadius: 20,
    position: "relative",
  },
  scoreLabel: {
    fontSize: 18,
    color: "#666",
    marginBottom: 15,
    fontFamily: "BalsamiqSans_400Regular",
  },
  scoreCircle: {
    alignItems: "center",
    justifyContent: "center",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "BalsamiqSans_400Regular",
  },
  scorePercentage: {
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "BalsamiqSans_400Regular",
  },
  progressRing: {
    position: "absolute",
    top: 45,
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 4,
    borderColor: "#e9ecef",
  },
  progressRingFill: {
    position: "absolute",
    top: -4,
    left: -4,
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 4,
    borderColor: "#34C759",
    borderTopColor: "transparent",
    borderLeftColor: "transparent",
  },
  statsContainer: {
    marginBottom: 30,
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 20,
    textAlign: "center",
    fontFamily: "BalsamiqSans_400Regular",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    marginBottom: 10,
  },
  statTextContainer: {
    flex: 1,
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
    fontFamily: "BalsamiqSans_400Regular",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    fontFamily: "BalsamiqSans_400Regular",
  },
  statTTSButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#e9ecef",
    justifyContent: "center",
    alignItems: "center",
  },
  badgesContainer: {
    marginBottom: 30,
    padding: 20,
    backgroundColor: "#fff8e1",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#ffe066",
  },
  badgesTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ff9500",
    marginBottom: 15,
    textAlign: "center",
    fontFamily: "BalsamiqSans_400Regular",
  },
  badges: {
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
    gap: 10,
  },
  badge: {
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    minWidth: 80,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  badgeEmoji: {
    fontSize: 24,
    marginBottom: 5,
  },
  badgeText: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    fontFamily: "BalsamiqSans_400Regular",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 15,
    marginBottom: 20,
  },
  replayButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f8ff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#007AFF",
    gap: 8,
  },
  replayButtonText: {
    color: "#007AFF",
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "BalsamiqSans_400Regular",
  },
  shareButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f8f0",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#34C759",
    gap: 8,
  },
  shareButtonText: {
    color: "#34C759",
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "BalsamiqSans_400Regular",
  },
  bottomSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: "center",
  },
  finishButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    shadowColor: "#007AFF",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  finishButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "BalsamiqSans_400Regular",
  },
});
