import React, { useMemo, useRef } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { HolidayItem } from "@/lib/api/holidays";
import type { CalendarCellData, DateMeta } from "@/types/calendar-types";

type CalendarCellProps = {
  cell: CalendarCellData;
  weekdayIndex: number;
  holiday: HolidayItem;
  dateMeta: DateMeta;
  onPress?: (
    cell: CalendarCellData,
    layoutInWindow?: { x: number; y: number; width: number; height: number },
  ) => void;
};

export const CalendarCell = ({
  cell,
  weekdayIndex,
  holiday,
  dateMeta,
  onPress,
}: CalendarCellProps) => {
  const ref = useRef<View | null>(null);

  const maxVisiblePreviewCount = dateMeta.isHoliday ? 2 : 3;

  const visiblePreviews = useMemo(() => {
    return dateMeta.todoPreviews.slice(0, maxVisiblePreviewCount);
  }, [dateMeta.todoPreviews, maxVisiblePreviewCount]);

  const extraTodoCount = Math.max(
    0,
    dateMeta.todoCount - maxVisiblePreviewCount,
  );

  const handlePress = () => {
    if (!onPress) return;

    if (ref.current?.measureInWindow) {
      ref.current.measureInWindow((x, y, width, height) => {
        onPress(cell, { x, y, width, height });
      });
      return;
    }

    onPress(cell);
  };

  return (
    <Pressable
      ref={ref}
      style={[
        styles.cell,
        cell.isSelected && styles.isSelectedCell,
        !cell.inCurrentMonth && styles.outsideMonthCell,
      ]}
      onPress={handlePress}
    >
      <View
        style={[
          styles.dayBadge,
          {
            backgroundColor: !cell.isToday
              ? "#FFFFFF"
              : dateMeta.dayTone === "red"
                ? "#DC2626"
                : dateMeta.dayTone === "blue"
                  ? "#2563EB"
                  : "#000000",
          },
        ]}
      >
        <Text
          style={[
            styles.dayText,
            {
              color: cell.isToday
                ? "#FFFFFF"
                : dateMeta.dayTone === "red"
                  ? "#DC2626"
                  : dateMeta.dayTone === "blue"
                    ? "#2563EB"
                    : "#000000",
            },
          ]}
        >
          {cell.day}
        </Text>
      </View>

      <View style={styles.todoContainer}>
        {holiday && (
          <View style={[styles.todoRow, styles.holidayCard]}>
            <Text style={styles.holidayLabel} numberOfLines={1}>
              {holiday.name}
            </Text>
          </View>
        )}

        {visiblePreviews.map((preview, index) => (
          <View
            style={[styles.todoRow, { backgroundColor: preview.categoryColor }]}
            key={`${preview.categoryName}-${preview.categoryColor}-${index}`}
          >
            <Text style={styles.todoPreviewText} numberOfLines={1}>
              {preview.categoryName}
            </Text>
          </View>
        ))}

        {extraTodoCount > 0 && (
          <View style={[styles.todoRow, styles.moreTodoCard]}>
            <Text style={styles.moreTodoText}>외 {extraTodoCount}개</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cell: {
    width: "14.2857%",
    aspectRatio: 1 / 2,
    alignItems: "center",
    justifyContent: "flex-start",
    borderWidth: 1.5,
    borderRadius: 9,
    borderColor: "transparent",
  },
  isSelectedCell: {
    borderWidth: 1.5,
    borderRadius: 9,
    borderColor: "#CCCCCC",
  },
  outsideMonthCell: {
    opacity: 0.2,
  },
  dayBadge: {
    width: 20,
    height: 20,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 0.5,
    marginTop: 3,
    marginBottom: 3,
  },
  dayText: {
    fontSize: 12,
    fontWeight: "500",
  },
  todoContainer: {
    width: "100%",
    alignItems: "center",
    gap: 3,
  },
  todoRow: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 1.5,
    borderRadius: 5,
  },
  holidayCard: {
    backgroundColor: "#FEECEC",
  },
  holidayLabel: {
    fontSize: 9,
    fontWeight: "400",
    color: "#DC2626",
  },
  todoPreviewText: {
    fontSize: 9,
    fontWeight: "400",
    color: "#000000",
  },
  moreTodoCard: {
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
  },
  moreTodoText: {
    fontSize: 8,
    fontWeight: "400",
    color: "#374151",
  },
});
