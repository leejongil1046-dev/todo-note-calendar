import { db } from "@/lib/db/db";
import {
  updateAllTodoTasksDone,
  updateTodoTaskDone,
  type TodoForDate,
} from "@/lib/db/todos";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Animated, LayoutChangeEvent, StyleSheet, View } from "react-native";

import { TodoCardDetail } from "./todo-card-detail";
import { TodoCardHeader } from "./todo-card-header";

const DETAIL_MAX_HEIGHT = 250;

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

    updateAllTodoTasksDone(db, todo.todoId, nextDone);
  };

  const toggleTask = (taskId: number) => {
    const targetTask = tasks.find((task) => task.id === taskId);
    if (!targetTask) return;

    const nextDone = !targetTask.isDone;

    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, isDone: nextDone } : task,
      ),
    );

    updateTodoTaskDone(db, todo.todoId, taskId, nextDone);
  };

  useEffect(() => {
    setTasks(todo.tasks);
  }, [todo.tasks]);

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
      <TodoCardHeader
        categoryColor={todo.categoryColor}
        categoryName={todo.categoryName}
        isAllDone={isAllDone}
        completedCount={completedCount}
        totalCount={totalCount}
        expanded={expanded}
        onPressCard={toggleExpand}
        onPressToggleAll={toggleAllTasks}
      />

      <Animated.View
        style={[
          styles.animatedDetailContainer,
          {
            height: detailHeightAnim,
            opacity: opacityAnim,
          },
        ]}
      >
        <TodoCardDetail
          tasks={tasks}
          content={todo.content}
          onLayout={handleDetailLayout}
          onPressTask={toggleTask}
        />
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
  animatedDetailContainer: {
    overflow: "hidden",
  },
});
