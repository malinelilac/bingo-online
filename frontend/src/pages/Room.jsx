import React, { useEffect, useState } from "react";
import { socket } from "../services/socket";
import PlayerList from "../components/PlayerList";
import NumberBoard from "../components/NumberBoard";
import BingoCard from "../components/BingoCard";

export default function Room({ session }) {
  const [players, setPlayers] = useState([]);
  const [numbers, setNumbers] = useState([]);
  const [card, setCard] = useState([]);
  const [winner, setWinner] = useState(null);

  useEffect(() => {
  const nums = new Set();
  while (nums.size < 25) nums.add(Math.floor(Math.random() * 75) + 1);
  setCard([...nums]);

  // Entrar na sala
  socket.emit("join_room", session);

  // Recebe lista completa de jogadores
  socket.on("update_players", (playerList) => setPlayers(playerList));

  // Recebe lista completa de números
  socket.on("update_numbers", (list) => setNumbers(list));

  // Eventos de atualização
  socket.on("player_joined", (player) => setPlayers((p) => [...p, player]));
  socket.on("number_drawn", (num) => setNumbers((n) => [...n, num]));
  socket.on("player_removed", (id) => setPlayers((p) => p.filter(pl => pl.playerId !== id)));
  socket.on("room_closed", () => alert("Sala fechada"));
  socket.on("bingo_winner", (name) => setWinner(name));
  socket.on("error_message", (msg) => alert(msg));

  return () => socket.off();
}, []);


  function drawNumber() {
    const number = Math.floor(Math.random() * 75) + 1;
    socket.emit("draw_number", { roomCode: session.roomCode, number });
  }

  function checkBingo() {
    const marked = card.map((num) => numbers.includes(num));
    const winPatterns = [];

    for (let i = 0; i < 5; i++) winPatterns.push(marked.slice(i * 5, i * 5 + 5).every(Boolean));
    for (let i = 0; i < 5; i++) winPatterns.push([0, 1, 2, 3, 4].map((r) => marked[i + r * 5]).every(Boolean));
    winPatterns.push([0, 6, 12, 18, 24].map((i) => marked[i]).every(Boolean));
    winPatterns.push([4, 8, 12, 16, 20].map((i) => marked[i]).every(Boolean));

    if (winPatterns.some(Boolean)) {
      socket.emit("player_bingo", { roomCode: session.roomCode, playerName: session.name || "Jogador" });
    } else {
      alert("Ainda não completou um padrão de bingo!");
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-sky-500 via-cyan-400 to-emerald-300 p-4 text-white">
      <div className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl shadow-2xl p-6 w-full max-w-5xl animate-fadeIn">
        <h2 className="text-2xl font-bold text-center mb-4">Sala {session.roomCode}</h2>
        {winner && (
          <div className="bg-yellow-400 text-black text-lg font-semibold p-2 rounded-lg text-center mb-4 animate-bounce">
            🎉 {winner} venceu o Bingo! 🎉
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-4">
          <PlayerList players={players} />
          <NumberBoard numbers={numbers} />
          <BingoCard numbers={card} drawn={numbers} />
        </div>

        <div className="flex flex-col md:flex-row gap-4 mt-6 justify-center">
          {session.isOwner && (
            <button
              className="px-6 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-yellow-400 to-orange-400 hover:scale-105 transition"
              onClick={drawNumber}
            >
              Sortear Número
            </button>
          )}
          <button
            className="px-6 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-green-400 to-emerald-500 hover:scale-105 transition"
            onClick={checkBingo}
          >
            Checar Bingo
          </button>
        </div>
      </div>
    </div>
  );
}
