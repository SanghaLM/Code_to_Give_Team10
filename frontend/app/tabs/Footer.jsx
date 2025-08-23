import React from 'react';
import { View, Text, Pressable, StyleSheet, Image } from 'react-native';
import { Link } from 'expo-router';

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    height: '12%',
    width: '100%',
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb47',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 18,
  },
  tabButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: '7.6%',
  },
  tabLabel: {
    fontSize: 12,
    fontFamily: 'BalsamiqSans_400Regular',
    marginTop: 1,
  },
  icon: {
    width: 28,
    height: 28,
  },
});

const TABS = {
  task: {
    title: 'Task',
    icon: require('../../assets/footer/task-icon.png'),
    activeIcon: require('../../assets/footer/task-icon-active.png'),
  },
  community: {
    title: 'Community',
    icon: require('../../assets/footer/web-icon.png'),
    activeIcon: require('../../assets/footer/web-icon-active.png'),
  },
  leaderboard: {
    title: 'Leaderboard',
    icon: require('../../assets/footer/rank-icon.png'),
    activeIcon: require('../../assets/footer/rank-icon-active.png'),
  },

  profile: {
    title: 'Profile',
    icon: require('../../assets/footer/profile-icon.png'),
    activeIcon: require('../../assets/footer/profile-icon-active.png'),
  },
};

export default function Footer({ state }) {
  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const tabInfo = TABS[route.name];

        if (!tabInfo) return null;

        // For all tabs, use different colors when active
        let labelColor = isFocused ? '#F7941F' : '#6b7280'; // Orange when active, gray when not

        return (
          <Link href={`/tabs/${route.name}`} asChild key={route.key}>
            <Pressable style={styles.tabButton}>
              <Image 
                source={isFocused ? tabInfo.activeIcon : tabInfo.icon}
                style={styles.icon}
                resizeMode="contain"
              />
              <Text style={[styles.tabLabel, { color: labelColor }]}>{tabInfo.title}</Text>
            </Pressable>
          </Link>
        );
      })}
    </View>
  );
}