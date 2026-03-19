import * as SQLite from "expo-sqlite";
import { runMigrations } from "./schema";
import { seedDefaultCategories } from "./todo-categories";

export const db = SQLite.openDatabaseSync("app.db");

export function initDb() {
  db.execSync("PRAGMA foreign_keys = ON;");
  runMigrations(db);
  seedDefaultCategories(db);
}
