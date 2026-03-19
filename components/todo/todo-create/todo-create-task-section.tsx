import React from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

type TodoCreateTaskSectionProps = {
  taskInput: string;
  tasks: string[];
  onChangeTaskInput: (value: string) => void;
  onAddTask: () => void;
  onRemoveTask: (index: number) => void;
};

export function TodoCreateTaskSection({
  taskInput,
  tasks,
  onChangeTaskInput,
  onAddTask,
  onRemoveTask,
}: TodoCreateTaskSectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.label}>할 일</Text>

      <View style={styles.taskInputRow}>
        <TextInput
          style={styles.taskInput}
          value={taskInput}
          onChangeText={onChangeTaskInput}
          placeholder="할 일을 입력하고 추가하세요"
          placeholderTextColor="#9CA3AF"
          returnKeyType="done"
          onSubmitEditing={onAddTask}
        />

        <Pressable style={styles.addButton} onPress={onAddTask}>
          <Text style={styles.addButtonText}>추가</Text>
        </Pressable>
      </View>

      {tasks.length > 0 && (
        <View style={styles.tagList}>
          {tasks.map((task, index) => (
            <View key={`${task}-${index}`} style={styles.tagChip}>
              <Text style={styles.tagText}>{task}</Text>
              <Pressable onPress={() => onRemoveTask(index)} hitSlop={8}>
                <Text style={styles.tagRemove}>×</Text>
              </Pressable>
            </View>
          ))}
        </View>
      )}
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
  taskInputRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  taskInput: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    fontSize: 13,
    color: "#111827",
  },
  addButton: {
    height: 44,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: "#E8EEF9",
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#0064E0",
  },
  tagList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tagChip: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 999,
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  tagText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#374151",
    marginRight: 8,
  },
  tagRemove: {
    fontSize: 12,
    fontWeight: "700",
    color: "#374151",
  },
});
