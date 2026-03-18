import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type RepeatType = "daily" | "weekday" | "weekend";

export function TodoInputForm() {
  const [title, setTitle] = useState("");
  const [subTodos, setSubTodos] = useState([""]);
  const [repeatType, setRepeatType] = useState<RepeatType>("daily");

  const addSubTodo = () => {
    setSubTodos((prev) => [...prev, ""]);
  };

  const updateSubTodo = (index: number, value: string) => {
    setSubTodos((prev) => prev.map((item, i) => (i === index ? value : item)));
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
      >
        <View style={styles.row}>
          <Text style={styles.label}>제목</Text>
          <TextInput
            style={styles.mainInput}
            value={title}
            onChangeText={setTitle}
            placeholder="제목을 입력하세요"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={styles.rowStart}>
          <Text style={styles.label}>할 일</Text>
          <View style={styles.subTodoSection}>
            {subTodos.map((item, index) => (
              <TextInput
                key={index}
                style={styles.subInput}
                value={item}
                onChangeText={(value) => updateSubTodo(index, value)}
                placeholder={`할 일 ${index + 1}`}
                placeholderTextColor="#9CA3AF"
              />
            ))}

            <Pressable style={styles.addButton} onPress={addSubTodo}>
              <Text style={styles.addButtonText}>+ 하위 할 일 추가</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>기간</Text>
          <View style={styles.dateRow}>
            <Pressable style={styles.dateButton}>
              <Text style={styles.dateButtonText}>2026.03.20</Text>
            </Pressable>
            <Text style={styles.dateSeparator}>~</Text>
            <Pressable style={styles.dateButton}>
              <Text style={styles.dateButtonText}>2026.04.10</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>반복</Text>
          <View style={styles.repeatRow}>
            <Pressable
              style={[
                styles.repeatButton,
                repeatType === "daily" && styles.repeatButtonActive,
              ]}
              onPress={() => setRepeatType("daily")}
            >
              <Text
                style={[
                  styles.repeatButtonText,
                  repeatType === "daily" && styles.repeatButtonTextActive,
                ]}
              >
                매일
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.repeatButton,
                repeatType === "weekday" && styles.repeatButtonActive,
              ]}
              onPress={() => setRepeatType("weekday")}
            >
              <Text
                style={[
                  styles.repeatButtonText,
                  repeatType === "weekday" && styles.repeatButtonTextActive,
                ]}
              >
                평일
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.repeatButton,
                repeatType === "weekend" && styles.repeatButtonActive,
              ]}
              onPress={() => setRepeatType("weekend")}
            >
              <Text
                style={[
                  styles.repeatButtonText,
                  repeatType === "weekend" && styles.repeatButtonTextActive,
                ]}
              >
                주말
              </Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.saveRow}>
          <Pressable style={styles.saveButton}>
            <Text style={styles.saveButtonText}>저장</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const LABEL_WIDTH = 64;

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    backgroundColor: "#F4F4F5",
    // overflow: "hidden",
  },
  scrollView: {
    width: "100%",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  rowStart: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  label: {
    width: LABEL_WIDTH,
    fontSize: 13,
    fontWeight: "700",
    color: "#374151",
    paddingTop: 10,
  },
  mainInput: {
    flex: 1,
    height: 38,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 12,
    backgroundColor: "#FFFFFF",
    fontSize: 12,
    color: "#111827",
  },
  subTodoSection: {
    flex: 1,
  },
  subInput: {
    width: "100%",
    height: 38,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 12,
    backgroundColor: "#FFFFFF",
    fontSize: 12,
    color: "#111827",
    marginBottom: 8,
  },
  addButton: {
    alignSelf: "flex-start",
    marginTop: 4,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "#E8EEF9",
  },
  addButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#0064E0",
  },
  dateRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  dateButton: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  dateButtonText: {
    fontSize: 13,
    color: "#111827",
  },
  dateSeparator: {
    marginHorizontal: 8,
    fontSize: 14,
    color: "#6B7280",
  },
  repeatRow: {
    flex: 1,
    flexDirection: "row",
    gap: 8,
  },
  repeatButton: {
    flex: 1,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
  },
  repeatButtonActive: {
    borderColor: "#0064E0",
    backgroundColor: "#EAF2FF",
  },
  repeatButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
  },
  repeatButtonTextActive: {
    color: "#0064E0",
  },
  saveRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 6,
  },
  saveButton: {
    minWidth: 96,
    height: 44,
    borderRadius: 10,
    backgroundColor: "#0064E0",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 18,
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
