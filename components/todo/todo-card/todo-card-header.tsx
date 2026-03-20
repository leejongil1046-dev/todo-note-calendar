import Check from "@/assets/images/check.svg";
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
  onPressCard: () => void;
  onPressToggleAll: () => void;
  onPressDelete: () => void;
};

export function TodoCardHeader({
  categoryColor,
  categoryName,
  isAllDone,
  completedCount,
  totalCount,
  expanded,
  onPressCard,
  onPressToggleAll,
  onPressDelete,
}: TodoCardHeaderProps) {
  return (
    <Pressable
      style={[styles.todoCard, { backgroundColor: categoryColor }]}
      onPress={onPressCard}
    >
      <View style={styles.todoHeaderRow}>
        <View style={styles.todoLeft}>
          <Pressable
            style={styles.todoCheckboxWrapper}
            onPress={onPressToggleAll}
          >
            <View style={styles.todoCheckbox}>
              {isAllDone && <Check width={19} height={19} />}
            </View>
          </Pressable>

          <Text style={[styles.todoText, isAllDone && styles.todoTextDone]}>
            {categoryName}
          </Text>
        </View>

        {!expanded ? (
          <Text style={styles.todoCountText}>
            {completedCount} / {totalCount}
          </Text>
        ) : (
          <Pressable style={styles.todoDeleteButton} onPress={onPressDelete}>
            <Delete width={18} height={18} />
          </Pressable>
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
});
