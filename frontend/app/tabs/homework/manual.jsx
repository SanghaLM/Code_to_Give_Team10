import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, SafeAreaView, TextInput, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function ManualScreen() {
  const router = useRouter();
  const [submissionText, setSubmissionText] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Get module info from route params or use default
  const moduleInfo = router.params?.moduleInfo || 'Booklet 2, Module 4 - Fruits';

  const handleSubmit = () => {
    if (submissionText.trim().length === 0) {
      Alert.alert('Error', 'Please enter your submission before submitting.');
      return;
    }
    
    setIsSubmitted(true);
    Alert.alert(
      'Success!', 
      'Your manual submission has been submitted successfully.',
      [
        {
          text: 'OK',
          onPress: () => {
            setTimeout(() => {
              router.push('/tabs/task');
            }, 1000);
          }
        }
      ]
    );
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Section */}
      <View style={styles.topSection}>
        <View style={styles.headerRow}>
          <Pressable onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </Pressable>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={styles.progressFill} />
            </View>
          </View>
        </View>
        <Text style={styles.moduleInfo}>{moduleInfo}</Text>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.mainContent} showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          <Text style={styles.instruction}>Manual Submission</Text>
          <Text style={styles.description}>
            Please complete your exercise and submit your work here. You can:
          </Text>
          
          <View style={styles.optionsContainer}>
            <View style={styles.optionItem}>
              <Ionicons name="pencil" size={24} color="#007AFF" />
              <Text style={styles.optionText}>Write your answers in the text area below</Text>
            </View>
            <View style={styles.optionItem}>
              <Ionicons name="images" size={24} color="#007AFF" />
              <Text style={styles.optionText}>Take photos of your completed work</Text>
            </View>
            <View style={styles.optionItem}>
              <Ionicons name="document" size={24} color="#007AFF" />
              <Text style={styles.optionText}>Upload any relevant files or documents</Text>
            </View>
          </View>

          <View style={styles.submissionSection}>
            <Text style={styles.submissionLabel}>Your Submission:</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter your answers, observations, or any additional notes here..."
              placeholderTextColor="#999"
              multiline
              numberOfLines={8}
              value={submissionText}
              onChangeText={setSubmissionText}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.photoSection}>
            <Text style={styles.photoLabel}>Add Photos (Optional):</Text>
            <Pressable style={styles.addPhotoButton}>
              <Ionicons name="camera" size={24} color="#007AFF" />
              <Text style={styles.addPhotoText}>Take Photo</Text>
            </Pressable>
            <Pressable style={styles.addPhotoButton}>
              <Ionicons name="image" size={24} color="#007AFF" />
              <Text style={styles.addPhotoText}>Choose from Gallery</Text>
            </Pressable>
          </View>

          <View style={styles.fileSection}>
            <Text style={styles.fileLabel}>Upload Files (Optional):</Text>
            <Pressable style={styles.uploadButton}>
              <Ionicons name="cloud-upload" size={24} color="#007AFF" />
              <Text style={styles.uploadText}>Choose File</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        {!isSubmitted ? (
          <Pressable 
            style={styles.submitButton}
            onPress={handleSubmit}
          >
            <Text style={styles.submitButtonText}>Submit Assignment</Text>
            <Ionicons name="send" size={20} color="#fff" />
          </Pressable>
        ) : (
          <View style={styles.successContainer}>
            <Ionicons name="checkmark-circle" size={24} color="#10b981" />
            <Text style={styles.successText}>Submitted Successfully!</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topSection: {
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  progressContainer: {
    flex: 1,
    marginLeft: 20,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF9500',
    width: '100%',
    borderRadius: 4,
  },
  moduleInfo: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'BalsamiqSans_400Regular',
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  instruction: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
    textAlign: 'left',
    fontFamily: 'BalsamiqSans_400Regular',
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    lineHeight: 24,
    fontFamily: 'BalsamiqSans_400Regular',
  },
  optionsContainer: {
    marginBottom: 30,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  optionText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 15,
    fontFamily: 'BalsamiqSans_400Regular',
  },
  submissionSection: {
    marginBottom: 30,
  },
  submissionLabel: {
    fontSize: 18,
    fontFamily: 'BalsamiqSans_700Bold',
    color: '#000',
    marginBottom: 15,
  },
  textInput: {
    borderWidth: 2,
    borderColor: '#e1e5e9',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    minHeight: 120,
    backgroundColor: '#f8f9fa',
    fontFamily: 'BalsamiqSans_400Regular',
  },
  photoSection: {
    marginBottom: 30,
  },
  photoLabel: {
    fontSize: 18,
    fontFamily: 'BalsamiqSans_700Bold',
    color: '#000',
    marginBottom: 15,
  },
  addPhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  addPhotoText: {
    fontSize: 16,
    color: '#007AFF',
    marginLeft: 10,
    fontFamily: 'BalsamiqSans_700Bold',
  },
  fileSection: {
    marginBottom: 30,
  },
  fileLabel: {
    fontSize: 18,
    fontFamily: 'BalsamiqSans_700Bold',
    color: '#000',
    marginBottom: 15,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  uploadText: {
    fontSize: 16,
    color: '#007AFF',
    marginLeft: 10,
    fontFamily: 'BalsamiqSans_700Bold',
  },
  bottomSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'BalsamiqSans_700Bold',
  },
  successContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#10b981',
  },
  successText: {
    color: '#10b981',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
    fontFamily: 'BalsamiqSans_400Regular',
  },
});
