import { AppTopBar } from "@/components/app-top-bar";
import { Calendar } from "@/components/calendar/calendar";
import { DateDetailModal } from "@/components/date-detail-modal";
import { useDateDetailModal } from "@/hooks/date/use-date-detail-modal";
import { buildDateMetaMap, buildMonthCells } from "@/lib/calendar/date-utils";
import { getKoreaTodayParts } from "@/lib/date/get-korea-today-parts";
import { db, initDb } from "@/lib/db/db";
import { getTodoSummaryForDate } from "@/lib/db/todos";
import { buildHolidayMapFromSeedYears } from "@/lib/holiday";
import { buildHolidaySeedByYears, HolidayMap } from "@/lib/holidays-cache";
import type { TodoSummary, TodoSummaryByDate } from "@/types/calendar-types";
import Constants from "expo-constants";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SERVICE_KEY =
  (Constants.expoConfig?.extra?.holidayApiKey as string) ?? "";

const SHOULD_REFRESH_HOLIDAYS = false;
const HOLIDAY_YEARS = [2024, 2025, 2026, 2027] as const;

export default function CalendarScreen() {
  const koreaToday = getKoreaTodayParts();

  const [selectedDate, setSelectedDate] = useState(koreaToday.dateString);
  const [calendarYear, setCalendarYear] = useState(koreaToday.year);
  const [calendarMonth, setCalendarMonth] = useState(koreaToday.month);

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
      return readTodoSummaryByMonth(koreaToday.year, koreaToday.month);
    },
  );

  const holidayMap = useMemo<HolidayMap>(() => {
    return buildHolidayMapFromSeedYears([...HOLIDAY_YEARS]);
  }, []);

  const {
    isDateCardOpen,
    isCardContentMounted,
    detailRect,
    detailProgress,
    contentOpacity,
    openDetailCard,
    closeDetailCard,
  } = useDateDetailModal();

  useEffect(() => {
    const load = async () => {
      if (!SHOULD_REFRESH_HOLIDAYS) return;

      const seed = await buildHolidaySeedByYears([2026, 2027], SERVICE_KEY);
      console.log(JSON.stringify(seed, null, 2));
    };

    load();
  }, []);

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

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <AppTopBar
        title="캘린더"
        onPressMenu={() => {
          /* 사이드 메뉴 열기 */
        }}
        onPressSearch={() => {
          /* 검색 화면 열기 */
        }}
        onPressMore={() => {
          /* 캘린더 전용 메뉴 */
        }}
      />

      <View style={styles.container}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        >
          <Calendar
            currentYear={calendarYear}
            currentMonth={calendarMonth}
            onChangeYearMonth={(year, month) => {
              setCalendarYear(year);
              setCalendarMonth(month);
            }}
            selectedDate={selectedDate}
            holidayMap={holidayMap}
            dateMetaMap={dateMetaMap}
            onPressDate={(dateString, layout) => {
              if (dateString === selectedDate && layout) {
                openDetailCard(layout);
                return;
              }

              setSelectedDate(dateString);
            }}
          />
        </ScrollView>
      </View>

      <DateDetailModal
        visible={isDateCardOpen}
        meta={selectedDateMeta}
        rect={detailRect}
        progress={detailProgress}
        contentOpacity={contentOpacity}
        onRequestClose={closeDetailCard}
        isCardContentMounted={isCardContentMounted}
        onTodoSummaryChanged={handleTodoSummaryChanged}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 5,
    backgroundColor: "#FFFFFF",
  },
});
