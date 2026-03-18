import { Image } from "expo-image";
import React, { useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, View } from "react-native";

type TodoInputFormProps = {
  label: string;
  completedCount: number;
  totalCount: number;
};

export function TodoInputForm() {
  const [expanded, setExpanded] = useState(false);
  const heightAnim = useRef(new Animated.Value(50)).current;
  const toggleExpand = () => {
    const toValue = expanded ? 50 : 200;
    Animated.timing(heightAnim, {
      toValue,
      duration: 200,
      useNativeDriver: false,
    }).start();
    setExpanded((prev) => !prev);
  };

  return (
    <Pressable onPress={toggleExpand}>
      <Animated.View
        style={[styles.todoInputCardWrapper, { height: heightAnim }]}
      >
        <View style={styles.todoInputCard}>
          <Image
            source={require("@/assets/images/plus.svg")}
            style={{ width: 25, height: 25 }}
            contentFit="contain"
          />
        </View>
        {/* expanded === true일 때 아래에 입력 폼 추가 예정 */}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  todoInputCardWrapper: {
    width: "100%",
    height: 50,
    borderRadius: 12,
    backgroundColor: "#F4F4F5",
    marginVertical: 6,
    justifyContent: "flex-start",
  },
  todoInputCard: {
    width: "100%",
    height: 50,
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: "#F4F4F5",
    justifyContent: "center",
    alignItems: "center",
  },
});
