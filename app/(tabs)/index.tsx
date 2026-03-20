import { AppTopBar } from "@/components/app-top-bar";
import { Calendar } from "@/components/calendar/calendar";
import { CalendarMonthHeader } from "@/components/calendar/calendar-month-header";
import { CalendarWeekdayHeader } from "@/components/calendar/calendar-weekday-header";
import { DateDetailModal } from "@/components/date-detail-modal";
import { useCalendarCursor } from "@/hooks/calendar/use-calendar-cursor";
import { useCalendarSummary } from "@/hooks/calendar/use-calendar-summary";
import { useDateDetailModal } from "@/hooks/date/use-date-detail-modal";
import { getKoreaTodayParts } from "@/lib/date/get-korea-today-parts";
import { buildHolidayMapFromSeedYears } from "@/lib/holiday";
import { buildHolidaySeedByYears, HolidayMap } from "@/lib/holidays-cache";

import Constants from "expo-constants";
import React, { useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SERVICE_KEY =
  (Constants.expoConfig?.extra?.holidayApiKey as string) ?? "";

const SHOULD_REFRESH_HOLIDAYS = false;
const HOLIDAY_YEARS = [2024, 2025, 2026, 2027] as const;

export default function CalendarScreen() {
  const koreaToday = getKoreaTodayParts();

  const [selectedDate, setSelectedDate] = useState(koreaToday.dateString);

  const holidayMap = useMemo<HolidayMap>(() => {
    return buildHolidayMapFromSeedYears([...HOLIDAY_YEARS]);
  }, []);

  const {
    calendarYear,
    calendarMonth,
    handleChangeYearMonth,
    handlePressPrevMonth,
    handlePressNextMonth,
  } = useCalendarCursor({
    initialYear: koreaToday.year,
    initialMonth: koreaToday.month,
  });

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
