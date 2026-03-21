import type { SQLiteDatabase } from "expo-sqlite";

import type { TodoCategory } from "@/types/todo-types";

export const DEFAULT_CATEGORIES: TodoCategory[] = [
  { id: "exercise", name: "운동", color: "#EAF4FF" },
  { id: "study", name: "공부", color: "#EAFBF3" },
  { id: "schedule", name: "약속", color: "#F3EEFF" },
];

export function seedDefaultCategories(db: SQLiteDatabase) {
  const now = Date.now();
  for (const category of DEFAULT_CATEGORIES) {
    db.runSync(
      `
        INSERT INTO todo_categories (id, name, color, created_at)
        VALUES (?, ?, ?, ?)
        ON CONFLICT(id) DO NOTHING
      `,
      [category.id, category.name, category.color, now],
    );
  }
}

export function getTodoCategories(db: SQLiteDatabase): TodoCategory[] {
  const rows = db.getAllSync<{ id: string; name: string; color: string }>(
    "SELECT id, name, color FROM todo_categories ORDER BY created_at ASC",
  );

  return rows;
}

export function upsertTodoCategory(db: SQLiteDatabase, category: TodoCategory) {
  const now = Date.now();

  db.runSync(
    `
      INSERT INTO todo_categories (id, name, color, created_at)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        color = excluded.color,
        created_at = excluded.created_at
    `,
    [category.id, category.name, category.color, now],
  );
}
