import { useEffect, useRef } from "react";
import { Animated } from "react-native";

type AnimatedTabIconProps = {
  children: React.ReactNode;
  focused: boolean;
};

export function AnimatedTabIcon({ children, focused }: AnimatedTabIconProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: focused ? 1.2 : 1, // 선택 시 살짝 확대
      useNativeDriver: true,
      friction: 8,
      tension: 70,
    }).start();

    Animated.spring(translateY, {
      toValue: focused ? -20 : 0, // 선택 시 약간 위로 이동
      useNativeDriver: true,
      friction: 8,
      tension: 70,
    }).start();
  }, [focused, scale, translateY]);

  return (
    <Animated.View
      style={{
        justifyContent: "center",
        alignItems: "center",
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: focused ? "#2563EB" : "transparent",
        transform: [{ scale }, { translateY }],
      }}
    >
      {children}
    </Animated.View>
  );
}
