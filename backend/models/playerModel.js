import { db } from "../db.js";

export async function addPlayer(id, name, roomCode, isOwner) {
  return db.run(`INSERT INTO players (id, name, roomCode, isOwner) VALUES (?, ?, ?, ?)`, 
    [id, name, roomCode, isOwner ? 1 : 0]);
}

export async function removePlayer(id) {
  return db.run(`DELETE FROM players WHERE id = ?`, [id]);
}

export async function getPlayersInRoom(roomCode) {
  return db.all(`SELECT * FROM players WHERE roomCode = ?`, [roomCode]);
}
