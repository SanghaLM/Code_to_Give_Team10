
import React, { useState, useRef } from 'react';
import { View, Text, Image, TextInput, Button, TouchableOpacity, StyleSheet, FlatList, Modal, Pressable, Platform, ToastAndroid, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.popupOverlay}>
        <View style={styles.popupContainer}>
          <View style={styles.popupHeader}>
            <View style={styles.popupTitleContainer}>
              <Ionicons name="warning" size={20} color="#8B4513" style={{ marginRight: 8 }} />
              <Text style={styles.popupTitle}>Chat Rules</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#8B4513" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.popupContent}>
            {chatRules.map((rule, index) => (
              <View key={index} style={styles.popupRuleItem}>
                <Text style={styles.popupRuleNumber}>{index + 1}.</Text>
                <Text style={styles.popupRuleText}>{rule}</Text>
              </View>
            ))}
          </View>
          
          <TouchableOpacity style={styles.acknowledgeButton} onPress={onClose}>
            <Text style={styles.acknowledgeButtonText}>I Understand</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

function Post({ post, onReact, onAddComment }) {
	const [comment, setComment] = useState('');
	const [menuVisible, setMenuVisible] = useState(false);
	const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
	const [showRules, setShowRules] = useState(false);
	const [hasShownRules, setHasShownRules] = useState(false);
	const menuButtonRef = useRef();

	const showMenu = () => {
		if (menuButtonRef.current) {
			menuButtonRef.current.measureInWindow((x, y, width, height) => {
				setMenuPosition({ x: x + width - 150, y: y + height }); // 150 is menu width
				setMenuVisible(true);
			});
		} else {
			setMenuVisible(true);
		}
	};

	const handleReport = () => {
		setMenuVisible(false);
		setTimeout(() => {
			if (Platform.OS === 'android') {
				ToastAndroid.show('Report forwarded to staff for review.', ToastAndroid.SHORT);
			} else {
				Alert.alert('Reported', 'Report forwarded to staff for review.');
			}
		}, 300);
	};

	const handleCommentSubmit = () => {
		if (comment.trim()) {
			if (!hasShownRules) {
				setShowRules(true);
				setHasShownRules(true);
			} else {
				onAddComment(comment);
				setComment('');
			}
		}
	};

	const handleRulesClose = () => {
		setShowRules(false);
		// After closing rules, submit the comment
		if (comment.trim()) {
			onAddComment(comment);
			setComment('');
		}
	};

	return (
		<View style={styles.postContainer}>
			<ChatRulesPopup 
				visible={showRules} 
				onClose={handleRulesClose} 
			/>
			
			<View style={styles.header}>
				<Image source={{ uri: post.avatar }} style={styles.avatar} />
				<View style={{ flex: 1 }}>
					<Text style={styles.username}>{post.username}</Text>
					<Text style={styles.timestamp}>{post.timestamp}</Text>
				</View>
				<TouchableOpacity
					ref={menuButtonRef}
					onPress={showMenu}
					style={styles.menuButton}
				>
					<Text style={styles.menuButtonText}>⋮</Text>
				</TouchableOpacity>
			</View>
			<Modal
				visible={menuVisible}
				transparent
				animationType="none"
				onRequestClose={() => setMenuVisible(false)}
			>
				<Pressable style={styles.modalOverlay} onPress={() => setMenuVisible(false)}>
					<View style={[styles.menuDropdown, { position: 'absolute', left: menuPosition.x, top: menuPosition.y }]}> 
						<TouchableOpacity style={styles.menuItem} onPress={handleReport}>
							<Text style={styles.menuItemText}>Report post</Text>
						</TouchableOpacity>
					</View>
				</Pressable>
			</Modal>
			<Text style={styles.content}>{post.text}</Text>
			{post.image ? (
				<Image source={typeof post.image === 'string' ? { uri: post.image } : post.image} style={styles.postImage} />
			) : null}
			<View style={styles.actions}>
				<TouchableOpacity onPress={onReact}>
					<Text>👍 {post.reactions}</Text>
				</TouchableOpacity>
			</View>
			<View style={styles.commentsSection}>
				{post.comments.map(c => (
					<Text key={c.id} style={styles.comment}>
						<Text style={{ fontWeight: 'bold' }}>{c.username}: </Text>
						{c.text}
					</Text>
				))}
				<View style={styles.addCommentRow}>
					<TextInput
						style={styles.commentInput}
						value={comment}
						placeholder="Add a comment..."
						onChangeText={setComment}
					/>
					<Button
						title="Post"
						onPress={handleCommentSubmit}
					/>
				</View>
			</View>
		</View>
	);
}

