import type { DateMeta } from "@/types/calendar-types";
import Entypo from "@expo/vector-icons/Entypo";
import { Text } from "@react-navigation/elements";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

export type DateDetailHeaderMenuItem = {
  label: string;
  onPress: () => void;
  /** true면 행 탭 불가(스타일만 흐리게) */
  disabled?: boolean;
};

export const DEFAULT_DATE_DETAIL_HEADER_MENU_ITEMS: DateDetailHeaderMenuItem[] =
  [
    { label: "순서 변경", onPress: () => {} },
    { label: "수정", onPress: () => {} },
    { label: "삭제", onPress: () => {} },
  ];

export type DateDetailModalListHeaderProps = {
  meta: DateMeta;
  menuOpen: boolean;
  onMenuOpenChange: (open: boolean) => void;
  /** 생략 시 `DEFAULT_DATE_DETAIL_HEADER_MENU_ITEMS` */
  menuItems?: DateDetailHeaderMenuItem[];
  menuDisabled?: boolean;
};

export function DateDetailModalListHeader({
  meta,
  menuOpen,
  onMenuOpenChange,
  menuItems: menuItemsProp,
  menuDisabled: menuDisabledFromParent = false,
}: DateDetailModalListHeaderProps) {
  const menuItems = menuItemsProp ?? DEFAULT_DATE_DETAIL_HEADER_MENU_ITEMS;

  const menuDisabled = menuDisabledFromParent || menuItems.length === 0;

  return (
    <View style={styles.headerStackRoot}>
      <View style={styles.listHeader}>
        <View style={styles.dateTextWrapper}>
          <Text style={styles.dateText}>
            {meta.year}년 {meta.month}월 {meta.day}일 ({meta.weekdayLabel})
          </Text>

          {meta.isHoliday && meta.holidayName && (
            <View style={styles.holidayCard}>
              <Text style={styles.holidayText}>{meta.holidayName}</Text>
            </View>
          )}
        </View>

        <View style={styles.menuAnchor}>
          <Pressable
            style={styles.dotsThreeVertical}
            onPress={() => {
              if (menuDisabled) return;
              onMenuOpenChange(!menuOpen);
            }}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="날짜 메뉴"
            accessibilityState={{ expanded: menuOpen }}
            disabled={menuDisabled}
          >
            <Entypo name="dots-three-vertical" size={16} color="#111827" />
          </Pressable>

          {menuOpen && !menuDisabled && menuItems.length > 0 ? (
            <View style={styles.dropdown} accessibilityViewIsModal>
              {menuItems.map((item, index) => (
                <Pressable
                  key={`${item.label}-${index}`}
                  disabled={item.disabled}
                  style={({ pressed }) => [
                    styles.dropdownRow,
                    index < menuItems.length - 1 && styles.dropdownRowBorder,
                    pressed && !item.disabled && styles.dropdownRowPressed,
                    item.disabled && styles.dropdownRowDisabled,
                  ]}
                  onPress={() => {
                    if (item.disabled) return;
                    item.onPress();
                    onMenuOpenChange(false);
                  }}
                  accessibilityState={{ disabled: !!item.disabled }}
                >
                  <Text
                    style={[
                      styles.dropdownRowText,
                      item.disabled && styles.dropdownRowTextDisabled,
                    ]}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  /**
   * FlatList에서 ListHeader 다음 셀이 같은 스크롤 콘텐츠 안에서 나중에 그려지면
   * absolute 드롭다운 위를 덮습니다. 루트에 zIndex/elevation으로 전체 헤더(메뉴 포함)를 위로 올림.
   */
  headerStackRoot: {
    zIndex: 100,
    elevation: 24,
    overflow: "visible",
    marginBottom: 20,
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateTextWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  dateText: {
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 3,
  },
  menuAnchor: {
    position: "relative",
    zIndex: 101,
  },
  dotsThreeVertical: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  dropdown: {
    position: "absolute",
    top: 36,
    right: 0,
    minWidth: 168,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingVertical: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 26,
    zIndex: 102,
  },
  dropdownRow: {
    paddingVertical: 11,
    paddingHorizontal: 14,
  },
  dropdownRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#F3F4F6",
  },
  dropdownRowPressed: {
    backgroundColor: "#F9FAFB",
  },
  dropdownRowText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#111827",
  },
  dropdownRowDisabled: {
    opacity: 0.45,
  },
  dropdownRowTextDisabled: {
    color: "#9CA3AF",
  },
  holidayCard: {
    width: "100%",
    height: 50,
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: "#FEECEC",
    marginVertical: 6,
  },
  holidayText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#DC2626",
  },
});
