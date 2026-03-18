import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export type CardColor =
  | "#EAF4FF"
  | "#EAFBF3"
  | "#F3EEFF"
  | "#FFF1E8"
  | "#FFF9DB"
  | "#FDEEF3";

const COLOR_OPTIONS: CardColor[] = [
  "#EAF4FF",
  "#EAFBF3",
  "#F3EEFF",
  "#FFF1E8",
  "#FFF9DB",
  "#FDEEF3",
];

type TodoCreateColorSectionProps = {
  selectedColor: CardColor;
  onSelectColor: (color: CardColor) => void;
};

export function TodoCreateColorSection({
  selectedColor,
  onSelectColor,
}: TodoCreateColorSectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.label}>배경색</Text>

      <View style={styles.colorRow}>
        {COLOR_OPTIONS.map((color) => {
          const selected = selectedColor === color;

          return (
            <Pressable
              key={color}
              onPress={() => onSelectColor(color)}
              style={[
                styles.colorCircle,
                { backgroundColor: color },
                selected && styles.colorCircleSelected,
              ]}
            />
          );
        })}
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
  colorRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  colorCircle: {
    width: 30,
    height: 30,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  colorCircleSelected: {
    borderWidth: 1,
    borderColor: "#9CA3AF",
  },
});
