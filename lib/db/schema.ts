import type { SQLiteDatabase } from "expo-sqlite";

export function runMigrations(db: SQLiteDatabase) {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS todo_categories (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      color TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );
  `);

  db.execSync(`
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_id TEXT NOT NULL,
      content TEXT,
      date TEXT NOT NULL,
      sort_order INTEGER NOT NULL,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      FOREIGN KEY (category_id) REFERENCES todo_categories(id)
    );
  `);

  db.execSync(`
    CREATE TABLE IF NOT EXISTS todo_tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      todo_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      is_done INTEGER NOT NULL DEFAULT 0,
      sort_order INTEGER NOT NULL,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      FOREIGN KEY (todo_id) REFERENCES todos(id) ON DELETE CASCADE
    );
  `);
}

export function resetDatabase(db: SQLiteDatabase) {
  db.execSync(`
    PRAGMA foreign_keys = OFF;

    DROP TABLE IF EXISTS todo_tasks;
    DROP TABLE IF EXISTS todos;
    DROP TABLE IF EXISTS todo_categories;

    PRAGMA foreign_keys = ON;
  `);

  runMigrations(db);
}
