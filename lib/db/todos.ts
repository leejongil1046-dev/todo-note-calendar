import type { SQLiteDatabase } from "expo-sqlite";

import type { TodoCategory } from "@/types/todo-types";

export type RepeatType = "daily" | "weekday" | "weekend";

export type CreateTodoPayload = {
  category: TodoCategory;
  tasks: string[];
  content: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  repeatType: RepeatType | null;
};

export type TodoTaskItem = {
  id: number;
  title: string;
  isDone: boolean;
  sortOrder: number;
};

export type TodoForDate = {
  todoId: number;
  categoryName: string;
  categoryColor: string;
  content: string | null;
  tasks: TodoTaskItem[];
};

export function createTodoWithTasks(
  db: SQLiteDatabase,
  payload: CreateTodoPayload,
) {
  const now = Date.now();

  const contentValue =
    payload.content.trim().length > 0 ? payload.content.trim() : null;

  const repeatTypeValue =
    payload.startDate === payload.endDate ? null : payload.repeatType;

  db.runSync(
    `
      INSERT INTO todo_categories (id, name, color, created_at)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        color = excluded.color
    `,
    [payload.category.id, payload.category.name, payload.category.color, now],
  );

  const todoResult = db.runSync(
    `
      INSERT INTO todos (
        category_id,
        content,
        start_date,
        end_date,
        repeat_type,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [
      payload.category.id,
      contentValue,
      payload.startDate,
      payload.endDate,
      repeatTypeValue,
      now,
      now,
    ],
  );

  const todoId = Number(todoResult.lastInsertRowId);

  payload.tasks.forEach((title, index) => {
    const trimmed = title.trim();
    if (!trimmed) return;

    db.runSync(
      `
        INSERT INTO todo_tasks (
          todo_id,
          title,
          is_done,
          sort_order,
          created_at,
          updated_at
        ) VALUES (?, ?, 0, ?, ?, ?)
      `,
      [todoId, trimmed, index, now, now],
    );
  });

  return todoId;
}

export function getTodosForDate(
  db: SQLiteDatabase,
  dateString: string,
): TodoForDate[] {
  const rows = db.getAllSync<{
    todoId: number;
    categoryName: string;
    categoryColor: string;
    content: string | null;
    taskId: number | null;
    taskTitle: string | null;
    taskIsDone: number | null;
    taskSortOrder: number | null;
    updatedAt: number;
    createdAt: number;
  }>(
    `
        SELECT
          t.id AS todoId,
          c.name AS categoryName,
          c.color AS categoryColor,
          t.content AS content,
          tt.id AS taskId,
          tt.title AS taskTitle,
          tt.is_done AS taskIsDone,
          tt.sort_order AS taskSortOrder,
          t.created_at AS createdAt,
          t.updated_at AS updatedAt
        FROM todos t
        JOIN todo_categories c ON c.id = t.category_id
        LEFT JOIN todo_tasks tt ON tt.todo_id = t.id
        WHERE t.start_date <= ?
          AND t.end_date >= ?
        ORDER BY t.created_at ASC, tt.sort_order ASC
      `,
    [dateString, dateString],
  );

  const todoMap = new Map<number, TodoForDate>();

  for (const row of rows) {
    if (!todoMap.has(row.todoId)) {
      todoMap.set(row.todoId, {
        todoId: row.todoId,
        categoryName: row.categoryName,
        categoryColor: row.categoryColor,
        content: row.content,
        tasks: [],
      });
    }

    const todo = todoMap.get(row.todoId)!;

    if (
      row.taskId !== null &&
      row.taskTitle !== null &&
      row.taskSortOrder !== null
    ) {
      todo.tasks.push({
        id: row.taskId,
        title: row.taskTitle,
        isDone: row.taskIsDone === 1,
        sortOrder: row.taskSortOrder,
      });
    }
  }

  return Array.from(todoMap.values());
}

export function getTodoCountForDate(
  db: SQLiteDatabase,
  dateString: string,
): number {
  const row = db.getFirstSync<{ count: number }>(
    `
        SELECT COUNT(*) AS count
        FROM todos t
        WHERE t.start_date <= ?
          AND t.end_date >= ?
      `,
    [dateString, dateString],
  );

  return row?.count ?? 0;
}

export function updateTodoTaskDone(
  db: SQLiteDatabase,
  todoId: number,
  taskId: number,
  isDone: boolean,
) {
  const now = Date.now();

  db.runSync(
    `
        UPDATE todo_tasks
        SET is_done = ?, updated_at = ?
        WHERE id = ?
      `,
    [isDone ? 1 : 0, now, taskId],
  );

  db.runSync(
    `
        UPDATE todos
        SET updated_at = ?
        WHERE id = ?
      `,
    [now, todoId],
  );
}

export function updateAllTodoTasksDone(
  db: SQLiteDatabase,
  todoId: number,
  isDone: boolean,
) {
  const now = Date.now();

  db.runSync(
    `
      UPDATE todo_tasks
      SET is_done = ?, updated_at = ?
      WHERE todo_id = ?
    `,
    [isDone ? 1 : 0, now, todoId],
  );

  db.runSync(
    `
      UPDATE todos
      SET updated_at = ?
      WHERE id = ?
    `,
    [now, todoId],
  );
}

export function deleteTodo(db: SQLiteDatabase, todoId: number) {
  const result = db.runSync(
    `
        DELETE FROM todos
        WHERE id = ?
      `,
    [todoId],
  );

  return result.changes;
}
