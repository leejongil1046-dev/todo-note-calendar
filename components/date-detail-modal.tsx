import type { DateMeta } from "@/types/calendar-types";
import { Text } from "@react-navigation/elements";
import { Image } from "expo-image";
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
import { TodoCard } from "./todo/todo-card";

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
              <View style={styles.holidayCard}>
                <Text style={styles.holidayText}>{meta.holidayName}</Text>
              </View>
            )}
            <TodoCard label="할 일" completedCount={2} totalCount={5} />
            <TodoCard label="할 일" completedCount={2} totalCount={5} />
            <TodoCard label="할 일" completedCount={2} totalCount={5} />
          </Animated.View>
          <Animated.View
            style={[styles.floatingButton, { opacity: contentOpacity }]}
          >
            <Image
              source={require("@/assets/images/plus.svg")}
              style={styles.plusIcon}
              contentFit="contain"
            />
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
    padding: 30,
    backgroundColor: "#FFFFFF",
  },
  dateText: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 16,
    marginLeft: 3,
  },
  holidayCard: {
    width: "100%",
    height: 50,
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: "#FEECEC",
    marginVertical: 6,
  },
  holidayText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#DC2626",
  },
  floatingButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",

    // 그림자 (iOS)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 10,

    // 그림자 (Android)
    elevation: 5,
  },
  plusIcon: {
    width: 50,
    height: 50,
  },
});
