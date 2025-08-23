import React from 'react';
import { Tabs } from 'expo-router';
import TeacherFooter from './Footer';

export default function TeacherTabLayout() {
  return (
    <Tabs
      tabBar={(props) => <TeacherFooter {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="students" options={{ title: 'Students' }} />
      <Tabs.Screen name="dashboard" options={{ title: 'Dashboard' }} />
      <Tabs.Screen name="assignments" options={{ title: 'Assignments' }} />
    </Tabs>
  );
}
