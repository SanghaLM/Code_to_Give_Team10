
import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

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

export default function TeacherStudents() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Students</Text>
      <FlatList
        data={STUDENTS}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Pressable
            style={styles.studentRow}
            onPress={() => router.push({ pathname: '/teacher/studentDetails', params: { id: item.id } })}
          >
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <View style={{ flex: 1 }}>
              <Text style={styles.studentName}>{item.name}</Text>
              <Text style={styles.parentName}>Parent: {item.parent}</Text>
            </View>
          </Pressable>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  studentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  avatar: { width: 48, height: 48, borderRadius: 24, marginRight: 16 },
  studentName: { fontSize: 18, fontWeight: 'bold' },
  parentName: { fontSize: 14, color: '#555' },
  separator: { height: 12 },
});
