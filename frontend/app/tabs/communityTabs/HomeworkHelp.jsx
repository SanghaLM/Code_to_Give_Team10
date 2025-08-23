

import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import NewPublicPost from './NewPublicPost';
import PublicPosts from './PublicPosts';
import Modal from 'react-native-modal';

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
const [reactedPostIds, setReactedPostIds] = useState([]); // Track posts reacted to

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
		if (reactedPostIds.includes(postId)) return; // Prevent multiple reactions
		setPosts(posts.map(post =>
			post.id === postId
				? { ...post, reactions: post.reactions + 1 }
				: post
		));
		setReactedPostIds([...reactedPostIds, postId]);
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
