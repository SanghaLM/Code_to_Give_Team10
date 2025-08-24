
import React from 'react';
import { View, Text, StyleSheet, Button, FlatList, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

// Hardcoded assignments and submissions data
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
      { studentId: '1', score: 95 },
      { studentId: '2', score: 78 },
      { studentId: '3', score: 88 },
    ],
  },
  {
    id: 'a2',
    title: 'Science Project Week 1',
    submissions: [
      { studentId: '1', score: 88 },
      { studentId: '2', score: 92 },
      { studentId: '4', score: 85 },
    ],
  },
  {
    id: 'a3',
    title: 'English Essay Week 1',
    submissions: [
      { studentId: '3', score: 90 },
      { studentId: '4', score: 80 },
    ],
  },
];

function getStats(assignment) {
  const totalStudents = STUDENTS.length;
  const completed = assignment.submissions.length;
  const completionRate = ((completed / totalStudents) * 100).toFixed(0);
  const scores = assignment.submissions.map(s => s.score);
  const avg = scores.length ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : '-';
  const high = scores.length ? Math.max(...scores) : '-';
  const low = scores.length ? Math.min(...scores) : '-';
  return { completionRate, avg, high, low, completed, totalStudents };
}

export default function TeacherAssignments() {
  const router = useRouter();
  
  const handleCreateAssignment = () => {
    router.push('/teacher/create-assignment');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Assignments</Text>
      <Pressable style={styles.createButton} onPress={handleCreateAssignment}>
        <Text style={styles.createButtonText}>Create New Assignment</Text>
      </Pressable>
      <FlatList
        data={ASSIGNMENTS}
        keyExtractor={item => item.id}
        style={{ marginTop: 24 }}
        renderItem={({ item }) => {
          const stats = getStats(item);
          return (
            <Pressable
              style={styles.assignmentCard}
              onPress={() => router.push({ pathname: '/teacher/assignmentDetails', params: { id: item.id } })}
            >
              <Text style={styles.assignmentTitle}>{item.title}</Text>
              <View style={styles.statsRow}>
                <Text style={styles.stat}>Completion: {stats.completed}/{stats.totalStudents} ({stats.completionRate}%)</Text>
              </View>
              <View style={styles.statsRow}>
                <Text style={styles.stat}>Avg: {stats.avg}</Text>
                <Text style={styles.stat}>High: {stats.high}</Text>
                <Text style={styles.stat}>Low: {stats.low}</Text>
              </View>
            </Pressable>
          );
        }}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 24, 
    backgroundColor: '#FFF4E7',
    paddingTop: '12%',
  },
  title: { 
    fontSize: 28, 
    fontFamily: 'BalsamiqSans_700Bold', 
    marginBottom: 16,
    color: '#000',
  },
  createButton: {
    backgroundColor: '#F7941F',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#F7941F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'BalsamiqSans_700Bold',
  },
  assignmentCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#c7c7c7ff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  assignmentTitle: { 
    fontSize: 18, 
    fontFamily: 'BalsamiqSans_700Bold', 
    marginBottom: 8,
    color: '#000',
  },
  statsRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 4,
  },
  stat: { 
    fontSize: 15, 
    color: '#333',
    fontFamily: 'BalsamiqSans_400Regular',
  },
});
