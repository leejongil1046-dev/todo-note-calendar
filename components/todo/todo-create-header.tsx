import Chevron from "@/assets/images/chevron.svg";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type TodoCreateHeaderProps = {
  onClose: () => void;
};

export function TodoCreateHeader({ onClose }: TodoCreateHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.leftGroup}>
        <Pressable onPress={onClose} hitSlop={8} style={styles.backButton}>
          <Chevron width={20} height={20} />
        </Pressable>

        <Text style={styles.headerTitle}>할 일 추가</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 56,
    paddingHorizontal: 20,
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  leftGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 5,
    paddingVertical: 4,
    paddingRight: 4,
  },
  backIcon: {
    fontSize: 24,
    fontWeight: "500",
    color: "#111827",
    lineHeight: 24,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000000",
  },
});
