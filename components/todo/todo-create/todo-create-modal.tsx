import React, { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { db } from "@/lib/db/db";
import {
  DEFAULT_CATEGORIES,
  getTodoCategories,
  upsertTodoCategory,
} from "@/lib/db/todo-categories";
import { TodoCategory } from "@/types/todo-types";
import { TodoCreateCategoryAddModal } from "./todo-create-category-add-modal";
import { TodoCreateCategorySection } from "./todo-create-category-section";
import { TodoCreateContentSection } from "./todo-create-content-section";
import {
  TodoCreateDateSection,
  type RepeatType,
} from "./todo-create-date-section";
import { TodoCreateHeader } from "./todo-create-header";
import { TodoCreateTaskSection } from "./todo-create-task-section";

type TodoCreateModalProps = {
  visible: boolean;
  selectedDate: string;
  onClose: () => void;
  onSave: (payload: {
    category: TodoCategory;
    tasks: string[];
    content: string;
    startDate: string;
    endDate: string;
    repeatType: RepeatType | null;
  }) => void;
};

export function TodoCreateModal({
  visible,
  selectedDate,
  onClose,
  onSave,
}: TodoCreateModalProps) {
  const [content, setContent] = useState("");
  const [taskInput, setTaskInput] = useState("");
  const [tasks, setTasks] = useState<string[]>([]);
  const [startDate, setStartDate] = useState(selectedDate);
  const [endDate, setEndDate] = useState(selectedDate);
  const [repeatType, setRepeatType] = useState<RepeatType>("daily");

  const [categories, setCategories] =
    useState<TodoCategory[]>(DEFAULT_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState<TodoCategory | null>(
    null,
  );
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isAddCategoryModalVisible, setIsAddCategoryModalVisible] =
    useState(false);

  const insets = useSafeAreaInsets();

  // 지금은 “하루만” 입력하므로 반복 기능은 저장에서 항상 제거한다.
  const isRepeatEnabled = false;

  const isSaveEnabled = selectedCategory !== null;

  // 모달이 열릴 때마다 SQLite에서 카테고리를 다시 불러와
  // “카테고리 추가”가 바로 반영되게 한다.
  useEffect(() => {
    if (!visible) return;
    try {
      const fromDb = getTodoCategories(db);
      setCategories(fromDb.length > 0 ? fromDb : DEFAULT_CATEGORIES);
    } catch {
      // SQLite가 초기화되기 전/에러면 UI 기본 카테고리를 사용.
      setCategories(DEFAULT_CATEGORIES);
    }
  }, [visible]);

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
    setContent("");
    setTaskInput("");
    setTasks([]);
    setStartDate(selectedDate);
    setEndDate(selectedDate);
    setRepeatType("daily");
    setSelectedCategory(null);
    setIsCategoryDropdownOpen(false);
    setIsAddCategoryModalVisible(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSave = () => {
    if (!selectedCategory) return;

    onSave({
      category: selectedCategory,
      tasks,
      content: content.trim(),
      startDate,
      endDate,
      repeatType: null,
    });

    resetForm();
    onClose();
  };

  const handleSelectCategory = (category: TodoCategory) => {
    setSelectedCategory(category);
    setIsCategoryDropdownOpen(false);
  };

  const handleAddCategory = (category: TodoCategory) => {
    // SQLite에 반영
    upsertTodoCategory(db, category);

    // 방금 추가한 카테고리를 바로 UI에 반영
    const fromDb = getTodoCategories(db);
    setCategories(
      fromDb.length > 0 ? fromDb : [...DEFAULT_CATEGORIES, category],
    );

    setSelectedCategory(category);
    setIsAddCategoryModalVisible(false);
    setIsCategoryDropdownOpen(false);
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
          contentContainerStyle={[
            styles.contentContainer,
            { paddingBottom: 120 + insets.bottom },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <TodoCreateCategorySection
            selectedCategory={selectedCategory}
            categories={categories}
            isDropdownOpen={isCategoryDropdownOpen}
            onToggleDropdown={() => setIsCategoryDropdownOpen((prev) => !prev)}
            onSelectCategory={handleSelectCategory}
            onPressAddCategory={() => {
              setIsCategoryDropdownOpen(false);
              setIsAddCategoryModalVisible(true);
            }}
          />

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
        </ScrollView>

        <View style={[styles.bottomBar, { paddingBottom: 16 + insets.bottom }]}>
          <Pressable
            onPress={handleSave}
            disabled={!isSaveEnabled}
            style={[
              styles.submitButton,
              !isSaveEnabled && styles.submitButtonDisabled,
            ]}
          >
            <Text
              style={[
                styles.submitButtonText,
                !isSaveEnabled && styles.submitButtonTextDisabled,
              ]}
            >
              저장
            </Text>
          </Pressable>
        </View>

        <TodoCreateCategoryAddModal
          visible={isAddCategoryModalVisible}
          onClose={() => setIsAddCategoryModalVisible(false)}
          onSubmit={handleAddCategory}
        />
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
  },
  bottomBar: {
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: "#FFFFFF",
    alignItems: "flex-end",
  },
  submitButton: {
    width: 65,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#0064E0",
    justifyContent: "center",
    alignItems: "center",
  },
  submitButtonDisabled: {
    backgroundColor: "#D1D5DB",
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  submitButtonTextDisabled: {
    color: "#F9FAFB",
  },
});
