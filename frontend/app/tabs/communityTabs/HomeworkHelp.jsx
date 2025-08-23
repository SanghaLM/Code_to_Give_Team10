

import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import NewPublicPost from './NewPublicPost';
import PublicPosts from './PublicPosts';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

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
	const [posts, setPosts] = useState(initialPosts);
	const [modalVisible, setModalVisible] = useState(false);

	const handleAddPost = (text, image) => {
		setPosts([
			{
				id: Math.random().toString(),
				username: 'You',
				avatar: 'https://randomuser.me/api/portraits/lego/1.jpg',
				text,
				image: image || null,
				reactions: 0,
				comments: [],
				timestamp: 'Just now',
			},
			...posts,
		]);
		setModalVisible(false);
	};

	const handleReact = postId => {
		setPosts(posts.map(post =>
			post.id === postId
				? { ...post, reactions: post.reactions + 1 }
				: post
		));
	};

	const handleAddComment = (postId, commentText) => {
		setPosts(posts.map(post =>
			post.id === postId
				? {
						...post,
						comments: [
							...post.comments,
							{
								id: Math.random().toString(),
								username: 'You',
								text: commentText,
							},
						],
					}
				: post
		));
	};

	return (
		<View style={styles.container}>
			<PublicPosts posts={posts} onReact={handleReact} onAddComment={handleAddComment} />
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
});
