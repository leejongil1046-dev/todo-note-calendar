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

const EMPTY_TODO_SUMMARY_BY_DATE: TodoSummaryByDate = {};

function buildMonthKey(year: number, month: number): string {
  return `${year}-${String(month).padStart(2, "0")}`;
}

function monthKeyFromDateString(dateString: string): string | null {
  const parts = dateString.split("-");
  if (parts.length < 2) return null;
  const y = Number(parts[0]);
  const m = Number(parts[1]);
  if (!Number.isFinite(y) || !Number.isFinite(m)) return null;
  return buildMonthKey(y, m);
}

type UseCalendarSummaryParams = {
  calendarYear: number;
  calendarMonth: number;
  selectedDate: string;
  holidayMap: HolidayMap;
};

type UseCalendarSummaryResult = {
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

  const [monthlyTodoSummaryByDate, setMonthlyTodoSummaryByDate] = useState<
    Record<string, TodoSummaryByDate>
  >(() => {
    const key = buildMonthKey(calendarYear, calendarMonth);
    return { [key]: readTodoSummaryByMonth(calendarYear, calendarMonth) };
  });

  const currentMonthKey = useMemo(
    () => buildMonthKey(calendarYear, calendarMonth),
    [calendarYear, calendarMonth],
  );

  const todoSummaryByDate =
    monthlyTodoSummaryByDate[currentMonthKey] ?? EMPTY_TODO_SUMMARY_BY_DATE;

  const handleTodoSummaryChanged = useCallback(
    (dateString: string, summary: TodoSummary) => {
      const key = monthKeyFromDateString(dateString);
      if (!key) return;

      setMonthlyTodoSummaryByDate((prev) => {
        const existing = prev[key];
        if (!existing) return prev;

        return {
          ...prev,
          [key]: {
            ...existing,
            [dateString]: summary,
          },
        };
      });
    },
    [],
  );

  const monthCells = useMemo(() => {
    return buildMonthCells(calendarYear, calendarMonth, selectedDate);
  }, [calendarYear, calendarMonth, selectedDate]);

  useEffect(() => {
    const key = buildMonthKey(calendarYear, calendarMonth);
    setMonthlyTodoSummaryByDate((prev) => {
      if (prev[key]) return prev;
      return {
        ...prev,
        [key]: readTodoSummaryByMonth(calendarYear, calendarMonth),
      };
    });
  }, [calendarYear, calendarMonth, readTodoSummaryByMonth]);

  const dateMetaMap = useMemo(() => {
    return buildDateMetaMap(monthCells, holidayMap, todoSummaryByDate);
  }, [monthCells, holidayMap, todoSummaryByDate]);

  const selectedDateMeta = dateMetaMap[selectedDate] ?? null;

  return {
    dateMetaMap,
    selectedDateMeta,
    handleTodoSummaryChanged,
  };
}
