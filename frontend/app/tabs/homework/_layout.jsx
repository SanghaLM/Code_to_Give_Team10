import React from 'react';
import { Stack } from 'expo-router';

export default function HomeworkLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          paddingTop: '8%',
          backgroundColor: '#fff',
        },
        // This ensures no footer is shown in homework pages
      }}
    >
      <Stack.Screen name="hw-1" />
      <Stack.Screen name="hw-2" />
      <Stack.Screen name="hw-3" />
      <Stack.Screen name="hw-4" />
      <Stack.Screen name="hw-end" />
    </Stack>
  );
}
