import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

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
      <Text style={styles.title}>{isCreating ? 'Create Account' : 'Login'}</Text>
      {isCreating && (
        <Text style={styles.instructions}>
          All fields are required. Set your own username and password for logging in later. The access code is provided by the administrators.
        </Text>
      )}
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsernameInput}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {isCreating && (
        <TextInput
          style={styles.input}
          placeholder="Access Code (from administrator)"
          value={accessCode}
          onChangeText={setAccessCode}
        />
      )}
      <Button
        title={isCreating ? 'Create Account' : 'Login'}
        onPress={isCreating ? handleCreateAccount : handleLogin}
      />
      <Text
        style={styles.switchText}
        onPress={() => setIsCreating(!isCreating)}
      >
        {isCreating ? 'Already have an account? Login' : 'Need an account? Create one'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  instructions: {
    fontSize: 14,
    color: '#444',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  switchText: {
    marginTop: 15,
    color: '#007bff',
    textDecorationLine: 'underline',
  },
});
