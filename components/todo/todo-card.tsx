import Check from "@/assets/images/check.svg";
import type { TodoForDate } from "@/lib/db/todos";
import React, { useMemo, useRef, useState } from "react";
import {
  Animated,
  LayoutChangeEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const HEADER_HEIGHT = 50;
const DETAIL_MAX_HEIGHT = 150;

type TodoCardProps = {
  todo: TodoForDate;
};

export function TodoCard({ todo }: TodoCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [tasks, setTasks] = useState(todo.tasks);
  const [measuredDetailHeight, setMeasuredDetailHeight] = useState(0);

  const detailHeightAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const completedCount = useMemo(() => {
    return tasks.filter((task) => task.isDone).length;
  }, [tasks]);

  const totalCount = tasks.length;

  const isAllDone = useMemo(() => {
    return totalCount > 0 && completedCount === totalCount;
  }, [completedCount, totalCount]);

  const toggleAllTasks = () => {
    const nextDone = !isAllDone;

    setTasks((prev) =>
      prev.map((task) => ({
        ...task,
        isDone: nextDone,
      })),
    );
  };

  const toggleTask = (taskId: number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, isDone: !task.isDone } : task,
      ),
    );
  };

  const animateOpen = (contentHeight: number) => {
    const nextHeight = Math.min(contentHeight, DETAIL_MAX_HEIGHT);

    Animated.parallel([
      Animated.timing(detailHeightAnim, {
        toValue: nextHeight,
        duration: 220,
        useNativeDriver: false,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 180,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const animateClose = () => {
    Animated.parallel([
      Animated.timing(detailHeightAnim, {
        toValue: 0,
        duration: 220,
        useNativeDriver: false,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 140,
        useNativeDriver: false,
      }),
    ]).start(() => {
      setExpanded(false);
    });
  };

  const toggleExpand = () => {
    if (expanded) {
      animateClose();
      return;
    }

    setExpanded(true);

    if (measuredDetailHeight > 0) {
      animateOpen(measuredDetailHeight);
    }
  };

  const handleDetailLayout = (e: LayoutChangeEvent) => {
    const height = e.nativeEvent.layout.height;

    if (height !== measuredDetailHeight) {
      setMeasuredDetailHeight(height);

      if (expanded) {
        const nextHeight = Math.min(height, DETAIL_MAX_HEIGHT);
        detailHeightAnim.setValue(nextHeight);
      }
    }
  };

  return (
    <View style={[styles.wrapper, { backgroundColor: todo.categoryColor }]}>
      <Pressable
        style={[styles.todoCard, { backgroundColor: todo.categoryColor }]}
        onPress={toggleExpand}
      >
        <View style={styles.todoHeaderRow}>
          <View style={styles.todoLeft}>
            <Pressable
              style={styles.todoCheckboxWrapper}
              onPress={toggleAllTasks}
            >
              <View style={styles.todoCheckbox}>
                {isAllDone && <Check width={19} height={19} />}
              </View>
            </Pressable>

            <Text style={[styles.todoText, isAllDone && styles.todoTextDone]}>
              {todo.categoryName}
            </Text>
          </View>

          <Text style={styles.todoCountText}>
            {completedCount} / {totalCount}
          </Text>
        </View>
      </Pressable>

      <Animated.View
        style={[
          styles.animatedDetailContainer,
          {
            height: detailHeightAnim,
            opacity: opacityAnim,
          },
        ]}
      >
        <ScrollView
          nestedScrollEnabled
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.detailContentContainer}
        >
          <View onLayout={handleDetailLayout}>
            {!!todo.content && (
              <Text style={styles.contentText}>{todo.content}</Text>
            )}

            {tasks.map((task) => (
              <View key={task.id} style={styles.taskRow}>
                <Pressable
                  style={styles.todoCheckboxWrapper}
                  onPress={() => toggleTask(task.id)}
                >
                  <View style={styles.todoCheckbox}>
                    {task.isDone && <Check width={19} height={19} />}
                  </View>
                </Pressable>

                <Text
                  style={[styles.taskText, task.isDone && styles.todoTextDone]}
                >
                  {task.title}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    borderRadius: 12,
    marginVertical: 6,
    overflow: "hidden",
  },
  todoCard: {
    width: "100%",
    height: HEADER_HEIGHT,
    paddingVertical: 15,
    paddingHorizontal: 20,
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
    color: "#111827",
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
  animatedDetailContainer: {
    overflow: "hidden",
  },
  detailContentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    paddingTop: 2,
  },
  contentText: {
    fontSize: 12,
    lineHeight: 18,
    color: "#374151",
    marginBottom: 10,
  },
  taskRow: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 34,
    marginBottom: 6,
  },
  taskText: {
    flex: 1,
    fontSize: 13,
    color: "#111827",
    paddingBottom: 1,
  },
});
