import { db } from "../db.js";

export async function addNumber(roomCode, number) {
  // Verifica se já foi sorteado
  const exists = await db.get(
    `SELECT * FROM drawn_numbers WHERE roomCode = ? AND number = ?`,
    [roomCode, number]
  );
  if (exists) return false;

  await db.run(
    `INSERT INTO drawn_numbers (roomCode, number) VALUES (?, ?)`,
    [roomCode, number]
  );
  return true;
}

export async function getNumbers(roomCode) {
  return db.all(`SELECT number FROM drawn_numbers WHERE roomCode = ?`, [roomCode]);
}
