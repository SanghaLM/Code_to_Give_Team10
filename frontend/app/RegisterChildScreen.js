import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUser } from "./userContext";

const API_BASE_URL = __DEV__
  ? "http://localhost:3000/api"
  : "https://your-production-domain.com/api";

export default function RegisterChildScreen() {
  const router = useRouter();
  const { setChildProfiles } = useUser();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [kindergartenLevel, setKindergartenLevel] = useState("");
  const [kindergartenName, setKindergartenName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");

  const handleSubmit = async () => {
    console.log("=== handleSubmitChild started ===");
    console.log("Input values:", {
      firstName,
      lastName,
      kindergartenLevel,
      kindergartenName,
    });

    // Input validation
    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !kindergartenLevel.trim() ||
      !kindergartenName.trim()
    ) {
      console.log("Validation failed: Missing required fields");
      Alert.alert("Missing Fields", "Please fill in all required fields.");
      return;
    }

    const validLevels = ["K1", "K2", "K3"];
    const normalizedLevel = kindergartenLevel.trim().toUpperCase();
    if (!validLevels.includes(normalizedLevel)) {
      console.log("Validation failed: Invalid kindergarten level");
      Alert.alert("Invalid Input", "Kindergarten level must be K1, K2, or K3.");
      return;
    }

    setIsSubmitting(true);
    console.log("Setting isSubmitting to true");

    try {
      const token = await AsyncStorage.getItem("userToken");
      console.log("Retrieved authToken:", token ? "Present" : "Missing");

      if (!token) {
        Alert.alert("Authentication Error", "Please log in again.");
        router.replace("/login");
        return;
      }

      const payload = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        kindergartenLevel: normalizedLevel,
        kindergartenName: kindergartenName.trim(),
      };
      console.log("Payload prepared:", payload);

      const response = await fetch(`${API_BASE_URL}/parents/children`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);

      if (response.ok) {
        console.log("Child profile created successfully");
        setChildProfiles(data.children || []);

        // Start the loading sequence
        setIsSubmitting(false);
        setIsCreatingProfile(true);

        // Show step-by-step loading messages
        setLoadingStep("Creating profile for your child...");

        // Clear form data
        setFirstName("");
        setLastName("");
        setKindergartenLevel("");
        setKindergartenName("");

        // Step 1: Creating profile (1 second)
        setTimeout(() => {
          setLoadingStep("Setting up learning environment...");
        }, 1000);

        // Step 2: Setting up environment (1 second)
        setTimeout(() => {
          setLoadingStep("Gathering homework assignments...");
        }, 2000);

        // Step 3: Final step and navigation (1 second)
        setTimeout(() => {
          console.log("Navigating to /tabs/task");
          router.replace("/tabs/task");
        }, 3000);
      } else {
        console.log("Child registration failed:", data.message);
        Alert.alert(
          "Registration Failed",
          data.message || "Failed to register child. Please try again."
        );
      }
    } catch (error) {
      console.error("Child registration error:", error.message);
      Alert.alert(
        "Registration Failed",
        `Network error: ${error.message}. Please check your connection and try again.`
      );
    } finally {
      if (!isCreatingProfile) {
        setIsSubmitting(false);
      }
      console.log("=== handleSubmitChild ended ===");
    }
  };

  // Show loading screen during profile creation
  if (isCreatingProfile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <View style={styles.loadingContent}>
            <Ionicons name="person-add" size={60} color="#F7941F" />
            <ActivityIndicator
              size="large"
              color="#F7941F"
              style={styles.loadingSpinner}
            />
            <Text style={styles.loadingTitle}>
              Welcome aboard, {firstName}! 🎉
            </Text>
            <Text style={styles.loadingText}>{loadingStep}</Text>
            <View style={styles.loadingSteps}>
              <View style={styles.stepIndicator}>
                <View style={[styles.step, styles.stepActive]} />
                <View
                  style={[
                    styles.step,
                    loadingStep.includes("environment") ||
                    loadingStep.includes("homework")
                      ? styles.stepActive
                      : styles.stepInactive,
                  ]}
                />
                <View
                  style={[
                    styles.step,
                    loadingStep.includes("homework")
                      ? styles.stepActive
                      : styles.stepInactive,
                  ]}
                />
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerSection}>
          <Ionicons name="person-add" size={40} color="#F7941F" />
          <Text style={styles.title}>Register Your Child</Text>
          <Text style={styles.description}>
            Add your child's profile to start managing their learning progress.
          </Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Ionicons
              name="person"
              size={20}
              color="#6b7280"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="First Name"
              value={firstName}
              onChangeText={setFirstName}
              autoCapitalize="words"
              placeholderTextColor="#9ca3af"
              editable={!isSubmitting}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons
              name="person"
              size={20}
              color="#6b7280"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Last Name"
              value={lastName}
              onChangeText={setLastName}
              autoCapitalize="words"
              placeholderTextColor="#9ca3af"
              editable={!isSubmitting}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons
              name="school"
              size={20}
              color="#6b7280"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Kindergarten Level (K1, K2, K3)"
              value={kindergartenLevel}
              onChangeText={setKindergartenLevel}
              autoCapitalize="characters"
              placeholderTextColor="#9ca3af"
              editable={!isSubmitting}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons
              name="business"
              size={20}
              color="#6b7280"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Kindergarten Name"
              value={kindergartenName}
              onChangeText={setKindergartenName}
              autoCapitalize="words"
              placeholderTextColor="#9ca3af"
              editable={!isSubmitting}
            />
          </View>

          <Pressable
            style={[
              styles.submitButton,
              isSubmitting && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <ActivityIndicator color="#fff" size="small" />
                <Text style={[styles.submitButtonText, { marginLeft: 8 }]}>
                  Creating...
                </Text>
              </>
            ) : (
              <>
                <Text style={styles.submitButtonText}>Add Child</Text>
                <Ionicons name="arrow-forward" size={20} color="#fff" />
              </>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF4E7",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: "5%",
    paddingVertical: "10%",
  },
  headerSection: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontFamily: "BalsamiqSans_700Bold",
    color: "#000",
    marginTop: 10,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    fontFamily: "BalsamiqSans_400Regular",
    color: "#6b7280",
    textAlign: "center",
    marginTop: 10,
    paddingHorizontal: 20,
  },
  formContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#c7c7c7ff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: "BalsamiqSans_400Regular",
    color: "#000",
    paddingVertical: 12,
  },
  submitButton: {
    backgroundColor: "#F7941F",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  submitButtonDisabled: {
    backgroundColor: "#d1d5db",
  },
  submitButtonText: {
    fontSize: 18,
    fontFamily: "BalsamiqSans_700Bold",
    color: "#fff",
    marginRight: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  loadingContent: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 40,
    shadowColor: "#c7c7c7ff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    minWidth: "80%",
  },
  loadingSpinner: {
    marginVertical: 20,
  },
  loadingTitle: {
    fontSize: 22,
    fontFamily: "BalsamiqSans_700Bold",
    color: "#F7941F",
    marginBottom: 10,
    textAlign: "center",
  },
  loadingText: {
    fontSize: 16,
    fontFamily: "BalsamiqSans_400Regular",
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 30,
  },
  loadingSteps: {
    alignItems: "center",
  },
  stepIndicator: {
    flexDirection: "row",
    alignItems: "center",
  },
  step: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 6,
  },
  stepActive: {
    backgroundColor: "#F7941F",
  },
  stepInactive: {
    backgroundColor: "#e5e7eb",
  },
});
