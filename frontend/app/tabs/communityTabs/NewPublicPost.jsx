
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Image, TouchableOpacity, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function NewPublicPost({ onAddPost }) {
	const [text, setText] = useState('');
	const [image, setImage] = useState(null);

	const pickImage = async () => {
		// Ask for permission
		const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
		if (status !== 'granted') {
			alert('Sorry, we need camera roll permissions to make this work!');
			return;
		}
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		});
		if (!result.canceled) {
			setImage(result.assets[0].uri);
		}
	};

	return (
		<View style={styles.newPostContainer}>
			<TextInput
				style={styles.newPostInput}
				placeholder="What's on your mind?"
				value={text}
				onChangeText={setText}
			/>
			<TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
				<Text style={styles.imagePickerButtonText}>Pick an image from gallery</Text>
			</TouchableOpacity>
			{image && (
				<Image source={{ uri: image }} style={styles.imagePreview} />
			)}
			<Button
				title="Post"
				onPress={() => {
					if (text.trim()) {
						onAddPost(text, image);
						setText('');
						setImage(null);
					}
				}}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	newPostContainer: {
		backgroundColor: '#fff',
		padding: 12,
		borderRadius: 8,
		marginBottom: 16,
	},
	newPostInput: {
		borderColor: '#ccc',
		borderWidth: 1,
		borderRadius: 6,
		padding: 8,
		marginBottom: 8,
		backgroundColor: '#fafafa',
	},
	imagePickerButton: {
		backgroundColor: '#e0e0e0',
		padding: 10,
		borderRadius: 6,
		alignItems: 'center',
		marginBottom: 8,
	},
	imagePickerButtonText: {
		color: '#333',
		fontWeight: 'bold',
	},
	imagePreview: {
		width: '100%',
		height: 180,
		borderRadius: 6,
		marginBottom: 8,
	},
});
