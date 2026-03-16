import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import * as Haptics from "expo-haptics";
import React, { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Colors } from "@/constants/theme";
import { Text } from "@react-navigation/elements";

type TabItemProps = {
  label: string;
  routeName: string;
  focused: boolean;
  color: string;
  onPress: () => void;
  onLongPress: () => void;
};

function TabItem({
  label,
  routeName,
  focused,
  color,
  onPress,
  onLongPress,
}: TabItemProps) {
  const scale = useRef(new Animated.Value(focused ? 1.08 : 1)).current;
  const translateY = useRef(new Animated.Value(focused ? -8 : 0)).current;
  const bgOpacity = useRef(new Animated.Value(focused ? 1 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: focused ? 1.05 : 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: focused ? -30 : 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(bgOpacity, {
        toValue: focused ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [focused, scale, translateY, bgOpacity]);

  const handlePress = async () => {
    await Haptics.selectionAsync();
    onPress();
  };

  const renderIcon = () => {
    if (routeName === "index") {
      return (
        <FontAwesome5
          name="calendar-alt"
          size={30}
          color={focused ? "#FFFFFF" : color}
        />
      );
    }

    if (routeName === "todoList") {
      return (
        <Feather
          name="check-square"
          size={30}
          color={focused ? "#FFFFFF" : color}
        />
      );
    }

    return (
      <FontAwesome
        name="user-circle"
        size={30}
        color={focused ? "#FFFFFF" : color}
      />
    );
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={focused ? { selected: true } : {}}
      onPress={handlePress}
      onLongPress={onLongPress}
      style={styles.itemPressable}
    >
      <Animated.View
        style={[
          styles.iconWrap,
          {
            transform: [{ scale }, { translateY }],
          },
        ]}
      >
        <View style={styles.iconFrame}>
          <Animated.View
            pointerEvents="none"
            style={[
              styles.activeBubble,
              {
                opacity: bgOpacity,
              },
            ]}
          />
          {renderIcon()}
        </View>
      </Animated.View>

      <Animated.View
        style={[{ transform: [{ translateY }] }, { opacity: bgOpacity }]}
      >
        <Text
          style={[
            styles.label,
            {
              color: focused ? Colors.light.tint : color,
              //   opacity: focused ? 1 : 0,
            },
          ]}
        >
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

export function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.outer, { paddingBottom: insets.bottom }]}>
      <View style={styles.inner}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;

          const options = descriptors[route.key].options;
          const label =
            typeof options.tabBarLabel === "string"
              ? options.tabBarLabel
              : typeof options.title === "string"
                ? options.title
                : route.name;

          const color = focused
            ? Colors.light.tint
            : Colors.light.tabIconDefault;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          return (
            <TabItem
              key={route.key}
              label={label}
              routeName={route.name}
              focused={focused}
              color={color}
              onPress={onPress}
              onLongPress={onLongPress}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    backgroundColor: "#FFFFFF",
  },
  inner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 70,
    paddingTop: 20,
    paddingHorizontal: 8,
    marginBottom: 20,
    marginHorizontal: 20,
    borderRadius: 30,
    backgroundColor: "#F3F8FF",

    // 그림자 (iOS)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 10,

    // 그림자 (Android)
    elevation: 3,
  },
  itemPressable: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrap: {
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "red",
  },
  iconFrame: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 6,
    borderColor: "#F3F8FF",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  activeBubble: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#2563EB",
  },
  label: {
    fontSize: 10,
    fontWeight: "500",
    lineHeight: 10,
  },
});
