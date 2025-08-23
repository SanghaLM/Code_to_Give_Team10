import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';

// Hardcoded reported posts data
const REPORTED_POSTS = [
  {
    id: 'p1',
    username: 'Daisy',
    avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
    text: 'Check out this funny meme! 😂',
    image: 'https://i.imgur.com/YOe4QqF.jpg',
    reason: 'Inappropriate image',
  },
  {
    id: 'p2',
    username: 'Frank',
    avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
    text: 'Who wants to play chess online?',
    image: null,
    reason: 'Spam',
  },
];

export default function ReportsPage() {
  const router = useRouter();
  const [posts, setPosts] = useState(REPORTED_POSTS);

  const handleAction = (id, action) => {
    setPosts(posts.filter(post => post.id !== id));
    // In a real app, send action to backend
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>{'< Back'}</Text>
      </Pressable>
      <Text style={styles.title}>Reported Posts</Text>
      <FlatList
        data={posts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.headerRow}>
              <Image source={{ uri: item.avatar }} style={styles.avatar} />
              <View style={{ flex: 1 }}>
                <Text style={styles.username}>{item.username}</Text>
                <Text style={styles.reason}>Reason: {item.reason}</Text>
              </View>
            </View>
            <Text style={styles.text}>{item.text}</Text>
            {item.image && (
              <Image source={{ uri: item.image }} style={styles.postImage} />
            )}
            <View style={styles.actionsRow}>
              <Pressable style={styles.takeDownButton} onPress={() => handleAction(item.id, 'takedown')}>
                <Text style={styles.takeDownText}>Take Down</Text>
              </Pressable>
              <Pressable style={styles.ignoreButton} onPress={() => handleAction(item.id, 'ignore')}>
                <Text style={styles.ignoreText}>Ignore</Text>
              </Pressable>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={{ color: '#888', marginTop: 24, textAlign: 'center' }}>No reported posts.</Text>}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 18 },
  backButton: { marginBottom: 8, alignSelf: 'flex-start', paddingVertical: 4, paddingHorizontal: 8 },
  backButtonText: { color: '#e53935', fontSize: 16, fontWeight: 'bold' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, color: '#e53935' },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 18,
    shadowColor: '#c7c7c7ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  avatar: { width: 36, height: 36, borderRadius: 18, marginRight: 10 },
  username: { fontWeight: 'bold', fontSize: 16 },
  reason: { color: '#e53935', fontSize: 13, marginTop: 2 },
  text: { marginBottom: 8, fontSize: 15 },
  postImage: { width: '100%', height: 140, borderRadius: 8, marginBottom: 8 },
  actionsRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12 },
  takeDownButton: {
    backgroundColor: '#e53935',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  takeDownText: { color: '#fff', fontWeight: 'bold' },
  ignoreButton: {
    backgroundColor: '#eee',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  ignoreText: { color: '#888', fontWeight: 'bold' },
});
