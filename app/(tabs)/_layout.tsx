import { Tabs } from "expo-router";
import React from "react";

import { CustomTabBar } from "@/components/navigation/custom-tab-bar";

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "캘린더",
        }}
      />
      <Tabs.Screen
        name="todoList"
        options={{
          title: "할 일 목록",
        }}
      />
      <Tabs.Screen
        name="user"
        options={{
          title: "사용자",
        }}
      />
    </Tabs>
  );
}
