import { motion } from 'framer-motion';

export default function Navbar() {
  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="flex items-center justify-between px-8 py-4 glass-dark border-b border-gold/10 z-50 relative"
    >
      <div className="flex items-center gap-3">
        {/* Logo mark */}
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <circle cx="14" cy="14" r="13" stroke="#c9a84c" strokeWidth="1.2" />
          <path d="M7 14 Q14 6 21 14 Q14 22 7 14Z" stroke="#00d4ff" strokeWidth="1.4" fill="none" />
          <circle cx="14" cy="14" r="2" fill="#c9a84c" />
        </svg>
        <span className="font-display text-lg font-semibold tracking-wide text-gold">
          Flight Route Optimizer
        </span>
      </div>

      <div className="flex items-center gap-6 text-xs text-slate-400 font-mono">
        <span className="hidden sm:block">TSP Algorithm Visualizer</span>
        <span className="px-2 py-1 rounded border border-gold/20 text-gold/70">
          v1.0
        </span>
      </div>
    </motion.header>
  );
}
