import { motion } from 'framer-motion';

const ALGO_META = {
  greedy:        { label: 'Nearest Neighbor', color: '#00d4ff' },
  heldKarp:      { label: 'Held-Karp DP',     color: '#c9a84c' },
  divideConquer: { label: 'Divide & Conquer', color: '#a78bfa' },
};

function ProgressBar({ value, max, color }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div className="w-full h-1 rounded-full bg-white/5 overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        style={{ background: color }}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      />
    </div>
  );
}

export default function RaceMode({ results, animationSteps, onStartRace, racing }) {
  if (!results) return null;

  const distances = Object.values(results)
    .filter((r) => r.distance != null)
    .map((r) => r.distance);
  const maxDist = Math.max(...distances);
  const minDist = Math.min(...distances);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-xl p-4 space-y-3"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm text-gold tracking-wide">Race Mode</h3>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onStartRace}
          className="px-3 py-1 text-xs font-mono rounded border border-gold/40 text-gold hover:bg-gold/10 transition-all"
        >
          {racing ? '↺ Replay' : '▶ Start Race'}
        </motion.button>
      </div>

      <div className="space-y-3">
        {['greedy', 'heldKarp', 'divideConquer'].map((algo) => {
          const r = results[algo];
          const meta = ALGO_META[algo];
          const routeLen = r?.route?.length ?? 0;
          const revealed = animationSteps[algo] ?? 0;
          const isBest = r?.distance === minDist;

          return (
            <div key={algo} className="space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: meta.color }} />
                  <span style={{ color: meta.color }}>{meta.label}</span>
                  {isBest && <span className="text-gold/50">★ optimal</span>}
                </div>
                <span className="text-slate-400 tabular-nums">
                  {r?.skipped
                    ? 'n/a'
                    : r?.distance != null
                    ? `${r.distance.toFixed(0)} km`
                    : '—'}
                </span>
              </div>
              {r && !r.skipped && (
                <ProgressBar
                  value={racing ? revealed : routeLen}
                  max={routeLen}
                  color={meta.color}
                />
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