export default function PublicPosts({ posts, onReact, onAddComment }) {
	return (
		<FlatList
			data={posts}
			keyExtractor={item => item.id}
			renderItem={({ item }) => (
				<Post
					post={item}
					onReact={() => onReact(item.id)}
					onAddComment={comment => onAddComment(item.id, comment)}
				/>
			)}
			ListFooterComponent={<View style={{ height: 80 }} />} // Spacer for footer message and FAB
			contentContainerStyle={{ paddingBottom: 24 }}
		/>
	);
}

const styles = StyleSheet.create({
	postContainer: {
		backgroundColor: '#fff',
		borderRadius: 16,
		padding: 16,
		marginBottom: 16,
		shadowColor: '#c7c7c7ff',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	header: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
	avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
	username: { 
		fontFamily: 'BalsamiqSans_700Bold', 
		fontSize: 16, 
		color: '#000',
	},
	timestamp: { 
		color: '#666', 
		fontSize: 12, 
		fontFamily: 'BalsamiqSans_400Regular',
		marginTop: 2,
	},
	menuButton: {
		paddingHorizontal: 8,
		paddingVertical: 4,
		alignItems: 'center',
		justifyContent: 'center',
	},
	 menuButtonText: {
		 fontSize: 22,
		 color: '#666',
		 fontFamily: 'BalsamiqSans_700Bold',
	 },
	 modalOverlay: {
		 flex: 1,
	 },
	 menuDropdown: {
		 backgroundColor: '#fff',
		 borderRadius: 12,
		 paddingVertical: 8,
		 paddingHorizontal: 16,
		 minWidth: 150,
		 elevation: 8,
		 shadowColor: '#c7c7c7ff',
		 shadowOffset: { width: 0, height: 4 },
		 shadowOpacity: 0.15,
		 shadowRadius: 8,
		 borderWidth: 1,
		 borderColor: '#e5e7eb',
	 },
	menuItem: {
		paddingVertical: 12,
	},
	menuItemText: {
		fontSize: 16,
		color: '#ef4444',
		fontFamily: 'BalsamiqSans_400Regular',
	},
	content: { 
		marginVertical: 12, 
		fontSize: 15, 
		fontFamily: 'BalsamiqSans_400Regular',
		color: '#333',
		lineHeight: 22,
	},
	postImage: { 
		width: '100%', 
		height: 200, 
		borderRadius: 12, 
		marginVertical: 12,
	},
	actions: { 
		flexDirection: 'row', 
		marginTop: 12,
		paddingTop: 12,
		borderTopWidth: 1,
		borderTopColor: '#f0f0f0',
	},
	commentsSection: { 
		marginTop: 12,
		paddingTop: 12,
		borderTopWidth: 1,
		borderTopColor: '#f0f0f0',
	},
	comment: { 
		fontSize: 14, 
		marginBottom: 8, 
		color: '#333',
		fontFamily: 'BalsamiqSans_400Regular',
		lineHeight: 20,
	},
	addCommentRow: { 
		flexDirection: 'row', 
		alignItems: 'center', 
		marginTop: 8,
	},
	commentInput: {
		flex: 1,
		borderColor: '#e5e7eb',
		borderWidth: 1,
		borderRadius: 12,
		padding: 12,
		marginRight: 12,
		backgroundColor: '#f8f9fa',
		fontSize: 14,
		fontFamily: 'BalsamiqSans_400Regular',
	},
	// New styles for Chat Rules Popup
	popupOverlay: {
		flex: 1,
		backgroundColor: 'rgba(0,0,0,0.5)',
		justifyContent: 'center',
		alignItems: 'center',
	},
	popupContainer: {
		backgroundColor: '#fff',
		borderRadius: 16,
		width: '90%',
		maxWidth: 400,
		overflow: 'hidden',
	},
	popupHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: 16,
		borderBottomWidth: 1,
		borderBottomColor: '#f0f0f0',
	},
	popupTitleContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	popupTitle: {
		fontSize: 20,
		fontFamily: 'BalsamiqSans_700Bold',
		color: '#000',
	},
	closeButton: {
		padding: 8,
	},
	popupContent: {
		padding: 16,
	},
	popupRuleItem: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		marginBottom: 12,
	},
	popupRuleNumber: {
		fontSize: 18,
		fontFamily: 'BalsamiqSans_700Bold',
		color: '#ef4444',
		marginRight: 12,
	},
	popupRuleText: {
		fontSize: 15,
		fontFamily: 'BalsamiqSans_400Regular',
		color: '#333',
		lineHeight: 22,
	},
	acknowledgeButton: {
		backgroundColor: '#ef4444',
		paddingVertical: 14,
		paddingHorizontal: 24,
		borderRadius: 12,
		alignItems: 'center',
		marginHorizontal: 16,
		marginBottom: 16,
	},
	acknowledgeButtonText: {
		color: '#fff',
		fontSize: 18,
		fontFamily: 'BalsamiqSans_700Bold',
	},
});
