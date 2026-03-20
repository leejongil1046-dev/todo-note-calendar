import { AppTopBar } from "@/components/app-top-bar";
import { Calendar } from "@/components/calendar/calendar";
import { CalendarMonthHeader } from "@/components/calendar/calendar-month-header";
import { CalendarWeekdayHeader } from "@/components/calendar/calendar-weekday-header";
import { DateDetailModal } from "@/components/date-detail-modal";
import { useCalendarSummary } from "@/hooks/calendar/use-calendar-summary";
import { useDateDetailModal } from "@/hooks/date/use-date-detail-modal";
import { getKoreaTodayParts } from "@/lib/date/get-korea-today-parts";
import { buildHolidayMapFromSeedYears } from "@/lib/holiday";
import { buildHolidaySeedByYears, HolidayMap } from "@/lib/holidays-cache";

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

  const holidayMap = useMemo<HolidayMap>(() => {
    return buildHolidayMapFromSeedYears([...HOLIDAY_YEARS]);
  }, []);

  const { dateMetaMap, selectedDateMeta, handleTodoSummaryChanged } =
    useCalendarSummary({
      calendarYear,
      calendarMonth,
      selectedDate,
      holidayMap,
    });

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

  const handleChangeYearMonth = useCallback((year: number, month: number) => {
    setCalendarYear(year);
    setCalendarMonth(month);
  }, []);

  const handlePressPrevMonth = () => {
    if (calendarMonth === 1) {
      setCalendarYear(calendarYear - 1);
      setCalendarMonth(12);
      return;
    }

    setCalendarYear(calendarYear);
    setCalendarMonth(calendarMonth - 1);
  };

  const handlePressNextMonth = () => {
    if (calendarMonth === 12) {
      setCalendarYear(calendarYear + 1);
      setCalendarMonth(1);
      return;
    }

    setCalendarYear(calendarYear);
    setCalendarMonth(calendarMonth + 1);
  };

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

      <CalendarMonthHeader
        year={calendarYear}
        month={calendarMonth}
        onPressPrevMonth={handlePressPrevMonth}
        onPressNextMonth={handlePressNextMonth}
      />

      <CalendarWeekdayHeader />

      <View style={styles.container}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        >
          <Calendar
            currentYear={calendarYear}
            currentMonth={calendarMonth}
            selectedDate={selectedDate}
            holidayMap={holidayMap}
            dateMetaMap={dateMetaMap}
            onChangeYearMonth={handleChangeYearMonth}
            onSwipePrevMonth={handlePressPrevMonth}
            onSwipeNextMonth={handlePressNextMonth}
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
