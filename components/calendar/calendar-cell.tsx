import { Pressable, StyleSheet, Text, View } from "react-native";

import type { CalendarCellData } from "@/lib/calendar/calendar-types";

type CalendarCellProps = {
  cell: CalendarCellData;
  onPress?: (dateString: string) => void;
};

export const CalendarCell = ({ cell, onPress }: CalendarCellProps) => {
  const handlePress = () => {
    onPress?.(cell.dateString);
  };

  return (
    <Pressable style={styles.cell} onPress={handlePress}>
      <View
        style={[
          styles.dayBadge,
          cell.isSelected && styles.selectedDayBadge,
          cell.isToday && styles.todayDayBadge,
        ]}
      >
        <Text
          style={[
            styles.dayText,
            !cell.inCurrentMonth && styles.outsideMonthText,
            cell.isSelected && styles.selectedDayText,
            cell.isToday && !cell.isSelected && styles.todayDayText,
          ]}
        >
          {cell.day}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cell: {
    width: "14.2857%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  dayBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedDayBadge: {
    backgroundColor: "#111827",
  },
  todayDayBadge: {
    borderWidth: 1,
    borderColor: "#9CA3AF",
  },
  dayText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#374151",
  },
  outsideMonthText: {
    color: "#C7CDD6",
  },
  selectedDayText: {
    color: "#FFFFFF",
  },
  todayDayText: {
    color: "#111827",
  },
});
