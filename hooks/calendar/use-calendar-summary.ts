import { useCallback, useEffect, useMemo, useState } from "react";

import { buildDateMetaMap, buildMonthCells } from "@/lib/calendar/date-utils";
import { db, initDb } from "@/lib/db/db";
import { getTodoSummaryForDate } from "@/lib/db/todos";

import type { HolidayMap } from "@/lib/holidays-cache";
import type {
    DateMeta,
    TodoSummary,
    TodoSummaryByDate,
} from "@/types/calendar-types";

type UseCalendarSummaryParams = {
  calendarYear: number;
  calendarMonth: number;
  selectedDate: string;
  holidayMap: HolidayMap;
};

type UseCalendarSummaryResult = {
  todoSummaryByDate: TodoSummaryByDate;
  dateMetaMap: Record<string, DateMeta>;
  selectedDateMeta: DateMeta | null;
  handleTodoSummaryChanged: (dateString: string, summary: TodoSummary) => void;
};

export function useCalendarSummary({
  calendarYear,
  calendarMonth,
  selectedDate,
  holidayMap,
}: UseCalendarSummaryParams): UseCalendarSummaryResult {
  const readTodoSummaryByMonth = useCallback(
    (year: number, month: number): TodoSummaryByDate => {
      initDb();

      const next: TodoSummaryByDate = {};
      const cells = buildMonthCells(year, month);

      for (const cell of cells) {
        next[cell.dateString] = getTodoSummaryForDate(db, cell.dateString);
      }

      return next;
    },
    [],
  );

  const [todoSummaryByDate, setTodoSummaryByDate] = useState<TodoSummaryByDate>(
    () => {
      return readTodoSummaryByMonth(calendarYear, calendarMonth);
    },
  );

  const handleTodoSummaryChanged = useCallback(
    (dateString: string, summary: TodoSummary) => {
      setTodoSummaryByDate((prev) => ({
        ...prev,
        [dateString]: summary,
      }));
    },
    [],
  );

  const monthCells = useMemo(() => {
    return buildMonthCells(calendarYear, calendarMonth, selectedDate);
  }, [calendarYear, calendarMonth, selectedDate]);

  useEffect(() => {
    setTodoSummaryByDate(readTodoSummaryByMonth(calendarYear, calendarMonth));
  }, [calendarYear, calendarMonth, readTodoSummaryByMonth]);

  const dateMetaMap = useMemo(() => {
    return buildDateMetaMap(monthCells, holidayMap, todoSummaryByDate);
  }, [monthCells, holidayMap, todoSummaryByDate]);

  const selectedDateMeta = dateMetaMap[selectedDate] ?? null;

  return {
    todoSummaryByDate,
    dateMetaMap,
    selectedDateMeta,
    handleTodoSummaryChanged,
  };
}
