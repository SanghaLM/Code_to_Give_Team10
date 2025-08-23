import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

// Hardcoded data (should match assignments.jsx)
const STUDENTS = [
  { id: '1', name: 'Alice Johnson' },
  { id: '2', name: 'Bob Smith' },
  { id: '3', name: 'Charlie Lee' },
  { id: '4', name: 'Daisy Kim' },
];

const ASSIGNMENTS = [
  {
    id: 'a1',
    title: 'Math Homework Week 1',
    submissions: [
      { studentId: '1', score: 95, completedAt: '2025-08-20 18:00' },
      { studentId: '2', score: 78, completedAt: '2025-08-21 09:30' },
      { studentId: '3', score: 88, completedAt: '2025-08-21 20:15' },
    ],
  },
  {
    id: 'a2',
    title: 'Science Project Week 1',
    submissions: [
      { studentId: '1', score: 88, completedAt: '2025-08-22 10:00' },
      { studentId: '2', score: 92, completedAt: '2025-08-22 11:00' },
      { studentId: '4', score: 85, completedAt: '2025-08-22 15:00' },
    ],
  },
  {
    id: 'a3',
    title: 'English Essay Week 1',
    submissions: [
      { studentId: '3', score: 90, completedAt: '2025-08-23 08:00' },
      { studentId: '4', score: 80, completedAt: '2025-08-23 09:00' },
    ],
  },
];

export default function AssignmentDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const assignment = ASSIGNMENTS.find(a => a.id === id);
  if (!assignment) return <Text>Assignment not found.</Text>;
  return (
    <View style={styles.container}>
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>{'< Back'}</Text>
      </Pressable>
      <Text style={styles.title}>{assignment.title}</Text>
      <Text style={styles.subtitle}>Submissions</Text>
      <FlatList
        data={assignment.submissions}
        keyExtractor={item => item.studentId}
        renderItem={({ item }) => {
          const student = STUDENTS.find(s => s.id === item.studentId);
          return (
            <View style={styles.submissionRow}>
              <Text style={styles.studentName}>{student ? student.name : 'Unknown'}</Text>
              <Text style={styles.score}>Score: {item.score}</Text>
              <Text style={styles.time}>Completed: {item.completedAt}</Text>
            </View>
          );
        }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff' },
  backButton: { marginBottom: 8, alignSelf: 'flex-start', paddingVertical: 4, paddingHorizontal: 8 },
  backButtonText: { color: '#1976d2', fontSize: 16, fontWeight: 'bold' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  subtitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  submissionRow: { marginBottom: 8, backgroundColor: '#f9f9f9', borderRadius: 8, padding: 12 },
  studentName: { fontSize: 16, fontWeight: 'bold' },
  score: { fontSize: 15, color: '#1976d2', marginTop: 2 },
  time: { fontSize: 13, color: '#555', marginTop: 2 },
  separator: { height: 8 },
});
