import Plus from "@/assets/images/plus.svg";
import { ConfirmModal } from "@/components/common/confirm-modal";
import { db } from "@/lib/db/db";
import { getTodosForDate, type TodoForDate } from "@/lib/db/todos";
import type { DateMeta } from "@/types/calendar-types";
import { Text } from "@react-navigation/elements";
import React, { useCallback, useEffect, useState } from "react";
import {
  Animated,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTodoCreate } from "@/hooks/todo/use-todo-create";
import { useTodoDelete } from "@/hooks/todo/use-todo-delete";
import { TodoCard } from "./todo/todo-card/todo-card";
import { TodoCreateModal } from "./todo/todo-create/todo-create-modal";

type Rect = { x: number; y: number; width: number; height: number };

type DateDetailModalProps = {
  visible: boolean;
  rect: Rect | null;
  progress: Animated.Value;
  contentOpacity: Animated.Value;
  meta: DateMeta | null;
  onRequestClose: () => void;
  isCardContentMounted: boolean;
};

export function DateDetailModal({
  visible,
  rect,
  progress,
  contentOpacity,
  meta,
  onRequestClose,
  isCardContentMounted,
}: DateDetailModalProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [todos, setTodos] = useState<TodoForDate[]>([]);

  const dateString = meta?.dateString;

  const refreshTodos = useCallback(() => {
    if (!dateString) return;
    setTodos(getTodosForDate(db, dateString));
  }, [dateString]);

  const {
    isDeleteConfirmOpen,
    isDeleteResultOpen,
    deleteResultMode,
    handleRequestDeleteTodo,
    handleConfirmDelete,
    closeDeleteConfirmModal,
    closeDeleteResultModal,
  } = useTodoDelete({ refreshTodos });

  const {
    isCreateResultOpen,
    createResultMode,
    closeCreateResultModal,
    handleCreateTodo,
  } = useTodoCreate({
    refreshTodos,
    closeCreateModal: () => setIsCreateModalOpen(false),
  });

  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const topOffset = insets.top;
  const bottomOffset = insets.bottom;

  const finalTop = topOffset + 52;
  const finalHeight = screenHeight - topOffset - bottomOffset - 52 - 82 - 30;

  useEffect(() => {
    if (!visible || !dateString) return;
    refreshTodos();
  }, [visible, dateString, refreshTodos]);

  if (!visible || !rect || !meta) return null;

  const initialTop = Platform.OS === "android" ? rect.y + topOffset : rect.y;

  return (
    <>
      <Modal
        visible
        transparent
        animationType="none"
        statusBarTranslucent
        onRequestClose={onRequestClose}
      >
        <View style={styles.overlay} pointerEvents="box-none">
          <Pressable style={styles.backdrop} onPress={onRequestClose} />

          <Animated.View
            style={[
              styles.card,
              {
                left: progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [rect.x, screenWidth * 0.05],
                }),
                top: progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [initialTop, finalTop],
                }),
                width: progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [rect.width, screenWidth * 0.9],
                }),
                height: progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [rect.height, finalHeight],
                }),
                opacity: progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1],
                }),
                borderRadius: progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [9, 24],
                }),
              },
            ]}
          >
            {isCardContentMounted && (
              <>
                <Animated.View
                  style={[styles.contentWrapper, { opacity: contentOpacity }]}
                >
                  <Text style={styles.dateText}>
                    {meta.year}년 {meta.month}월 {meta.day}일 (
                    {meta.weekdayLabel})
                  </Text>

                  <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                  >
                    {meta.isHoliday && meta.holidayName && (
                      <View style={styles.holidayCard}>
                        <Text style={styles.holidayText}>
                          {meta.holidayName}
                        </Text>
                      </View>
                    )}

                    {todos.length === 0 ? (
                      <Text style={styles.emptyTodosText}>
                        아직 할 일이 없어요
                      </Text>
                    ) : (
                      todos.map((todo) => (
                        <TodoCard
                          key={todo.todoId}
                          todo={todo}
                          onRequestDelete={handleRequestDeleteTodo}
                        />
                      ))
                    )}
                  </ScrollView>
                </Animated.View>

                <Animated.View
                  style={[styles.floatingButton, { opacity: contentOpacity }]}
                >
                  <Pressable
                    style={styles.floatingButtonPressable}
                    onPress={() => setIsCreateModalOpen(true)}
                  >
                    <Plus width={50} height={50} />
                  </Pressable>
                </Animated.View>
              </>
            )}
          </Animated.View>
        </View>

        <TodoCreateModal
          visible={isCreateModalOpen}
          selectedDate={meta.dateString}
          onClose={() => setIsCreateModalOpen(false)}
          onSave={handleCreateTodo}
        />
      </Modal>

      <ConfirmModal
        visible={isDeleteConfirmOpen}
        mode="delete-todo"
        onConfirm={handleConfirmDelete}
        onClose={closeDeleteConfirmModal}
      />

      <ConfirmModal
        visible={isDeleteResultOpen}
        mode={
          deleteResultMode === "success" ? "delete-success" : "delete-failed"
        }
        onConfirm={closeDeleteResultModal}
        onClose={closeDeleteResultModal}
      />

      <ConfirmModal
        visible={isCreateResultOpen}
        mode={
          createResultMode === "success" ? "create-success" : "create-failed"
        }
        onConfirm={closeCreateResultModal}
        onClose={closeCreateResultModal}
      />
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  card: {
    position: "absolute",
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },
  contentWrapper: {
    flex: 1,
    padding: 30,
  },
  dateText: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 16,
    marginLeft: 3,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 90,
  },
  holidayCard: {
    width: "100%",
    height: 50,
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: "#FEECEC",
    marginVertical: 6,
  },
  holidayText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#DC2626",
  },
  emptyTodosText: {
    marginTop: 14,
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
  },
  floatingButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  floatingButtonPressable: {
    width: "100%",
    height: "100%",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
});
