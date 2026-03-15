import { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";

import { CalendarGrid } from "./calendar-grid";
import { CalendarMonthHeader } from "./calendar-month-header";
import { CalendarWeekdayHeader } from "./calendar-weekday-header";

type CalendarProps = {
  initialYear: number;
  initialMonth: number;
  selectedDate?: string;
  onPressDate?: (dateString: string) => void;
};

export const Calendar = ({
  initialYear,
  initialMonth,
  selectedDate,
  onPressDate,
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
        onPressDate={onPressDate}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
});
