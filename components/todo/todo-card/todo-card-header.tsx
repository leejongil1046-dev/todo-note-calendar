import Check from "@/assets/images/check.svg";
import ChevronDown from "@/assets/images/chevron-down.svg";
import ChevronUp from "@/assets/images/chevron-up.svg";
import Delete from "@/assets/images/delete.svg";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const HEADER_HEIGHT = 50;

type TodoCardHeaderProps = {
  categoryColor: string;
  categoryName: string;
  isAllDone: boolean;
  completedCount: number;
  totalCount: number;
  expanded: boolean;
  isMovingTodo: boolean;
  isMoveMode: boolean;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onPressCard: () => void;
  onPressToggleAll: () => void;
  onPressDelete: () => void;
  onLongPressMove: () => void;
  onPressMoveUp: () => void;
  onPressMoveDown: () => void;
  onPressComplete: () => void;
};

export function TodoCardHeader({
  categoryColor,
  categoryName,
  isAllDone,
  completedCount,
  totalCount,
  expanded,
  isMovingTodo,
  isMoveMode,
  canMoveUp,
  canMoveDown,
  onPressCard,
  onPressToggleAll,
  onPressDelete,
  onLongPressMove,
  onPressMoveUp,
  onPressMoveDown,
  onPressComplete,
}: TodoCardHeaderProps) {
  return (
    <Pressable
      style={[styles.todoCard, { backgroundColor: categoryColor }]}
      onPress={onPressCard}
      onLongPress={onLongPressMove}
      delayLongPress={180}
    >
      <View style={styles.todoHeaderRow}>
        <View style={styles.todoLeft}>
          <Pressable
            style={styles.todoCheckboxWrapper}
            onPress={onPressToggleAll}
            disabled={isMoveMode}
          >
            <View style={styles.todoCheckbox}>
              {isAllDone && <Check width={19} height={19} />}
            </View>
          </Pressable>

          <Text style={[styles.todoText, isAllDone && styles.todoTextDone]}>
            {categoryName}
          </Text>
        </View>

        {isMovingTodo ? (
          <View style={styles.moveActions}>
            <Pressable
              style={[
                styles.moveButton,
                !canMoveUp && styles.moveButtonDisabled,
              ]}
              onPress={onPressMoveUp}
              disabled={!canMoveUp}
            >
              <ChevronUp width={18} height={18} />
            </Pressable>

            <Pressable
              style={[
                styles.moveButton,
                !canMoveDown && styles.moveButtonDisabled,
              ]}
              onPress={onPressMoveDown}
              disabled={!canMoveDown}
            >
              <ChevronDown width={18} height={18} />
            </Pressable>

            <Pressable
              style={[styles.completeButton]}
              onPress={onPressComplete}
            >
              <Text style={[styles.completeButtonText]}>완료</Text>
            </Pressable>
          </View>
        ) : !expanded ? (
          <Text style={styles.todoCountText}>
            {completedCount} / {totalCount}
          </Text>
        ) : (
          <View>
            <Pressable
              style={styles.todoDeleteButton}
              onPress={onPressDelete}
              disabled={isMoveMode}
            >
              <Delete width={18} height={18} />
            </Pressable>
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  todoCard: {
    width: "100%",
    height: HEADER_HEIGHT,
    paddingVertical: 15,
    paddingLeft: 20,
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
    marginRight: 20,
  },
  todoDeleteButton: {
    width: 30,
    height: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  moveActions: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
    gap: 6,
  },
  moveButton: {
    width: 30,
    height: 30,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  moveButtonDisabled: {
    backgroundColor: "#F3F4F6",
  },
  moveButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#111827",
  },
  completeButton: {
    minWidth: 36,
    height: 26,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  completeButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#111827",
  },
});
