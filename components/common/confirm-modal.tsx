import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

export type ConfirmMode =
  | "delete-todo"
  | "delete-success"
  | "delete-failed"
  | "create-success"
  | "create-failed";
type ConfirmButtonVariant = "primary" | "delete";

type ConfirmModalProps = {
  visible: boolean;
  mode: ConfirmMode;
  onConfirm: () => void;
  onClose: () => void;
};

const PRESET: Record<
  ConfirmMode,
  {
    title: string;
    description: string;
    confirmLabel: string;
    cancelLabel: string;
    confirmVariant: ConfirmButtonVariant;
    hideCancel: boolean;
  }
> = {
  "delete-todo": {
    title: "할 일을 삭제할까요?",
    description: "삭제한 내용은 다시 되돌릴 수 없습니다.",
    confirmLabel: "삭제",
    cancelLabel: "취소",
    confirmVariant: "delete",
    hideCancel: false,
  },
  "delete-success": {
    title: "삭제 완료",
    description: "할 일이 성공적으로 삭제되었습니다.",
    confirmLabel: "확인",
    cancelLabel: "",
    confirmVariant: "primary",
    hideCancel: true,
  },
  "delete-failed": {
    title: "삭제 실패",
    description: "삭제할 할 일을 찾지 못했습니다.",
    confirmLabel: "확인",
    cancelLabel: "",
    confirmVariant: "primary",
    hideCancel: true,
  },
  "create-success": {
    title: "추가 완료",
    description: "할 일이 성공적으로 추가되었습니다.",
    confirmLabel: "확인",
    cancelLabel: "",
    confirmVariant: "primary",
    hideCancel: true,
  },
  "create-failed": {
    title: "추가 실패",
    description: "할 일을 추가할 수 없습니다. 다시 시도해주세요.",
    confirmLabel: "확인",
    cancelLabel: "",
    confirmVariant: "primary",
    hideCancel: true,
  },
};

export function ConfirmModal({
  visible,
  mode,
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  if (!visible) return null;

  const preset = PRESET[mode];

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={styles.modalCard}>
          <Text style={styles.title}>{preset.title}</Text>
          <Text style={styles.description}>{preset.description}</Text>

          <View style={styles.buttonRow}>
            {!preset.hideCancel && (
              <Pressable style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelButtonText}>
                  {preset.cancelLabel}
                </Text>
              </Pressable>
            )}

            <Pressable
              style={[
                styles.confirmButton,
                preset.confirmVariant === "primary" && styles.primaryButton,
                preset.confirmVariant === "delete" && styles.deleteButton,
              ]}
              onPress={handleConfirm}
            >
              <Text
                style={[
                  styles.confirmButtonText,
                  preset.confirmVariant === "primary" &&
                    styles.primaryButtonText,
                  preset.confirmVariant === "delete" && styles.deleteButtonText,
                ]}
              >
                {preset.confirmLabel}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.28)",
  },
  modalCard: {
    width: "82%",
    maxWidth: 340,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.16,
    shadowRadius: 20,
    elevation: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 10,
  },
  description: {
    fontSize: 13,
    lineHeight: 20,
    color: "#4B5563",
    marginBottom: 18,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  cancelButton: {
    minWidth: 72,
    height: 38,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
  },
  confirmButton: {
    minWidth: 72,
    height: 38,
    paddingHorizontal: 14,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  confirmButtonText: {
    fontSize: 13,
    fontWeight: "600",
  },
  primaryButton: {
    backgroundColor: "#E8EEF9",
  },
  primaryButtonText: {
    color: "#0064E0",
  },
  deleteButton: {
    backgroundColor: "#FCEAEA",
  },
  deleteButtonText: {
    color: "#DC2626",
  },
});
