import { motion } from 'framer-motion';

const ALGO_ORDER = ['greedy', 'heldKarp', 'divideConquer'];
const ALGO_LABELS = {
  greedy:        'Nearest Neighbor',
  heldKarp:      'Held-Karp DP',
  divideConquer: 'Divide & Conquer',
};
const ALGO_COLORS = {
  greedy:        '#00d4ff',
  heldKarp:      '#c9a84c',
  divideConquer: '#a78bfa',
};
const AVG_SPEED_KMH = 900; // commercial jet cruising speed

function flightTime(km) {
  if (km == null) return '—';
  const hrs = km / AVG_SPEED_KMH;
  const h = Math.floor(hrs);
  const m = Math.round((hrs - h) * 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function badge(text, color) {
  return (
    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono"
      style={{ color, background: `${color}18`, border: `1px solid ${color}30` }}>
      {text}
    </span>
  );
}

export default function StatsPanel({ results }) {
  if (!results) return null;

  const validResults = ALGO_ORDER.filter((a) => results[a]?.distance != null);
  const distances    = validResults.map((a) => results[a].distance);
  const minDist      = Math.min(...distances);
  const maxDist      = Math.max(...distances);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-xl p-4 space-y-4"
    >
      <h3 className="font-display text-sm text-gold tracking-wide">Comparison</h3>

      <div className="overflow-x-auto">
        <table className="w-full text-[11px] font-mono">
          <thead>
            <tr className="text-slate-500 border-b border-white/5">
              <th className="text-left py-1.5 pr-2 font-normal">Algorithm</th>
              <th className="text-right py-1.5 pr-2 font-normal">Distance</th>
              <th className="text-right py-1.5 pr-2 font-normal">Flight Time</th>
              <th className="text-right py-1.5 pr-2 font-normal">Steps</th>
              <th className="text-right py-1.5 font-normal">Big-O</th>
            </tr>
          </thead>
          <tbody>
            {ALGO_ORDER.map((algo, i) => {
              const r      = results[algo];
              const color  = ALGO_COLORS[algo];
              const isBest = r?.distance === minDist;
              const isWorst= r?.distance === maxDist && validResults.length > 1;

              return (
                <motion.tr key={algo}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="border-b border-white/5"
                >
                  <td className="py-2 pr-2">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: color }} />
                      <span style={{ color: isBest ? color : undefined }} className={isBest ? '' : 'text-slate-300'}>
                        {ALGO_LABELS[algo]}
                      </span>
                      {isBest && <span className="text-[8px] text-gold/50">★</span>}
                    </div>
                  </td>
                  <td className="text-right pr-2 tabular-nums">
                    {r?.skipped ? <span className="text-slate-500">n/a</span>
                      : r?.distance != null
                        ? <span style={{ color: isBest ? color : isWorst ? '#f87171aa' : undefined }}
                            className={!isBest && !isWorst ? 'text-slate-300' : ''}>
                            {r.distance.toFixed(0)} km
                          </span>
                        : '—'}
                  </td>
                  <td className="text-right pr-2 tabular-nums text-slate-400">
                    {r?.skipped ? '—' : flightTime(r?.distance)}
                  </td>
                  <td className="text-right pr-2 tabular-nums text-slate-400">
                    {r?.skipped ? '—' : (r?.steps?.toLocaleString() ?? '—')}
                  </td>
                  <td className="text-right">
                    {r?.complexity && badge(r.complexity, color)}
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Optimality gap */}
      {validResults.length > 1 && (
        <div className="flex justify-between text-[10px] font-mono text-slate-500 pt-1 border-t border-white/5">
          <span>Greedy vs optimal gap</span>
          <span className="text-slate-400">
            {results.greedy?.distance != null && minDist > 0
              ? `+${(((results.greedy.distance - minDist) / minDist) * 100).toFixed(1)}%`
              : '—'}
          </span>
        </div>
      )}

      {/* Speed note */}
      <p className="text-[9px] text-slate-600 font-mono">
        ✈ Flight time estimated at {AVG_SPEED_KMH.toLocaleString()} km/h cruising speed
      </p>
    </motion.div>
  );
}
