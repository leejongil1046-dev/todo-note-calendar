import { AppTopBar } from "@/components/app-top-bar";
import { Calendar } from "@/components/calendar/calendar";
import { getKoreaTodayParts } from "@/lib/date/get-korea-today-parts";
import {
  ensureHolidaySeed,
  getHolidayMapForYears,
  HolidayMap,
  refreshHolidayYear,
} from "@/lib/holidays-cache";
import Constants from "expo-constants";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Todo = {
  id: string;
  text: string;
  done: boolean;
};

type TodosByDate = {
  [date: string]: Todo[];
};

const SERVICE_KEY =
  (Constants.expoConfig?.extra?.holidayApiKey as string) ?? "";

const SHOULD_REFRESH_HOLIDAYS = false;

export default function CalendarScreen() {
  const koreaToday = getKoreaTodayParts();

  const [selectedDate, setSelectedDate] = useState(koreaToday.dateString);
  const today = new Date();
  const [holidayMap, setHolidayMap] = useState<HolidayMap | null>(null);
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

      await refreshHolidayYear(currentYear, SERVICE_KEY);
      await refreshHolidayYear(nextYear, SERVICE_KEY);

      const updatedMap = await getHolidayMapForYears(years);
      setHolidayMap(updatedMap);
    };

    load();
  }, []);

  // const todos = todosByDate[selectedDate] ?? [];

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
            onPressDate={(dateString) => {
              setSelectedDate(dateString);
            }}
          />
        </ScrollView>
      </View>
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
});
