import Check from "@/assets/images/check.svg";
import type { TodoTaskItem } from "@/lib/db/todos";
import React from "react";
import {
  LayoutChangeEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

type TodoCardDetailProps = {
  tasks: TodoTaskItem[];
  content: string | null;
  onLayout: (e: LayoutChangeEvent) => void;
  onPressTask: (taskId: number) => void;
};

export function TodoCardDetail({
  tasks,
  content,
  onLayout,
  onPressTask,
}: TodoCardDetailProps) {
  return (
    <ScrollView
      nestedScrollEnabled
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.detailContentContainer}
    >
      <View onLayout={onLayout}>
        {tasks.map((task, index) => (
          <View
            key={task.id}
            style={[
              styles.taskRow,
              {
                marginTop: index === 0 ? 6 : 0,
                marginBottom: index === tasks.length - 1 ? 6 : 0,
              },
            ]}
          >
            <Pressable
              style={styles.todoCheckboxWrapper}
              onPress={() => onPressTask(task.id)}
            >
              <View style={styles.todoCheckbox}>
                {task.isDone && <Check width={19} height={19} />}
              </View>
            </Pressable>

            <Text style={[styles.taskText, task.isDone && styles.todoTextDone]}>
              {task.title}
            </Text>
          </View>
        ))}

        {!!content && <Text style={styles.contentText}>{content}</Text>}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  detailContentContainer: {
    paddingHorizontal: 20,
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  taskRow: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 34,
    marginLeft: 28,
    marginBottom: 3,
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
  todoTextDone: {
    textDecorationLine: "line-through",
    color: "#6B7280",
  },
  contentText: {
    fontSize: 12,
    lineHeight: 18,
    color: "#374151",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#000000",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginLeft: 28,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  taskText: {
    flex: 1,
    fontSize: 13,
    color: "#111827",
    paddingBottom: 1,
  },
});
