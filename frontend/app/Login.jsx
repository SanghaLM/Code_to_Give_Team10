import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUser } from "./userContext";
import { useRouter } from "expo-router";

const API_BASE_URL = __DEV__
  ? "http://localhost:3000/api"
  : "https://your-production-domain.com/api";

export default function Login() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsernameInput] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSignupSuccess, setIsSignupSuccess] = useState(false);
  const { setRole, setUsername, setIsLoggedIn, setUserData, setChildProfiles } =
    useUser();

  // Check for existing token and child profiles on component mount
  useEffect(() => {
    // checkExistingToken();
  }, []);

  const checkExistingToken = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const userData = await AsyncStorage.getItem("userData");
      const userRole = await AsyncStorage.getItem("userRole");

      if (token && userData && userRole) {
        console.log("Existing token found, fetching profile...");
        const response = await fetch(`${API_BASE_URL}/parents/profile`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const profileData = await response.json();
          console.log("Profile data:", profileData);
          const parsedUserData = JSON.parse(userData);
          setRole(userRole);
          setUsername(parsedUserData.username || parsedUserData.firstName);
          setUserData({
            token,
            parent: parsedUserData,
          });
          setChildProfiles(profileData.children || []);
          setIsLoggedIn(true);
          // Redirect handled by _layout.jsx
        } else {
          await clearStoredData();
        }
      }
    } catch (error) {
      console.error("Token validation error:", error);
      await clearStoredData();
    }
  };

  const clearStoredData = async () => {
    try {
      await AsyncStorage.multiRemove(["userToken", "userData", "userRole"]);
      console.log("Stored data cleared");
    } catch (error) {
      console.error("Error clearing storage:", error);
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^\d{8,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ""));
  };

  const handleLogin = async () => {
    console.log("handleLogin called", { username, password, isLoading });

    if (!username.trim() || !password) {
      Alert.alert("Missing Fields", "Please enter both username and password.");
      return;
    }

    if (!setUserData) {
      console.error("setUserData is undefined. Check UserContext setup.");
      Alert.alert(
        "Login Failed",
        "Internal error: User context is not properly set up. Please contact support."
      );
      return;
    }

    setIsLoading(true);
    console.log("Setting isLoading to true for login");

    try {
      const normalizedUsername = username.trim().toLowerCase();

      // Admin login fallback
      if (normalizedUsername === "admin" && password === "admin") {
        console.log("Admin login successful");
        await AsyncStorage.multiSet([
          ["userToken", "admin-token"],
          [
            "userData",
            JSON.stringify({
              username: "admin",
              firstName: "Admin",
              lastName: "User",
            }),
          ],
          ["userRole", "parent"],
        ]);

        setRole("parent");
        setUsername("admin");
        setIsLoggedIn(true);
        setUserData({
          token: "admin-token",
          parent: { username: "admin", firstName: "Admin", lastName: "User" },
        });
        setChildProfiles([]);
        setIsLoading(false);
        return;
      }

      console.log("Sending login request to", `${API_BASE_URL}/parents/login`);
      const response = await fetch(`${API_BASE_URL}/parents/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
      });

      const data = await response.json();
      console.log("Login response:", { status: response.status, data });

      if (response.ok) {
        await AsyncStorage.multiSet([
          ["userToken", data.token],
          ["userData", JSON.stringify(data.parent)],
          ["userRole", "parent"],
        ]);

        setRole("parent");
        setUsername(username.trim());
        setUserData({
          token: data.token,
          parent: data.parent,
        });
        setIsLoggedIn(true);

        // Fetch parent profile to check child profiles
        console.log("Fetching parent profile to check child profiles...");
        const profileResponse = await fetch(`${API_BASE_URL}/parents/profile`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${data.token}`,
            "Content-Type": "application/json",
          },
        });

        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          console.log("Profile data:", profileData);
          setChildProfiles(profileData.children || []);
        } else {
          console.log(
            "Failed to fetch profile, redirecting to /register-child"
          );
          setChildProfiles([]);
        }
      } else {
        Alert.alert(
          "Login Failed",
          data.message ||
            "Invalid credentials. Please check your username and password."
        );
      }
    } catch (error) {
      console.error("Login error:", error.message);
      Alert.alert(
        "Login Failed",
        "Network error. Please check your connection and try again."
      );
    } finally {
      setIsLoading(false);
      console.log("Setting isLoading to false for login");
    }
  };

  const handleCreateAccount = async () => {
    console.log("=== handleCreateAccount started ===");
    console.log("Input values:", {
      firstName,
      lastName,
      username,
      email,
      phone,
      password,
      confirmPassword,
      accessCode,
      isLoading,
    });

    // Validation
    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !username.trim() ||
      !password ||
      !confirmPassword ||
      !accessCode.trim()
    ) {
      console.log("Validation failed: Missing required fields");
      Alert.alert("Missing Fields", "Please fill in all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      console.log("Validation failed: Passwords do not match");
      Alert.alert("Invalid Input", "Passwords do not match.");
      return;
    }

    if (email.trim() && !validateEmail(email.trim())) {
      console.log("Validation failed: Invalid email");
      Alert.alert("Invalid Input", "Please enter a valid email address.");
      return;
    }

    if (phone.trim() && !validatePhone(phone.trim())) {
      console.log("Validation failed: Invalid phone");
      Alert.alert(
        "Invalid Input",
        "Please enter a valid phone number (8-15 digits, no '+' or other characters)."
      );
      return;
    }

    console.log("All validations passed, preparing payload...");
    setIsLoading(true);
    console.log("Setting isLoading to true for signup");

    try {
      const payload = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        username: username.trim(),
        password,
        confirmPassword,
        accessCode: accessCode.trim(),
        ...(email.trim() && { email: email.trim() }),
        ...(phone.trim() && { phone: phone.trim() }),
      };
      console.log("Payload prepared:", {
        ...payload,
        password: "[HIDDEN]",
        confirmPassword: "[HIDDEN]",
      });
      console.log(
        "Sending signup request to",
        `${API_BASE_URL}/parents/signup`
      );

      const response = await fetch(`${API_BASE_URL}/parents/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log("Received response, status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);

      if (response.ok) {
        console.log("Signup successful, switching to success screen");
        setIsSignupSuccess(true);
        clearForm();
      } else {
        console.log("Signup failed, message:", data.message);
        Alert.alert(
          "Signup Failed",
          data.message ||
            "Failed to create account. Please check your details and try again."
        );
      }
    } catch (error) {
      console.error("Signup error:", error.message);
      Alert.alert(
        "Signup Failed",
        `Network error: ${error.message}. Please check your connection and try again.`
      );
    } finally {
      setIsLoading(false);
      console.log("Setting isLoading to false for signup");
      console.log("=== handleCreateAccount ended ===");
    }
  };

  const clearForm = () => {
    console.log("Clearing form");
    setFirstName("");
    setLastName("");
    setUsernameInput("");
    setEmail("");
    setPhone("");
    setPassword("");
    setConfirmPassword("");
    setAccessCode("");
  };

  if (isSignupSuccess) {
    return (
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.successCard}>
            <Ionicons
              name="checkmark-circle"
              size={80}
              color="#28a745"
              style={styles.successIcon}
            />
            <Text style={styles.successTitle}>Sign Up Successful</Text>
            <Text style={styles.successMessage}>
              Your parent account has been created! Please go back to the login
              page and sign in.
            </Text>
            <Pressable
              style={styles.loginButton}
              onPress={() => {
                console.log(
                  "Go to Login button pressed, switching to login mode"
                );
                setIsSignupSuccess(false);
                setIsCreating(false);
                clearForm();
                console.log("Switched to login mode, form cleared");
              }}
            >
              <Text style={styles.loginButtonText}>Go to Login</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </Pressable>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerSection}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoEmoji}>🎓</Text>
            <Text style={styles.appName}>ReachOut</Text>
          </View>
          <Text style={styles.tagline}>Your Learning Journey Starts Here</Text>
        </View>

        <View style={styles.loginCard}>
          <Text style={styles.title}>
            {isCreating ? "Create Parent Account" : "Welcome Back!"}
          </Text>

          {isCreating && (
            <View style={styles.instructionsCard}>
              <Ionicons name="information-circle" size={20} color="#F7941F" />
              <Text style={styles.instructions}>
                Create a parent account to manage your children's learning
                progress. Required fields: First Name, Last Name, Username,
                Password, Confirm Password, Access Code.
              </Text>
            </View>
          )}

          {isCreating && (
            <>
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
                  editable={!isLoading}
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
                  editable={!isLoading}
                />
              </View>
            </>
          )}

          <View style={styles.inputContainer}>
            <Ionicons
              name="person"
              size={20}
              color="#6b7280"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={username}
              onChangeText={setUsernameInput}
              autoCapitalize="none"
              placeholderTextColor="#9ca3af"
              editable={!isLoading}
            />
          </View>

          {isCreating && (
            <>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="mail"
                  size={20}
                  color="#6b7280"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Email (optional)"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  placeholderTextColor="#9ca3af"
                  editable={!isLoading}
                />
              </View>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="call"
                  size={20}
                  color="#6b7280"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Phone (optional, e.g., 12345678)"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="numeric"
                  placeholderTextColor="#9ca3af"
                  editable={!isLoading}
                />
              </View>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="key"
                  size={20}
                  color="#6b7280"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Access Code"
                  value={accessCode}
                  onChangeText={setAccessCode}
                  placeholderTextColor="#9ca3af"
                  editable={!isLoading}
                />
              </View>
            </>
          )}

          <View style={styles.inputContainer}>
            <Ionicons
              name="lock-closed"
              size={20}
              color="#6b7280"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor="#9ca3af"
              editable={!isLoading}
            />
          </View>

          {isCreating && (
            <View style={styles.inputContainer}>
              <Ionicons
                name="lock-closed"
                size={20}
                color="#6b7280"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                placeholderTextColor="#9ca3af"
                editable={!isLoading}
              />
            </View>
          )}

          <Pressable
            style={[
              styles.loginButton,
              isLoading && styles.loginButtonDisabled,
            ]}
            onPress={() => {
              console.log("Login/Signup button pressed", {
                isCreating,
                isLoading,
              });
              isCreating ? handleCreateAccount() : handleLogin();
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <ActivityIndicator color="#fff" size="small" />
                <Text style={[styles.loginButtonText, { marginLeft: 8 }]}>
                  {isCreating ? "Creating..." : "Logging in..."}
                </Text>
              </>
            ) : (
              <>
                <Text style={styles.loginButtonText}>
                  {isCreating ? "Create Account" : "Login"}
                </Text>
                <Ionicons name="arrow-forward" size={20} color="#fff" />
              </>
            )}
          </Pressable>
        </View>

        <Pressable
          style={styles.switchContainer}
          onPress={() => {
            console.log(
              "Switch mode pressed, toggling isCreating:",
              !isCreating
            );
            setIsCreating(!isCreating);
            clearForm();
          }}
          disabled={isLoading}
        >
          <Text style={styles.switchText}>
            {isCreating
              ? "Already have an account? "
              : "Need a parent account? "}
          </Text>
          <Text style={styles.switchLink}>
            {isCreating ? "Login" : "Create one"}
          </Text>
        </Pressable>
      </ScrollView>
    </View>
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
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  logoEmoji: {
    fontSize: 40,
    marginRight: 10,
  },
  appName: {
    fontSize: 32,
    fontFamily: "BalsamiqSans_700Bold",
    color: "#000",
  },
  tagline: {
    fontSize: 16,
    fontFamily: "BalsamiqSans_400Regular",
    color: "#6b7280",
    textAlign: "center",
  },
  loginCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    shadowColor: "#c7c7c7ff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1,
  },
  successCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 32,
    marginBottom: 20,
    shadowColor: "#c7c7c7ff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1,
    alignItems: "center",
  },
  successIcon: {
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontFamily: "BalsamiqSans_700Bold",
    color: "#000",
    textAlign: "center",
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  successMessage: {
    fontSize: 16,
    fontFamily: "BalsamiqSans_400Regular",
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 24,
    paddingHorizontal: 16,
    lineHeight: 22,
  },
  title: {
    fontSize: 24,
    fontFamily: "BalsamiqSans_700Bold",
    color: "#000",
    textAlign: "center",
    marginBottom: 20,
  },
  instructionsCard: {
    flexDirection: "row",
    backgroundColor: "#f0f9ff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: "#e0f2fe",
  },
  instructions: {
    fontSize: 14,
    fontFamily: "BalsamiqSans_400Regular",
    color: "#6b7280",
    marginLeft: 10,
    flex: 1,
    lineHeight: 20,
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
  loginButton: {
    backgroundColor: "#F7941F",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 20,
    zIndex: 1,
  },
  loginButtonDisabled: {
    backgroundColor: "#d1d5db",
  },
  loginButtonText: {
    fontSize: 18,
    fontFamily: "BalsamiqSans_700Bold",
    color: "#fff",
    marginRight: 20,
    paddingHorizontal: 20,

  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    zIndex: 1,
  },
  switchText: {
    fontSize: 16,
    fontFamily: "BalsamiqSans_400Regular",
    color: "#6b7280",
  },
  switchLink: {
    fontSize: 16,
    fontFamily: "BalsamiqSans_400Regular",
    color: "#F7941F",
    fontWeight: "bold",
  },
});
