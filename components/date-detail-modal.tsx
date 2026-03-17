import type { DateMeta } from "@/types/calendar-types";
import { Text } from "@react-navigation/elements";
import React from "react";
import {
  Animated,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Rect = { x: number; y: number; width: number; height: number };

type DateDetailModalProps = {
  visible: boolean;
  rect: Rect | null;
  progress: Animated.Value;
  contentOpacity: Animated.Value;
  meta: DateMeta | null;
  onRequestClose: () => void;
};

export function DateDetailModal({
  visible,
  rect,
  progress,
  contentOpacity,
  meta,
  onRequestClose,
}: DateDetailModalProps) {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const TOP_OFFSET = insets.top;
  const BOTTOM_OFFSET = insets.bottom;

  const finalTop = Platform.OS === "ios" ? insets.top + 52 : 52;
  const finalHeight = screenHeight - TOP_OFFSET - BOTTOM_OFFSET - 52 - 82 - 30;

  if (!visible || !rect || !meta) return null;

  return (
    <Modal
      visible
      transparent
      animationType="none"
      onRequestClose={onRequestClose}
    >
      <View style={styles.overlay} pointerEvents="box-none">
        <Pressable style={styles.backdrop} onPress={onRequestClose} />
        <Animated.View
          style={[
            styles.card,
            {
              left: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [rect.x, screenWidth * 0.05],
              }),
              top: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [rect.y, finalTop],
              }),
              width: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [rect.width, screenWidth * 0.9],
              }),
              height: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [rect.height, finalHeight],
              }),
              opacity: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 1],
              }),
              borderRadius: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [9, 24],
              }),
            },
          ]}
        >
          <Animated.View style={{ opacity: contentOpacity }}>
            <Text style={styles.dateText}>
              {meta.year}년 {meta.month}월 {meta.day}일 ({meta.weekdayLabel})
            </Text>
            {meta.isHoliday && meta.holidayName && (
              <Text style={styles.holidayText}>{meta.holidayName}</Text>
            )}
            {/* TODO: 여기 아래에 투두 리스트/기념일 등을 배치 */}
          </Animated.View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  card: {
    position: "absolute",
    padding: 20,
    paddingBottom: 28,
    backgroundColor: "#FFFFFF",
  },
  dateText: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 16,
  },
  holidayText: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 12,
  },
});
