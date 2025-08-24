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
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 18,
    paddingHorizontal: '3%',
  },
  tabButton: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    maxWidth: '30%',
    minWidth: '25%',
  },
  tabLabel: {
    fontSize: 12,
    fontFamily: 'BalsamiqSans_400Regular',
    marginTop: 1,
    textAlign: 'center',
  },
  icon: {
    width: 28,
    height: 28,
  },
});

const TABS = {
  students: {
    title: 'Students',
    icon: require('../../assets/footer/rank-icon.png'),
    activeIcon: require('../../assets/footer/rank-icon-active.png'),
  },
  dashboard: {
    title: 'Dashboard',
    icon: require('../../assets/footer/task-icon.png'),
    activeIcon: require('../../assets/footer/task-icon-active.png'),
  },
  assignments: {
    title: 'Assignments',
    icon: require('../../assets/footer/web-icon.png'),
    activeIcon: require('../../assets/footer/web-icon-active.png'),
  },
};

export default function TeacherFooter({ state }) {
  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const tabInfo = TABS[route.name];
        if (!tabInfo) return null;
        let labelColor = isFocused ? '#F7941F' : '#6b7280';
        return (
          <Link href={`/teacher/${route.name}`} asChild key={route.key}>
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
