import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function Hw4Screen() {
  const router = useRouter();
  const [isCompleted, setIsCompleted] = useState(false);

  const handleComplete = () => {
    setIsCompleted(true);
  };

  const handleFinish = () => {
    setTimeout(() => {
      router.push('/tabs/homework/hw-end');
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
        <Text style={styles.instruction}>Trace the letter</Text>
        
        <View style={styles.contentArea}>
          <View style={styles.tracingContainer}>
            <View style={styles.letterOutline}>
              <Text style={styles.letterDots}>A</Text>
              <View style={styles.tracePath}>
                {/* Dotted outline of letter A */}
                <View style={styles.dotRow}>
                  <View style={styles.dot} />
                  <View style={styles.dot} />
                  <View style={styles.dot} />
                  <View style={styles.dot} />
                  <View style={styles.dot} />
                </View>
                <View style={styles.dotRow}>
                  <View style={styles.dot} />
                  <View style={styles.dot} />
                  <View style={styles.dot} />
                  <View style={styles.dot} />
                  <View style={styles.dot} />
                </View>
                <View style={styles.dotRow}>
                  <View style={styles.dot} />
                  <View style={styles.dot} />
                  <View style={styles.dot} />
                  <View style={styles.dot} />
                  <View style={styles.dot} />
                  <View style={styles.dot} />
                </View>
              </View>
            </View>
          </View>

          {!isCompleted && (
            <Pressable style={styles.completeButton} onPress={handleComplete}>
              <Text style={styles.completeButtonText}>Mark as Complete</Text>
            </Pressable>
          )}

          {isCompleted && (
            <Text style={styles.completedText}>Great job! Letter traced! 🎉</Text>
          )}
        </View>

        <View style={styles.optionsRow}>
          {options.map((opt, idx) => (
            !(dropped && opt === selectedWord) && (
              <Animated.View
                key={opt}
                style={[styles.wordTile, pans[idx].getLayout(), draggingIdx === idx && { zIndex: 2 }]}
                {...panResponders[idx].panHandlers}
              >
                <Text style={styles.tileText}>{opt}</Text>
              </Animated.View>
            )
          ))}
        </View>
      </View>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        <Pressable 
          style={styles.finishButton}
          onPress={handleFinish}
        >
          <Text style={styles.finishButtonText}>Finish</Text>
          <Ionicons name="checkmark" size={20} color="#fff" />
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
    width: '100%',
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
  sentenceRow: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 20,
  flexWrap: 'wrap',
  justifyContent: 'center',
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
  tracingContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  letterOutline: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  letterDots: {
    fontSize: 120,
    fontWeight: 'bold',
    color: '#000',
    opacity: 0.1,
    fontFamily: 'BalsamiqSans_400Regular',
  },
  tracePath: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#000',
  },
  completeButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    marginBottom: 20,
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'BalsamiqSans_400Regular',
  },
  completedText: {
    fontSize: 24,
    color: '#10B981',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'BalsamiqSans_400Regular',
  },
  bottomSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: 'flex-end',
  },
  finishButton: {
    backgroundColor: '#34C759',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  finishButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'BalsamiqSans_400Regular',
  },
});
