import { useCallback, useMemo, useRef, useState } from "react";
import { Animated } from "react-native";

const FAB_SIZE = 50;
const GAP = 15;
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
  /** 순서 변경 chevron 레이어 — spread와 별도로 duration 등 세밀 조정 가능 (enter/exit parallel에 포함) */
  const reorderChevronsOpacity = useRef(new Animated.Value(0)).current;
  const actionSpread = useRef(new Animated.Value(0)).current;
  /** 수정·삭제 서브 FAB — 동일 */
  const actionSubFabOpacity = useRef(new Animated.Value(0)).current;
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

  /** 순서 변경: chevron 마운트 후 회전 + 펼침 + 불투명도 동시 (각 timing/spring 수치 여기서 조절) */
  const enterReorderMode = useCallback(() => {
    // setIsFabClusterAnimating(true);
    setReorderChevronsMounted(true);
    reorderSpread.setValue(0);
    reorderChevronsOpacity.setValue(0);
    requestAnimationFrame(() => {
      Animated.parallel([
        Animated.spring(fabRotation, {
          toValue: 1,
          useNativeDriver: true,
          friction: 9,
          tension: 40,
        }),
        Animated.timing(reorderSpread, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(reorderChevronsOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // setIsFabClusterAnimating(false);
      });
    });
  }, [fabRotation, reorderChevronsOpacity, reorderSpread]);

  /** 순서 변경 해제: 겹침 + 원래 각도 동시 → 언마운트 */
  const exitReorderMode = useCallback(
    (onFullyClosed?: () => void) => {
      setIsFabClusterAnimating(true);
      Animated.parallel([
        Animated.timing(reorderSpread, {
          toValue: 0,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.spring(fabRotation, {
          toValue: 0,
          useNativeDriver: true,
          friction: 9,
          tension: 40,
        }),
        Animated.timing(reorderChevronsOpacity, {
          toValue: 0,
          duration: 350,
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        setIsFabClusterAnimating(false);
        if (!finished) return;
        setReorderChevronsMounted(false);
        onFullyClosed?.();
      });
    },
    [fabRotation, reorderChevronsOpacity, reorderSpread],
  );

  /** 진입 직후 취소: 회전·펼침 애니메이션 중단 후 0으로 (순서 변경 / 수정·삭제 공통) */
  const cancelRotationOnlyEnter = useCallback(
    (onDone?: () => void) => {
      setIsFabClusterAnimating(true);
      fabRotation.stopAnimation();
      reorderSpread.stopAnimation();
      reorderChevronsOpacity.stopAnimation();
      actionSpread.stopAnimation();
      actionSubFabOpacity.stopAnimation();
      reorderSpread.setValue(0);
      reorderChevronsOpacity.setValue(0);
      actionSpread.setValue(0);
      actionSubFabOpacity.setValue(0);
      Animated.spring(fabRotation, {
        toValue: 0,
        useNativeDriver: true,
        friction: 9,
        tension: 40,
      }).start(({ finished }) => {
        setIsFabClusterAnimating(false);
        if (finished) onDone?.();
      });
    },
    [
      actionSpread,
      actionSubFabOpacity,
      fabRotation,
      reorderChevronsOpacity,
      reorderSpread,
    ],
  );

  /** 수정·삭제: 서브 FAB 마운트 후 회전 + 슬라이드 + 불투명도 동시 */
  const enterActionSubFabMode = useCallback(() => {
    // setIsFabClusterAnimating(true);
    setActionSubFabMounted(true);
    actionSpread.setValue(0);
    actionSubFabOpacity.setValue(0);
    requestAnimationFrame(() => {
      Animated.parallel([
        Animated.spring(fabRotation, {
          toValue: 1,
          useNativeDriver: true,
          friction: 9,
          tension: 40,
        }),
        Animated.timing(actionSpread, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(actionSubFabOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // setIsFabClusterAnimating(false);
      });
    });
  }, [actionSpread, actionSubFabOpacity, fabRotation]);

  /** 수정·삭제 해제: 접힘 + 원래 각도 동시 → 언마운트 */
  const exitActionSubFabMode = useCallback(
    (onFullyClosed?: () => void) => {
      setIsFabClusterAnimating(true);
      Animated.parallel([
        Animated.timing(actionSpread, {
          toValue: 0,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.spring(fabRotation, {
          toValue: 0,
          useNativeDriver: true,
          friction: 9,
          tension: 40,
        }),
        Animated.timing(actionSubFabOpacity, {
          toValue: 0,
          duration: 350,
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        setIsFabClusterAnimating(false);
        if (!finished) return;
        setActionSubFabMounted(false);
        onFullyClosed?.();
      });
    },
    [actionSpread, actionSubFabOpacity, fabRotation],
  );

  const resetInstant = useCallback(() => {
    fabRotation.stopAnimation();
    reorderSpread.stopAnimation();
    reorderChevronsOpacity.stopAnimation();
    actionSpread.stopAnimation();
    actionSubFabOpacity.stopAnimation();
    fabRotation.setValue(0);
    reorderSpread.setValue(0);
    reorderChevronsOpacity.setValue(0);
    actionSpread.setValue(0);
    actionSubFabOpacity.setValue(0);
    setReorderChevronsMounted(false);
    setActionSubFabMounted(false);
    setIsFabClusterAnimating(false);
  }, [
    actionSpread,
    actionSubFabOpacity,
    fabRotation,
    reorderChevronsOpacity,
    reorderSpread,
  ]);

  return {
    fabRotate,
    upTranslateY,
    downTranslateY,
    actionTranslateY,
    reorderChevronsOpacity,
    actionSubFabOpacity,
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
