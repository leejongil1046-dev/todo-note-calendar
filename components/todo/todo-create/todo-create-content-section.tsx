import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

type TodoCreateContentSectionProps = {
  content: string;
  onChangeContent: (value: string) => void;
};

export function TodoCreateContentSection({
  content,
  onChangeContent,
}: TodoCreateContentSectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.label}>내용</Text>
      <TextInput
        style={styles.textArea}
        value={content}
        onChangeText={onChangeContent}
        placeholder="내용을 입력하세요"
        placeholderTextColor="#9CA3AF"
        multiline
        textAlignVertical="top"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  textArea: {
    minHeight: 110,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 13,
    color: "#111827",
  },
});
