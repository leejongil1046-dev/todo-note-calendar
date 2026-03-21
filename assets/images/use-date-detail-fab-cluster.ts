import { useCallback, useMemo, useRef, useState } from "react";
import { Animated } from "react-native";

const FAB_SIZE = 50;
const GAP = 12;
/** 접힘: 아래 chevron이 메인 FAB와 겹치도록 내릴 양 */
const DOWN_STACK_OFFSET = FAB_SIZE + GAP;
/** 접힘: 위 chevron이 메인 FAB와 겹치도록 내릴 양 */
const UP_STACK_OFFSET = 2 * (FAB_SIZE + GAP);
/** 수정/삭제: 서브 아이콘 1개가 메인 FAB와 겹치도록 내릴 양 */
const ACTION_STACK_OFFSET = FAB_SIZE + GAP;

/**
 * 날짜 상세 모달 우측 하단 FAB + 순서 변경(chevron) / 수정·삭제(단일 서브) 스택.
 * 애니메이션은 메뉴/FAB 등 버튼 핸들러에서만 시작 (모드 진입·해제용).
 */
export function useDateDetailFabCluster() {
  const fabRotation = useRef(new Animated.Value(0)).current;
  const reorderSpread = useRef(new Animated.Value(0)).current;
  const actionSpread = useRef(new Animated.Value(0)).current;
  const [reorderChevronsMounted, setReorderChevronsMounted] = useState(false);
  const [actionSubFabMounted, setActionSubFabMounted] = useState(false);

  const fabRotate = useMemo(
    () =>
      fabRotation.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "45deg"],
      }),
    [fabRotation],
  );

  const upTranslateY = useMemo(
    () =>
      reorderSpread.interpolate({
        inputRange: [0, 1],
        outputRange: [UP_STACK_OFFSET, 0],
      }),
    [reorderSpread],
  );

  const downTranslateY = useMemo(
    () =>
      reorderSpread.interpolate({
        inputRange: [0, 1],
        outputRange: [DOWN_STACK_OFFSET, 0],
      }),
    [reorderSpread],
  );

  const actionTranslateY = useMemo(
    () =>
      actionSpread.interpolate({
        inputRange: [0, 1],
        outputRange: [ACTION_STACK_OFFSET, 0],
      }),
    [actionSpread],
  );

  /** 순서 변경: 먼저 + 45° 회전 → 완료 후 chevron 마운트 후 위로 펼침 */
  const enterReorderMode = useCallback(() => {
    Animated.spring(fabRotation, {
      toValue: 1,
      useNativeDriver: true,
      friction: 9,
      tension: 80,
    }).start(({ finished }) => {
      if (!finished) return;
      setReorderChevronsMounted(true);
      reorderSpread.setValue(0);
      requestAnimationFrame(() => {
        Animated.timing(reorderSpread, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }).start();
      });
    });
  }, [fabRotation, reorderSpread]);

  /** 순서 변경 해제: chevron 아래로 겹침 → + 원래 각도 → 언마운트 */
  const exitReorderMode = useCallback(
    (onFullyClosed?: () => void) => {
      Animated.timing(reorderSpread, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (!finished) return;
        Animated.spring(fabRotation, {
          toValue: 0,
          useNativeDriver: true,
          friction: 9,
          tension: 80,
        }).start(({ finished: f2 }) => {
          if (!f2) return;
          setReorderChevronsMounted(false);
          onFullyClosed?.();
        });
      });
    },
    [fabRotation, reorderSpread],
  );

  /** 회전만 끝나기 전 FAB 탭 시 0°로 되돌림 (순서 변경 / 수정·삭제 공통) */
  const cancelRotationOnlyEnter = useCallback(
    (onDone?: () => void) => {
      fabRotation.stopAnimation();
      Animated.spring(fabRotation, {
        toValue: 0,
        useNativeDriver: true,
        friction: 9,
        tension: 80,
      }).start(({ finished }) => {
        if (finished) onDone?.();
      });
    },
    [fabRotation],
  );

  /** 수정·삭제: 회전 → 서브 FAB 마운트 → 위로 슬라이드 */
  const enterActionSubFabMode = useCallback(() => {
    Animated.spring(fabRotation, {
      toValue: 1,
      useNativeDriver: true,
      friction: 9,
      tension: 80,
    }).start(({ finished }) => {
      if (!finished) return;
      setActionSubFabMounted(true);
      actionSpread.setValue(0);
      requestAnimationFrame(() => {
        Animated.timing(actionSpread, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }).start();
      });
    });
  }, [actionSpread, fabRotation]);

  /** 수정·삭제 해제: 서브 아래로 겹침 → 0° → 언마운트 */
  const exitActionSubFabMode = useCallback(
    (onFullyClosed?: () => void) => {
      Animated.timing(actionSpread, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (!finished) return;
        Animated.spring(fabRotation, {
          toValue: 0,
          useNativeDriver: true,
          friction: 9,
          tension: 80,
        }).start(({ finished: f2 }) => {
          if (!f2) return;
          setActionSubFabMounted(false);
          onFullyClosed?.();
        });
      });
    },
    [actionSpread, fabRotation],
  );

  const resetInstant = useCallback(() => {
    fabRotation.stopAnimation();
    reorderSpread.stopAnimation();
    actionSpread.stopAnimation();
    fabRotation.setValue(0);
    reorderSpread.setValue(0);
    actionSpread.setValue(0);
    setReorderChevronsMounted(false);
    setActionSubFabMounted(false);
  }, [actionSpread, fabRotation, reorderSpread]);

  return {
    fabRotate,
    upTranslateY,
    downTranslateY,
    actionTranslateY,
    reorderChevronsMounted,
    actionSubFabMounted,
    enterReorderMode,
    exitReorderMode,
    cancelRotationOnlyEnter,
    enterActionSubFabMode,
    exitActionSubFabMode,
    resetInstant,
  };
}
