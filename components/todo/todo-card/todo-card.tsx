import { type TodoForDate } from "@/lib/db/todos";
import React from "react";
import { Animated, StyleSheet, View } from "react-native";

import { useTodoCardExpand } from "@/hooks/todo/use-todo-card-expand";
import { useTodoCardTasks } from "@/hooks/todo/use-todo-card-tasks";
import { TodoCardDetail } from "./todo-card-detail";
import { TodoCardHeader } from "./todo-card-header";

type TodoCardProps = {
  todo: TodoForDate;
  isMovingTodo?: boolean;
  isMoveMode?: boolean;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  onRequestDelete: (todo: TodoForDate) => void;
  onActivateMoveMode: (todoId: number) => void;
  onExitMoveMode: () => void;
  onPressMoveUp: (todoId: number) => void;
  onPressMoveDown: (todoId: number) => void;
};

export function TodoCard({
  todo,
  isMovingTodo = false,
  isMoveMode = false,
  canMoveUp = false,
  canMoveDown = false,
  onRequestDelete,
  onActivateMoveMode,
  onExitMoveMode,
  onPressMoveUp,
  onPressMoveDown,
}: TodoCardProps) {
  const { expanded, toggleExpand, handleDetailLayout, detailAnimatedStyle } =
    useTodoCardExpand(isMoveMode);

  const {
    tasks,
    completedCount,
    totalCount,
    isAllDone,
    handleToggleAllTasks,
    handleToggleTask,
  } = useTodoCardTasks({
    todoId: todo.todoId,
    initialTasks: todo.tasks,
    isMoveMode,
  });

  const handlePressCard = () => {
    if (isMoveMode) return;
    toggleExpand();
  };

  const handlePressComplete = () => {
    if (isMoveMode) {
      onExitMoveMode?.();
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
        isMovingTodo={isMovingTodo}
        isMoveMode={isMoveMode}
        canMoveUp={canMoveUp}
        canMoveDown={canMoveDown}
        onPressCard={handlePressCard}
        onPressToggleAll={handleToggleAllTasks}
        onPressDelete={() => onRequestDelete(todo)}
        onLongPressMove={() => onActivateMoveMode(todo.todoId)}
        onPressMoveUp={() => onPressMoveUp(todo.todoId)}
        onPressMoveDown={() => onPressMoveDown(todo.todoId)}
        onPressComplete={handlePressComplete}
      />

      <Animated.View
        style={[styles.animatedDetailContainer, detailAnimatedStyle]}
      >
        <TodoCardDetail
          tasks={tasks}
          content={todo.content}
          onLayout={handleDetailLayout}
          onPressTask={handleToggleTask}
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
