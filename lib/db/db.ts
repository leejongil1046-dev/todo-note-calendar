import * as SQLite from "expo-sqlite";
import { runMigrations } from "./schema";

export const db = SQLite.openDatabaseSync("app.db");

export function initDb() {
  db.execSync("PRAGMA foreign_keys = ON;");
  runMigrations(db);
}
