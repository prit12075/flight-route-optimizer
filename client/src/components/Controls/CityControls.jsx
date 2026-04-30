import { motion } from 'framer-motion';

const INDIA_PRESET = [
  { name: 'Delhi',     lat: 28.6139, lng: 77.2090 },
  { name: 'Mumbai',    lat: 19.0760, lng: 72.8777 },
  { name: 'Bangalore', lat: 12.9716, lng: 77.5946 },
  { name: 'Chennai',   lat: 13.0827, lng: 80.2707 },
  { name: 'Kolkata',   lat: 22.5726, lng: 88.3639 },
  { name: 'Jaipur',    lat: 26.9124, lng: 75.7873 },
  { name: 'Pune',      lat: 18.5204, lng: 73.8567 },
  { name: 'Hyderabad', lat: 17.3850, lng: 78.4867 },
];

const EUROPE_PRESET = [
  { name: 'London',    lat: 51.5074, lng: -0.1278 },
  { name: 'Paris',     lat: 48.8566, lng:  2.3522 },
  { name: 'Berlin',    lat: 52.5200, lng: 13.4050 },
  { name: 'Madrid',    lat: 40.4168, lng: -3.7038 },
  { name: 'Rome',      lat: 41.9028, lng: 12.4964 },
  { name: 'Amsterdam', lat: 52.3676, lng:  4.9041 },
  { name: 'Vienna',    lat: 48.2082, lng: 16.3738 },
  { name: 'Warsaw',    lat: 52.2297, lng: 21.0122 },
];

const USA_PRESET = [
  { name: 'New York',     lat: 40.7128, lng: -74.0060 },
  { name: 'Los Angeles',  lat: 34.0522, lng: -118.2437 },
  { name: 'Chicago',      lat: 41.8781, lng: -87.6298 },
  { name: 'Houston',      lat: 29.7604, lng: -95.3698 },
  { name: 'Phoenix',      lat: 33.4484, lng: -112.0740 },
  { name: 'Philadelphia', lat: 39.9526, lng: -75.1652 },
  { name: 'San Antonio',  lat: 29.4241, lng: -98.4936 },
  { name: 'Dallas',       lat: 32.7767, lng: -96.7970 },
];

function Btn({ onClick, children, variant = 'default', disabled }) {
  const base =
    'px-3 py-2 rounded text-xs font-mono tracking-wide transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap';
  const variants = {
    default: 'border border-gold/30 text-gold/80 hover:border-gold hover:text-gold',
    primary: 'bg-gold/10 border border-gold/50 text-gold hover:bg-gold/20',
    danger:  'border border-red-500/30 text-red-400/70 hover:border-red-400 hover:text-red-400',
    cyan:    'border border-cyan-electric/30 text-cyan-electric/80 hover:border-cyan-electric hover:text-cyan-electric',
  };
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      className={`${base} ${variants[variant]}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </motion.button>
  );
}

export default function CityControls({ onLoadPreset, onClear, onOptimize, cityCount, loading }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="flex flex-wrap gap-2 items-center"
    >
      <span className="text-[10px] text-slate-500 font-mono mr-1">Presets:</span>
      <Btn variant="primary" onClick={() => onLoadPreset(INDIA_PRESET)}>✈ India Hubs</Btn>
      <Btn variant="default" onClick={() => onLoadPreset(EUROPE_PRESET)}>✈ Europe Hubs</Btn>
      <Btn variant="default" onClick={() => onLoadPreset(USA_PRESET)}>✈ USA Hubs</Btn>

      <div className="w-px h-5 bg-gold/10 mx-1" />

      <Btn variant="danger" onClick={onClear} disabled={cityCount === 0}>✕ Clear</Btn>
      <Btn variant="cyan" onClick={onOptimize} disabled={cityCount < 2 || loading}>
        {loading ? 'Computing…' : '▶ Optimize Routes'}
      </Btn>

      <span className="text-[10px] text-slate-500 font-mono ml-auto">
        {cityCount < 2 ? 'Add ≥2 cities' : `${cityCount} cities ready`}
      </span>
    </motion.div>
  );
}
