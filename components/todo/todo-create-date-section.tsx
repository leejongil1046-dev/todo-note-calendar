import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export type RepeatType = "daily" | "weekday" | "weekend";

type TodoCreateDateSectionProps = {
  startDate: string;
  endDate: string;
  repeatType: RepeatType;
  isRepeatEnabled: boolean;
  onPressStartDate: () => void;
  onPressEndDate: () => void;
  onChangeRepeatType: (value: RepeatType) => void;
};

export function TodoCreateDateSection({
  startDate,
  endDate,
  repeatType,
  isRepeatEnabled,
  onPressStartDate,
  onPressEndDate,
  onChangeRepeatType,
}: TodoCreateDateSectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.label}>기간</Text>

      <View style={styles.dateRow}>
        <Pressable style={styles.dateButton} onPress={onPressStartDate}>
          <Text style={styles.dateButtonText}>{startDate}</Text>
        </Pressable>

        <Text style={styles.dateSeparator}>~</Text>

        <Pressable style={styles.dateButton} onPress={onPressEndDate}>
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
          onPress={() => onChangeRepeatType("daily")}
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
          onPress={() => onChangeRepeatType("weekday")}
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
          disabled={!isRepeatEnabled}
          style={[
            styles.repeatButton,
            repeatType === "weekend" &&
              isRepeatEnabled &&
              styles.repeatButtonActive,
            !isRepeatEnabled && styles.repeatButtonDisabled,
          ]}
          onPress={() => onChangeRepeatType("weekend")}
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
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
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
});
