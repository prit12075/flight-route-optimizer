import { motion } from 'framer-motion';

export default function Loader({ label = 'Computing routes…' }) {
  return (
    <div className="flex flex-col items-center gap-4 py-8">
      <div className="relative w-12 h-12">
        <motion.span
          className="absolute inset-0 rounded-full border-2 border-transparent border-t-gold"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        />
        <motion.span
          className="absolute inset-2 rounded-full border-2 border-transparent border-t-cyan-electric"
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'linear' }}
        />
      </div>
      <p className="text-xs text-slate-400 font-mono tracking-widest uppercase">
        {label}
      </p>
    </div>
  );
}
