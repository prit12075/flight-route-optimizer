import { motion, AnimatePresence } from 'framer-motion';

const CITY_LABELS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export default function CityListPanel({ cities, onRemove, onClear }) {
  if (cities.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-xl p-4 space-y-3"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm text-gold tracking-wide">
          City Queue
          <span className="ml-2 text-xs font-mono text-slate-500 font-normal">
            {cities.length} stops
          </span>
        </h3>
        <button
          onClick={onClear}
          className="text-[10px] font-mono text-red-400/60 hover:text-red-400 transition-colors border border-red-500/20 hover:border-red-400/40 px-2 py-0.5 rounded"
        >
          Clear all
        </button>
      </div>

      <ul className="space-y-1 max-h-48 overflow-y-auto pr-1">
        <AnimatePresence initial={false}>
          {cities.map((city, i) => (
            <motion.li
              key={`${city.lat}-${city.lng}`}
              initial={{ opacity: 0, x: -10, height: 0 }}
              animate={{ opacity: 1, x: 0, height: 'auto' }}
              exit={{ opacity: 0, x: 10, height: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-white/3 group"
            >
              {/* Label badge */}
              <span
                className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-mono font-bold flex-shrink-0"
                style={{ background: 'rgba(201,168,76,0.15)', color: '#c9a84c', border: '1px solid rgba(201,168,76,0.3)' }}
              >
                {CITY_LABELS[i % 26]}
              </span>

              {/* Name + coords */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-mono text-slate-300 truncate">{city.name}</p>
                <p className="text-[9px] font-mono text-slate-600">
                  {city.lat.toFixed(3)}, {city.lng.toFixed(3)}
                </p>
              </div>

              {/* Remove */}
              <button
                onClick={() => onRemove(i)}
                className="opacity-0 group-hover:opacity-100 text-[10px] text-red-400/60 hover:text-red-400 transition-all px-1"
              >
                ✕
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </motion.div>
  );
}
