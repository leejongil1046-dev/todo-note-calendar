import React, { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type RepeatType = "daily" | "weekday" | "weekend";

type CardColor =
  | "#EAF4FF"
  | "#EAFBF3"
  | "#F3EEFF"
  | "#FFF1E8"
  | "#FFF9DB"
  | "#FDEEF3";

const COLOR_OPTIONS: CardColor[] = [
  "#EAF4FF",
  "#EAFBF3",
  "#F3EEFF",
  "#FFF1E8",
  "#FFF9DB",
  "#FDEEF3",
];

type TodoCreateModalProps = {
  visible: boolean;
  selectedDate: string;
  onClose: () => void;
  onSave: (payload: {
    title: string;
    tasks: string[];
    content: string;
    startDate: string;
    endDate: string;
    repeatType: RepeatType | null;
    color: CardColor;
  }) => void;
};

export function TodoCreateModal({
  visible,
  selectedDate,
  onClose,
  onSave,
}: TodoCreateModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [taskInput, setTaskInput] = useState("");
  const [tasks, setTasks] = useState<string[]>([]);
  const [startDate, setStartDate] = useState(selectedDate);
  const [endDate, setEndDate] = useState(selectedDate);
  const [repeatType, setRepeatType] = useState<RepeatType>("daily");
  const [selectedColor, setSelectedColor] = useState<CardColor>("#EAF4FF");
  const insets = useSafeAreaInsets();

  const TOP_OFFSET = insets.top;
  const BOTTOM_OFFSET = insets.bottom;

  // const isRepeatEnabled = useMemo(() => {
  //   return startDate !== selectedDate || endDate !== selectedDate;
  // }, [startDate, endDate, selectedDate]);
  const isRepeatEnabled = true;

  const addTask = () => {
    const trimmed = taskInput.trim();
    if (!trimmed) return;
    setTasks((prev) => [...prev, trimmed]);
    setTaskInput("");
  };

  const removeTask = (index: number) => {
    setTasks((prev) => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setTaskInput("");
    setTasks([]);
    setStartDate(selectedDate);
    setEndDate(selectedDate);
    setRepeatType("daily");
    setSelectedColor("#EAF4FF");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSave = () => {
    onSave({
      title: title.trim(),
      tasks,
      content: content.trim(),
      startDate,
      endDate,
      repeatType: isRepeatEnabled ? repeatType : null,
      color: selectedColor,
    });

    resetForm();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <View style={[styles.wrapper, { paddingTop: TOP_OFFSET }]}>
        <View style={[styles.header]}>
          <Pressable onPress={handleClose} hitSlop={8}>
            <Text style={styles.closeText}>닫기</Text>
          </Pressable>

          <Text style={styles.headerTitle}>할 일 추가</Text>

          <Pressable onPress={handleSave} hitSlop={8}>
            <Text style={styles.saveText}>저장</Text>
          </Pressable>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.section}>
            <Text style={styles.label}>제목</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="제목을 입력하세요"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>할 일</Text>

            <View style={styles.taskInputRow}>
              <TextInput
                style={styles.taskInput}
                value={taskInput}
                onChangeText={setTaskInput}
                placeholder="할 일을 입력하고 추가하세요"
                placeholderTextColor="#9CA3AF"
                returnKeyType="done"
                onSubmitEditing={addTask}
              />

              <Pressable style={styles.addButton} onPress={addTask}>
                <Text style={styles.addButtonText}>추가</Text>
              </Pressable>
            </View>

            {tasks.length > 0 && (
              <View style={styles.tagList}>
                {tasks.map((task, index) => (
                  <View key={`${task}-${index}`} style={styles.tagChip}>
                    <Text style={styles.tagText}>{task}</Text>
                    <Pressable onPress={() => removeTask(index)} hitSlop={8}>
                      <Text style={styles.tagRemove}>×</Text>
                    </Pressable>
                  </View>
                ))}
              </View>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>내용</Text>
            <TextInput
              style={styles.textArea}
              value={content}
              onChangeText={setContent}
              placeholder="내용을 입력하세요"
              placeholderTextColor="#9CA3AF"
              multiline
              textAlignVertical="top"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>기간</Text>

            <View style={styles.dateRow}>
              <Pressable style={styles.dateButton}>
                <Text style={styles.dateButtonText}>{startDate}</Text>
              </Pressable>
              <Text style={styles.dateSeparator}>~</Text>
              <Pressable style={styles.dateButton}>
                <Text style={styles.dateButtonText}>{endDate}</Text>
              </Pressable>
            </View>

            <View style={styles.repeatRow}>
              <Pressable
                disabled={!isRepeatEnabled}
                style={[
                  styles.repeatButton,
                  repeatType === "daily" &&
                    isRepeatEnabled &&
                    styles.repeatButtonActive,
                  !isRepeatEnabled && styles.repeatButtonDisabled,
                ]}
                onPress={() => setRepeatType("daily")}
              >
                <Text
                  style={[
                    styles.repeatButtonText,
                    repeatType === "daily" &&
                      isRepeatEnabled &&
                      styles.repeatButtonTextActive,
                    !isRepeatEnabled && styles.repeatButtonTextDisabled,
                  ]}
                >
                  매일
                </Text>
              </Pressable>

              <Pressable
                disabled={!isRepeatEnabled}
                style={[
                  styles.repeatButton,
                  repeatType === "weekday" &&
                    isRepeatEnabled &&
                    styles.repeatButtonActive,
                  !isRepeatEnabled && styles.repeatButtonDisabled,
                ]}
                onPress={() => setRepeatType("weekday")}
              >
                <Text
                  style={[
                    styles.repeatButtonText,
                    repeatType === "weekday" &&
                      isRepeatEnabled &&
                      styles.repeatButtonTextActive,
                    !isRepeatEnabled && styles.repeatButtonTextDisabled,
                  ]}
                >
                  평일
                </Text>
              </Pressable>

              <Pressable
                // disabled={!isRepeatEnabled}
                style={[
                  styles.repeatButton,
                  repeatType === "weekend" &&
                    isRepeatEnabled &&
                    styles.repeatButtonActive,
                  !isRepeatEnabled && styles.repeatButtonDisabled,
                ]}
                onPress={() => setRepeatType("weekend")}
              >
                <Text
                  style={[
                    styles.repeatButtonText,
                    repeatType === "weekend" &&
                      isRepeatEnabled &&
                      styles.repeatButtonTextActive,
                    !isRepeatEnabled && styles.repeatButtonTextDisabled,
                  ]}
                >
                  주말
                </Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>배경색</Text>
            <View style={styles.colorRow}>
              {COLOR_OPTIONS.map((color) => {
                const selected = selectedColor === color;

                return (
                  <Pressable
                    key={color}
                    onPress={() => setSelectedColor(color)}
                    style={[
                      styles.colorCircle,
                      { backgroundColor: color },
                      selected && styles.colorCircleSelected,
                    ]}
                  />
                );
              })}
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    width: "100%",
  },
  header: {
    height: 52,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  closeText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
  },
  saveText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0064E0",
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    fontSize: 14,
    color: "#111827",
  },
  textArea: {
    minHeight: 110,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: "#111827",
  },
  taskInputRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  taskInput: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    fontSize: 14,
    color: "#111827",
  },
  addButton: {
    height: 44,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: "#E8EEF9",
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0064E0",
  },
  tagList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tagChip: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 999,
    backgroundColor: "#EEF4FF",
    paddingLeft: 12,
    paddingRight: 10,
    paddingVertical: 8,
  },
  tagText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1F2937",
    marginRight: 8,
  },
  tagRemove: {
    fontSize: 14,
    fontWeight: "700",
    color: "#6B7280",
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  dateButton: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  dateButtonText: {
    fontSize: 14,
    color: "#111827",
  },
  dateSeparator: {
    marginHorizontal: 8,
    fontSize: 14,
    color: "#6B7280",
  },
  repeatRow: {
    flexDirection: "row",
    gap: 8,
  },
  repeatButton: {
    flex: 1,
    height: 40,
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
  repeatButtonDisabled: {
    backgroundColor: "#F9FAFB",
    borderColor: "#E5E7EB",
  },
  repeatButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
  },
  repeatButtonTextActive: {
    color: "#0064E0",
  },
  repeatButtonTextDisabled: {
    color: "#C0C4CC",
  },
  colorRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  colorCircle: {
    width: 30,
    height: 30,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  colorCircleSelected: {
    borderWidth: 1,
    borderColor: "#9CA3AF",
  },
});
