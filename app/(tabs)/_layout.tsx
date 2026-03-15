import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import { Colors } from "@/constants/theme";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors["light"].tint,
        tabBarInactiveTintColor: Colors["light"].tabIconDefault,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          height: 110,
          paddingTop: 10,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "캘린더",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="calendar-alt" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="todoList"
        options={{
          title: "할 일 목록",
          tabBarIcon: ({ color }) => (
            <Feather name="check-square" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="user"
        options={{
          title: "사용자",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="user-circle" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
