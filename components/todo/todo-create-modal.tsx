import React, { useMemo, useState } from "react";
import { Modal, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  TodoCreateColorSection,
  type CardColor,
} from "./todo-create-color-section";
import { TodoCreateContentSection } from "./todo-create-content-section";
import {
  TodoCreateDateSection,
  type RepeatType,
} from "./todo-create-date-section";
import { TodoCreateHeader } from "./todo-create-header";
import { TodoCreateTaskSection } from "./todo-create-task-section";
import { TodoCreateTitleSection } from "./todo-create-title-section";

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

  const isRepeatEnabled = useMemo(() => {
    return startDate !== selectedDate || endDate !== selectedDate;
  }, [startDate, endDate, selectedDate]);

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
      <View style={[styles.wrapper, { paddingTop: insets.top }]}>
        <TodoCreateHeader onClose={handleClose} />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <TodoCreateTitleSection title={title} onChangeTitle={setTitle} />

          <TodoCreateTaskSection
            taskInput={taskInput}
            tasks={tasks}
            onChangeTaskInput={setTaskInput}
            onAddTask={addTask}
            onRemoveTask={removeTask}
          />

          <TodoCreateContentSection
            content={content}
            onChangeContent={setContent}
          />

          <TodoCreateDateSection
            startDate={startDate}
            endDate={endDate}
            repeatType={repeatType}
            isRepeatEnabled={isRepeatEnabled}
            onPressStartDate={() => {}}
            onPressEndDate={() => {}}
            onChangeRepeatType={setRepeatType}
          />

          <TodoCreateColorSection
            selectedColor={selectedColor}
            onSelectColor={setSelectedColor}
          />
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    width: "100%",
    backgroundColor: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
});
