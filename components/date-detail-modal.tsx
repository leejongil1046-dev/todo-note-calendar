import React from "react";
import {
  Animated,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Rect = { x: number; y: number; width: number; height: number };

type DateDetailModalProps = {
  visible: boolean;
  selectedDate: string;
  rect: Rect | null;
  progress: Animated.Value;
  onRequestClose: () => void;
};

export function DateDetailModal({
  visible,
  selectedDate,
  rect,
  progress,
  onRequestClose,
}: DateDetailModalProps) {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const TOP_OFFSET = insets.top;
  const BOTTOM_OFFSET = insets.bottom;

  const finalTop = Platform.OS === "ios" ? insets.top + 52 : 52;
  const finalHeight = screenHeight - TOP_OFFSET - BOTTOM_OFFSET - 52 - 90 - 30;

  if (!visible || !rect) return null;

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
                outputRange: [0.9, 1],
              }),
            },
          ]}
        >
          <Text style={styles.dateText}>{selectedDate}</Text>
          {/* TODO: 이 안에 기념일/국경일/투두 리스트를 배치 */}
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
    borderRadius: 24,
    padding: 20,
    paddingBottom: 28,
    backgroundColor: "#FFFFFF",
  },
  dateText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
});
