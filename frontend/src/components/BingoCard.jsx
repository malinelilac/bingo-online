export default function BingoCard({ numbers, drawn }) {
  return (
    <div className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-xl p-4 shadow-md">
      <h4 className="text-lg font-semibold text-center mb-3">🎯 Sua Cartela</h4>
      <div className="grid grid-cols-5 gap-2">
        {numbers.map((n, i) => (
          <div
            key={i}
            className={`p-3 rounded-lg text-center font-bold text-lg transition-all ${
              drawn.includes(n)
                ? "bg-gradient-to-r from-pink-500 to-yellow-400 text-white scale-105"
                : "bg-white/10 text-white"
            }`}
          >
            {n}
          </div>
        ))}
      </div>
    </div>
  );
}