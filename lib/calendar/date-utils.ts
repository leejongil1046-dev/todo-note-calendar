import type { CalendarCellData } from "./calendar-types";

export const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month, 0).getDate();
};

export const getFirstDayOfMonth = (year: number, month: number) => {
  return new Date(year, month - 1, 1).getDay();
};

export const getLeadingCellCount = (year: number, month: number) => {
  return getFirstDayOfMonth(year, month);
};

export const getPrevYearMonth = (year: number, month: number) => {
  if (month === 1) {
    return {
      year: year - 1,
      month: 12,
    };
  }

  return {
    year,
    month: month - 1,
  };
};

export const getNextYearMonth = (year: number, month: number) => {
  if (month === 12) {
    return {
      year: year + 1,
      month: 1,
    };
  }

  return {
    year,
    month: month + 1,
  };
};

const padZero = (value: number) => {
  return String(value).padStart(2, "0");
};

export const formatDateString = (year: number, month: number, day: number) => {
  return `${year}-${padZero(month)}-${padZero(day)}`;
};

export const getTodayDateString = () => {
  const today = new Date();

  return formatDateString(
    today.getFullYear(),
    today.getMonth() + 1,
    today.getDate(),
  );
};

export const buildCurrentMonthCells = (
  year: number,
  month: number,
  selectedDate?: string,
) => {
  const daysInMonth = getDaysInMonth(year, month);
  const todayDateString = getTodayDateString();

  const cells: CalendarCellData[] = [];

  for (let day = 1; day <= daysInMonth; day += 1) {
    const dateString = formatDateString(year, month, day);

    cells.push({
      key: dateString,
      dateString,
      year,
      month,
      day,
      inCurrentMonth: true,
      isToday: dateString === todayDateString,
      isSelected: dateString === selectedDate,
    });
  }

  return cells;
};

export const buildLeadingMonthCells = (
  year: number,
  month: number,
  selectedDate?: string,
) => {
  const leadingCount = getLeadingCellCount(year, month);

  if (leadingCount === 0) {
    return [];
  }

  const prevYearMonth = getPrevYearMonth(year, month);
  const prevMonthDays = getDaysInMonth(prevYearMonth.year, prevYearMonth.month);
  const todayDateString = getTodayDateString();

  const cells: CalendarCellData[] = [];
  const startDay = prevMonthDays - leadingCount + 1;

  for (let day = startDay; day <= prevMonthDays; day += 1) {
    const dateString = formatDateString(
      prevYearMonth.year,
      prevYearMonth.month,
      day,
    );

    cells.push({
      key: dateString,
      dateString,
      year: prevYearMonth.year,
      month: prevYearMonth.month,
      day,
      inCurrentMonth: false,
      isToday: dateString === todayDateString,
      isSelected: dateString === selectedDate,
    });
  }

  return cells;
};

export const buildTrailingMonthCells = (
  year: number,
  month: number,
  selectedDate?: string,
) => {
  const leadingCells = buildLeadingMonthCells(year, month, selectedDate);
  const currentMonthCells = buildCurrentMonthCells(year, month, selectedDate);

  const trailingCount = 42 - (leadingCells.length + currentMonthCells.length);

  if (trailingCount <= 0) {
    return [];
  }

  const nextYearMonth = getNextYearMonth(year, month);
  const todayDateString = getTodayDateString();

  const cells: CalendarCellData[] = [];

  for (let day = 1; day <= trailingCount; day += 1) {
    const dateString = formatDateString(
      nextYearMonth.year,
      nextYearMonth.month,
      day,
    );

    cells.push({
      key: dateString,
      dateString,
      year: nextYearMonth.year,
      month: nextYearMonth.month,
      day,
      inCurrentMonth: false,
      isToday: dateString === todayDateString,
      isSelected: dateString === selectedDate,
    });
  }

  return cells;
};
