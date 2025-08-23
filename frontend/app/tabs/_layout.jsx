import React from 'react';
import { Tabs } from 'expo-router';
import Footer from './Footer';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <Footer {...props} />}
      screenOptions={{
        headerShown: false, // <-- Hide all headers
      }}
    >
      <Tabs.Screen
        name="task"
        options={{
          title: 'Task',
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: 'Community',
        }}
      />
      <Tabs.Screen
        name="rank"
        options={{
          title: 'Rank',
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progress',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
        }}
      />
    </Tabs>
  );
}