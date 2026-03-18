import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type TodoCreateHeaderProps = {
  onClose: () => void;
  onSave: () => void;
};

export function TodoCreateHeader({ onClose, onSave }: TodoCreateHeaderProps) {
  return (
    <View style={styles.header}>
      <Pressable onPress={onClose} hitSlop={8}>
        <Text style={styles.closeText}>닫기</Text>
      </Pressable>

      <Text style={styles.headerTitle}>할 일 추가</Text>

      <Pressable onPress={onSave} hitSlop={8}>
        <Text style={styles.saveText}>저장</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 52,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  closeText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
  },
  saveText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0064E0",
  },
});
