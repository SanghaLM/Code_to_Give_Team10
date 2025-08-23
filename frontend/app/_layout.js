import React from 'react';
import { Stack, Slot } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts } from 'expo-font';
import { BalsamiqSans_400Regular } from '@expo-google-fonts/balsamiq-sans';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { UserProvider, useUser } from './userContext';

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});


function MainRouter() {
  const { role } = useUser();
  // Route to teacher or student interface
  if (role === 'teacher') {
    // Teacher interface: show teacher tabs
    return <Slot name="teacher" />;
  }
  // Student interface: show default stack/tabs
  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    BalsamiqSans_400Regular,
  });

  if (!fontsLoaded && !fontError) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <UserProvider>
          <MainRouter />
        </UserProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}