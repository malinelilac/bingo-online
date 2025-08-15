export default function PlayerList({ players }) {
  return (
    <div className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-xl p-4 shadow-md">
      <h4 className="text-lg font-semibold text-center mb-3">👥 Jogadores</h4>
      <ul className="space-y-1">
        {players.length > 0 ? (
          players.map((p) => (
            <li key={p.playerId} className="p-2 rounded bg-white/10">
              {p.name}
            </li>
          ))
        ) : (
          <li className="text-sm text-white/70">Nenhum jogador ainda</li>
        )}
      </ul>
    </div>
  );
}
