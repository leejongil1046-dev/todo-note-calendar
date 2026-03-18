import { Image } from "expo-image";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";

type TodoInputFormProps = {
  label: string;
  completedCount: number;
  totalCount: number;
};

export function TodoInputForm() {
  const [done, setDone] = useState(false);

  return (
    <View style={styles.todoInputCard}>
      <Image
        source={require("@/assets/images/plus.svg")}
        style={{ width: 30, height: 30 }}
        contentFit="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  todoInputCard: {
    width: "100%",
    height: 50,
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: "#F4F4F5",
    marginVertical: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  todoText: {
    fontSize: 13,
    fontWeight: "500",
    paddingBottom: 2,
  },
  todoTextDone: {
    textDecorationLine: "line-through",
    color: "#6B7280",
  },
});
