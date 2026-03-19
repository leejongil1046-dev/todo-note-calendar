import { TodoCategory } from "@/types/todo-types";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

type TodoCreateCategorySectionProps = {
  selectedCategory: TodoCategory | null;
  categories: TodoCategory[];
  isDropdownOpen: boolean;
  onToggleDropdown: () => void;
  onSelectCategory: (category: TodoCategory) => void;
  onPressAddCategory: () => void;
};

export function TodoCreateCategorySection({
  selectedCategory,
  categories,
  isDropdownOpen,
  onToggleDropdown,
  onSelectCategory,
  onPressAddCategory,
}: TodoCreateCategorySectionProps) {
  return (
    <View style={styles.section}>
      <Pressable
        style={[
          styles.selectedChip,
          selectedCategory
            ? { backgroundColor: selectedCategory.color }
            : styles.emptyChip,
        ]}
        onPress={onToggleDropdown}
      >
        <Text style={styles.selectedChipText}>
          {selectedCategory ? selectedCategory.name : "카테고리 없음"}
        </Text>
      </Pressable>

      {isDropdownOpen && (
        <View style={styles.inlineDropdownContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipScrollContent}
          >
            {categories.map((category) => {
              const isSelected = selectedCategory?.id === category.id;

              return (
                <Pressable
                  key={category.id}
                  style={[
                    styles.categoryChip,
                    { backgroundColor: category.color },
                    isSelected && styles.categoryChipSelected,
                  ]}
                  onPress={() => onSelectCategory(category)}
                >
                  <Text style={styles.categoryChipText}>{category.name}</Text>
                </Pressable>
              );
            })}

            <Pressable style={styles.addChip} onPress={onPressAddCategory}>
              <Text style={styles.addChipText}>+ 카테고리 추가</Text>
            </Pressable>
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const CHIP_HEIGHT = 34;

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  selectedChip: {
    minHeight: CHIP_HEIGHT,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-start",
    flexShrink: 0,
    borderWidth: 1,
    borderColor: "transparent",
  },
  emptyChip: {
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "transparent",
  },
  selectedChipText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#374151",
  },

  inlineDropdownContainer: {
    flex: 1,
    marginLeft: 10,
    minHeight: CHIP_HEIGHT,
    justifyContent: "center",
  },
  chipScrollContent: {
    paddingRight: 8,
    alignItems: "center",
    gap: 8,
  },

  categoryChip: {
    minHeight: CHIP_HEIGHT,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryChipSelected: {
    borderWidth: 1,
    borderColor: "#AAAAAA",
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#374151",
  },

  addChip: {
    minHeight: CHIP_HEIGHT,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#AAAAAA",
    borderStyle: "dashed",
  },
  addChipText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#0064E0",
  },
});
