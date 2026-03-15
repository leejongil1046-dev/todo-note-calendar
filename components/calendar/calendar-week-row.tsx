import { StyleSheet, View } from "react-native";

import type { CalendarCellData } from "@/lib/calendar/calendar-types";

import { CalendarCell } from "./calendar-cell";

type CalendarWeekRowProps = {
  week: CalendarCellData[];
  onPressDate?: (dateString: string) => void;
};

export const CalendarWeekRow = ({
  week,
  onPressDate,
}: CalendarWeekRowProps) => {
  return (
    <View style={styles.row}>
      {week.map((cell) => (
        <CalendarCell key={cell.key} cell={cell} onPress={onPressDate} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
  },
});
