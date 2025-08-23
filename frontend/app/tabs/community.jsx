import React, { useState } from "react";
import { Dimensions } from "react-native";
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
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={initialLayout}
      renderTabBar={(props) => (
        <TabBar
          {...props}
          indicatorStyle={{ backgroundColor: "#333" }}
          style={{ backgroundColor: "#f5f5f5" }}
          labelStyle={{ color: "black", fontFamily: "BalsamiqSans_400Regular" }}
        />
      )}
    />
  );
}
