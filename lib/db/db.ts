import * as SQLite from "expo-sqlite";
import { resetDatabase, runMigrations } from "./schema";
import { seedDefaultCategories } from "./todo-categories";

export const db = SQLite.openDatabaseSync("app.db");

const SHOULD_RESET_DB = false;

export function initDb() {
  db.execSync("PRAGMA foreign_keys = ON;");

  if (__DEV__ && SHOULD_RESET_DB) {
    resetDatabase(db);
  } else {
    runMigrations(db);
  }

  seedDefaultCategories(db);
}
