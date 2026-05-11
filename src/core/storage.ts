import Database from 'better-sqlite3';
import path from 'node:path';
import type { TestRun } from '../types/index.js';

const DB_PATH = path.join(process.cwd(), '.sentinel.db');

export function getDb(): Database.Database {
  const db = new Database(DB_PATH);

  db.exec(`
    CREATE TABLE IF NOT EXISTS test_runs (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      test_title TEXT    NOT NULL,
      file_path  TEXT    NOT NULL,
      status     TEXT    NOT NULL,
      duration   INTEGER NOT NULL,
      timestamp  TEXT    NOT NULL
    )
  `);

  return db;
}

export function insertTestRun(run: TestRun): void {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO test_runs (test_title, file_path, status, duration, timestamp)
    VALUES (@test_title, @file_path, @status, @duration, @timestamp)
  `);
  stmt.run(run);
}

export function getAllRuns(): TestRun[] {
  const db = getDb();
  return db.prepare(
    'SELECT * FROM test_runs ORDER BY timestamp DESC'
  ).all() as TestRun[];
}
