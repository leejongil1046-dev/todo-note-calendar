import { Pressable, StyleSheet, Text, View } from "react-native";

type CalendarMonthHeaderProps = {
  year: number;
  month: number;
  onPressPrevMonth?: () => void;
  onPressNextMonth?: () => void;
};

export const CalendarMonthHeader = ({
  year,
  month,
  onPressPrevMonth,
  onPressNextMonth,
}: CalendarMonthHeaderProps) => {
  return (
    <View style={styles.container}>
      <Pressable style={styles.arrowButton} onPress={onPressPrevMonth}>
        <Text style={styles.arrowText}>‹</Text>
      </Pressable>

      <Text style={styles.title}>
        {year}년 {month}월
      </Text>

      <Pressable style={styles.arrowButton} onPress={onPressNextMonth}>
        <Text style={styles.arrowText}>›</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 5,
    // backgroundColor: "red",
  },
  arrowButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  arrowText: {
    fontSize: 22,
    fontWeight: "400",
    color: "#374151",
    lineHeight: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
});
