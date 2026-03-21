import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

import { HolidayMap } from "@/lib/holidays-cache";
import type { CalendarCellData, DateMeta } from "@/types/calendar-types";
import { CalendarGrid } from "./calendar-grid";

type CalendarProps = {
  currentYear: number;
  currentMonth: number;
  selectedDate: string;
  holidayMap: HolidayMap;
  dateMetaMap: Record<string, DateMeta>;
  onChangeYearMonth: (year: number, month: number) => void;
  onSwipePrevMonth: () => void;
  onSwipeNextMonth: () => void;
  onPressDate?: (
    dateString: string,
    layoutInWindow?: { x: number; y: number; width: number; height: number },
  ) => void;
};

export const Calendar = ({
  currentYear,
  currentMonth,
  selectedDate,
  holidayMap,
  dateMetaMap,
  onChangeYearMonth,
  onSwipePrevMonth,
  onSwipeNextMonth,
  onPressDate,
}: CalendarProps) => {
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

    onChangeYearMonth(newYear, newMonth);
    onPressDate?.(cell.dateString, layoutInWindow);
  };

  const handleSwipeEnd = (translationX: number) => {
    const threshold = 40;

    if (translationX > threshold) {
      onSwipePrevMonth();
    } else if (translationX < -threshold) {
      onSwipeNextMonth();
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
  },
});
