import DeleteFabIcon from "@/assets/images/delete.svg";
import EditFabIcon from "@/assets/images/edit.svg";
import Plus from "@/assets/images/plus.svg";
import { ConfirmModal } from "@/components/common/confirm-modal";
import {
  DateDetailModalListHeader,
  type DateDetailHeaderMenuItem,
} from "@/components/date-detail-modal-list-header";
import { TodoCard } from "@/components/todo/todo-card/todo-card";
import { TodoCreateModal } from "@/components/todo/todo-create/todo-create-modal";
import { useDateDetailFabCluster } from "@/hooks/todo/use-date-detail-fab-cluster";
import { useTodoCreate } from "@/hooks/todo/use-todo-create";
import { useTodoDelete } from "@/hooks/todo/use-todo-delete";
import { db } from "@/lib/db/db";
import {
  getTodosForDate,
  updateTodoOrdersAsync,
  type TodoForDate,
} from "@/lib/db/todos";
import type {
  DateDetailListMenuMode,
  DateMeta,
  TodoSummary,
} from "@/types/calendar-types";
import Feather from "@expo/vector-icons/Feather";
import { Text } from "@react-navigation/elements";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Animated,
  FlatList,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
export { DEFAULT_DATE_DETAIL_HEADER_MENU_ITEMS } from "@/components/date-detail-modal-list-header";
export type { DateDetailHeaderMenuItem } from "@/components/date-detail-modal-list-header";

type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type DateDetailModalProps = {
  visible: boolean;
  rect: Rect | null;
  progress: Animated.Value;
  contentOpacity: Animated.Value;
  meta: DateMeta | null;
  onRequestClose: () => void;
  isCardContentMounted: boolean;
  onTodoSummaryChanged: (dateString: string, summary: TodoSummary) => void;
};

const buildTodoSummaryFromTodos = (todos: TodoForDate[]): TodoSummary => {
  return {
    count: todos.length,
    previews: todos.slice(0, 3).map((todo) => ({
      categoryName: todo.categoryName,
      categoryColor: todo.categoryColor,
    })),
  };
};

