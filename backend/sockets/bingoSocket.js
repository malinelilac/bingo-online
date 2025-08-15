import { addNumber, getNumbers } from "../models/numberModel.js";
import { removePlayer } from "../models/playerModel.js";
import { deleteRoom } from "../models/roomModel.js";

export function setupBingoSocket(io) {
  // Lista de jogadores em cada sala
  const rooms = {}; 
  // Lista de números sorteados em cada sala
  const roomNumbers = {};
  
  
  io.on("connection", (socket) => {
    console.log("Novo usuário conectado:", socket.id);

    socket.on("join_room", ({ roomCode, name, playerId }) => {
      socket.join(roomCode);
      io.to(roomCode).emit("player_joined", { playerId, name });
    });

    socket.on("draw_number", async ({ roomCode, number }) => {
      const success = await addNumber(roomCode, number);
      if (!success) {
        socket.emit("error_message", "Número já sorteado!");
        return;
      }
      io.to(roomCode).emit("number_drawn", number);
    });

    socket.on("player_bingo", ({ roomCode, playerName }) => {
      io.to(roomCode).emit("bingo_winner", playerName);
    });

    socket.on("remove_player", async ({ roomCode, targetId }) => {
      await removePlayer(targetId);
      io.to(roomCode).emit("player_removed", targetId);
    });

    socket.on("close_room", async ({ roomCode }) => {
      await deleteRoom(roomCode);
      io.to(roomCode).emit("room_closed");
    });

    socket.on("join_room", ({ roomCode, name, playerId }) => {
      socket.join(roomCode);

      // Se quiser evitar duplicados:
      if (!rooms[roomCode]) rooms[roomCode] = [];
      const exists = rooms[roomCode].some(p => p.playerId === playerId);
      if (!exists) {
          rooms[roomCode].push({ playerId, name });
      }

      // Envia a lista completa para todos na sala
      io.to(roomCode).emit("update_players", rooms[roomCode]);
    });
  });
}
