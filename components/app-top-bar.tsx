// components/AppTopBar.tsx
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  title?: string;
  onPressMenu?: () => void;
  onPressSearch?: () => void;
  onPressMore?: () => void;
};

export function AppTopBar({
  title = "오늘 할 일",
  onPressMenu,
  onPressSearch,
  onPressMore,
}: Props) {
  return (
    <View style={styles.container}>
      {/* 왼쪽: 메뉴(햄버거) */}
      <TouchableOpacity style={styles.left} onPress={onPressMenu} hitSlop={12}>
        <Feather name="menu" size={22} color="#111827" />
      </TouchableOpacity>

      {/* 가운데: 타이틀 */}
      <View style={styles.center}>
        <Text style={styles.title}>{title}</Text>
      </View>

      {/* 오른쪽: 검색 + 더보기 */}
      <View style={styles.right}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onPressSearch}
          hitSlop={12}
        >
          <Feather name="search" size={20} color="#111827" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onPressMore}
          hitSlop={12}
        >
          <Entypo name="dots-three-vertical" size={18} color="#111827" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 52,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E7EB",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  left: {
    width: 60,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  right: {
    width: 60,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  iconButton: {
    marginLeft: 12,
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
    color: "#111827",
  },
});
