import { Pressable, StyleSheet, Text, View } from "react-native";

import { HolidayItem } from "@/lib/api/holidays";
import type { CalendarCellData } from "@/lib/calendar/calendar-types";

type CalendarCellProps = {
  cell: CalendarCellData;
  weekdayIndex: number;
  onPress?: (dateString: string) => void;
  holiday?: HolidayItem;
};

export const CalendarCell = ({
  cell,
  weekdayIndex,
  onPress,
  holiday,
}: CalendarCellProps) => {
  const handlePress = () => {
    onPress?.(cell.dateString);
  };

  const isSunday = weekdayIndex === 0;
  const isWeekday = weekdayIndex > 0 && weekdayIndex < 6;
  const isSaturday = weekdayIndex === 6;
  const isHoliday = !!holiday?.isHoliday;

  return (
    <Pressable
      style={[styles.cell, cell.isSelected && styles.isSelectedCell]}
      onPress={handlePress}
    >
      <View
        style={[
          styles.dayBadge,
          cell.isToday && (isSunday || isHoliday) && styles.todaySundayBadge,
          cell.isToday && isWeekday && !isHoliday && styles.todayWeekDayBadge,
          cell.isToday && isSaturday && !isHoliday && styles.todaySaturDayBadge,
        ]}
      >
        <Text
          style={[
            styles.dayText,
            (isSunday || isHoliday) && styles.sundayText,
            isWeekday && !isHoliday && styles.weekdayText,
            isSaturday && !isHoliday && styles.saturdayText,
            !cell.inCurrentMonth && styles.outsideMonthText,
            cell.isToday && styles.todayText,
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
  dayBadge: {
    width: 25,
    height: 25,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 3,
    paddingBottom: 0.5,
  },
  selectedSundayBadge: { backgroundColor: "#DC2626" },
  selectedWeekDayBadge: { backgroundColor: "#111827" },
  selectedSaturDayBadge: { backgroundColor: "#2563EB" },
  todaySundayBadge: {
    borderWidth: 1,
    borderColor: "#DC2626",
    backgroundColor: "#DC2626",
  },
  todayWeekDayBadge: {
    borderWidth: 1,
    borderColor: "#000000",
    backgroundColor: "#000000",
  },
  todaySaturDayBadge: {
    borderWidth: 1,
    borderColor: "#2563EB",
    backgroundColor: "#2563EB",
  },
  dayText: {
    fontSize: 12,
    fontWeight: "500",
  },
  todayText: {
    color: "#FFFFFF",
  },
  sundayText: {
    color: "#DC2626",
  },
  weekdayText: {
    color: "#374151",
  },
  saturdayText: {
    color: "#2563EB",
  },
  outsideMonthText: {
    color: "#C7CDD6",
  },
  holidayLabel: {
    fontSize: 8,
    fontWeight: "500",
    color: "#DC2626",
  },
});
