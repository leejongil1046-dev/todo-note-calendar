import { db } from "@/lib/db/db";
import {
  updateAllTodoTasksDone,
  updateTodoTaskDone,
  type TodoForDate,
} from "@/lib/db/todos";
import React, { useEffect, useMemo, useState } from "react";
import { Animated, StyleSheet, View } from "react-native";

import { useTodoCardExpand } from "@/hooks/todo/use-todo-card-expand";
import { TodoCardDetail } from "./todo-card-detail";
import { TodoCardHeader } from "./todo-card-header";

type TodoCardProps = {
  todo: TodoForDate;
  onRequestDelete: (todo: TodoForDate) => void;
  onLongPressDrag?: () => void;
  isDragging?: boolean;
};

export function TodoCard({
  todo,
  onRequestDelete,
  onLongPressDrag,
  isDragging = false,
}: TodoCardProps) {
  const [tasks, setTasks] = useState(todo.tasks);

  const { expanded, toggleExpand, handleDetailLayout, detailAnimatedStyle } =
    useTodoCardExpand(isDragging);

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

  return (
    <View
      style={[
        styles.wrapper,
        { backgroundColor: todo.categoryColor },
        isDragging && styles.draggingWrapper,
      ]}
    >
      <TodoCardHeader
        categoryColor={todo.categoryColor}
        categoryName={todo.categoryName}
        isAllDone={isAllDone}
        completedCount={completedCount}
        totalCount={totalCount}
        expanded={expanded}
        onPressCard={toggleExpand}
        onPressToggleAll={toggleAllTasks}
        onPressDelete={() => onRequestDelete(todo)}
        onLongPressDrag={onLongPressDrag}
        isDragging={isDragging}
      />

      <Animated.View
        style={[styles.animatedDetailContainer, detailAnimatedStyle]}
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
  draggingWrapper: {
    opacity: 0.96,
  },
  animatedDetailContainer: {
    overflow: "hidden",
  },
});
