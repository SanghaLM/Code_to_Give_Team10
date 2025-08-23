
import React from 'react';
import { View, Text, StyleSheet, Image, FlatList } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

// Hardcoded assignments and students data for demo
const ASSIGNMENTS = [
  {
    id: 'a1',
    title: 'Math Homework Week 1',
    submissions: [
      { studentId: '1', score: 95, completedAt: '2025-08-20 18:00' },
      { studentId: '2', score: 78, completedAt: '2025-08-21 09:30' },
    ],
  },
  {
    id: 'a2',
    title: 'Science Project Week 1',
    submissions: [
      { studentId: '1', score: 88, completedAt: '2025-08-22 10:00' },
      { studentId: '2', score: 92, completedAt: '2025-08-22 11:00' },
    ],
  },
  {
    id: 'a3',
    title: 'English Essay Week 1',
    submissions: [
      { studentId: '2', score: 90, completedAt: '2025-08-23 08:00' },
    ],
  },
];

const STUDENTS = [
  {
    id: '1',
    name: 'Alice Johnson',
    parent: 'Mary Johnson',
    avatar: 'https://randomuser.me/api/portraits/women/10.jpg',
  },
  {
    id: '2',
    name: 'Bob Smith',
    parent: 'John Smith',
    avatar: 'https://randomuser.me/api/portraits/men/11.jpg',
  },
];

export default function StudentDetails() {
  const { id } = useLocalSearchParams();
  const student = STUDENTS.find(s => s.id === id);
  if (!student) return <Text>Student not found.</Text>;

  // Gather all assignments with this student's submission
  const studentAssignments = ASSIGNMENTS.map(a => {
    const submission = a.submissions.find(s => s.studentId === id);
    return submission
      ? { title: a.title, score: submission.score, completedAt: submission.completedAt }
      : null;
  }).filter(Boolean);

  return (
    <View style={styles.container}>
      <Image source={{ uri: student.avatar }} style={styles.avatar} />
      <Text style={styles.name}>{student.name}</Text>
      <Text style={styles.parent}>Parent: {student.parent}</Text>
      <Text style={styles.sectionTitle}>Assignment Submissions</Text>
      <FlatList
        data={studentAssignments}
        keyExtractor={item => item.title}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.assignmentTitle}>{item.title}</Text>
            <View style={styles.cardRow}>
              <Text style={styles.assignmentScore}>Score: <Text style={styles.scoreValue}>{item.score}</Text></Text>
              <Text style={styles.assignmentTime}>Completed: {item.completedAt}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={{ color: '#888', marginTop: 12 }}>No submissions yet.</Text>}
        contentContainerStyle={{ width: '100%' }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', padding: 24, backgroundColor: '#fff' },
  avatar: { width: 90, height: 90, borderRadius: 45, marginBottom: 16 },
  name: { fontSize: 22, fontWeight: 'bold', marginBottom: 4 },
  parent: { fontSize: 16, color: '#555', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 16, marginBottom: 8 },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#c7c7c7ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  assignmentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000',
    fontFamily: 'BalsamiqSans_400Regular',
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  assignmentScore: {
    fontSize: 15,
    color: '#000',
    fontFamily: 'BalsamiqSans_400Regular',
  },
  scoreValue: {
    color: '#1976d2',
    fontWeight: 'bold',
    fontFamily: 'BalsamiqSans_400Regular',
  },
  assignmentTime: {
    fontSize: 13,
    color: '#555',
    fontFamily: 'BalsamiqSans_400Regular',
  },
});
