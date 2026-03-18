import { Image } from "expo-image";
import React, { useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";

const COLLAPSED_HEIGHT = 50;
const EXPANDED_HEIGHT = 250;

type TodoCardProps = {
  label: string;
  completedCount: number;
  totalCount: number;
};

export function TodoCard({ label, completedCount, totalCount }: TodoCardProps) {
  const [done, setDone] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const heightAnim = useRef(new Animated.Value(COLLAPSED_HEIGHT)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const toggleExpand = () => {
    const nextExpanded = !expanded;

    Animated.parallel([
      Animated.timing(heightAnim, {
        toValue: nextExpanded ? EXPANDED_HEIGHT : COLLAPSED_HEIGHT,
        duration: 220,
        useNativeDriver: false,
      }),
      Animated.timing(opacityAnim, {
        toValue: nextExpanded ? 1 : 0,
        duration: 150,
        useNativeDriver: false,
      }),
    ]).start();

    setExpanded(nextExpanded);
  };

  return (
    <Animated.View style={[styles.wrapper, { height: heightAnim }]}>
      <Pressable style={styles.todoCard} onPress={toggleExpand}>
        <View style={styles.todoHeaderRow}>
          <View style={styles.todoLeft}>
            <Pressable
              style={styles.todoCheckboxWrapper}
              onPress={() => setDone((prev) => !prev)}
            >
              <View style={styles.todoCheckbox}>
                {done && (
                  <Image
                    source={require("@/assets/images/check.svg")}
                    style={{ width: 19, height: 19 }}
                    contentFit="contain"
                  />
                )}
              </View>
            </Pressable>
            <Text style={[styles.todoText, done && styles.todoTextDone]}>
              {label}
            </Text>
          </View>
          <Text style={styles.todoCountText}>
            {completedCount} / {totalCount}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    borderRadius: 12,
    backgroundColor: "#F3F8FF",
    marginVertical: 6,
    overflow: "hidden",
  },
  todoCard: {
    width: "100%",
    height: 50,
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: "#F3F8FF",
    justifyContent: "center",
  },
  todoHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  todoLeft: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
  },
  todoCheckboxWrapper: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  todoCheckbox: {
    width: 18,
    height: 18,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: "#000000",
    backgroundColor: "#FFFFFF",
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  todoText: {
    fontSize: 13,
    fontWeight: "500",
    paddingBottom: 2,
  },
  todoTextDone: {
    textDecorationLine: "line-through",
    color: "#6B7280",
  },
  todoCountText: {
    fontSize: 12,
    color: "#6B7280",
    paddingBottom: 1,
  },
});
