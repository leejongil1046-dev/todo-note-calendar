import { AppTopBar } from "@/components/app-top-bar";
import { Calendar } from "@/components/calendar/calendar";
import { DateDetailModal } from "@/components/date-detail-modal";
import { buildDateMeta } from "@/lib/calendar/date-utils";
import { getKoreaTodayParts } from "@/lib/date/get-korea-today-parts";
import {
  buildHolidaySeedByYears,
  ensureHolidaySeed,
  getHolidayMapForYears,
  HolidayMap,
} from "@/lib/holidays-cache";
import Constants from "expo-constants";
import React, { useEffect, useRef, useState } from "react";
import { Animated, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SERVICE_KEY =
  (Constants.expoConfig?.extra?.holidayApiKey as string) ?? "";

const SHOULD_REFRESH_HOLIDAYS = false;

export default function CalendarScreen() {
  const koreaToday = getKoreaTodayParts();

  const [selectedDate, setSelectedDate] = useState(koreaToday.dateString);
  const [holidayMap, setHolidayMap] = useState<HolidayMap | null>(null);
  const [isDateCardOpen, setIsDateCardOpen] = useState(false);
  const [detailRect, setDetailRect] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const detailProgress = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  // const [todosByDate, setTodosByDate] = useState<TodosByDate>({});
  // const [input, setInput] = useState("");

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

  const openDetailCard = (rect: {
    x: number;
    y: number;
    width: number;
    height: number;
  }) => {
    setDetailRect(rect);
    setIsDateCardOpen(true);
    detailProgress.setValue(0);
    contentOpacity.setValue(0);

    Animated.sequence([
      Animated.timing(detailProgress, {
        toValue: 1,
        duration: 220,
        useNativeDriver: false,
      }),
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeDetailCard = () => {
    Animated.sequence([
      Animated.timing(contentOpacity, {
        toValue: 0,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(detailProgress, {
        toValue: 0,
        duration: 180,
        useNativeDriver: false,
      }),
    ]).start(({ finished }) => {
      if (finished) {
        setIsDateCardOpen(false);
        setDetailRect(null);
      }
    });
  };

  // const addTodo = () => {
  //   if (!input.trim()) return;
  //   const newTodo: Todo = {
  //     id: Date.now().toString(),
  //     text: input.trim(),
  //     done: false,
  //   };
  //   setTodosByDate((prev) => ({
  //     ...prev,
  //     [selectedDate]: [...(prev[selectedDate] ?? []), newTodo],
  //   }));
  //   setInput("");
  // };

  // const toggleTodo = (id: string) => {
  //   setTodosByDate((prev) => ({
  //     ...prev,
  //     [selectedDate]: (prev[selectedDate] ?? []).map((t) =>
  //       t.id === id ? { ...t, done: !t.done } : t,
  //     ),
  //   }));
  // };

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
          /* 캘린더 전용 메뉴(예: 보기 설정) */
        }}
      />
      <View style={styles.container}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 24 }} // 필요하면 여유 여백
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
  todoContainer: { flex: 1, padding: 16 },
  dateTitle: { fontSize: 18, fontWeight: "600", marginBottom: 12 },
  inputRow: { flexDirection: "row", gap: 8, marginBottom: 12 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  todoItem: { paddingVertical: 8 },
  todoText: { fontSize: 16 },
  todoDone: { textDecorationLine: "line-through", color: "#9ca3af" },
  emptyText: { color: "#9ca3af" },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 32,
    backgroundColor: "#FFFFFF",
    minHeight: 260,
  },
  modalDateText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
});
