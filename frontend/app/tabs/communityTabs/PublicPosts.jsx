
import React, { useState, useRef } from 'react';
import { View, Text, Image, TextInput, Button, TouchableOpacity, StyleSheet, FlatList, Modal, Pressable, Platform, ToastAndroid, Alert } from 'react-native';

function Post({ post, onReact, onAddComment }) {
	const [comment, setComment] = useState('');
	const [menuVisible, setMenuVisible] = useState(false);
	const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
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

	return (
		<View style={styles.postContainer}>
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
						onPress={() => {
							if (comment.trim()) {
								onAddComment(comment);
								setComment('');
							}
						}}
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
		fontWeight: 'bold', 
		fontSize: 16, 
		fontFamily: 'BalsamiqSans_400Regular',
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
		 fontWeight: 'bold',
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
});
