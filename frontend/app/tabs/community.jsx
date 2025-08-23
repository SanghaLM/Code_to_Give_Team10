import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

const ForFunRoute = () => (
  <View style={styles.scene}>
    <Text style={styles.text}>For Fun Content</Text>
  </View>
);

const HomeworkHelpRoute = () => (
  <View style={styles.scene}>
    <Text style={styles.text}>Homework Help Content</Text>
  </View>
);

const MessageTeacherRoute = () => (
  <View style={styles.scene}>
    <Text style={styles.text}>Message a Teacher Content</Text>
  </View>
);

const initialLayout = { width: Dimensions.get('window').width };

export default function CommunityScreen() {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'forfun', title: 'For Fun' },
    { key: 'homework', title: 'Homework Help' },
    { key: 'teacher', title: 'Message a Teacher' },
  ]);

  const renderScene = SceneMap({
    forfun: ForFunRoute,
    homework: HomeworkHelpRoute,
    teacher: MessageTeacherRoute,
  });

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={initialLayout}
      renderTabBar={props => (
        <TabBar
          {...props}
          indicatorStyle={{ backgroundColor: '#333' }}
          style={{ backgroundColor: '#f5f5f5' }}
          labelStyle={{ color: 'black', fontFamily: 'BalsamiqSans_400Regular' }}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  text: {
    fontSize: 24,
    fontFamily: 'BalsamiqSans_400Regular',
    color: '#333',
  },
});