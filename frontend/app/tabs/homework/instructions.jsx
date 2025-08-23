import React from 'react';
import { View, Text, StyleSheet, Pressable, SafeAreaView, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { fontFamily } from '../../fonts';

export default function InstructionsScreen() {
  const router = useRouter();
  
  // Get module info from route params or use default
  const moduleInfo = router.params?.moduleInfo || 'Booklet 2, Module 4 - Fruits';

  const handleStartExercise = () => {
    // Always start with hw-1, then progress through the sequence
    router.push({
      pathname: '/tabs/homework/hw-1',
      params: { moduleInfo }
    });
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Section */}
      <View style={styles.topSection}>
        <View style={styles.headerRow}>
          <Pressable onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </Pressable>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={styles.progressFill} />
            </View>
          </View>
        </View>
        <Text style={styles.moduleInfo}>{moduleInfo}</Text>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.mainContent} showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          <Text style={styles.instruction}>Exercise Instructions</Text>
          
          <View style={styles.instructionCard}>
            <View style={styles.instructionHeader}>
              <Ionicons name="information-circle" size={24} color="#007AFF" />
              <Text style={styles.instructionTitle}>How to Complete This Exercise</Text>
            </View>
            
            <Text style={styles.instructionText}>
              This exercise consists of 4 interactive activities that will help you learn and practice the concepts. Here's what you'll encounter:
            </Text>
          </View>

          <View style={styles.stepsContainer}>
            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Reading & Pronunciation</Text>
                <Text style={styles.stepDescription}>
                  Listen to the word and practice saying it out loud. Tap the audio button to hear the correct pronunciation.
                </Text>
              </View>
            </View>

            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Matching Exercise</Text>
                <Text style={styles.stepDescription}>
                  Match the correct word with its corresponding image. Select items from both columns to make the right connection.
                </Text>
              </View>
            </View>

            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Letter Recognition</Text>
                <Text style={styles.stepDescription}>
                  Identify the correct letter from the options provided. Look carefully at each choice before making your selection.
                </Text>
              </View>
            </View>

            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>4</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Tracing Practice</Text>
                <Text style={styles.stepDescription}>
                  Practice writing by tracing the dotted letters. Follow the pattern carefully to improve your handwriting skills.
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.tipsContainer}>
            <Text style={styles.tipsTitle}>💡 Tips for Success</Text>
            <View style={styles.tipItem}>
              <Ionicons name="checkmark-circle" size={20} color="#10b981" />
              <Text style={styles.tipText}>Take your time and read each instruction carefully</Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="checkmark-circle" size={20} color="#10b981" />
              <Text style={styles.tipText}>Practice pronunciation by repeating words out loud</Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="checkmark-circle" size={20} color="#10b981" />
              <Text style={styles.tipText}>Don't worry about making mistakes - learning is a process!</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        <Pressable 
          style={styles.startButton}
          onPress={handleStartExercise}
        >
          <Text style={styles.startButtonText}>Start Exercise</Text>
          <Ionicons name="play" size={20} color="#fff" />
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
    width: '0%',
    borderRadius: 4,
  },
  moduleInfo: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: fontFamily.regular,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  instruction: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 30,
    textAlign: 'left',
    fontFamily: fontFamily.bold,
  },
  instructionCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  instructionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  instructionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginLeft: 10,
    fontFamily: fontFamily.bold,
  },
  instructionText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    fontFamily: fontFamily.regular,
  },
  stepsContainer: {
    marginBottom: 30,
  },
  stepItem: {
    flexDirection: 'row',
    marginBottom: 25,
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    marginTop: 2,
  },
  stepNumberText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: fontFamily.bold,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
    fontFamily: fontFamily.bold,
  },
  stepDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    fontFamily: fontFamily.regular,
  },
  tipsContainer: {
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#10b981',
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#10b981',
    marginBottom: 15,
    fontFamily: fontFamily.bold,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  tipText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 10,
    fontFamily: fontFamily.regular,
  },
  bottomSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: fontFamily.bold,
  },
});