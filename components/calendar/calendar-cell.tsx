import React, { useRef } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { HolidayItem } from "@/lib/api/holidays";
import type { CalendarCellData, DateMeta } from "@/types/calendar-types";

type CalendarCellProps = {
  cell: CalendarCellData;
  weekdayIndex: number;
  holiday?: HolidayItem;
  dateMeta?: DateMeta;
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

  // const isSunday = weekdayIndex === 0;
  // const isWeekday = weekdayIndex > 0 && weekdayIndex < 6;
  // const isSaturday = weekdayIndex === 6;
  // const isHoliday = !!holiday?.isHoliday;

  return (
    <Pressable
      ref={ref}
      style={[
        styles.cell,
        cell.isSelected && styles.isSelectedCell,
        !cell.inCurrentMonth && styles.outsideMonthCell,
        // { backgroundColor: dateMeta?.hasTodo ? "yellow" : "white" },
      ]}
      onPress={handlePress}
    >
      <View
        style={[
          styles.dayBadge,
          {
            backgroundColor: !cell.isToday
              ? "#FFFFFF"
              : dateMeta?.dayTone === "red"
                ? "#DC2626"
                : dateMeta?.dayTone === "blue"
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
                : dateMeta?.dayTone === "red"
                  ? "#DC2626"
                  : dateMeta?.dayTone === "blue"
                    ? "#2563EB"
                    : "#000000",
            },
          ]}
        >
          {cell.day}
        </Text>
      </View>
      {holiday && (
        <Text style={styles.holidayLabel} numberOfLines={1}>
          {holiday.name}
        </Text>
      )}
      {(dateMeta?.todoCount ?? 0) > 0 && (
        <View style={styles.hasTodoBadge}></View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cell: {
    width: "14.2857%",
    aspectRatio: 2 / 3,
    alignItems: "center",
    justifyContent: "flex-start",
    borderWidth: 1.5,
    borderRadius: 9,
    borderColor: "rgba(0,0,0,0)",
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
    width: 25,
    height: 25,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 3,
    paddingBottom: 0.5,
  },
  dayText: {
    fontSize: 12,
    fontWeight: "500",
  },
  holidayLabel: {
    fontSize: 8,
    fontWeight: "500",
    color: "#DC2626",
  },
  hasTodoBadge: {
    position: "absolute",
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#0064E0",
    left: "50%",
    marginLeft: -2,
    bottom: "30%",
  },
});
