import type { SQLiteDatabase } from "expo-sqlite";

import { TodoSummary } from "@/types/calendar-types";
import type { TodoCategory } from "@/types/todo-types";

export type CreateTodoPayload = {
  category: TodoCategory;
  tasks: string[];
  content: string;
  date: string; // YYYY-MM-DD
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
  date: string;
  sortOrder: number;
  tasks: TodoTaskItem[];
};

const getNextTodoSortOrder = (db: SQLiteDatabase, dateString: string) => {
  const row = db.getFirstSync<{ maxSortOrder: number | null }>(
    `
      SELECT MAX(sort_order) AS maxSortOrder
      FROM todos
      WHERE date = ?
    `,
    [dateString],
  );

  return (row?.maxSortOrder ?? -1) + 1;
};

export function createTodoWithTasks(
  db: SQLiteDatabase,
  payload: CreateTodoPayload,
) {
  const now = Date.now();

  const contentValue =
    payload.content.trim().length > 0 ? payload.content.trim() : null;

  const trimmedTasks = payload.tasks
    .map((title) => title.trim())
    .filter((title) => title.length > 0);

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

  const nextSortOrder = getNextTodoSortOrder(db, payload.date);

  const todoResult = db.runSync(
    `
      INSERT INTO todos (
        category_id,
        content,
        date,
        sort_order,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?)
    `,
    [payload.category.id, contentValue, payload.date, nextSortOrder, now, now],
  );

  const todoId = Number(todoResult.lastInsertRowId);

  trimmedTasks.forEach((title, index) => {
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
      [todoId, title, index, now, now],
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
    date: string;
    todoSortOrder: number;
    taskId: number | null;
    taskTitle: string | null;
    taskIsDone: number | null;
    taskSortOrder: number | null;
  }>(
    `
      SELECT
        t.id AS todoId,
        c.name AS categoryName,
        c.color AS categoryColor,
        t.content AS content,
        t.date AS date,
        t.sort_order AS todoSortOrder,
        tt.id AS taskId,
        tt.title AS taskTitle,
        tt.is_done AS taskIsDone,
        tt.sort_order AS taskSortOrder
      FROM todos t
      JOIN todo_categories c
        ON c.id = t.category_id
      LEFT JOIN todo_tasks tt
        ON tt.todo_id = t.id
      WHERE t.date = ?
      ORDER BY
        t.sort_order ASC,
        t.created_at ASC,
        t.id ASC,
        tt.sort_order ASC,
        tt.id ASC
    `,
    [dateString],
  );

  const todoMap = new Map<number, TodoForDate>();

  for (const row of rows) {
    if (!todoMap.has(row.todoId)) {
      todoMap.set(row.todoId, {
        todoId: row.todoId,
        categoryName: row.categoryName,
        categoryColor: row.categoryColor,
        content: row.content,
        date: row.date,
        sortOrder: row.todoSortOrder,
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

export function getTodoSummaryForDate(
  db: SQLiteDatabase,
  dateString: string,
): TodoSummary {
  const rows = db.getAllSync<{
    todoId: number;
    categoryName: string;
    categoryColor: string;
  }>(
    `
      SELECT
        t.id AS todoId,
        c.name AS categoryName,
        c.color AS categoryColor
      FROM todos t
      JOIN todo_categories c
        ON c.id = t.category_id
      WHERE t.date = ?
      ORDER BY
        t.sort_order ASC,
        t.created_at ASC,
        t.id ASC
    `,
    [dateString],
  );

  return {
    count: rows.length,
    previews: rows.slice(0, 3).map((row) => ({
      categoryName: row.categoryName,
      categoryColor: row.categoryColor,
    })),
  };
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

export function updateTodoOrders(db: SQLiteDatabase, orderedTodoIds: number[]) {
  const now = Date.now();

  db.execSync("BEGIN");

  try {
    orderedTodoIds.forEach((todoId, index) => {
      db.runSync(
        `
          UPDATE todos
          SET sort_order = ?, updated_at = ?
          WHERE id = ?
        `,
        [index, now, todoId],
      );
    });

    db.execSync("COMMIT");
  } catch (error) {
    db.execSync("ROLLBACK");
    throw error;
  }
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
