import { Image } from "expo-image";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type TodoCardProps = {
  label: string;
  completedCount: number;
  totalCount: number;
};

export function TodoCard({ label, completedCount, totalCount }: TodoCardProps) {
  const [done, setDone] = useState(false);

  return (
    <View style={styles.todoCard}>
      <View style={styles.todoHeaderRow}>
        <View style={styles.todoLeft}>
          <Pressable
            style={styles.todoCheckbox}
            onPress={() => setDone((prev) => !prev)}
          >
            {done && (
              <Image
                source={require("@/assets/images/check.svg")}
                style={{ width: 19, height: 19 }}
                contentFit="contain"
              />
            )}
          </Pressable>
          <Text style={[styles.todoText, done && styles.todoTextDone]}>
            {label}
          </Text>
        </View>
        <Text style={styles.todoCountText}>
          {completedCount} / {totalCount}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  todoCard: {
    width: "100%",
    height: 50,
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: "#F3F8FF",
    marginVertical: 6,
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
  todoCheckbox: {
    width: 18,
    height: 18,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: "#000000",
    backgroundColor: "#FFFFFF",
    marginRight: 10,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
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