export function DateDetailModal({
  visible,
  rect,
  progress,
  contentOpacity,
  meta,
  onRequestClose,
  isCardContentMounted,
  onTodoSummaryChanged,
}: DateDetailModalProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [todos, setTodos] = useState<TodoForDate[]>([]);
  const todosRef = useRef<TodoForDate[]>([]);
  todosRef.current = todos;
  const [headerMenuOpen, setHeaderMenuOpen] = useState(false);
  const [listMenuMode, setListMenuMode] =
    useState<DateDetailListMenuMode>("none");
  /** 순서 변경·수정: 단일 선택 */
  const [singleSelectedTodoId, setSingleSelectedTodoId] = useState<
    number | null
  >(null);
  /** 삭제: 다중 선택 */
  const [deleteSelectedTodoIds, setDeleteSelectedTodoIds] = useState<number[]>(
    [],
  );

  const {
    fabRotate,
    upTranslateY,
    downTranslateY,
    actionTranslateY,
    reorderChevronsMounted,
    actionSubFabMounted,
    enterReorderMode,
    exitReorderMode,
    cancelRotationOnlyEnter,
    enterActionSubFabMode,
    exitActionSubFabMode,
    resetInstant,
    isFabClusterAnimating,
  } = useDateDetailFabCluster();

  const dateString = meta?.dateString;

  const refreshTodos = useCallback(() => {
    if (!dateString) return;

    const nextTodos = getTodosForDate(db, dateString);
    const nextSummary = buildTodoSummaryFromTodos(nextTodos);

    setTodos(nextTodos);
    onTodoSummaryChanged(dateString, nextSummary);
  }, [dateString, onTodoSummaryChanged]);

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

  const isListMenuModeActive = listMenuMode !== "none";

  const clearListModeSelections = useCallback(() => {
    setSingleSelectedTodoId(null);
    setDeleteSelectedTodoIds([]);
  }, []);

  useEffect(() => {
    clearListModeSelections();
  }, [clearListModeSelections, listMenuMode]);

  /** 순서 변경: 선택된 할 일을 리스트에서 한 칸 위/아래로 (DB sort_order 반영) */
  const moveSelectedTodoInReorder = useCallback(
    (direction: "up" | "down") => {
      if (
        listMenuMode !== "reorder" ||
        singleSelectedTodoId == null ||
        !dateString
      ) {
        return;
      }

      const prevTodos = todosRef.current;
      const idx = prevTodos.findIndex((t) => t.todoId === singleSelectedTodoId);
      if (idx === -1) return;

      const nextIdx = direction === "up" ? idx - 1 : idx + 1;
      if (nextIdx < 0 || nextIdx >= prevTodos.length) return;

      const nextTodos = [...prevTodos];
      [nextTodos[idx], nextTodos[nextIdx]] = [
        nextTodos[nextIdx],
        nextTodos[idx],
      ];

      todosRef.current = nextTodos;
      setTodos(nextTodos);
      onTodoSummaryChanged(dateString, buildTodoSummaryFromTodos(nextTodos));
      void updateTodoOrdersAsync(
        db,
        nextTodos.map((t) => t.todoId),
      );
    },
    [dateString, listMenuMode, onTodoSummaryChanged, singleSelectedTodoId],
  );

  const handleTodoListModePress = useCallback(
    (todoId: number) => {
      if (listMenuMode === "delete") {
        setDeleteSelectedTodoIds((prev) =>
          prev.includes(todoId)
            ? prev.filter((id) => id !== todoId)
            : [...prev, todoId],
        );
        return;
      }
      if (listMenuMode === "reorder" || listMenuMode === "edit") {
        setSingleSelectedTodoId((prev) => (prev === todoId ? null : todoId));
      }
    },
    [listMenuMode],
  );

  const openListMenuMode = useCallback(
    (mode: Exclude<DateDetailListMenuMode, "none">) => {
      setHeaderMenuOpen(false);
      setListMenuMode(mode);
      if (mode === "reorder") {
        enterReorderMode();
      } else {
        enterActionSubFabMode();
      }
    },
    [enterActionSubFabMode, enterReorderMode],
  );

  const headerMenuItems = useMemo<DateDetailHeaderMenuItem[]>(
    () => [
      {
        label: "순서 변경",
        onPress: () => openListMenuMode("reorder"),
        disabled: todos.length <= 1,
      },
      {
        label: "수정",
        onPress: () => openListMenuMode("edit"),
        disabled: todos.length === 0,
      },
      {
        label: "삭제",
        onPress: () => openListMenuMode("delete"),
        disabled: todos.length === 0,
      },
    ],
    [openListMenuMode, todos.length],
  );

  const handleFabPress = useCallback(() => {
    if (listMenuMode === "reorder") {
      clearListModeSelections();
      if (reorderChevronsMounted) {
        exitReorderMode(() => setListMenuMode("none"));
      } else {
        cancelRotationOnlyEnter(() => setListMenuMode("none"));
      }
      return;
    }

    if (listMenuMode === "edit" || listMenuMode === "delete") {
      clearListModeSelections();
      if (actionSubFabMounted) {
        exitActionSubFabMode(() => setListMenuMode("none"));
      } else {
        cancelRotationOnlyEnter(() => setListMenuMode("none"));
      }
      return;
    }

    setIsCreateModalOpen(true);
  }, [
    actionSubFabMounted,
    cancelRotationOnlyEnter,
    clearListModeSelections,
    exitActionSubFabMode,
    exitReorderMode,
    listMenuMode,
    reorderChevronsMounted,
  ]);

  useEffect(() => {
    if (!visible || !dateString) return;
    refreshTodos();
  }, [visible, dateString, refreshTodos]);

  useEffect(() => {
    if (!visible) {
      setHeaderMenuOpen(false);
      setListMenuMode("none");
      clearListModeSelections();
      resetInstant();
    }
  }, [clearListModeSelections, resetInstant, visible]);

  useEffect(() => {
    if (isListMenuModeActive) setHeaderMenuOpen(false);
  }, [isListMenuModeActive]);

  const renderListHeader = useCallback(() => {
    if (!meta) return null;

    return (
      <DateDetailModalListHeader
        meta={meta}
        menuOpen={headerMenuOpen}
        onMenuOpenChange={setHeaderMenuOpen}
        menuItems={headerMenuItems}
        menuDisabled={isListMenuModeActive}
      />
    );
  }, [meta, headerMenuOpen, headerMenuItems, isListMenuModeActive]);

  const flatListExtraData = useMemo(
    () =>
      `${listMenuMode}-${singleSelectedTodoId}-${deleteSelectedTodoIds.join(",")}-${isFabClusterAnimating}`,
    [
      deleteSelectedTodoIds,
      isFabClusterAnimating,
      listMenuMode,
      singleSelectedTodoId,
    ],
  );

  const reorderChevronMoveDisabled = useMemo(() => {
    if (listMenuMode !== "reorder") {
      return { up: true, down: true };
    }
    if (singleSelectedTodoId == null || todos.length === 0) {
      return { up: true, down: true };
    }
    const idx = todos.findIndex((t) => t.todoId === singleSelectedTodoId);
    if (idx === -1) {
      return { up: true, down: true };
    }
    return {
      up: idx <= 0,
      down: idx >= todos.length - 1,
    };
  }, [listMenuMode, singleSelectedTodoId, todos]);

  if (!visible || !rect || !meta) return null;

  const initialTop = Platform.OS === "android" ? rect.y + topOffset : rect.y;

  return (
    <>
      <Modal visible transparent animationType="none" statusBarTranslucent>
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
                  <FlatList
                    data={todos}
                    extraData={flatListExtraData}
                    keyExtractor={(item) => String(item.todoId)}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContent}
                    ListHeaderComponent={renderListHeader}
                    ListHeaderComponentStyle={styles.flatListHeaderWrapper}
                    onScrollBeginDrag={() => setHeaderMenuOpen(false)}
                    ListEmptyComponent={
                      <Text style={styles.emptyTodosText}>
                        아직 할 일이 없어요
                      </Text>
                    }
                    renderItem={({ item, index }) => (
                      <TodoCard
                        todo={item}
                        listMenuMode={listMenuMode}
                        isSelectedForListMode={
                          listMenuMode === "delete"
                            ? deleteSelectedTodoIds.includes(item.todoId)
                            : listMenuMode === "reorder" ||
                                listMenuMode === "edit"
                              ? singleSelectedTodoId === item.todoId
                              : false
                        }
                        onPressSelectInListMode={handleTodoListModePress}
                        blockTodoInteraction={isFabClusterAnimating}
                      />
                    )}
                  />
                </Animated.View>

                <Animated.View
                  style={[styles.fabCluster, { opacity: contentOpacity }]}
                  pointerEvents="box-none"
                >
                  {/* column-reverse: 선언 순서대로 아래→위 = FAB, 아래 chevron, 위 chevron */}
                  <Animated.View style={styles.floatingButton}>
                    <Pressable
                      style={styles.floatingButtonPressable}
                      onPress={handleFabPress}
                    >
                      <Animated.View
                        style={{
                          transform: [{ rotate: fabRotate }],
                        }}
                      >
                        <Plus width={50} height={50} />
                      </Animated.View>
                    </Pressable>
                  </Animated.View>

                  {reorderChevronsMounted && (
                    <Animated.View
                      style={[
                        styles.subFab,
                        styles.subFabSpacing,
                        reorderChevronMoveDisabled.down &&
                          styles.reorderSubFabDisabled,
                        { transform: [{ translateY: downTranslateY }] },
                      ]}
                    >
                      <Pressable
                        disabled={reorderChevronMoveDisabled.down}
                        style={[
                          styles.floatingButtonPressable,
                          reorderChevronMoveDisabled.down &&
                            styles.reorderChevronPressableDisabled,
                        ]}
                        onPress={() => moveSelectedTodoInReorder("down")}
                      >
                        <Feather
                          name="chevron-down"
                          size={28}
                          color={
                            reorderChevronMoveDisabled.down
                              ? "#9CA3AF"
                              : "#000000"
                          }
                        />
                      </Pressable>
                    </Animated.View>
                  )}

                  {reorderChevronsMounted && (
                    <Animated.View
                      style={[
                        styles.subFab,
                        styles.subFabSpacing,
                        reorderChevronMoveDisabled.up &&
                          styles.reorderSubFabDisabled,
                        { transform: [{ translateY: upTranslateY }] },
                      ]}
                    >
                      <Pressable
                        disabled={reorderChevronMoveDisabled.up}
                        style={[
                          styles.floatingButtonPressable,
                          reorderChevronMoveDisabled.up &&
                            styles.reorderChevronPressableDisabled,
                        ]}
                        onPress={() => moveSelectedTodoInReorder("up")}
                      >
                        <Feather
                          name="chevron-up"
                          size={28}
                          color={
                            reorderChevronMoveDisabled.up
                              ? "#9CA3AF"
                              : "#000000"
                          }
                        />
                      </Pressable>
                    </Animated.View>
                  )}

                  {listMenuMode === "edit" && actionSubFabMounted && (
                    <Animated.View
                      style={[
                        styles.subFab,
                        styles.subFabSpacing,
                        { transform: [{ translateY: actionTranslateY }] },
                      ]}
                    >
                      <Pressable
                        style={styles.floatingButtonPressable}
                        onPress={() => {
                          /* TODO: 선택된 할 일 수정 */
                        }}
                      >
                        <EditFabIcon width={28} height={28} />
                      </Pressable>
                    </Animated.View>
                  )}

                  {listMenuMode === "delete" && actionSubFabMounted && (
                    <Animated.View
                      style={[
                        styles.subFab,
                        styles.subFabSpacing,
                        { transform: [{ translateY: actionTranslateY }] },
                      ]}
                    >
                      <Pressable
                        style={styles.floatingButtonPressable}
                        onPress={() => {
                          /* TODO: 선택된 할 일 삭제 */
                        }}
                      >
                        <DeleteFabIcon width={28} height={28} />
                      </Pressable>
                    </Animated.View>
                  )}
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
  /** 헤더(드롭다운)가 리스트 셀보다 위에 그려지도록 VirtualizedList 쪽에도 지정 */
  flatListHeaderWrapper: {
    zIndex: 100,
    elevation: 24,
  },
  listContent: {
    paddingBottom: 90,
  },
  emptyTodosText: {
    marginTop: 14,
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
  },
  fabCluster: {
    position: "absolute",
    bottom: 20,
    right: 20,
    flexDirection: "column-reverse",
    alignItems: "center",
  },
  floatingButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  subFab: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    zIndex: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  subFabSpacing: {
    marginBottom: 12,
  },
  reorderSubFabDisabled: {
    backgroundColor: "#F3F4F6",
    shadowOpacity: 0.08,
    elevation: 2,
  },
  reorderChevronPressableDisabled: {
    opacity: 0.65,
  },
  floatingButtonPressable: {
    width: "100%",
    height: "100%",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
});
