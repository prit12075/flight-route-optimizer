import { motion } from 'framer-motion';

const ALGO_ORDER = ['greedy', 'heldKarp', 'divideConquer'];
const ALGO_LABELS = {
  greedy: 'Nearest Neighbor',
  heldKarp: 'Held-Karp DP',
  divideConquer: 'Divide & Conquer',
};

function badge(text, color) {
  return (
    <span
      className="px-1.5 py-0.5 rounded text-[9px] font-mono"
      style={{ color, background: `${color}18`, border: `1px solid ${color}30` }}
    >
      {text}
    </span>
  );
}

export default function StatsPanel({ results }) {
  if (!results) return null;

  const validResults = ALGO_ORDER.filter((a) => results[a]?.distance != null);
  const distances = validResults.map((a) => results[a].distance);
  const minDist = Math.min(...distances);
  const maxDist = Math.max(...distances);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-xl p-4 space-y-3"
    >
      <h3 className="font-display text-sm text-gold tracking-wide">Comparison</h3>

      <div className="overflow-x-auto">
        <table className="w-full text-[11px] font-mono">
          <thead>
            <tr className="text-slate-500 border-b border-white/5">
              <th className="text-left py-1.5 pr-3 font-normal">Algorithm</th>
              <th className="text-right py-1.5 pr-3 font-normal">Distance</th>
              <th className="text-right py-1.5 pr-3 font-normal">Steps</th>
              <th className="text-right py-1.5 font-normal">Complexity</th>
            </tr>
          </thead>
          <tbody>
            {ALGO_ORDER.map((algo, i) => {
              const r = results[algo];
              const isBest = r?.distance === minDist;
              const isWorst = r?.distance === maxDist && validResults.length > 1;

              return (
                <motion.tr
                  key={algo}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="border-b border-white/5"
                >
                  <td className="py-2 pr-3">
                    <span className={isBest ? 'text-gold' : 'text-slate-300'}>
                      {ALGO_LABELS[algo]}
                    </span>
                    {isBest && <span className="ml-1 text-[8px] text-gold/60">★ best</span>}
                  </td>
                  <td className="text-right pr-3 tabular-nums">
                    {r?.skipped ? (
                      <span className="text-slate-500">n/a</span>
                    ) : r?.distance != null ? (
                      <span className={isBest ? 'text-gold' : isWorst ? 'text-red-400/70' : 'text-slate-300'}>
                        {r.distance.toFixed(1)}
                      </span>
                    ) : '—'}
                  </td>
                  <td className="text-right pr-3 tabular-nums text-slate-400">
                    {r?.skipped ? '—' : (r?.steps?.toLocaleString() ?? '—')}
                  </td>
                  <td className="text-right">
                    {r?.complexity && badge(r.complexity, '#a78bfa')}
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Optimality gap */}
      {validResults.length > 1 && (
        <div className="pt-1 text-[10px] font-mono text-slate-500 flex justify-between">
          <span>Optimality gap (greedy vs best):</span>
          <span className="text-slate-400">
            {results.greedy?.distance != null && minDist > 0
              ? `+${(((results.greedy.distance - minDist) / minDist) * 100).toFixed(1)}%`
              : '—'}
          </span>
        </div>
      )}
    </motion.div>
  );
}
