
import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

// Hardcoded data for demo
const improvementStats = {
  avgCompletionTime: {
    lastWeek: 42, // minutes
    thisWeek: 38,
  },
  avgCompletionRate: {
    lastWeek: 82, // percent
    thisWeek: 89,
  },
};

const potentialConcerns = [
  {
    name: 'Bob Smith',
    missed: 2,
    slow: 1,
    fast: 0,
    avatar: 'https://randomuser.me/api/portraits/men/11.jpg',
  },
  {
    name: 'Charlie Lee',
    missed: 1,
    slow: 2,
    fast: 1,
    avatar: 'https://randomuser.me/api/portraits/men/12.jpg',
  },
];

export default function TeacherDashboard() {
  const router = useRouter();
  const completionTimeChange = improvementStats.avgCompletionTime.thisWeek - improvementStats.avgCompletionTime.lastWeek;
  const completionRateChange = improvementStats.avgCompletionRate.thisWeek - improvementStats.avgCompletionRate.lastWeek;
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Reports Received Button */}
      <Pressable style={styles.reportsButton} onPress={() => router.push('/teacher/reports')}>
        <Text style={styles.reportsButtonText}>Reports Received</Text>
      </Pressable>

      {/* Improvement Statistics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Improvement Statistics</Text>
        <View style={styles.statsRow}>
          <Text style={styles.statLabel}>Avg. Completion Time:</Text>
          <Text style={styles.statValue}>{improvementStats.avgCompletionTime.thisWeek} min</Text>
          <Text style={[styles.statChange, { color: completionTimeChange < 0 ? '#16a34a' : '#e11d48' }]}>({completionTimeChange < 0 ? '↓' : '↑'} {Math.abs(completionTimeChange)} min)</Text>
        </View>
        <View style={styles.statsRow}>
          <Text style={styles.statLabel}>Avg. Completion Rate:</Text>
          <Text style={styles.statValue}>{improvementStats.avgCompletionRate.thisWeek}%</Text>
          <Text style={[styles.statChange, { color: completionRateChange > 0 ? '#16a34a' : '#e11d48' }]}>({completionRateChange > 0 ? '↑' : '↓'} {Math.abs(completionRateChange)}%)</Text>
        </View>
      </View>

      {/* Potential Concerns */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Potential Concerns</Text>
        {potentialConcerns.length === 0 ? (
          <Text style={{ color: '#888', marginTop: 8 }}>No concerns at this time.</Text>
        ) : (
          potentialConcerns.map((student, idx) => (
            <View key={idx} style={styles.concernCard}>
              <View style={styles.concernRow}>
                <View style={styles.avatar}>
                  <View style={styles.avatarCircle}>
                    <Text style={styles.avatarInitial}>{student.name[0]}</Text>
                  </View>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.concernName}>{student.name}</Text>
                  <Text style={styles.concernDetail}>Missed: {student.missed} | Slow: {student.slow} | Fast: {student.fast}</Text>
                </View>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  contentContainer: { padding: 24 },
  reportsButton: {
    backgroundColor: '#e53935', // red
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 24,
    elevation: 2,
  },
  reportsButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 18,
    marginBottom: 24,
    shadowColor: '#c7c7c7ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1976d2',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statLabel: { fontSize: 16, color: '#333', flex: 1 },
  statValue: { fontSize: 16, fontWeight: 'bold', color: '#000', marginLeft: 8 },
  statChange: { fontSize: 15, marginLeft: 8 },
  concernCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  concernRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: { marginRight: 14 },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e0e7ef',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: { fontSize: 20, fontWeight: 'bold', color: '#1976d2' },
  concernName: { fontSize: 16, fontWeight: 'bold', color: '#000' },
  concernDetail: { fontSize: 14, color: '#555', marginTop: 2 },
});
