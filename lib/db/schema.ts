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
      start_date TEXT NOT NULL,
      end_date TEXT NOT NULL,
      repeat_type TEXT,
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
      sort_order INTEGER,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      FOREIGN KEY (todo_id) REFERENCES todos(id) ON DELETE CASCADE
    );
  `);
}
