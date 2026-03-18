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
    borderBottomColor: "#DDDDDD",
  },
  leftGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000000",
    paddingBottom: 2,
  },
});
