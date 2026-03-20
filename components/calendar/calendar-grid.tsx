import { StyleSheet, View } from "react-native";

import { buildMonthCells, chunkMonthCells } from "@/lib/calendar/date-utils";
import { HolidayMap } from "@/lib/holidays-cache";
import type { CalendarCellData, DateMeta } from "@/types/calendar-types";
import { CalendarWeekRow } from "./calendar-week-row";

type CalendarGridProps = {
  year: number;
  month: number;
  selectedDate: string;
  holidayMap: HolidayMap;
  dateMetaMap: Record<string, DateMeta>;
  onPressDate?: (
    cell: CalendarCellData,
    layoutInWindow?: { x: number; y: number; width: number; height: number },
  ) => void;
};

export const CalendarGrid = ({
  year,
  month,
  selectedDate,
  holidayMap,
  dateMetaMap,
  onPressDate,
}: CalendarGridProps) => {
  const monthCells = buildMonthCells(year, month, selectedDate);
  const weeks = chunkMonthCells(monthCells);

  return (
    <View style={styles.container}>
      {weeks.map((week, index) => (
        <CalendarWeekRow
          key={`${year}-${month}-week-${index}`}
          week={week}
          holidayMap={holidayMap}
          dateMetaMap={dateMetaMap}
          onPressDate={onPressDate}
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
