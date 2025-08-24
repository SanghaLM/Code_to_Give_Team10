import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from './userContext';


export default function Login() {
  const [username, setUsernameInput] = useState('');
  const [password, setPassword] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const { setRole, setUsername, setIsLoggedIn } = useUser();


  const handleLogin = async () => {
    // Normalize username for comparison
    const normalizedUsername = username.trim().toLowerCase();
    // Hardcoded admin login for teacher
    if (normalizedUsername === 'admin' && password === 'admin') {
      setRole('teacher');
      setUsername(username.trim());
      setIsLoggedIn(true);
      return;
    }
    // All other logins are students (for demo)
    if (username && password) {
      setRole('student');
      setUsername(username.trim());
      setIsLoggedIn(true);
      return;
    }
    Alert.alert('Login Failed', 'Please enter a valid username and password.');
  };


  const handleCreateAccount = async () => {
    // For demo: require all fields
    if (!username || !password || !accessCode) {
      Alert.alert('Missing Fields', 'Please fill in all fields.');
      return;
    }
    // Accept any access code for demo
    setRole('student');
    setUsername(username);
    setIsLoggedIn(true);
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoEmoji}>🎓</Text>
            <Text style={styles.appName}>ReachOut</Text>
          </View>
          <Text style={styles.tagline}>Your Learning Journey Starts Here</Text>
        </View>

        {/* Login Card */}
        <View style={styles.loginCard}>
          <Text style={styles.title}>
            {isCreating ? 'Create Account' : 'Welcome Back!'}
          </Text>
          
          {isCreating && (
            <View style={styles.instructionsCard}>
              <Ionicons name="information-circle" size={20} color="#F7941F" />
              <Text style={styles.instructions}>
                All fields are required. Set your own username and password for logging in later. The access code is provided by the administrators.
              </Text>
            </View>
          )}

          {/* Input Fields */}
          <View style={styles.inputContainer}>
            <Ionicons name="person" size={20} color="#6b7280" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={username}
              onChangeText={setUsernameInput}
              autoCapitalize="none"
              placeholderTextColor="#9ca3af"
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed" size={20} color="#6b7280" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor="#9ca3af"
            />
          </View>

          {isCreating && (
            <View style={styles.inputContainer}>
              <Ionicons name="key" size={20} color="#6b7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Access Code (from administrator)"
                value={accessCode}
                onChangeText={setAccessCode}
                placeholderTextColor="#9ca3af"
              />
            </View>
          )}

          {/* Login Button */}
          <Pressable
            style={styles.loginButton}
            onPress={isCreating ? handleCreateAccount : handleLogin}
          >
            <Text style={styles.loginButtonText}>
              {isCreating ? 'Create Account' : 'Login'}
            </Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </Pressable>
        </View>

        {/* Switch Mode */}
        <Pressable
          style={styles.switchContainer}
          onPress={() => setIsCreating(!isCreating)}
        >
          <Text style={styles.switchText}>
            {isCreating ? 'Already have an account? ' : 'Need an account? '}
          </Text>
          <Text style={styles.switchLink}>
            {isCreating ? 'Login' : 'Create one'}
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF4E7',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: '5%',
    paddingVertical: '10%',
  },

  // Header Section
  headerSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  logoEmoji: {
    fontSize: 40,
    marginRight: 10,
  },
  appName: {
    fontSize: 32,
    fontFamily: 'BalsamiqSans_700Bold',
    color: '#000',
  },
  tagline: {
    fontSize: 16,
    fontFamily: 'BalsamiqSans_400Regular',
    color: '#6b7280',
    textAlign: 'center',
  },

  // Login Card
  loginCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#c7c7c7ff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontFamily: 'BalsamiqSans_700Bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 20,
  },

  // Instructions
  instructionsCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF4E7',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  instructions: {
    fontSize: 14,
    fontFamily: 'BalsamiqSans_400Regular',
    color: '#6b7280',
    marginLeft: 10,
    flex: 1,
    lineHeight: 20,
  },

  // Input Fields
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'BalsamiqSans_400Regular',
    color: '#000',
    paddingVertical: 12,
  },

  // Login Button
  loginButton: {
    backgroundColor: '#F7941F',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 20,
  },
  loginButtonText: {
    fontSize: 18,
    fontFamily: 'BalsamiqSans_700Bold',
    color: '#fff',
    marginRight: 8,
  },

  // Demo Info
  demoCard: {
    backgroundColor: '#f0f9ff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0f2fe',
  },
  demoTitle: {
    fontSize: 16,
    fontFamily: 'BalsamiqSans_400Regular',
    color: '#0369a1',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  demoText: {
    fontSize: 14,
    fontFamily: 'BalsamiqSans_400Regular',
    color: '#0284c7',
    marginBottom: 4,
  },

  // Switch Mode
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  switchText: {
    fontSize: 16,
    fontFamily: 'BalsamiqSans_400Regular',
    color: '#6b7280',
  },
  switchLink: {
    fontSize: 16,
    fontFamily: 'BalsamiqSans_400Regular',
    color: '#F7941F',
    fontWeight: 'bold',
  },
});
