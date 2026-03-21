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
  /** FAB 진입·종료·취소 애니메이션 중 — 할 일 카드 터치 등 상호작용 잠금용 */
  const [isFabClusterAnimating, setIsFabClusterAnimating] = useState(false);

  const fabRotate = useMemo(
    () =>
      fabRotation.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "135deg"],
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

  /** 순서 변경: chevron 마운트 후 회전 + 펼침 동시 실행 */
  const enterReorderMode = useCallback(() => {
    setIsFabClusterAnimating(true);
    setReorderChevronsMounted(true);
    reorderSpread.setValue(0);
    requestAnimationFrame(() => {
      Animated.parallel([
        Animated.spring(fabRotation, {
          toValue: 1,
          useNativeDriver: true,
          friction: 9,
          tension: 50,
        }),
        Animated.timing(reorderSpread, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsFabClusterAnimating(false);
      });
    });
  }, [fabRotation, reorderSpread]);

  /** 순서 변경 해제: 겹침 + 원래 각도 동시 → 언마운트 */
  const exitReorderMode = useCallback(
    (onFullyClosed?: () => void) => {
      setIsFabClusterAnimating(true);
      Animated.parallel([
        Animated.timing(reorderSpread, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(fabRotation, {
          toValue: 0,
          useNativeDriver: true,
          friction: 9,
          tension: 50,
        }),
      ]).start(({ finished }) => {
        setIsFabClusterAnimating(false);
        if (!finished) return;
        setReorderChevronsMounted(false);
        onFullyClosed?.();
      });
    },
    [fabRotation, reorderSpread],
  );

  /** 진입 직후 취소: 회전·펼침 애니메이션 중단 후 0으로 (순서 변경 / 수정·삭제 공통) */
  const cancelRotationOnlyEnter = useCallback(
    (onDone?: () => void) => {
      setIsFabClusterAnimating(true);
      fabRotation.stopAnimation();
      reorderSpread.stopAnimation();
      actionSpread.stopAnimation();
      reorderSpread.setValue(0);
      actionSpread.setValue(0);
      Animated.spring(fabRotation, {
        toValue: 0,
        useNativeDriver: true,
        friction: 9,
        tension: 50,
      }).start(({ finished }) => {
        setIsFabClusterAnimating(false);
        if (finished) onDone?.();
      });
    },
    [actionSpread, fabRotation, reorderSpread],
  );

  /** 수정·삭제: 서브 FAB 마운트 후 회전 + 슬라이드 동시 */
  const enterActionSubFabMode = useCallback(() => {
    setIsFabClusterAnimating(true);
    setActionSubFabMounted(true);
    actionSpread.setValue(0);
    requestAnimationFrame(() => {
      Animated.parallel([
        Animated.spring(fabRotation, {
          toValue: 1,
          useNativeDriver: true,
          friction: 9,
          tension: 50,
        }),
        Animated.timing(actionSpread, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsFabClusterAnimating(false);
      });
    });
  }, [actionSpread, fabRotation]);

  /** 수정·삭제 해제: 접힘 + 원래 각도 동시 → 언마운트 */
  const exitActionSubFabMode = useCallback(
    (onFullyClosed?: () => void) => {
      setIsFabClusterAnimating(true);
      Animated.parallel([
        Animated.timing(actionSpread, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(fabRotation, {
          toValue: 0,
          useNativeDriver: true,
          friction: 9,
          tension: 50,
        }),
      ]).start(({ finished }) => {
        setIsFabClusterAnimating(false);
        if (!finished) return;
        setActionSubFabMounted(false);
        onFullyClosed?.();
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
    setIsFabClusterAnimating(false);
  }, [actionSpread, fabRotation, reorderSpread]);

  return {
    fabRotate,
    upTranslateY,
    downTranslateY,
    actionTranslateY,
    reorderChevronsMounted,
    actionSubFabMounted,
    isFabClusterAnimating,
    enterReorderMode,
    exitReorderMode,
    cancelRotationOnlyEnter,
    enterActionSubFabMode,
    exitActionSubFabMode,
    resetInstant,
  };
}
