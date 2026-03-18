import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

type TodoCreateTitleSectionProps = {
  title: string;
  onChangeTitle: (value: string) => void;
};

export function TodoCreateTitleSection({
  title,
  onChangeTitle,
}: TodoCreateTitleSectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.label}>제목</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={onChangeTitle}
        placeholder="제목을 입력하세요"
        placeholderTextColor="#9CA3AF"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    fontSize: 14,
    color: "#111827",
  },
});
