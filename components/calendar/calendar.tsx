import { useMemo, useRef, useState } from "react";
import {
  PanResponder,
  StyleSheet,
  View,
  type GestureResponderEvent,
  type PanResponderGestureState,
} from "react-native";

import type { CalendarCellData } from "@/lib/calendar/calendar-types";
import { HolidayMap } from "@/lib/holidays-cache";
import { CalendarGrid } from "./calendar-grid";
import { CalendarMonthHeader } from "./calendar-month-header";
import { CalendarWeekdayHeader } from "./calendar-weekday-header";

type CalendarProps = {
  initialYear: number;
  initialMonth: number;
  selectedDate?: string;
  onPressDate?: (
    dateString: string,
    layoutInWindow?: { x: number; y: number; width: number; height: number },
  ) => void;
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

  const visibleSelectedDate = useMemo(() => {
    return selectedDate;
  }, [selectedDate]);

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
    const newMonth = clicked.getMonth() + 1; // Calendar는 1~12 사용

    setCurrentYear(newYear);
    setCurrentMonth(newMonth);
    onPressDate?.(cell.dateString, layoutInWindow);
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (
        _e: GestureResponderEvent,
        gestureState: PanResponderGestureState,
      ) => {
        const { dx, dy } = gestureState;
        // 가로 스와이프가 세로보다 크고, 일정 이상 움직였을 때만
        return Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy);
      },
      onPanResponderRelease: (
        _e: GestureResponderEvent,
        gestureState: PanResponderGestureState,
      ) => {
        const { dx } = gestureState;
        const threshold = 40;

        if (dx > threshold) {
          // 오른쪽으로 스와이프 → 이전 달
          handlePressPrevMonth();
        } else if (dx < -threshold) {
          // 왼쪽으로 스와이프 → 다음 달
          handlePressNextMonth();
        }
      },
    }),
  ).current;

  return (
    <View style={styles.container}>
      <CalendarMonthHeader
        year={currentYear}
        month={currentMonth}
        onPressPrevMonth={handlePressPrevMonth}
        onPressNextMonth={handlePressNextMonth}
      />

      <CalendarWeekdayHeader />

      <View {...panResponder.panHandlers}>
        <CalendarGrid
          year={currentYear}
          month={currentMonth}
          selectedDate={visibleSelectedDate}
          onPressDate={handlePressDate}
          holidayMap={holidayMap}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: 10,
  },
});
