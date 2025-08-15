import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import crypto from "crypto";

import { db } from "./db.js";
import { createRoom, getRoomByCode } from "./models/roomModel.js";
import { addPlayer } from "./models/playerModel.js";
import { setupBingoSocket } from "./sockets/bingoSocket.js";

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Criar sala
app.post("/create-room", async (req, res) => {
  const { name } = req.body;
  const code = crypto.randomBytes(3).toString("hex").toUpperCase();
  const playerId = crypto.randomUUID();

  await createRoom(code, playerId);
  await addPlayer(playerId, name, code, true);

  res.json({ roomCode: code, playerId, isOwner: true });
});

// Entrar na sala
app.post("/join-room", async (req, res) => {
  const { name, code } = req.body;
  const room = await getRoomByCode(code);
  if (!room) return res.status(404).json({ error: "Sala não encontrada" });

  const playerId = crypto.randomUUID();
  await addPlayer(playerId, name, code, false);

  res.json({ roomCode: code, playerId, isOwner: false });
});

// Configura socket
setupBingoSocket(io);

server.listen(4000, () => console.log("Backend rodando na porta 4000"));
