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

export type TodoPreview = {
  categoryName: string;
  categoryColor: string;
};

export type TodoSummary = {
  count: number;
  previews: TodoPreview[];
};

export type TodoSummaryByDate = Record<string, TodoSummary>;

/** 날짜 상세 모달 헤더 메뉴(순서 변경 / 수정 / 삭제) 활성 모드 */
export type DateDetailListMenuMode = "none" | "reorder" | "edit" | "delete";

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
  todoPreviews: TodoPreview[];
};
