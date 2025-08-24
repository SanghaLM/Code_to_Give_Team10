

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import NewPublicPost from './NewPublicPost';
import PublicPosts from './PublicPosts';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as api from '../../api';
import { useUser } from '../../userContext';

export default function HomeworkHelp() {
	const [posts, setPosts] = useState([]);
	const [modalVisible, setModalVisible] = useState(false);
	const [reactedPostIds, setReactedPostIds] = useState([]);
	const { username, token } = useUser();

	const load = async () => {
		try {
			const res = await api.listPublicPostsByCategory('homework');
			setPosts(res.posts || []);
		} catch (err) {
			console.warn('Failed to load public posts', err);
		}
	};

	useEffect(() => { load(); }, []);

	const handleAddPost = async (text, image) => {
		try {
			const res = await api.createPublicPost(username || 'You', text, image, token, 'homework');
			setPosts(prev => [res.post, ...prev]);
			setModalVisible(false);
		} catch (err) {
			console.error('Failed to create post', err);
		}
	};

	const handleReact = async (postId) => {
		if (reactedPostIds.includes(postId)) return;
		try {
			const res = await api.request(`/public/posts/${postId}/react`, { method: 'POST' }, token);
			setPosts(prev => prev.map(p => (String(p.id || p._id) === String(res.post.id || res.post._id) ? res.post : p)));
			setReactedPostIds(prev => [...prev, postId]);
		} catch (err) {
			console.warn('React failed', err);
		}
	};

	const handleAddComment = async (postId, commentText) => {
		try {
			const res = await api.request(`/public/posts/${postId}/comment`, { method: 'POST', body: JSON.stringify({ username: username || 'You', text: commentText }) }, token);
			setPosts(prev => prev.map(p => (String(p.id || p._id) === String(res.post.id || res.post._id) ? res.post : p)));
		} catch (err) {
			console.warn('Add comment failed', err);
		}
	};

	const handleReport = async (postId) => {
		try {
			await api.request(`/public/posts/${postId}/report`, { method: 'POST' }, token);
			// Optionally remove reported post from public view; reload
			setPosts(prev => prev.filter(p => String(p.id || p._id) !== String(postId)));
		} catch (err) {
			console.warn('Report failed', err);
		}
	};

	return (
		<View style={styles.container}>
			<PublicPosts posts={posts} onReact={handleReact} onAddComment={handleAddComment} onReport={handleReport} />
			<TouchableOpacity
				style={styles.fab}
				onPress={() => setModalVisible(true)}
				activeOpacity={0.8}
			>
				<Icon name="plus-circle" size={60} color="#1976d2" />
			</TouchableOpacity>
			<Modal
				isVisible={modalVisible}
				onBackdropPress={() => setModalVisible(false)}
				style={styles.modal}
				avoidKeyboard
			>
				<View style={styles.modalContent}>
					<NewPublicPost onAddPost={handleAddPost} />
				</View>
			</Modal>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: '#f5f5f5', padding: 12 },
	fab: {
		position: 'absolute',
		right: 24,
		bottom: 32,
		zIndex: 10,
		elevation: 10,
	},
	modal: {
		justifyContent: 'center',
		margin: 0,
	},
	modalContent: {
		backgroundColor: '#fff',
		borderRadius: 12,
		padding: 20,
		marginHorizontal: 24,
	},
	lastMessageContainer: {
		alignItems: 'center',
		marginTop: 8,
		marginBottom: 80, // leave space for FAB
	},
	lastMessage: {
		color: '#888',
		fontSize: 15,
		textAlign: 'center',
		paddingVertical: 8,
	},
});
