import { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

import { HolidayMap } from "@/lib/holidays-cache";
import type { CalendarCellData, DateMeta } from "@/types/calendar-types";
import { CalendarGrid } from "./calendar-grid";
import { CalendarMonthHeader } from "./calendar-month-header";
import { CalendarWeekdayHeader } from "./calendar-weekday-header";

type CalendarProps = {
  initialYear: number;
  initialMonth: number;
  selectedDate?: string;
  holidayMap?: HolidayMap;
  dateMetaMap?: Record<string, DateMeta>;
  onPressDate?: (
    dateString: string,
    layoutInWindow?: { x: number; y: number; width: number; height: number },
  ) => void;
};

export const Calendar = ({
  initialYear,
  initialMonth,
  selectedDate,
  holidayMap,
  dateMetaMap,
  onPressDate,
}: CalendarProps) => {
  const [currentYear, setCurrentYear] = useState(initialYear);
  const [currentMonth, setCurrentMonth] = useState(initialMonth);

  const handlePressPrevMonth = () => {
    setCurrentMonth((prevMonth) => {
      if (prevMonth === 1) {
        setCurrentYear((prevYear) => prevYear - 1);
        return 12;
      }
      return prevMonth - 1;
    });
  };

  const handlePressNextMonth = () => {
    setCurrentMonth((prevMonth) => {
      if (prevMonth === 12) {
        setCurrentYear((prevYear) => prevYear + 1);
        return 1;
      }
      return prevMonth + 1;
    });
  };

  const visibleSelectedDate = useMemo(() => selectedDate, [selectedDate]);

  const handlePressDate = (
    cell: CalendarCellData,
    layoutInWindow?: { x: number; y: number; width: number; height: number },
  ) => {
    if (cell.inCurrentMonth) {
      onPressDate?.(cell.dateString, layoutInWindow);
      return;
    }

    const clicked = new Date(`${cell.dateString}T00:00:00`);
    const newYear = clicked.getFullYear();
    const newMonth = clicked.getMonth() + 1;

    setCurrentYear(newYear);
    setCurrentMonth(newMonth);
    onPressDate?.(cell.dateString, layoutInWindow);
  };

  const handleSwipeEnd = (translationX: number) => {
    const threshold = 40;

    if (translationX > threshold) {
      handlePressNextMonth();
    } else if (translationX < -threshold) {
      handlePressPrevMonth();
    }
  };

  const panGesture = Gesture.Pan()
    .runOnJS(true)
    .activeOffsetX([-10, 10])
    .failOffsetY([-10, 10])
    .maxPointers(1)
    .onEnd((event) => {
      handleSwipeEnd(event.translationX);
    });

  return (
    <View style={styles.container}>
      <CalendarMonthHeader
        year={currentYear}
        month={currentMonth}
        onPressPrevMonth={handlePressPrevMonth}
        onPressNextMonth={handlePressNextMonth}
      />

      <CalendarWeekdayHeader />

      <GestureDetector gesture={panGesture}>
        <View>
          <CalendarGrid
            year={currentYear}
            month={currentMonth}
            selectedDate={visibleSelectedDate}
            holidayMap={holidayMap}
            dateMetaMap={dateMetaMap}
            onPressDate={handlePressDate}
          />
        </View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: 10,
  },
});
