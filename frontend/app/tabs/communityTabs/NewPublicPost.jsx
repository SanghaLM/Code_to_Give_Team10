
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
		padding: 20,
		borderRadius: 16,
		marginBottom: 16,
		shadowColor: '#c7c7c7ff',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	newPostInput: {
		borderColor: '#e5e7eb',
		borderWidth: 1,
		borderRadius: 12,
		padding: 16,
		marginBottom: 16,
		backgroundColor: '#f8f9fa',
		fontSize: 16,
		fontFamily: 'BalsamiqSans_400Regular',
		minHeight: 100,
		textAlignVertical: 'top',
	},
	imagePickerButton: {
		backgroundColor: '#FFF4E7',
		padding: 12,
		borderRadius: 12,
		alignItems: 'center',
		marginBottom: 16,
		borderWidth: 1,
		borderColor: '#F7941F',
	},
	imagePickerButtonText: {
		color: '#F7941F',
		fontWeight: '600',
		fontSize: 16,
		fontFamily: 'BalsamiqSans_400Regular',
	},
	imagePreview: {
		width: '100%',
		height: 200,
		borderRadius: 12,
		marginBottom: 16,
	},
});
