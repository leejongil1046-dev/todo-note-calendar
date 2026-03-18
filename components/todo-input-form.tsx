import { Image } from "expo-image";
import React, { useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, TextInput } from "react-native";

const COLLAPSED_HEIGHT = 50;
const EXPANDED_HEIGHT = 180;

export function TodoInputForm() {
  const [expanded, setExpanded] = useState(false);

  const heightAnim = useRef(new Animated.Value(COLLAPSED_HEIGHT)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const toggleExpand = () => {
    const nextExpanded = !expanded;

    Animated.parallel([
      Animated.timing(heightAnim, {
        toValue: nextExpanded ? EXPANDED_HEIGHT : COLLAPSED_HEIGHT,
        duration: 220,
        useNativeDriver: false,
      }),
      Animated.timing(opacityAnim, {
        toValue: nextExpanded ? 1 : 0,
        duration: 150,
        useNativeDriver: false,
      }),
    ]).start();

    setExpanded(nextExpanded);
  };

  return (
    <Animated.View style={[styles.wrapper, { height: heightAnim }]}>
      <Pressable style={styles.header} onPress={toggleExpand}>
        <Image
          source={require("@/assets/images/plus.svg")}
          style={styles.plusIcon}
          contentFit="contain"
        />
      </Pressable>

      <Animated.View style={[styles.body, { opacity: opacityAnim }]}>
        <TextInput
          style={styles.mainInput}
          placeholder="할 일을 입력하세요"
          placeholderTextColor="#9CA3AF"
          returnKeyType="done"
        />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    borderRadius: 12,
    backgroundColor: "#F4F4F5",
    marginVertical: 6,
    overflow: "hidden",
  },
  header: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  plusIcon: {
    width: 25,
    height: 25,
  },
  body: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  mainInput: {
    width: "70%",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: "#111827",
    backgroundColor: "#FFFFFF",
  },
});
