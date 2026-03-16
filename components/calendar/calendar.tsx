import { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";

import type { CalendarCellData } from "@/lib/calendar/calendar-types";
import { HolidayMap } from "@/lib/holidays-cache";
import { CalendarGrid } from "./calendar-grid";
import { CalendarMonthHeader } from "./calendar-month-header";
import { CalendarWeekdayHeader } from "./calendar-weekday-header";

type CalendarProps = {
  initialYear: number;
  initialMonth: number;
  selectedDate?: string;
  onPressDate?: (dateString: string) => void;
  holidayMap?: HolidayMap;
};

export const Calendar = ({
  initialYear,
  initialMonth,
  selectedDate,
  onPressDate,
  holidayMap,
}: CalendarProps) => {
  const [currentYear, setCurrentYear] = useState(initialYear);
  const [currentMonth, setCurrentMonth] = useState(initialMonth);

  const handlePressPrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentYear((prev) => prev - 1);
      setCurrentMonth(12);
      return;
    }

    setCurrentMonth((prev) => prev - 1);
  };

  const handlePressNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentYear((prev) => prev + 1);
      setCurrentMonth(1);
      return;
    }

    setCurrentMonth((prev) => prev + 1);
  };

  const visibleSelectedDate = useMemo(() => {
    return selectedDate;
  }, [selectedDate]);

  const handlePressDate = (cell: CalendarCellData) => {
    if (cell.inCurrentMonth) {
      onPressDate?.(cell.dateString);
      return;
    }

    const clicked = new Date(`${cell.dateString}T00:00:00`);
    const newYear = clicked.getFullYear();
    const newMonth = clicked.getMonth() + 1; // Calendar는 1~12 사용

    setCurrentYear(newYear);
    setCurrentMonth(newMonth);
    onPressDate?.(cell.dateString);
  };

  return (
    <View style={styles.container}>
      <CalendarMonthHeader
        year={currentYear}
        month={currentMonth}
        onPressPrevMonth={handlePressPrevMonth}
        onPressNextMonth={handlePressNextMonth}
      />

      <CalendarWeekdayHeader />

      <CalendarGrid
        year={currentYear}
        month={currentMonth}
        selectedDate={visibleSelectedDate}
        onPressDate={handlePressDate}
        holidayMap={holidayMap}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: 10,
  },
});
