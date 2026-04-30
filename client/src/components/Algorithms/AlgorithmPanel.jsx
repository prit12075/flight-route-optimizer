import { motion } from 'framer-motion';
import AlgorithmCard from './AlgorithmCard';

const ALGOS = ['greedy', 'heldKarp', 'divideConquer'];

export default function AlgorithmPanel({
  results,
  activeAlgo,
  showAllRoutes,
  onSelectAlgo,
  onReplay,
  onToggleAllRoutes,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="space-y-3"
    >
      <div className="flex items-center justify-between">
        <h2 className="font-display text-base text-slate-200 tracking-wide">Algorithms</h2>
        {results && (
          <button
            onClick={onToggleAllRoutes}
            className={`text-[10px] font-mono px-2 py-1 rounded border transition-all ${
              showAllRoutes
                ? 'border-gold/50 text-gold bg-gold/10'
                : 'border-white/10 text-slate-500 hover:border-gold/30 hover:text-gold/60'
            }`}
          >
            {showAllRoutes ? '⊙ All routes on' : '⊙ Show all routes'}
          </button>
        )}
      </div>

      <div className="space-y-2">
        {ALGOS.map((algo) => (
          <AlgorithmCard
            key={algo}
            algo={algo}
            result={results?.[algo] ?? null}
            isActive={activeAlgo === algo}
            onClick={() => onSelectAlgo(algo)}
            onReplay={() => onReplay(algo)}
          />
        ))}
      </div>
    </motion.div>
  );
}
