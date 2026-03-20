import { StyleSheet, View } from "react-native";

import { HolidayMap } from "@/lib/holidays-cache";
import type { CalendarCellData, DateMeta } from "@/types/calendar-types";
import { CalendarCell } from "./calendar-cell";

type CalendarWeekRowProps = {
  week: CalendarCellData[];
  holidayMap: HolidayMap;
  dateMetaMap: Record<string, DateMeta>;
  onPressDate?: (
    cell: CalendarCellData,
    layoutInWindow?: { x: number; y: number; width: number; height: number },
  ) => void;
};

export const CalendarWeekRow = ({
  week,
  holidayMap,
  dateMetaMap,
  onPressDate,
}: CalendarWeekRowProps) => {
  return (
    <View style={styles.row}>
      {week.map((cell, index) => (
        <CalendarCell
          key={cell.key}
          cell={cell}
          weekdayIndex={index}
          holiday={holidayMap?.[cell.dateString]}
          dateMeta={dateMetaMap?.[cell.dateString]}
          onPress={onPressDate}
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
