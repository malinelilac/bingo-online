import sqlite3 from "sqlite3";
import { open } from "sqlite";

export const db = await open({
  filename: "./db.sqlite",
  driver: sqlite3.Database
});

await db.exec(`
CREATE TABLE IF NOT EXISTS rooms (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT UNIQUE,
  ownerId TEXT
);

CREATE TABLE IF NOT EXISTS players (
  id TEXT PRIMARY KEY,
  name TEXT,
  roomCode TEXT,
  isOwner INTEGER
);

CREATE TABLE IF NOT EXISTS drawn_numbers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  roomCode TEXT,
  number INTEGER
);
`);