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

export type DateMeta = {
  dateString: string; // "YYYY-MM-DD"
  year: number;
  month: number;
  day: number;
  weekdayLabel: string; // "일" ~ "토"
  isToday: boolean;
  isHoliday: boolean;
  holidayName?: string;
};
