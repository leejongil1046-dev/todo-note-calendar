import React, { useMemo, useState } from "react";
import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import {
    COLOR_OPTIONS,
    type CardColor,
    type TodoCategory,
} from "@/types/todo-types";

type TodoCreateCategoryAddModalProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (category: TodoCategory) => void;
};

export function TodoCreateCategoryAddModal({
  visible,
  onClose,
  onSubmit,
}: TodoCreateCategoryAddModalProps) {
  const [name, setName] = useState("");
  const [selectedColor, setSelectedColor] = useState<CardColor>(
    COLOR_OPTIONS[0],
  );

  const isSubmitEnabled = useMemo(() => name.trim().length > 0, [name]);

  const handleClose = () => {
    setName("");
    setSelectedColor(COLOR_OPTIONS[0]);
    onClose();
  };

  const handleSubmit = () => {
    const trimmed = name.trim();
    if (!trimmed) return;

    onSubmit({
      id: `category-${Date.now()}`,
      name: trimmed,
      color: selectedColor,
    });

    setName("");
    setSelectedColor(COLOR_OPTIONS[0]);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <Pressable style={styles.overlay} onPress={handleClose}>
        <Pressable style={styles.card} onPress={() => {}}>
          <Text style={styles.title}>카테고리 추가</Text>

          <View style={styles.field}>
            <Text style={styles.label}>카테고리 이름</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="예: 운동, 공부, 약속"
              placeholderTextColor="#9CA3AF"
              maxLength={20}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>배경색</Text>
            <View style={styles.colorGrid}>
              {COLOR_OPTIONS.map((color) => {
                const isSelected = selectedColor === color;

                return (
                  <Pressable
                    key={color}
                    style={[
                      styles.colorButton,
                      { backgroundColor: color },
                      isSelected && styles.colorButtonSelected,
                    ]}
                    onPress={() => setSelectedColor(color)}
                  />
                );
              })}
            </View>
          </View>

          <View style={styles.bottomButtons}>
            <Pressable style={styles.cancelButton} onPress={handleClose}>
              <Text style={styles.cancelButtonText}>취소</Text>
            </Pressable>

            <Pressable
              style={[
                styles.submitButton,
                !isSubmitEnabled && styles.submitButtonDisabled,
              ]}
              disabled={!isSubmitEnabled}
              onPress={handleSubmit}
            >
              <Text
                style={[
                  styles.submitButtonText,
                  !isSubmitEnabled && styles.submitButtonTextDisabled,
                ]}
              >
                추가
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(17, 24, 39, 0.35)",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  card: {
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    padding: 20,
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 20,
  },
  field: {
    marginBottom: 18,
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
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
  },
  colorButtonSelected: {
    borderColor: "#AAAAAA",
    borderWidth: 1,
  },
  colorCheck: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },
  bottomButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  cancelButton: {
    height: 42,
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  submitButton: {
    height: 42,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#0064E0",
    justifyContent: "center",
    alignItems: "center",
  },
  submitButtonDisabled: {
    backgroundColor: "#D1D5DB",
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  submitButtonTextDisabled: {
    color: "#F9FAFB",
  },
});
