import { db } from "../db.js";

export async function createRoom(code, ownerId) {
  return db.run(`INSERT INTO rooms (code, ownerId) VALUES (?, ?)`, [code, ownerId]);
}

export async function getRoomByCode(code) {
  return db.get(`SELECT * FROM rooms WHERE code = ?`, [code]);
}

export async function deleteRoom(code) {
  return db.run(`DELETE FROM rooms WHERE code = ?`, [code]);
}
