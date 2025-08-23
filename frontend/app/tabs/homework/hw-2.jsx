import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, SafeAreaView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function Hw2Screen() {
  const router = useRouter();
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [selectedRight, setSelectedRight] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleLeftSelect = (index) => {
    setSelectedLeft(index);
    setSelectedRight(null);
    setIsCorrect(false);
  };

  const handleRightSelect = (index) => {
    if (selectedLeft === 0 && index === 0) {
      setSelectedRight(index);
      setIsCorrect(true);
    } else {
      setSelectedRight(index);
      setIsCorrect(false);
    }
  };

  const handleNext = () => {
    setTimeout(() => {
      router.push('/tabs/homework/hw-3');
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
              <View style={styles.progressFill} />
            </View>
          </View>
        </View>
        <Text style={styles.moduleInfo}>Booklet 2, Module 4 - Fruits</Text>
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        <Text style={styles.instruction}>Match the animal to the word</Text>
        
        <View style={styles.contentArea}>
          <View style={styles.matchingContainer}>
            {/* Left Column - Images */}
            <View style={styles.leftColumn}>
              <View style={styles.imageContainer}>
                <View style={styles.frogImage}>
                  <Text style={styles.frogText}>🐸</Text>
                </View>
                <View style={[styles.dot, selectedLeft === 0 && styles.selectedDot]} />
              </View>
              <View style={styles.imageContainer}>
                <View style={styles.placeholderImage}>
                  <Text style={styles.placeholderText}>🦁</Text>
                </View>
                <View style={[styles.dot, selectedLeft === 1 && styles.selectedDot]} />
              </View>
              <View style={styles.imageContainer}>
                <View style={styles.placeholderImage}>
                  <Text style={styles.placeholderText}>🐷</Text>
                </View>
                <View style={[styles.dot, selectedLeft === 2 && styles.selectedDot]} />
              </View>
            </View>

            {/* Right Column - Words */}
            <View style={styles.rightColumn}>
              <View style={styles.wordContainer}>
                <Text style={styles.wordText}>Frog</Text>
                <View style={[styles.dot, selectedRight === 0 && styles.selectedDot]} />
              </View>
              <View style={styles.wordContainer}>
                <Text style={styles.wordText}>Lion</Text>
                <View style={[styles.dot, selectedRight === 1 && styles.selectedDot]} />
              </View>
              <View style={styles.wordContainer}>
                <Text style={styles.wordText}>Pig</Text>
                <View style={[styles.dot, selectedRight === 2 && styles.selectedDot]} />
              </View>
            </View>

            {/* Connection Line */}
            {selectedLeft === 0 && selectedRight === 0 && (
              <View style={styles.connectionLine} />
            )}
          </View>

          {isCorrect && (
            <Text style={styles.correctText}>Correct! 🎉</Text>
          )}
        </View>
      </View>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        <Pressable 
          style={styles.nextButton}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>Next</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topSection: {
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  progressContainer: {
    flex: 1,
    marginLeft: 20,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF9500',
    width: '50%',
    borderRadius: 4,
  },
  moduleInfo: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
    fontFamily: 'BalsamiqSans_400Regular',
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  instruction: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 40,
    textAlign: 'left',
    fontFamily: 'BalsamiqSans_400Regular',
  },
  contentArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  matchingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    position: 'relative',
  },
  leftColumn: {
    alignItems: 'center',
    gap: 30,
  },
  rightColumn: {
    alignItems: 'center',
    gap: 30,
  },
  imageContainer: {
    alignItems: 'center',
    gap: 10,
  },
  wordContainer: {
    alignItems: 'center',
    gap: 10,
  },
  frogImage: {
    width: 80,
    height: 80,
    backgroundColor: '#90EE90',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#32CD32',
  },
  placeholderImage: {
    width: 80,
    height: 80,
    backgroundColor: '#F0F0F0',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#D3D3D3',
  },
  frogText: {
    fontSize: 40,
  },
  placeholderText: {
    fontSize: 40,
  },
  wordText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    fontFamily: 'BalsamiqSans_400Regular',
  },
  dot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FF9500',
  },
  selectedDot: {
    backgroundColor: '#007AFF',
    borderWidth: 3,
    borderColor: '#0056CC',
  },
  connectionLine: {
    position: 'absolute',
    top: 45,
    left: '25%',
    right: '25%',
    height: 2,
    backgroundColor: '#C0C0C0',
    transform: [{ rotate: '15deg' }],
  },
  correctText: {
    fontSize: 24,
    color: '#10B981',
    fontWeight: 'bold',
    marginTop: 20,
    fontFamily: 'BalsamiqSans_400Regular',
  },
  bottomSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: 'flex-end',
  },
  nextButton: {
    backgroundColor: '#34C759',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'BalsamiqSans_400Regular',
  },
});
