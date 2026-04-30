import { motion } from 'framer-motion';
import RouteAnimator from './RouteAnimator';

const CITY_LABELS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export default function MapCanvas({
  cities,
  results,
  animationSteps,
  activeAlgo,
  canvasRef,
  onMouseDown,
  onMouseMove,
  onMouseUp,
}) {
  const activeResult = results?.[activeAlgo];
  const isOptimal = activeAlgo === 'heldKarp';

  return (
    <div
      ref={canvasRef}
      className="relative w-full h-full cursor-crosshair select-none overflow-hidden rounded-xl"
      style={{
        background: 'radial-gradient(ellipse at 30% 40%, #0d1a3a 0%, #0a0f1e 70%)',
        border: '1px solid rgba(201,168,76,0.12)',
      }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
      {/* Grid lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-10">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#c9a84c" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Routes */}
      {activeResult?.route && (
        <RouteAnimator
          cities={cities}
          route={activeResult.route}
          revealedEdges={animationSteps[activeAlgo] ?? activeResult.route.length}
          isOptimal={isOptimal}
        />
      )}

      {/* City pins */}
      {cities.map((city, i) => (
        <motion.div
          key={i}
          className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 pointer-events-none"
          style={{ left: city.x, top: city.y }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          {/* Pin glow ring */}
          <div
            className="absolute w-7 h-7 rounded-full city-pin-pulse"
            style={{ background: 'rgba(201,168,76,0.08)' }}
          />
          {/* Pin dot */}
          <div
            className="w-3 h-3 rounded-full border-2 border-gold z-10"
            style={{ background: '#c9a84c', boxShadow: '0 0 8px rgba(201,168,76,0.8)' }}
          />
          {/* Label */}
          <span
            className="text-[10px] font-mono text-gold/90 leading-none z-10"
            style={{ textShadow: '0 0 6px rgba(201,168,76,0.6)' }}
          >
            {CITY_LABELS[i % 26]}
          </span>
        </motion.div>
      ))}

      {/* Empty state hint */}
      {cities.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 pointer-events-none">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" opacity="0.3">
            <circle cx="20" cy="20" r="18" stroke="#c9a84c" strokeWidth="1" strokeDasharray="4 3" />
            <line x1="20" y1="8" x2="20" y2="32" stroke="#c9a84c" strokeWidth="1" />
            <line x1="8" y1="20" x2="32" y2="20" stroke="#c9a84c" strokeWidth="1" />
          </svg>
          <p className="text-slate-500 text-xs font-mono tracking-widest uppercase">
            Click to place cities
          </p>
          <p className="text-slate-600 text-[10px] font-mono">
            Drag pins to reposition
          </p>
        </div>
      )}

      {/* City count badge */}
      {cities.length > 0 && (
        <div className="absolute top-3 right-3 px-2 py-1 rounded text-[10px] font-mono text-gold/60 border border-gold/10 glass">
          {cities.length} {cities.length === 1 ? 'city' : 'cities'}
        </div>
      )}
    </div>
  );
}
