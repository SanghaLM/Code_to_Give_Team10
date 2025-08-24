import React from "react";
import { Stack, Slot } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useFonts } from "expo-font";
import {
  BalsamiqSans_400Regular,
  BalsamiqSans_400Regular_Italic,
  BalsamiqSans_700Bold,
  BalsamiqSans_700Bold_Italic,
} from "@expo-google-fonts/balsamiq-sans";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import { UserProvider, useUser } from "./userContext";
import Login from "./Login";
import RegisterChildScreen from "./RegisterChildScreen";

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

function MainRouter() {
  const { role, isLoggedIn, childProfiles } = useUser();

  if (!isLoggedIn) {
    return <Login />;
  }

  if (role === "parent" && (!childProfiles || childProfiles.length === 0)) {
    return <RegisterChildScreen />;
  }

  if (role === "teacher") {
    // Teacher interface: stack with teacher tabs
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="teacher" />
      </Stack>
    );
  }

  // Parent with children or student interface: stack with student tabs
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="tabs" />
    </Stack>
  );
}

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    BalsamiqSans_400Regular,
    BalsamiqSans_400Regular_Italic,
    BalsamiqSans_700Bold,
    BalsamiqSans_700Bold_Italic,
  });

  if (!fontsLoaded && !fontError) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F7941F" />
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
