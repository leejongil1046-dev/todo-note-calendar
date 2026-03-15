import { Calendar } from "@/components/calendar/calendar";
import { getKoreaTodayParts } from "@/lib/date/get-korea-today-parts";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Todo = {
  id: string;
  text: string;
  done: boolean;
};

type TodosByDate = {
  [date: string]: Todo[];
};

export default function TodoCalendarScreen() {
  const koreaToday = getKoreaTodayParts();

  const [selectedDate, setSelectedDate] = useState(koreaToday.dateString);
  const [todosByDate, setTodosByDate] = useState<TodosByDate>({});
  const [input, setInput] = useState("");

  const todos = todosByDate[selectedDate] ?? [];

  const addTodo = () => {
    if (!input.trim()) return;
    const newTodo: Todo = {
      id: Date.now().toString(),
      text: input.trim(),
      done: false,
    };
    setTodosByDate((prev) => ({
      ...prev,
      [selectedDate]: [...(prev[selectedDate] ?? []), newTodo],
    }));
    setInput("");
  };

  const toggleTodo = (id: string) => {
    setTodosByDate((prev) => ({
      ...prev,
      [selectedDate]: (prev[selectedDate] ?? []).map((t) =>
        t.id === id ? { ...t, done: !t.done } : t,
      ),
    }));
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.container}>
        <Calendar
          initialYear={koreaToday.year}
          initialMonth={koreaToday.month}
          selectedDate={selectedDate}
          onPressDate={(dateString) => {
            setSelectedDate(dateString);
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "white" },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 5,
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
