export type CalendarCellData = {
  key: string;
  dateString: string;
  year: number;
  month: number;
  day: number;
  inCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
};

export type DayTone = "red" | "blue" | "default";

export type TodoCountByDate = Record<string, number>;

export type DateMeta = {
  dateString: string; // "YYYY-MM-DD"
  year: number;
  month: number;
  day: number;
  weekdayIndex: number;
  weekdayLabel: string; // "일" ~ "토"

  isToday: boolean;

  isHoliday: boolean;
  holidayName?: string;

  dayTone: DayTone;

  hasTodo: boolean;
  todoCount: number;
};
