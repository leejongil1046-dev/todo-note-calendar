import { StyleSheet, View } from "react-native";

import { buildMonthCells, chunkMonthCells } from "@/lib/calendar/date-utils";

import { CalendarWeekRow } from "./calendar-week-row";

type CalendarGridProps = {
  year: number;
  month: number;
  selectedDate?: string;
  onPressDate?: (dateString: string) => void;
};

export const CalendarGrid = ({
  year,
  month,
  selectedDate,
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
