import { useRef, useState } from "react";
import { Animated, LayoutChangeEvent } from "react-native";

const DETAIL_MAX_HEIGHT = 250;

export function useTodoCardExpand() {
  const [expanded, setExpanded] = useState(false);
  const [measuredDetailHeight, setMeasuredDetailHeight] = useState(0);

  const detailHeightAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const animateOpen = (contentHeight: number) => {
    const nextHeight = Math.min(contentHeight, DETAIL_MAX_HEIGHT);

    Animated.parallel([
      Animated.timing(detailHeightAnim, {
        toValue: nextHeight,
        duration: 220,
        useNativeDriver: false,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 180,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const animateClose = () => {
    Animated.parallel([
      Animated.timing(detailHeightAnim, {
        toValue: 0,
        duration: 220,
        useNativeDriver: false,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 140,
        useNativeDriver: false,
      }),
    ]).start(() => {
      setExpanded(false);
    });
  };

  const toggleExpand = () => {
    if (expanded) {
      animateClose();
      return;
    }

    setExpanded(true);

    if (measuredDetailHeight > 0) {
      animateOpen(measuredDetailHeight);
    }
  };

  const handleDetailLayout = (e: LayoutChangeEvent) => {
    const height = e.nativeEvent.layout.height;

    if (height !== measuredDetailHeight) {
      setMeasuredDetailHeight(height);

      if (expanded) {
        const nextHeight = Math.min(height, DETAIL_MAX_HEIGHT);
        detailHeightAnim.setValue(nextHeight);
      }
    }
  };

  const detailAnimatedStyle = {
    height: detailHeightAnim,
    opacity: opacityAnim,
  };

  return {
    expanded,
    toggleExpand,
    handleDetailLayout,
    detailAnimatedStyle,
  };
}
