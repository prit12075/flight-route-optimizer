import { motion } from 'framer-motion';

const ALGO_CONFIG = {
  greedy: {
    color: '#00d4ff',
    label: 'Nearest Neighbor',
    description: 'Always moves to the closest unvisited city.',
  },
  heldKarp: {
    color: '#c9a84c',
    label: 'Held-Karp DP',
    description: 'Exact optimal via dynamic programming bitmask.',
  },
  divideConquer: {
    color: '#a78bfa',
    label: 'Divide & Conquer',
    description: 'Splits by median X, solves halves, merges.',
  },
};

export default function AlgorithmCard({ algo, result, isActive, onClick, onReplay }) {
  const cfg = ALGO_CONFIG[algo];

  return (
    <motion.div
      layout
      whileHover={{ scale: 1.01 }}
      onClick={onClick}
      className="rounded-xl p-4 cursor-pointer transition-all duration-200 space-y-3"
      style={{
        background: isActive
          ? `linear-gradient(135deg, ${cfg.color}08 0%, #0a0f1e 100%)`
          : 'rgba(13,20,38,0.6)',
        border: `1px solid ${isActive ? cfg.color + '50' : cfg.color + '18'}`,
        boxShadow: isActive ? `0 0 16px ${cfg.color}18` : 'none',
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: cfg.color, boxShadow: `0 0 6px ${cfg.color}` }}
            />
            <h4 className="font-display text-sm" style={{ color: cfg.color }}>
              {cfg.label}
            </h4>
          </div>
          <p className="text-[10px] text-slate-500 font-mono mt-0.5 ml-4">
            {cfg.description}
          </p>
        </div>
        {result?.complexity && (
          <span
            className="text-[9px] font-mono px-1.5 py-0.5 rounded flex-shrink-0"
            style={{ color: cfg.color, background: `${cfg.color}12`, border: `1px solid ${cfg.color}25` }}
          >
            {result.complexity}
          </span>
        )}
      </div>

      {/* Stats */}
      {result?.skipped ? (
        <p className="text-[10px] font-mono text-slate-500 italic">{result.reason}</p>
      ) : result ? (
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-0.5">
            <p className="text-[9px] text-slate-500 font-mono uppercase tracking-wider">Distance</p>
            <p className="text-sm font-mono tabular-nums" style={{ color: cfg.color }}>
              {result.distance?.toFixed(1) ?? '—'}
            </p>
          </div>
          <div className="space-y-0.5">
            <p className="text-[9px] text-slate-500 font-mono uppercase tracking-wider">Steps</p>
            <p className="text-sm font-mono tabular-nums text-slate-300">
              {result.steps?.toLocaleString() ?? '—'}
            </p>
          </div>
        </div>
      ) : (
        <p className="text-[10px] text-slate-600 font-mono">Run optimizer to see results.</p>
      )}

      {/* Actions */}
      {result && !result.skipped && (
        <div className="flex gap-2 pt-1">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={(e) => { e.stopPropagation(); onReplay(); }}
            className="text-[10px] font-mono px-2 py-1 rounded border transition-all"
            style={{
              color: cfg.color + 'aa',
              borderColor: cfg.color + '25',
            }}
          >
            ↺ Replay
          </motion.button>
          {isActive && (
            <span className="text-[10px] font-mono text-slate-600 self-center ml-auto">
              Shown on map
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
}
