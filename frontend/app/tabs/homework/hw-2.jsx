import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
  Animated,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Speech from "expo-speech";

export default function Hw2Screen() {
  const router = useRouter();
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [selectedRight, setSelectedRight] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [matches, setMatches] = useState({});
  const [completedMatches, setCompletedMatches] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentSpeaking, setCurrentSpeaking] = useState(null);
  const [shakeAnimation] = useState(new Animated.Value(0));
  const [celebrationAnimation] = useState(new Animated.Value(0));

  // Animal data with emojis and words
  const animals = [
    { emoji: "🐸", word: "Frog", color: "#90EE90", borderColor: "#32CD32" },
    { emoji: "🦁", word: "Lion", color: "#FFD700", borderColor: "#FFA500" },
    { emoji: "🐷", word: "Pig", color: "#FFB6C1", borderColor: "#FF69B4" },
  ];

  const correctMatches = {
    0: 0, // Frog to Frog
    1: 1, // Lion to Lion
    2: 2, // Pig to Pig
  };

  useEffect(() => {
    if (completedMatches === animals.length) {
      startCelebrationAnimation();
      speakText("Excellent! All matches completed!");
    }
  }, [completedMatches]);

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

  const handleLeftSelect = (index) => {
    if (matches[index]) return; // Already matched

    setSelectedLeft(index);
    setSelectedRight(null);
    setIsCorrect(false);

    // Speak the animal name
    setCurrentSpeaking(`left-${index}`);
    speakText(animals[index].word);
  };

  const handleRightSelect = (index) => {
    if (Object.values(matches).includes(index)) return; // Already matched

    setSelectedRight(index);

    // Speak the word
    setCurrentSpeaking(`right-${index}`);
    speakText(animals[index].word);

    // Check if match is correct
    if (selectedLeft !== null) {
      if (correctMatches[selectedLeft] === index) {
        // Correct match!
        setIsCorrect(true);
        setMatches((prev) => ({ ...prev, [selectedLeft]: index }));
        setCompletedMatches((prev) => prev + 1);

        // Celebrate and speak encouragement
        setTimeout(() => {
          speakText("Correct! Well done!");
        }, 500);

        // Reset selections after a delay
        setTimeout(() => {
          setSelectedLeft(null);
          setSelectedRight(null);
          setIsCorrect(false);
        }, 1500);
      } else {
        // Wrong match
        startShakeAnimation();
        speakText("Try again!");

        // Reset selections after a delay
        setTimeout(() => {
          setSelectedLeft(null);
          setSelectedRight(null);
        }, 1000);
      }
    }
  };

  const handleAnimalPress = (index, side) => {
    if (side === "left") {
      handleLeftSelect(index);
    } else {
      handleRightSelect(index);
    }
  };

  const handleNext = () => {
    Speech.stop();
    setTimeout(() => {
      router.push("/tabs/homework/hw-3");
    }, 1000);
  };

  const renderConnectionLine = (leftIndex, rightIndex) => {
    if (!matches[leftIndex]) return null;

    const topPosition = 25 + leftIndex * 100; // Simpler positioning

    return (
      <View
        key={`line-${leftIndex}-${rightIndex}`}
        style={[
          styles.connectionLine,
          {
            top: topPosition,
            backgroundColor: animals[leftIndex].borderColor,
          },
        ]}
      />
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
              <View style={[styles.progressFill, { width: "50%" }]} />
            </View>
          </View>
        </View>
        <Text style={styles.moduleInfo}>Booklet 2, Module 4 - Animals</Text>
      </View>

      {/* Instruction */}
      <View style={styles.instructionContainer}>
        <View style={styles.instructionRow}>
          <Image 
            source={require('../../../assets/instructions/icon-3.jpeg')} 
            style={styles.instructionIcon} 
          />
          <Text style={styles.instruction}>Match the animal to the word</Text>
        </View>
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
          <View style={styles.matchingContainer}>
            {/* Left Column - Animal Emojis */}
            <View style={styles.leftColumn}>
              {animals.map((animal, index) => (
                <Pressable
                  key={`left-${index}`}
                  style={styles.itemContainer}
                  onPress={() => handleAnimalPress(index, "left")}
                >
                  <View
                    style={[
                      styles.emojiContainer,
                      {
                        backgroundColor: animal.color,
                        borderColor: animal.borderColor,
                        opacity: matches[index] ? 0.5 : 1,
                      },
                      selectedLeft === index && styles.selectedContainer,
                      matches[index] && styles.matchedContainer,
                    ]}
                  >
                    <Text style={styles.emoji}>{animal.emoji}</Text>

                    {/* TTS Button for emoji */}
                    <Pressable
                      style={[
                        styles.miniAudioButton,
                        currentSpeaking === `left-${index}` &&
                          styles.speakingButton,
                      ]}
                      onPress={(e) => {
                        e.stopPropagation();
                        setCurrentSpeaking(`left-${index}`);
                        speakText(animal.word);
                      }}
                    >
                      <Ionicons name="volume-high" size={12} color="#fff" />
                    </Pressable>
                  </View>

                  <View
                    style={[
                      styles.dot,
                      selectedLeft === index && styles.selectedDot,
                      matches[index] && styles.matchedDot,
                    ]}
                  />
                </Pressable>
              ))}
            </View>

            {/* Connection Lines */}
            <View style={styles.connectionContainer}>
              {Object.entries(matches).map(([leftIndex, rightIndex]) =>
                renderConnectionLine(parseInt(leftIndex), rightIndex)
              )}
            </View>

            {/* Right Column - Words */}
            <View style={styles.rightColumn}>
              {animals.map((animal, index) => (
                <Pressable
                  key={`right-${index}`}
                  style={styles.itemContainer}
                  onPress={() => handleAnimalPress(index, "right")}
                >
                  <View
                    style={[
                      styles.wordContainer,
                      selectedRight === index && styles.selectedWordContainer,
                      Object.values(matches).includes(index) &&
                        styles.matchedWordContainer,
                    ]}
                  >
                    <Text
                      style={[
                        styles.wordText,
                        Object.values(matches).includes(index) &&
                          styles.matchedWordText,
                      ]}
                    >
                      {animal.word}
                    </Text>

                    {/* TTS Button for word */}
                    <Pressable
                      style={[
                        styles.miniAudioButton,
                        currentSpeaking === `right-${index}` &&
                          styles.speakingButton,
                      ]}
                      onPress={(e) => {
                        e.stopPropagation();
                        setCurrentSpeaking(`right-${index}`);
                        speakText(animal.word);
                      }}
                    >
                      <Ionicons name="volume-high" size={12} color="#fff" />
                    </Pressable>
                  </View>

                  <View
                    style={[
                      styles.dot,
                      selectedRight === index && styles.selectedDot,
                      Object.values(matches).includes(index) &&
                        styles.matchedDot,
                    ]}
                  />
                </Pressable>
              ))}
            </View>
          </View>

          {/* Feedback Messages */}
          {isCorrect && (
            <Animated.View
              style={[
                styles.feedbackContainer,
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
            <Text style={styles.progressText}>
              {completedMatches}/{animals.length} matches completed
            </Text>
            <View style={styles.progressDots}>
              {animals.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.progressDot,
                    index < completedMatches && styles.progressDotCompleted,
                  ]}
                />
              ))}
            </View>
          </View>

          {/* All completed message */}
          {completedMatches === animals.length && (
            <View style={styles.completionContainer}>
              <Text style={styles.completionText}>
                🎊 All matches completed! 🎊
              </Text>
            </View>
          )}
        </Animated.View>
      </ScrollView>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        <Pressable
          style={[
            styles.nextButton,
            completedMatches < animals.length && styles.nextButtonDisabled,
          ]}
          onPress={handleNext}
          disabled={completedMatches < animals.length}
        >
          <Text
            style={[
              styles.nextButtonText,
              completedMatches < animals.length &&
                styles.nextButtonTextDisabled,
            ]}
          >
            Next
          </Text>
          <Ionicons
            name="arrow-forward"
            size={20}
            color={completedMatches < animals.length ? "#999" : "#fff"}
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
    marginBottom: 30,
  },
  instructionRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
  matchingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    position: "relative",
    marginBottom: 30,
  },
  leftColumn: {
    alignItems: "center",
    gap: 25,
    paddingTop: 10,
  },
  rightColumn: {
    alignItems: "center",
    gap: 25,
    paddingTop: 10,
  },
  itemContainer: {
    alignItems: "center",
    gap: 10,
  },
  emojiContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    position: "relative",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  selectedContainer: {
    borderWidth: 4,
    borderColor: "#007AFF",
    shadowColor: "#007AFF",
    shadowOpacity: 0.3,
  },
  matchedContainer: {
    borderColor: "#34C759",
    backgroundColor: "#E8F5E8",
  },
  emoji: {
    fontSize: 40,
  },
  miniAudioButton: {
    position: "absolute",
    bottom: -3,
    right: -3,
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
  wordContainer: {
    backgroundColor: "#f8f9fa",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#e9ecef",
    minWidth: 70,
    alignItems: "center",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedWordContainer: {
    borderColor: "#007AFF",
    backgroundColor: "#E3F2FD",
    shadowColor: "#007AFF",
    shadowOpacity: 0.2,
  },
  matchedWordContainer: {
    borderColor: "#34C759",
    backgroundColor: "#E8F5E8",
  },
  wordText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    fontFamily: "BalsamiqSans_400Regular",
  },
  matchedWordText: {
    color: "#34C759",
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#e9ecef",
    borderWidth: 2,
    borderColor: "#dee2e6",
  },
  selectedDot: {
    backgroundColor: "#007AFF",
    borderColor: "#0056CC",
  },
  matchedDot: {
    backgroundColor: "#34C759",
    borderColor: "#28A745",
  },
  connectionContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  connectionLine: {
    position: "absolute",
    left: 85,
    right: 85,
    height: 2,
    borderRadius: 1,
  },
  feedbackContainer: {
    alignItems: "center",
    marginVertical: 20,
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
  progressDots: {
    flexDirection: "row",
    gap: 8,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#e9ecef",
    borderWidth: 1,
    borderColor: "#dee2e6",
  },
  progressDotCompleted: {
    backgroundColor: "#34C759",
    borderColor: "#28A745",
  },
  completionContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  completionText: {
    fontSize: 20,
    color: "#FF6B35",
    fontWeight: "bold",
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
