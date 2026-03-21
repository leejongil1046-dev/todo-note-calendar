import { type TodoForDate } from "@/lib/db/todos";
import type { DateDetailListMenuMode } from "@/types/calendar-types";
import React from "react";
import { Animated, StyleSheet, View } from "react-native";

import { useTodoCardExpand } from "@/hooks/todo/use-todo-card-expand";
import { useTodoCardTasks } from "@/hooks/todo/use-todo-card-tasks";
import { TodoCardDetail } from "./todo-card-detail";
import { TodoCardHeader } from "./todo-card-header";

type TodoCardProps = {
  todo: TodoForDate;
  /** 날짜 상세 모달 헤더 메뉴 모드(순서 변경·수정·삭제) — `none`이 아니면 펼침·태스크 토글 비활성, 헤더 탭으로 대상 선택 */
  listMenuMode?: DateDetailListMenuMode;
  /** 리스트 메뉴 모드에서 이 카드가 동작 대상으로 선택됨 */
  isSelectedForListMode?: boolean;
  /** 리스트 메뉴 모드에서 헤더(카드) 탭 — 부모가 단일/다중 선택 처리 */
  onPressSelectInListMode?: (todoId: number) => void;
  /** FAB 모드 진입·종료 애니메이션 중 — 카드·체크·태스크 터치 전부 무시 */
  blockTodoInteraction?: boolean;
};

export function TodoCard({
  todo,
  listMenuMode = "none",
  isSelectedForListMode = false,
  onPressSelectInListMode,
  blockTodoInteraction = false,
}: TodoCardProps) {
  const isListMenuModeActive = listMenuMode !== "none";
  const interactionLocked = isListMenuModeActive || blockTodoInteraction;

  const { toggleExpand, handleDetailLayout, detailAnimatedStyle } =
    useTodoCardExpand(interactionLocked);

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
    isListMenuModeActive: interactionLocked,
  });

  const handlePressCard = () => {
    if (blockTodoInteraction) return;
    if (isListMenuModeActive) {
      onPressSelectInListMode?.(todo.todoId);
      return;
    }
    toggleExpand();
  };

  return (
    <View
      style={[
        styles.wrapper,
        { backgroundColor: todo.categoryColor },
        {
          borderColor:
            isListMenuModeActive && isSelectedForListMode
              ? "#2563EB"
              : "transparent",
        },
      ]}
    >
      <TodoCardHeader
        categoryColor={todo.categoryColor}
        categoryName={todo.categoryName}
        isAllDone={isAllDone}
        completedCount={completedCount}
        totalCount={totalCount}
        isListMenuModeActive={interactionLocked}
        onPressCard={handlePressCard}
        onPressToggleAll={handleToggleAllTasks}
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
  /** borderWidth 고정 → 모드 on/off 시 카드 크기 변하지 않음 (색만 변경) */
  wrapper: {
    width: "100%",
    borderRadius: 12,
    marginVertical: 6,
    borderWidth: 2,
    borderColor: "transparent",
    overflow: "hidden",
  },
  animatedDetailContainer: {
    overflow: "hidden",
  },
});
