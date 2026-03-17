import { StyleSheet, View } from "react-native";

import { buildMonthCells, chunkMonthCells } from "@/lib/calendar/date-utils";
import { HolidayMap } from "@/lib/holidays-cache";
import type { CalendarCellData } from "@/types/calendar-types";
import { CalendarWeekRow } from "./calendar-week-row";

type CalendarGridProps = {
  year: number;
  month: number;
  selectedDate?: string;
  onPressDate?: (
    cell: CalendarCellData,
    layoutInWindow?: { x: number; y: number; width: number; height: number },
  ) => void;
  holidayMap?: HolidayMap;
};

export const CalendarGrid = ({
  year,
  month,
  selectedDate,
  onPressDate,
  holidayMap,
}: CalendarGridProps) => {
  const monthCells = buildMonthCells(year, month, selectedDate);
  const weeks = chunkMonthCells(monthCells);

  return (
    <View style={styles.container}>
      {weeks.map((week, index) => (
        <CalendarWeekRow
          key={`${year}-${month}-week-${index}`}
          week={week}
          onPressDate={onPressDate}
          holidayMap={holidayMap}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
});
