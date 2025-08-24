import React, { useState } from "react";
import { Dimensions, View, StyleSheet, Text, TouchableOpacity, Animated } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { Ionicons } from '@expo/vector-icons';
import ForFun from "./communityTabs/ForFun";
import HomeworkHelp from "./communityTabs/HomeworkHelp";
import MessageTeacher from "./communityTabs/MessageTeacherRoute"; // The WhatsApp-like chat

const initialLayout = { width: Dimensions.get("window").width };

// Chat Rules Component
const ChatRules = ({ isExpanded, onToggle, rules }) => {
  const [animation] = useState(new Animated.Value(0));

  React.useEffect(() => {
    Animated.timing(animation, {
      toValue: isExpanded ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isExpanded]);

  const maxHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 200],
  });

  return (
    <View style={styles.rulesContainer}>
      <TouchableOpacity style={styles.rulesHeader} onPress={onToggle}>
        <View style={styles.rulesTitle}>
          <Ionicons name="warning" size={18} color="#8B4513" style={{ marginRight: 8 }} />
          <Text style={styles.rulesTitleText}>Chat Rules</Text>
        </View>
        <Ionicons 
          name={isExpanded ? 'chevron-up' : 'chevron-down'} 
          size={20} 
          color="#8B4513" 
        />
      </TouchableOpacity>
      
      <Animated.View style={[styles.rulesContent, { maxHeight }]}>
        <View style={styles.rulesList}>
          {rules.map((rule, index) => (
            <View key={index} style={styles.ruleItem}>
              <Text style={styles.ruleNumber}>{index + 1}.</Text>
              <Text style={styles.ruleText}>{rule}</Text>
            </View>
          ))}
        </View>
      </Animated.View>
    </View>
  );
};

export default function CommunityScreen() {
  const [index, setIndex] = useState(0);
  const [rulesExpanded, setRulesExpanded] = useState(false);
  const [routes] = useState([
    { key: "forfun", title: "For Fun" },
    { key: "homework", title: "Homework Help" },
    { key: "teacher", title: "Message a Teacher" },
  ]);

  const chatRules = [
    "Be respectful and kind to everyone",
    "No bullying, harassment, or hate speech",
    "Keep conversations appropriate for all ages",
    "No sharing personal information",
    "Report any concerning behavior to teachers",
    "Stay on topic and relevant to the community"
  ];

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'forfun':
        return (
          <View style={styles.sceneContainer}>
            <ChatRules 
              isExpanded={rulesExpanded} 
              onToggle={() => setRulesExpanded(!rulesExpanded)}
              rules={chatRules}
            />
            <ForFun />
          </View>
        );
      case 'homework':
        return (
          <View style={styles.sceneContainer}>
            <ChatRules 
              isExpanded={rulesExpanded} 
              onToggle={() => setRulesExpanded(!rulesExpanded)}
              rules={chatRules}
            />
            <HomeworkHelp />
          </View>
        );
      case 'teacher':
        return <MessageTeacher />;
      default:
        return null;
    }
  };

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
  sceneContainer: {
    flex: 1,
  },
  rulesContainer: {
    backgroundColor: '#FFF8DC',
    borderRadius: 12,
    marginHorizontal: '5%',
    marginBottom: 10,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  rulesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#FFE4B5',
  },
  rulesTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rulesTitleText: {
    fontFamily: 'BalsamiqSans_700Bold',
    fontSize: 16,
    color: '#8B4513',
  },
  rulesContent: {
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  rulesList: {
    // No specific styles for the list, it will be handled by ruleItem
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  ruleNumber: {
    fontFamily: 'BalsamiqSans_700Bold',
    fontSize: 14,
    color: '#FF6B35',
    marginRight: 8,
  },
  ruleText: {
    fontFamily: 'BalsamiqSans_400Regular',
    fontSize: 14,
    color: '#8B4513',
    flexShrink: 1,
  },
});
