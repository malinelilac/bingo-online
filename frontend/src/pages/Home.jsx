import React, { useState } from "react";
import axios from "axios";
import { socket } from "../services/socket"; // importa a instância do socket

export default function Home({ onJoin }) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");

  async function createRoom() {
    if (!name.trim()) return alert("Digite seu nome");

    try {
      const res = await axios.post("http://localhost:4000/create-room", { name });
      const data = { ...res.data, name };

      // Entra na sala como master
      socket.emit("join_room", {
        roomCode: data.code,
        name: name,
        playerId: socket.id
      });

      onJoin(data);
    } catch (err) {
      console.error(err);
      alert("Erro ao criar sala");
    }
  }

  async function joinRoom() {
    if (!name.trim() || !code.trim()) return alert("Preencha nome e código");

    try {
      const res = await axios.post("http://localhost:4000/join-room", { name, code });
      const data = { ...res.data, name };

      socket.emit("join_room", {
        roomCode: data.code,
        name: name,
        playerId: socket.id
      });

      onJoin(data);
    } catch (err) {
      console.error(err);
      alert("Erro ao entrar na sala");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-500 via-cyan-400 to-emerald-300 p-4">
      <div className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl shadow-2xl p-8 w-full max-w-sm animate-fadeIn">
        <h1 className="text-3xl font-bold text-white text-center mb-6 drop-shadow-lg">
          🎯 Bingo da FGV
        </h1>

        <input
          className="w-full p-3 mb-4 rounded-lg border border-white/30 bg-white/80 focus:outline-none focus:ring-2 focus:ring-sky-400"
          placeholder="Seu nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          className="w-full py-3 mb-4 rounded-lg font-semibold text-white bg-gradient-to-r from-yellow-400 to-orange-400 hover:scale-105 transition"
          onClick={createRoom}
        >
          Criar Sala
        </button>

        <div className="flex items-center my-4 text-white/80">
          <div className="flex-1 border-t border-white/30"></div>
          <span className="px-2">ou</span>
          <div className="flex-1 border-t border-white/30"></div>
        </div>

        <input
          className="w-full p-3 mb-4 rounded-lg border border-white/30 bg-white/80 focus:outline-none focus:ring-2 focus:ring-sky-400"
          placeholder="Código da sala"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button
          className="w-full py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-green-400 to-emerald-500 hover:scale-105 transition"
          onClick={joinRoom}
        >
          Entrar na Sala
        </button>
      </div>
    </div>
  );
}
