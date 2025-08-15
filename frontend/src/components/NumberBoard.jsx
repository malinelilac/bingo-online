export default function NumberBoard({ numbers }) {
  return (
    <div className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-xl p-4 shadow-md">
      <h4 className="text-lg font-semibold text-center mb-3">🎲 Números Sorteados</h4>
      <p className="text-center break-words">
        {numbers.length > 0 ? numbers.join(", ") : "Nenhum número sorteado ainda"}
      </p>
    </div>
  );
}
