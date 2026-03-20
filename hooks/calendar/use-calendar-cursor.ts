import { useCallback, useState } from "react";

type UseCalendarCursorParams = {
  initialYear: number;
  initialMonth: number;
};

export const useCalendarCursor = ({
  initialYear,
  initialMonth,
}: UseCalendarCursorParams) => {
  const [calendarYear, setCalendarYear] = useState(initialYear);
  const [calendarMonth, setCalendarMonth] = useState(initialMonth);

  const handleChangeYearMonth = useCallback((year: number, month: number) => {
    setCalendarYear(year);
    setCalendarMonth(month);
  }, []);

  const handlePressPrevMonth = () => {
    if (calendarMonth === 1) {
      handleChangeYearMonth(calendarYear - 1, 12);
      return;
    }

    handleChangeYearMonth(calendarYear, calendarMonth - 1);
  };

  const handlePressNextMonth = () => {
    if (calendarMonth === 12) {
      handleChangeYearMonth(calendarYear + 1, 1);
      return;
    }
    handleChangeYearMonth(calendarYear, calendarMonth + 1);
  };

  return {
    calendarYear,
    calendarMonth,
    handleChangeYearMonth,
    handlePressPrevMonth,
    handlePressNextMonth,
  };
};
