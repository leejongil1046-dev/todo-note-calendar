import { StyleSheet, Text, View } from "react-native";

const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

export const CalendarWeekdayHeader = () => {
  return (
    <View style={styles.row}>
      {WEEKDAY_LABELS.map((label) => (
        <View key={label} style={styles.cell}>
          <Text style={styles.label}>{label}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    marginBottom: 6,
  },
  cell: {
    width: "14.2857%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: "500",
    color: "#6B7280",
  },
});
