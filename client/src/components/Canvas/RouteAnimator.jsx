import { motion } from 'framer-motion';

/**
 * Renders SVG edges for a route up to `revealedEdges` count.
 * isOptimal tints the lines gold instead of cyan.
 */
export default function RouteAnimator({ cities, route, revealedEdges, isOptimal = false }) {
  if (!route || cities.length < 2) return null;

  const stroke = isOptimal ? '#c9a84c' : '#00d4ff';
  const glow = isOptimal
    ? 'drop-shadow(0 0 4px rgba(201,168,76,0.7))'
    : 'drop-shadow(0 0 4px rgba(0,212,255,0.6))';

  // Build edges including the closing edge back to start
  const fullRoute = [...route, route[0]];
  const edges = fullRoute.slice(0, (revealedEdges ?? fullRoute.length) + 1);

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ filter: glow }}
    >
      <defs>
        <marker
          id={`arrow-${isOptimal ? 'gold' : 'cyan'}`}
          markerWidth="6"
          markerHeight="6"
          refX="3"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L0,6 L6,3 z" fill={stroke} opacity="0.8" />
        </marker>
      </defs>

      {edges.slice(0, -1).map((fromIdx, i) => {
        const toIdx = edges[i + 1];
        const from = cities[fromIdx];
        const to = cities[toIdx];
        if (!from || !to) return null;

        const isLast = i === edges.length - 2;

        return (
          <motion.line
            key={`edge-${i}`}
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            stroke={stroke}
            strokeWidth={isOptimal ? 1.8 : 1.4}
            strokeOpacity={isLast ? 1 : 0.65}
            strokeDasharray={isLast ? '6 4' : 'none'}
            markerEnd={`url(#arrow-${isOptimal ? 'gold' : 'cyan'})`}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
          />
        );
      })}
    </svg>
  );
}
