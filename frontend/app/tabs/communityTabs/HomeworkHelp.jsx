

import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import NewPublicPost from './NewPublicPost';
import PublicPosts from './PublicPosts';
import RNModal from 'react-native-modal';

// Chat Rules Popup Component
const ChatRulesPopup = ({ visible, onClose }) => {
  const chatRules = [
    "Be respectful and kind to everyone",
    "No bullying, harassment, or hate speech",
    "Keep conversations appropriate for all ages",
    "No sharing personal information",
    "Report any concerning behavior to teachers",
    "Stay on topic and relevant to the community"
  ];

  return (
    <RNModal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.rulesPopupOverlay}>
        <View style={styles.rulesPopupContainer}>
          <View style={styles.rulesPopupHeader}>
            <View style={styles.rulesPopupTitleContainer}>
              <Ionicons name="warning" size={20} color="#8B4513" style={{ marginRight: 8 }} />
              <Text style={styles.rulesPopupTitle}>Chat Rules</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.rulesCloseButton}>
              <Ionicons name="close" size={24} color="#8B4513" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.rulesPopupContent}>
            {chatRules.map((rule, index) => (
              <View key={index} style={styles.rulesPopupRuleItem}>
                <Text style={styles.rulesPopupRuleNumber}>{index + 1}.</Text>
                <Text style={styles.rulesPopupRuleText}>{rule}</Text>
              </View>
            ))}
          </View>
          
          <TouchableOpacity style={styles.rulesAcknowledgeButton} onPress={onClose}>
            <Text style={styles.rulesAcknowledgeButtonText}>I Understand</Text>
          </TouchableOpacity>
        </View>
      </View>
    </RNModal>
  );
};

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
const [rulesModalVisible, setRulesModalVisible] = useState(false);
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

	const handleFabPress = () => {
		// Show rules first, then post modal after acknowledgment
		setRulesModalVisible(true);
	};

	const handleRulesClose = () => {
		setRulesModalVisible(false);
		// Show post creation modal after rules are acknowledged
		setModalVisible(true);
	};

	return (
		<View style={styles.container}>
			<PublicPosts posts={posts} onReact={handleReact} onAddComment={handleAddComment} />

			{/* Chat Rules Popup - Shows First */}
			<ChatRulesPopup 
				visible={rulesModalVisible} 
				onClose={handleRulesClose} 
			/>
			
			{/* Post Creation Modal - Shows After Rules */}
			<RNModal
				isVisible={modalVisible}
				onBackdropPress={() => setModalVisible(false)}
				style={styles.modal}
				avoidKeyboard
			>
				<View style={styles.modalContent}>
					<NewPublicPost onAddPost={handleAddPost} />
				</View>
			</RNModal>
			
			<TouchableOpacity
				style={styles.fab}
				onPress={handleFabPress}
				activeOpacity={0.8}
			>
				<Ionicons name="add" size={28} color="#fff" />
			</TouchableOpacity> 
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
	rulesPopupOverlay: {
		flex: 1,
		backgroundColor: 'rgba(0,0,0,0.5)',
		justifyContent: 'center',
		alignItems: 'center',
	},
	rulesPopupContainer: {
		backgroundColor: '#fff',
		borderRadius: 16,
		padding: 24,
		width: '80%',
		alignItems: 'center',
		shadowColor: '#c7c7c7ff',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.15,
		shadowRadius: 8,
		elevation: 8,
	},
	rulesPopupHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		width: '100%',
		marginBottom: 16,
	},
	rulesPopupTitleContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	rulesPopupTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		color: '#8B4513',
		fontFamily: 'BalsamiqSans_700Bold',
	},
	rulesCloseButton: {
		padding: 8,
	},
	rulesPopupContent: {
		width: '100%',
		marginBottom: 20,
	},
	rulesPopupRuleItem: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		marginBottom: 12,
	},
	rulesPopupRuleNumber: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#F7941F',
		marginRight: 10,
		fontFamily: 'BalsamiqSans_700Bold',
	},
	rulesPopupRuleText: {
		fontSize: 16,
		color: '#333',
		fontFamily: 'BalsamiqSans_400Regular',
	},
	rulesAcknowledgeButton: {
		backgroundColor: '#F7941F',
		paddingVertical: 12,
		paddingHorizontal: 24,
		borderRadius: 10,
		width: '100%',
	},
	rulesAcknowledgeButtonText: {
		color: '#fff',
		fontSize: 18,
		fontWeight: 'bold',
		textAlign: 'center',
		fontFamily: 'BalsamiqSans_700Bold',
	},
});
