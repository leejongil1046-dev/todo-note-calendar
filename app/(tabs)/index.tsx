import { AppTopBar } from "@/components/app-top-bar";
import { Calendar } from "@/components/calendar/calendar";
import { DateDetailModal } from "@/components/date-detail-modal";
import { useDateDetailModal } from "@/hooks/date/use-date-detail-modal";
import { buildDateMetaMap, buildMonthCells } from "@/lib/calendar/date-utils";
import { getKoreaTodayParts } from "@/lib/date/get-korea-today-parts";
import { db, initDb } from "@/lib/db/db";
import { getTodoCountForDate } from "@/lib/db/todos";
import { buildHolidayMapFromSeedYears } from "@/lib/holiday";
import { buildHolidaySeedByYears, HolidayMap } from "@/lib/holidays-cache";
import type { TodoCountByDate } from "@/types/calendar-types";
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
  const [todoCountByDate, setTodoCountByDate] = useState<TodoCountByDate>(
    () => {
      // 첫 화면(오늘 기준 월)을 열자마자 DB에서 todo 개수 반영.
      initDb();

      const next: TodoCountByDate = {};
      const cells = buildMonthCells(koreaToday.year, koreaToday.month);

      for (const cell of cells) {
        next[cell.dateString] = getTodoCountForDate(db, cell.dateString);
      }

      return next;
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

  const handleTodoCountChanged = useCallback(
    (dateString: string, count: number) => {
      setTodoCountByDate((prev) => {
        if (prev[dateString] === count) return prev;

        return {
          ...prev,
          [dateString]: count,
        };
      });
    },
    [],
  );

  const monthCells = useMemo(() => {
    return buildMonthCells(calendarYear, calendarMonth, selectedDate);
  }, [calendarYear, calendarMonth, selectedDate]);

  useEffect(() => {
    // 캘린더가 다른 달로 전환될 때, 해당 월의 hasTodo/todoCount도 DB 기준으로 다시 채운다.
    // (modal은 meta 자체가 있는지만 중요하지만, 배지/색상까지 정확히 보이게 하기 위함)
    initDb();

    const next: TodoCountByDate = {};
    const cells = buildMonthCells(calendarYear, calendarMonth);
    for (const cell of cells) {
      next[cell.dateString] = getTodoCountForDate(db, cell.dateString);
    }

    setTodoCountByDate(next);
  }, [calendarYear, calendarMonth]);

  const dateMetaMap = useMemo(() => {
    return buildDateMetaMap(monthCells, holidayMap, todoCountByDate);
  }, [monthCells, holidayMap, todoCountByDate]);

  // console.log(JSON.stringify(dateMetaMap, null, 2));

  const selectedDateMeta = dateMetaMap[selectedDate] ?? null;

  // console.log(selectedDate);

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
        onTodoCountChanged={handleTodoCountChanged}
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
