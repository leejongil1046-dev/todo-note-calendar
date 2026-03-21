import { useCallback, useEffect, useRef, useState } from "react";
import { Animated, LayoutChangeEvent } from "react-native";

const DETAIL_MAX_HEIGHT = 250;

export function useTodoCardExpand(isDragging: boolean) {
  const [expanded, setExpanded] = useState(false);
  const [measuredDetailHeight, setMeasuredDetailHeight] = useState(0);

  const detailHeightAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const animateOpen = useCallback(
    (contentHeight: number) => {
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
    },
    [detailHeightAnim, opacityAnim],
  );

  const animateClose = useCallback(() => {
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
  }, [detailHeightAnim, opacityAnim]);

  const toggleExpand = () => {
    if (isDragging) return;

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

  useEffect(() => {
    if (!isDragging) return;
    if (!expanded) return;

    animateClose();
  }, [isDragging, expanded, animateClose]);

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
