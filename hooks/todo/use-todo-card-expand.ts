import { useCallback, useEffect, useRef, useState } from "react";
import { Animated, LayoutChangeEvent } from "react-native";

const DETAIL_MAX_HEIGHT = 250;

export function useTodoCardExpand(isListMenuModeActive: boolean) {
  const [expanded, setExpanded] = useState(false);
  const [measuredDetailHeight, setMeasuredDetailHeight] = useState(0);
  const wasListMenuModeActiveRef = useRef(isListMenuModeActive);

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
    if (isListMenuModeActive) return;

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
    if (!isListMenuModeActive) return;
    if (!expanded) return;

    animateClose();
  }, [isListMenuModeActive, expanded, animateClose]);

  /** 리스트 메뉴 모드 종료 시 상세 애니메이션·상태를 접힌 상태로 고정 (중간 프레임/불일치로 내용이 안 보이는 현상 방지) */
  useEffect(() => {
    const was = wasListMenuModeActiveRef.current;
    wasListMenuModeActiveRef.current = isListMenuModeActive;
    if (!was || isListMenuModeActive) return;

    detailHeightAnim.stopAnimation();
    opacityAnim.stopAnimation();
    detailHeightAnim.setValue(0);
    opacityAnim.setValue(0);
    setExpanded(false);
  }, [detailHeightAnim, isListMenuModeActive, opacityAnim]);

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
