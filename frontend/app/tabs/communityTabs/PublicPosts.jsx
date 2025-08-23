
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
				<Image source={{ uri: post.image }} style={styles.postImage} />
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
			contentContainerStyle={{ paddingBottom: 24 }}
		/>
	);
}

const styles = StyleSheet.create({
	postContainer: {
		backgroundColor: '#fff',
		borderRadius: 8,
		padding: 12,
		marginBottom: 16,
		shadowColor: '#000',
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 2,
	},
	header: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
	avatar: { width: 36, height: 36, borderRadius: 18, marginRight: 8 },
	username: { fontWeight: 'bold', fontSize: 16 },
	timestamp: { color: '#888', fontSize: 12 },
	menuButton: {
		paddingHorizontal: 8,
		paddingVertical: 4,
		alignItems: 'center',
		justifyContent: 'center',
	},
	 menuButtonText: {
		 fontSize: 22,
		 color: '#888',
		 fontWeight: 'bold',
	 },
	 modalOverlay: {
		 flex: 1,
	 },
	 menuDropdown: {
		 backgroundColor: '#fff',
		 borderRadius: 8,
		 paddingVertical: 8,
		 paddingHorizontal: 16,
		 minWidth: 150,
		 elevation: 5,
		 shadowColor: '#000',
		 shadowOpacity: 0.1,
		 shadowRadius: 8,
		 borderWidth: 1,
		 borderColor: '#eee',
	 },
	menuItem: {
		paddingVertical: 10,
	},
	menuItemText: {
		fontSize: 16,
		color: '#e53935',
	},
	content: { marginVertical: 8, fontSize: 15 },
	postImage: { width: '100%', height: 180, borderRadius: 8, marginVertical: 8 },
	actions: { flexDirection: 'row', marginTop: 8 },
	commentsSection: { marginTop: 8 },
	comment: { fontSize: 13, marginBottom: 4, color: '#333' },
	addCommentRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
	commentInput: {
		flex: 1,
		borderColor: '#eee',
		borderWidth: 1,
		borderRadius: 6,
		padding: 6,
		marginRight: 8,
		backgroundColor: '#fafafa',
		fontSize: 13,
	},
});
