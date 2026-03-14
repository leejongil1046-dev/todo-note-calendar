import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Calendar } from "react-native-calendars";
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
  const today = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'
  const [selectedDate, setSelectedDate] = useState(today);
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
          onDayPress={(day) => setSelectedDate(day.dateString)}
          markedDates={{
            [selectedDate]: { selected: true, selectedColor: "#3b82f6" },
          }}
        />

        {/* <View style={styles.todoContainer}>
        <Text style={styles.dateTitle}>{selectedDate}의 할 일</Text>

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="할 일을 입력하세요"
            value={input}
            onChangeText={setInput}
          />
          <Button title="추가" onPress={addTodo} />
        </View>

        <FlatList
          data={todos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => toggleTodo(item.id)}
              style={styles.todoItem}
            >
              <Text style={[styles.todoText, item.done && styles.todoDone]}>
                {item.text}
              </Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>아직 할 일이 없습니다.</Text>
          }
        />
      </View> */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "white" },
  container: { flex: 1 },
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
