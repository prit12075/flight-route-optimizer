import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { searchCities } from '../../services/geocode';

function useDebounce(fn, delay) {
  const timer = useRef(null);
  return useCallback((...args) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => fn(...args), delay);
  }, [fn, delay]);
}

export default function CitySearchBar({ onAddCity }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const fetchResults = useCallback(async (q) => {
    if (q.length < 2) { setResults([]); setOpen(false); return; }
    setLoading(true);
    try {
      const data = await searchCities(q);
      setResults(data);
      setOpen(data.length > 0);
    } finally {
      setLoading(false);
    }
  }, []);

  const debouncedFetch = useDebounce(fetchResults, 320);

  function handleChange(e) {
    const v = e.target.value;
    setQuery(v);
    debouncedFetch(v);
  }

  function handleSelect(city) {
    onAddCity(city);
    setQuery('');
    setResults([]);
    setOpen(false);
  }

  // Close on outside click
  useEffect(() => {
    function onDown(e) {
      if (!containerRef.current?.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gold/20 bg-navy-800/80 backdrop-blur-sm focus-within:border-gold/50 transition-colors">
        {/* Search icon */}
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="flex-shrink-0 text-gold/50">
          <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.2" />
          <line x1="9.5" y1="9.5" x2="13" y2="13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="Search city to add…"
          className="flex-1 bg-transparent text-xs font-mono text-slate-200 placeholder-slate-600 outline-none"
        />
        {loading && (
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
            className="w-3 h-3 border border-gold/40 border-t-gold rounded-full flex-shrink-0"
          />
        )}
      </div>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute z-[1000] top-full mt-1 w-full rounded-lg overflow-hidden"
            style={{ background: '#0d1426', border: '1px solid rgba(201,168,76,0.2)', boxShadow: '0 8px 32px rgba(0,0,0,0.6)' }}
          >
            {results.map((city, i) => (
              <li
                key={i}
                onClick={() => handleSelect(city)}
                className="flex items-center gap-2 px-3 py-2.5 text-xs font-mono cursor-pointer hover:bg-gold/8 transition-colors border-b border-white/4 last:border-0"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-gold/60 flex-shrink-0" />
                <span className="text-slate-300 truncate">{city.name}</span>
                <span className="ml-auto text-[10px] text-slate-600 flex-shrink-0">
                  {city.lat.toFixed(2)}, {city.lng.toFixed(2)}
                </span>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
