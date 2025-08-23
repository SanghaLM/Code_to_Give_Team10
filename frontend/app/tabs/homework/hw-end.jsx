import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function HwEndScreen() {
  const router = useRouter();

  const handleBackToTasks = () => {
    setTimeout(() => {
      router.push('/tabs/task');
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Section */}
      <View style={styles.topSection}>
        <Text style={styles.moduleInfo}>Booklet 2, Module 4 - Fruits</Text>
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        <View style={styles.congratsContainer}>
          <Ionicons name="trophy" size={80} color="#FFD700" />
          <Text style={styles.congratsText}>Congratulations!</Text>
          <Text style={styles.completionText}>You've completed Module 4 - Fruits</Text>
        </View>

        <View style={styles.scoreContainer}>
          <Text style={styles.scoreLabel}>Your Score</Text>
          <Text style={styles.scoreValue}>18/20</Text>
          <Text style={styles.scorePercentage}>90%</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Ionicons name="checkmark-circle" size={24} color="#10b981" />
            <Text style={styles.statText}>4 questions completed</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="time" size={24} color="#3b82f6" />
            <Text style={styles.statText}>Time: 2:30</Text>
          </View>
        </View>
      </View>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        <Pressable 
          style={styles.finishButton}
          onPress={handleBackToTasks}
        >
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
    backgroundColor: '#fff',
  },
  topSection: {
    paddingTop: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  moduleInfo: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'BalsamiqSans_400Regular',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  congratsContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  congratsText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: 'BalsamiqSans_400Regular',
  },
  completionText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    fontFamily: 'BalsamiqSans_400Regular',
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  scoreLabel: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
    fontFamily: 'BalsamiqSans_400Regular',
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 5,
    fontFamily: 'BalsamiqSans_400Regular',
  },
  scorePercentage: {
    fontSize: 24,
    color: '#10b981',
    fontWeight: '600',
    fontFamily: 'BalsamiqSans_400Regular',
  },
  statsContainer: {
    width: '100%',
    gap: 15,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
  },
  statText: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'BalsamiqSans_400Regular',
  },
  bottomSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  finishButton: {
    backgroundColor: '#007AFF',
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
