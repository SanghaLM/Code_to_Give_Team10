

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import NewPublicPost from './NewPublicPost';
import PublicPosts from './PublicPosts';
import Modal from 'react-native-modal';
import * as api from '../../api';
import { useUser } from '../../userContext';

const initialPosts = [
	{
		id: '1',
		username: 'Alice',
		avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
		text: 'How do I solve this math problem?',
		image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
		reactions: 2,
		comments: [
			{ id: 'c1', username: 'Bob', text: 'Try using the quadratic formula!' },
		],
		timestamp: '2h ago',
	},
	{
		id: '2',
		username: 'Charlie',
		avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
		text: 'Anyone finished the science homework?',
		image: null,
		reactions: 1,
		comments: [],
		timestamp: '1h ago',
	},
];

export default function HomeworkHelp() {
	// fallback demo posts so the feed is visible without a backend
	const [posts, setPosts] = useState(initialPosts);
	const [modalVisible, setModalVisible] = useState(false);
	const [reactedPostIds, setReactedPostIds] = useState([]);
	const { username, token } = useUser();

	const load = async () => {
		try {
			const res = await api.listPublicPostsByCategory('homework');
			if (res && Array.isArray(res.posts) && res.posts.length > 0) {
				setPosts(res.posts);
			}
		} catch (err) {
			console.warn('Failed to load public posts', err);
		}
	};

	useEffect(() => { load(); }, []);

	const handleAddPost = async (text, image) => {
		try {
				const sendUsername = (username || '').toLowerCase() === 'sarahchen' ? 'Sarah Chen' : (username || 'You');
				const sendAvatar = (username || '').toLowerCase() === 'sarahchen' ? 'https://randomuser.me/api/portraits/women/65.jpg' : undefined;
				const res = await api.createPublicPost(username || 'sarahchen', text, image, token, 'homework', sendUsername, sendAvatar);
				let newPost = res.post || {};
				if ((username || '').toLowerCase() === 'sarahchen') {
					newPost = {
						...newPost,
						username: 'Sarah Chen',
						avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
					};
				} else {
					newPost = { ...newPost, username: newPost.author || username || 'You' };
				}
				setPosts(prev => [newPost, ...prev]);
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
				<Ionicons name="add" size={28} color="#fff" />
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
	container: { 
		flex: 1, 
		backgroundColor: '#FFF4E7', 
		paddingHorizontal: '5%',
		paddingTop: 10,
	},
	fab: {
		position: 'absolute',
		right: '7%',
		bottom: 32,
		zIndex: 10,
		elevation: 10,
		backgroundColor: '#F7941F',
		borderRadius: 30,
		width: 60,
		height: 60,
		justifyContent: 'center',
		alignItems: 'center',
		shadowColor: '#F7941F',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 8,
	},
	modal: {
		justifyContent: 'center',
		margin: 0,
	},
	modalContent: {
		backgroundColor: '#fff',
		borderRadius: 16,
		padding: 24,
		marginHorizontal: '5%',
		shadowColor: '#c7c7c7ff',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.15,
		shadowRadius: 8,
		elevation: 8,
	},
	lastMessageContainer: {
		alignItems: 'center',
		marginTop: 8,
		marginBottom: 100, // leave space for FAB
	},
	lastMessage: {
		color: '#666',
		fontSize: 15,
		textAlign: 'center',
		paddingVertical: 8,
		fontFamily: 'BalsamiqSans_400Regular',
	},
});
