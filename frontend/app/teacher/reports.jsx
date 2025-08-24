import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as api from '../tabs/communityTabs/../../api';
import { useUser } from '../userContext';

export default function ReportsPage() {
  const router = useRouter();
  const { token } = useUser();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.request('/public/posts?reported=true', { method: 'GET' }, token);
      const items = (res.posts || []).map(p => ({ ...p, id: p.id || p._id }));
      setPosts(items);
    } catch (err) {
      console.warn('Failed to load reported posts', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleAction = async (id, action) => {
    try {
      if (action === 'takedown') {
        await api.request(`/public/posts/${id}`, { method: 'DELETE' }, token);
        setPosts(prev => prev.filter(p => String(p.id) !== String(id)));
      } else if (action === 'ignore') {
        await api.request(`/public/posts/${id}/unreport`, { method: 'PATCH' }, token);
        setPosts(prev => prev.filter(p => String(p.id) !== String(id)));
      }
    } catch (err) {
      console.warn('Moderation action failed', err);
      Alert.alert('Error', 'Action failed.');
    }
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
              <Image source={{ uri: item.avatar || 'https://randomuser.me/api/portraits/lego/1.jpg' }} style={styles.avatar} />
              <View style={{ flex: 1 }}>
                <Text style={styles.username}>{item.author || item.username || 'Unknown'}</Text>
                <Text style={styles.reason}>Reason: {item.reason || 'Reported'}</Text>
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
        ListEmptyComponent={<Text style={{ color: '#888', marginTop: 24, textAlign: 'center' }}>{loading ? 'Loading...' : 'No reported posts.'}</Text>}
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
