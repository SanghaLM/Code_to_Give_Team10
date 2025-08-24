import React, { useState } from "react";
import { Dimensions, View, StyleSheet, Text } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import ForFun from "./communityTabs/ForFun";
import HomeworkHelp from "./communityTabs/HomeworkHelp";
import MessageTeacher from "./communityTabs/MessageTeacherRoute"; // The WhatsApp-like chat
const initialLayout = { width: Dimensions.get("window").width };

export default function CommunityScreen() {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "forfun", title: "For Fun" },
    { key: "homework", title: "Homework Help" },
    { key: "teacher", title: "Message a Teacher" },
  ]);

  const renderScene = SceneMap({
    forfun: ForFun,
    homework: HomeworkHelp,
    teacher: MessageTeacher,
  });

  return (
    <View style={styles.container}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        style={styles.tabView}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            indicatorStyle={styles.indicator}
            style={styles.tabBar}
            tabStyle={styles.tabStyle}
            activeColor={'#F7941F'}
            inactiveColor={'#6b7280'}
            pressColor={'transparent'}
            renderLabel={({ route, focused, color }) => (
              <Text style={[styles.tabLabel, { color }, focused && styles.tabLabelActive]}>
                {route.title}
              </Text>
            )}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF4E7',
    paddingTop: '12%',
  },
  tabView: {
    flex: 1,
  },
  tabBar: {
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#c7c7c7ff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
    marginHorizontal: '5%',
    marginBottom: 10,
    borderRadius: 12,
  },
  indicator: {
    backgroundColor: '#F7941F',
    height: 3,
    borderRadius: 2,
  },
  tabLabel: {
    fontFamily: 'BalsamiqSans_400Regular',
    fontSize: 15,
    margin: 0,
    padding: 0,
  },
  tabLabelActive: {
    color: '#F7941F',
    fontFamily: 'BalsamiqSans_700Bold',
  },
  tabLabelInactive: {
    color: '#6b7280',
  },
  tabStyle: {
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
});
