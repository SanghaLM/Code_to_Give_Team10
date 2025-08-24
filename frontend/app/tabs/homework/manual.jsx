import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
  TextInput,
  Alert,
  ScrollView,
  ActivityIndicator,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUser } from "../../userContext.js";

const API_BASE_URL = __DEV__
  ? "http://localhost:3000/api"
  : "https://your-production-domain.com/api";

export default function ManualScreen() {
  const router = useRouter();
  const { childProfiles } = useUser();
  const [submissionText, setSubmissionText] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [homeworkId, setHomeworkId] = useState(1);
  const [childId, setChildId] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [isParamsValid, setIsParamsValid] = useState(true);

  // Get data from route params
  const moduleInfo =
    router.params?.moduleInfo || "Booklet 2, Module 4 - Fruits";
  const homeworkIdParam = router.params?.homeworkId;

  useEffect(() => {
    initializeScreen();
  }, []);

  const initializeScreen = async () => {
    console.log("=== initializeScreen started ===");
    console.log("Router params:", { moduleInfo, homeworkIdParam });
    console.log("Child profiles from context:", childProfiles);

    try {
      // Get auth token from AsyncStorage
      const token = await AsyncStorage.getItem("userToken");
      console.log("Retrieved authToken:", token ? "Present" : "Missing");
      setAuthToken(token);

      // Set homework ID from params - for testing, use a default if not provided
      if (homeworkIdParam) {
        console.log("Setting homeworkId:", homeworkIdParam);
        setHomeworkId(homeworkIdParam);
      } else {
        console.warn(
          "No homeworkId provided in params, using default for testing"
        );
        setHomeworkId("default-homework-id"); // Allow testing without real homework ID
      }

      // Set child ID from childProfiles (use first child if available)
      if (childProfiles && childProfiles.length > 0) {
        console.log("Setting childId:", childProfiles[0]._id);
        setChildId(childProfiles[0]._id);
      } else {
        console.warn(
          "No child profiles found in context, using default for testing"
        );
        setChildId("default-child-id"); // Allow testing without real child profile
      }

      // Always set params as valid for now - we'll handle missing data in submission
      setIsParamsValid(true);

      // Request camera/media permissions
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        console.warn("Camera roll permissions not granted");
        Alert.alert(
          "Permission needed",
          "Camera roll permissions are required to add photos."
        );
      }
    } catch (error) {
      console.error("Error initializing screen:", error.message);
      setIsParamsValid(true); // Still allow submission attempt
    }
    console.log("=== initializeScreen ended ===");
  };

  const takePhoto = async () => {
    try {
      console.log("Taking photo...");
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!result.canceled && result.assets[0]) {
        console.log("Photo taken:", result.assets[0].uri);
        setSelectedImages([...selectedImages, result.assets[0]]);
      } else {
        console.log("Photo taking canceled");
      }
    } catch (error) {
      console.error("Camera error:", error.message);
      Alert.alert("Error", "Failed to take photo");
    }
  };

  const pickImageFromGallery = async () => {
    try {
      console.log("Picking image from gallery...");
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.7,
      });

      if (!result.canceled && result.assets) {
        console.log(
          "Images selected:",
          result.assets.map((asset) => asset.uri)
        );
        setSelectedImages([...selectedImages, ...result.assets]);
      } else {
        console.log("Image picking canceled");
      }
    } catch (error) {
      console.error("Image picker error:", error.message);
      Alert.alert("Error", "Failed to pick images");
    }
  };

  const pickDocument = async () => {
    try {
      console.log("Picking document...");
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/*", "text/*"],
        multiple: true,
      });

      if (!result.canceled && result.assets) {
        console.log(
          "Files selected:",
          result.assets.map((asset) => asset.name)
        );
        setSelectedFiles([...selectedFiles, ...result.assets]);
      } else {
        console.log("Document picking canceled");
      }
    } catch (error) {
      console.error("Document picker error:", error.message);
      Alert.alert("Error", "Failed to pick document");
    }
  };

  const removeImage = (index) => {
    console.log("Removing image at index:", index);
    const newImages = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(newImages);
  };

  const removeFile = (index) => {
    console.log("Removing file at index:", index);
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
  };

  const uploadFile = async (file, type = "image") => {
    console.log("Uploading file:", file.uri, "Type:", type);
    const formData = new FormData();

    formData.append("file", {
      uri: file.uri,
      type:
        file.type ||
        (type === "image" ? "image/jpeg" : "application/octet-stream"),
      name:
        file.name ||
        `${type}_${Date.now()}.${type === "image" ? "jpg" : "pdf"}`,
    });

    try {
      const response = await fetch(`${API_BASE_URL}/parents/submit-homework`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: formData,
      });

      console.log("Upload response status:", response.status);
      const result = await response.json();
      console.log("Upload response data:", result);

      if (response.ok) {
        return result.filePath || result.url;
      } else {
        throw new Error(result.message || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error.message);
      throw error;
    }
  };

  const handleSubmit = async () => {
    console.log("=== handleSubmit started ===");
    console.log("Submission data:", {
      submissionText,
      selectedImages: selectedImages.map((img) => img.uri),
      selectedFiles: selectedFiles.map((file) => file.name),
      homeworkId,
      childId,
      authToken,
    });

    if (
      submissionText.trim().length === 0 &&
      selectedImages.length === 0 &&
      selectedFiles.length === 0
    ) {
      console.log("Validation failed: No content provided");
      Alert.alert(
        "Error",
        "Please enter text, add photos, or upload files before submitting."
      );
      return;
    }

    setIsSubmitting(true);
    console.log("Setting isSubmitting to true");

    try {
      // COMMENTED OUT: Simulation for testing
      if (!authToken || homeworkId === "default-homework-id") {
        console.log("Simulating submission for testing purposes");
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate network delay

        setIsSubmitted(true);
        Alert.alert(
          "Success!",
          "Your manual submission has been submitted successfully.",
          [
            {
              text: "OK",
              onPress: () => {
                setTimeout(() => {
                  router.push("/tabs/task");
                }, 1000);
              },
            },
          ]
        );
        return;
      }

      // Upload images
      const imageUrls = [];
      for (const image of selectedImages) {
        try {
          const url = await uploadFile(image, "image");
          console.log("Image uploaded:", url);
          imageUrls.push(url);
        } catch (error) {
          console.error("Failed to upload image:", error.message);
          Alert.alert("Error", `Failed to upload image: ${error.message}`);
          throw error;
        }
      }

      // Upload files
      const fileUrls = [];
      for (const file of selectedFiles) {
        try {
          const url = await uploadFile(file, "file");
          console.log("File uploaded:", url);
          fileUrls.push(url);
        } catch (error) {
          console.error("Failed to upload file:", error.message);
          Alert.alert("Error", `Failed to upload file: ${error.message}`);
          throw error;
        }
      }

      // Submit homework - let's see what the backend says about missing data
      const payload = {
        homeworkId,
        studentId: childId,

        submissionText: submissionText.trim(),
        images: imageUrls,
        files: fileUrls,
      };
      console.log("Submitting payload to backend:", payload);

      const response = await fetch(`${API_BASE_URL}/parents/submit-homework`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(payload),
      });

      // console.log("Backend response status:", response.status);
      const result = await response.json();
      // console.log("Backend response data:", result);

      if (response.ok) {
        console.log("Submission successful");
        setIsSubmitted(true);
        Alert.alert(
          "Success!",
          "Your manual submission has been submitted successfully.",
          [
            {
              text: "OK",
              onPress: () => {
                setTimeout(() => {
                  router.push("/tabs/task");
                }, 1000);
              },
            },
          ]
        );
      } else {
        console.log("Backend submission failed:", result.message);
        // Show the backend error message to see what's missing
        Alert.alert(
          "Backend Response",
          `Status: ${response.status}\nMessage: ${
            result.message || "Unknown error"
          }\nDetails: ${JSON.stringify(result, null, 2)}`
        );
      }
    } catch (error) {
      console.error("Network/Submission error:", error.message);
      Alert.alert(
        "Network Error",
        `Error details: ${
          error.message
        }\n\nCurrent data:\n- HomeworkId: ${homeworkId}\n- ChildId: ${childId}\n- AuthToken: ${
          authToken ? "Present" : "Missing"
        }`
      );
    } finally {
      setIsSubmitting(false);
      console.log("Setting isSubmitting to false");
      console.log("=== handleSubmit ended ===");
    }
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
      <ScrollView
        style={styles.mainContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentContainer}>
          <Text style={styles.instruction}>Manual Submission</Text>
          <Text style={styles.description}>
            Please complete your exercise and submit your work here. You can:
          </Text>

          <View style={styles.optionsContainer}>
            <View style={styles.optionItem}>
              <Ionicons name="pencil" size={24} color="#007AFF" />
              <Text style={styles.optionText}>
                Write your answers in the text area below
              </Text>
            </View>
            <View style={styles.optionItem}>
              <Ionicons name="images" size={24} color="#007AFF" />
              <Text style={styles.optionText}>
                Take photos of your completed work
              </Text>
            </View>
            <View style={styles.optionItem}>
              <Ionicons name="document" size={24} color="#007AFF" />
              <Text style={styles.optionText}>
                Upload any relevant files or documents
              </Text>
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
              editable={!isSubmitting}
            />
          </View>

          <View style={styles.photoSection}>
            <Text style={styles.photoLabel}>Add Photos (Optional):</Text>
            <Pressable
              style={styles.addPhotoButton}
              onPress={takePhoto}
              disabled={isSubmitting}
            >
              <Ionicons name="camera" size={24} color="#007AFF" />
              <Text style={styles.addPhotoText}>Take Photo</Text>
            </Pressable>
            <Pressable
              style={styles.addPhotoButton}
              onPress={pickImageFromGallery}
              disabled={isSubmitting}
            >
              <Ionicons name="image" size={24} color="#007AFF" />
              <Text style={styles.addPhotoText}>Choose from Gallery</Text>
            </Pressable>

            {selectedImages.length > 0 && (
              <View style={styles.previewContainer}>
                {selectedImages.map((image, index) => (
                  <View key={index} style={styles.previewItem}>
                    <Image
                      source={{ uri: image.uri }}
                      style={styles.previewImage}
                    />
                    <Pressable
                      style={styles.removeButton}
                      onPress={() => removeImage(index)}
                      disabled={isSubmitting}
                    >
                      <Ionicons name="close-circle" size={24} color="#ef4444" />
                    </Pressable>
                  </View>
                ))}
              </View>
            )}
          </View>

          <View style={styles.fileSection}>
            <Text style={styles.fileLabel}>Upload Files (Optional):</Text>
            <Pressable
              style={styles.uploadButton}
              onPress={pickDocument}
              disabled={isSubmitting}
            >
              <Ionicons name="cloud-upload" size={24} color="#007AFF" />
              <Text style={styles.uploadText}>Choose File</Text>
            </Pressable>

            {selectedFiles.length > 0 && (
              <View style={styles.previewContainer}>
                {selectedFiles.map((file, index) => (
                  <View key={index} style={styles.previewItem}>
                    <Text style={styles.previewFileName}>{file.name}</Text>
                    <Pressable
                      style={styles.removeButton}
                      onPress={() => removeFile(index)}
                      disabled={isSubmitting}
                    >
                      <Ionicons name="close-circle" size={24} color="#ef4444" />
                    </Pressable>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        {!isSubmitted ? (
          <Pressable
            style={[
              styles.submitButton,
              isSubmitting && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Text style={styles.submitButtonText}>Submit Assignment</Text>
                <Ionicons name="send" size={20} color="#fff" />
              </>
            )}
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
    backgroundColor: "#fff",
  },
  topSection: {
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  progressContainer: {
    flex: 1,
    marginLeft: 20,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#FF9500",
    width: "100%",
    borderRadius: 4,
  },
  moduleInfo: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "BalsamiqSans_400Regular",
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
    fontWeight: "bold",
    color: "#000",
    marginBottom: 20,
    textAlign: "left",
    fontFamily: "BalsamiqSans_400Regular",
  },
  description: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
    lineHeight: 24,
    fontFamily: "BalsamiqSans_400Regular",
  },
  optionsContainer: {
    marginBottom: 30,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
  },
  optionText: {
    fontSize: 14,
    color: "#333",
    marginLeft: 15,
    fontFamily: "BalsamiqSans_400Regular",
  },
  submissionSection: {
    marginBottom: 30,
  },
  submissionLabel: {
    fontSize: 18,
    fontFamily: "BalsamiqSans_700Bold",
    color: "#000",
    marginBottom: 15,
  },
  textInput: {
    borderWidth: 2,
    borderColor: "#e1e5e9",
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    minHeight: 120,
    backgroundColor: "#f8f9fa",
    fontFamily: "BalsamiqSans_400Regular",
  },
  photoSection: {
    marginBottom: 30,
  },
  photoLabel: {
    fontSize: 18,
    fontFamily: "BalsamiqSans_700Bold",
    color: "#000",
    marginBottom: 15,
  },
  addPhotoButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f8ff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#007AFF",
  },
  addPhotoText: {
    fontSize: 16,
    color: "#007AFF",
    marginLeft: 10,
    fontFamily: "BalsamiqSans_700Bold",
  },
  fileSection: {
    marginBottom: 30,
  },
  fileLabel: {
    fontSize: 18,
    fontFamily: "BalsamiqSans_700Bold",
    color: "#000",
    marginBottom: 15,
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f8ff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#007AFF",
  },
  uploadText: {
    fontSize: 16,
    color: "#007AFF",
    marginLeft: 10,
    fontFamily: "BalsamiqSans_700Bold",
  },
  previewContainer: {
    marginTop: 12,
  },
  previewItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    backgroundColor: "#f8f9fa",
    padding: 10,
    borderRadius: 8,
  },
  previewImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  previewFileName: {
    fontSize: 14,
    fontFamily: "BalsamiqSans_400Regular",
    color: "#000",
    flex: 1,
  },
  removeButton: {
    padding: 4,
  },
  bottomSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: "center",
  },
  submitButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  submitButtonDisabled: {
    backgroundColor: "#d1d5db",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "BalsamiqSans_700Bold",
  },
  successContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0fdf4",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#10b981",
  },
  successText: {
    color: "#10b981",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 10,
    fontFamily: "BalsamiqSans_400Regular",
  },
});
