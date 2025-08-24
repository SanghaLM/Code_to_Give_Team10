import React from 'react';
import { View, Text, StyleSheet, Pressable, SafeAreaView, ScrollView, Image } from 'react-native';
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
          <Text style={styles.instruction}>Parental Guidance</Text>
          
          <View style={styles.instructionCard}>
            <View style={styles.instructionHeader}>
              <Ionicons name="information-circle" size={24} color="#007AFF" />
              <Text style={styles.instructionTitle}>How to Complete This Exercise</Text>
            </View>
            
            <Text style={styles.instructionText}>
            This exercise contains interactive activities marked by four symbols, each directly related to a different core skill.
            </Text>
          </View>

          <View style={styles.stepsContainer}>
            <View style={styles.stepItem}>
              <View style={styles.stepImage}>
                <Image source={require('../../../assets/instructions/icon-1.jpeg')} style={styles.stepIcon} />
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Point & Read</Text>
                <Text style={styles.stepDescription}>
                 Press speaker button and speak out the word written on the screen..
                </Text>
              </View>
            </View>

            <View style={styles.stepItem}>
              <View style={styles.stepImage}>
                <Image source={require('../../../assets/instructions/icon-2.jpeg')} style={styles.stepIcon} />
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Trace the Letter</Text>
                <Text style={styles.stepDescription}>
                 Place your finger on the screen and trace the dotted line to form the letter
                </Text>
              </View>
            </View>

            <View style={styles.stepItem}>
              <View style={styles.stepImage}>
                <Image source={require('../../../assets/instructions/icon-3.jpeg')} style={styles.stepIcon} />
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Independent Task</Text>
                <Text style={styles.stepDescription}>
                  Your child is encouraged to write and complete the task independently.
                </Text>
              </View>
            </View>

            <View style={styles.stepItem}>
              <View style={styles.stepImage}>
                <Image source={require('../../../assets/instructions/icon-4.jpeg')} style={styles.stepIcon} />
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Choose the Correct Answer</Text>
                <Text style={styles.stepDescription}>
                From the choices provided, identify and tap the correct answer. 
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
    fontFamily: fontFamily.bold,
    color: '#000',
    marginBottom: 30,
    textAlign: 'left',
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
    fontFamily: fontFamily.bold,
    color: '#000',
    marginLeft: 10,
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
    marginBottom: 30,
    alignItems: 'flex-start',
  },

  stepContent: {
    flex: 1,
    paddingTop: 5,
  },
  stepTitle: {
    fontSize: 18,
    fontFamily: fontFamily.bold,
    color: '#000',
    marginBottom: 8,
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
    fontFamily: fontFamily.bold,
    color: '#10b981',
    marginBottom: 15,
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
    fontFamily: fontFamily.bold,
  },
  stepImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
    marginTop: 0,
    overflow: 'hidden',
  },
  stepIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
});