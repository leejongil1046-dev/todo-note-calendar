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
