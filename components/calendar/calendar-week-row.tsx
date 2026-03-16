import { StyleSheet, View } from "react-native";

import type { CalendarCellData } from "@/lib/calendar/calendar-types";

import { HolidayMap } from "@/lib/holidays-cache";
import { CalendarCell } from "./calendar-cell";

type CalendarWeekRowProps = {
  week: CalendarCellData[];
  onPressDate?: (cell: CalendarCellData) => void;
  holidayMap?: HolidayMap;
};

export const CalendarWeekRow = ({
  week,
  onPressDate,
  holidayMap,
}: CalendarWeekRowProps) => {
  return (
    <View style={styles.row}>
      {week.map((cell, index) => (
        <CalendarCell
          key={cell.key}
          cell={cell}
          weekdayIndex={index}
          onPress={onPressDate}
          holiday={holidayMap?.[cell.dateString]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#CCCCCC",
  },
});
