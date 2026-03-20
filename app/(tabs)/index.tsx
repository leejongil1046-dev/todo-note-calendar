import { AppTopBar } from "@/components/app-top-bar";
import { Calendar } from "@/components/calendar/calendar";
import { DateDetailModal } from "@/components/date-detail-modal";
import { useDateDetailModal } from "@/hooks/date/use-date-detail-modal";
import { buildDateMeta } from "@/lib/calendar/date-utils";
import { getKoreaTodayParts } from "@/lib/date/get-korea-today-parts";
import {
  buildHolidaySeedByYears,
  ensureHolidaySeed,
  getHolidayMapForYears,
  HolidayMap,
} from "@/lib/holidays-cache";
import Constants from "expo-constants";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SERVICE_KEY =
  (Constants.expoConfig?.extra?.holidayApiKey as string) ?? "";

const SHOULD_REFRESH_HOLIDAYS = false;

export default function CalendarScreen() {
  const koreaToday = getKoreaTodayParts();
  const [selectedDate, setSelectedDate] = useState(koreaToday.dateString);
  const [holidayMap, setHolidayMap] = useState<HolidayMap | null>(null);

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
      const years = [2024, 2025, 2026, 2027];

      await ensureHolidaySeed(years);

      const cachedMap = await getHolidayMapForYears(years);
      setHolidayMap(cachedMap);

      if (!SHOULD_REFRESH_HOLIDAYS) return;

      const currentYear = new Date().getFullYear();
      const nextYear = currentYear + 1;

      await buildHolidaySeedByYears([currentYear, nextYear], SERVICE_KEY);
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

      <View style={styles.container}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        >
          <Calendar
            initialYear={koreaToday.year}
            initialMonth={koreaToday.month}
            selectedDate={selectedDate}
            holidayMap={holidayMap ?? undefined}
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
        meta={buildDateMeta(selectedDate, holidayMap)}
        rect={detailRect}
        progress={detailProgress}
        contentOpacity={contentOpacity}
        onRequestClose={closeDetailCard}
        isCardContentMounted={isCardContentMounted}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FFFFFF" },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 5,
    backgroundColor: "#FFFFFF",
  },
});
