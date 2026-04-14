export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 mesh-bg flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-400 flex items-center justify-center animate-glow-pulse">
            <span className="font-display text-white text-xl font-bold">C</span>
          </div>
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-400 opacity-30 blur-lg animate-pulse" />
        </div>
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-sky-500"
              style={{ animation: `bounce 1s ease-in-out ${i * 0.15}s infinite` }}
            />
          ))}
        </div>
      </div>
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50% { transform: translateY(-8px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
