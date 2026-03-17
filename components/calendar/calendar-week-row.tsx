import { StyleSheet, View } from "react-native";

import { HolidayMap } from "@/lib/holidays-cache";
import type { CalendarCellData } from "@/types/calendar-types";
import { CalendarCell } from "./calendar-cell";

type CalendarWeekRowProps = {
  week: CalendarCellData[];
  onPressDate?: (
    cell: CalendarCellData,
    layoutInWindow?: { x: number; y: number; width: number; height: number },
  ) => void;
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
