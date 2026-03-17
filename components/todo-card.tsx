import { StyleSheet, Text, View } from "react-native";

type TodoCardProps = {
  label: string;
  completedCount: number;
  totalCount: number;
};

export function TodoCard({ label, completedCount, totalCount }: TodoCardProps) {
  return (
    <View style={styles.todoCard}>
      <View style={styles.todoHeaderRow}>
        <View style={styles.todoLeft}>
          <View style={styles.todoCheckbox} />
          <Text style={styles.todoText}>{label}</Text>
        </View>
        <Text style={styles.todoCountText}>
          {completedCount} / {totalCount}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  todoCard: {
    width: "100%",
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: "#F3F8FF",
    marginVertical: 6,
  },
  todoHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  todoLeft: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
  },
  todoCheckbox: {
    width: 18,
    height: 18,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#9CA3AF",
    backgroundColor: "#FFFFFF",
    marginRight: 10,
  },
  todoText: {
    fontSize: 13,
    fontWeight: "500",
    paddingBottom: 2,
  },
  todoCountText: {
    fontSize: 12,
    color: "#6B7280",
    paddingBottom: 2,
  },
});
