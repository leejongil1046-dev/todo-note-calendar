import { useCallback, useEffect, useRef, useState } from "react";
import { Animated, Easing } from "react-native";

type DetailRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export function useDateDetailModal() {
  const [isDateCardOpen, setIsDateCardOpen] = useState(false);
  const [isCardContentMounted, setIsCardContentMounted] = useState(false);
  const [detailRect, setDetailRect] = useState<DetailRect | null>(null);

  const detailProgress = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const mountTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearMountTimer = useCallback(() => {
    if (mountTimerRef.current) {
      clearTimeout(mountTimerRef.current);
      mountTimerRef.current = null;
    }
  }, []);

  const openDetailCard = useCallback(
    (rect: DetailRect) => {
      clearMountTimer();

      setDetailRect(rect);
      setIsDateCardOpen(true);
      setIsCardContentMounted(false);

      detailProgress.stopAnimation();
      contentOpacity.stopAnimation();

      detailProgress.setValue(0);
      contentOpacity.setValue(0);

      Animated.timing(detailProgress, {
        toValue: 1,
        duration: 250,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }).start();

      mountTimerRef.current = setTimeout(() => {
        setIsCardContentMounted(true);

        Animated.timing(contentOpacity, {
          toValue: 1,
          duration: 200,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }).start();

        mountTimerRef.current = null;
      }, 300);
    },
    [clearMountTimer, contentOpacity, detailProgress],
  );

  const closeDetailCard = useCallback(() => {
    clearMountTimer();

    contentOpacity.stopAnimation();
    detailProgress.stopAnimation();

    Animated.timing(contentOpacity, {
      toValue: 0,
      duration: 200,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (!finished) return;

      setIsCardContentMounted(false);

      Animated.timing(detailProgress, {
        toValue: 0,
        duration: 250,
        easing: Easing.in(Easing.ease),
        useNativeDriver: false,
      }).start(({ finished }) => {
        if (!finished) return;

        setIsDateCardOpen(false);
        setDetailRect(null);
      });
    });
  }, [clearMountTimer, contentOpacity, detailProgress]);

  useEffect(() => {
    return () => {
      clearMountTimer();
    };
  }, [clearMountTimer]);

  return {
    isDateCardOpen,
    isCardContentMounted,
    detailRect,
    detailProgress,
    contentOpacity,
    openDetailCard,
    closeDetailCard,
  };
}
