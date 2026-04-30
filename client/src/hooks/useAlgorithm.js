import { useState, useCallback, useRef } from 'react';
import { optimizeRoutes } from '../services/api';

export function useAlgorithm() {
  const [results, setResults]             = useState(null);
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState(null);
  const [animationSteps, setAnimationSteps] = useState({});
  const [racing, setRacing]               = useState(false);
  const timers = useRef({});

  function clearTimers() {
    Object.values(timers.current).forEach(clearTimeout);
    timers.current = {};
  }

  function animateAlgo(algo, routeLen) {
    clearTimeout(timers.current[algo]);
    let step = 0;
    const tick = () => {
      step++;
      setAnimationSteps((prev) => ({ ...prev, [algo]: step }));
      if (step < routeLen) {
        timers.current[algo] = setTimeout(tick, 60);
      }
    };
    tick();
  }

  const runOptimize = useCallback(async (cities) => {
    if (cities.length < 2) return;
    clearTimers();
    setLoading(true);
    setError(null);
    setResults(null);
    setAnimationSteps({});
    setRacing(false);

    try {
      const data = await optimizeRoutes(cities);
      setResults(data);
      if (data.greedy?.route) animateAlgo('greedy', data.greedy.route.length);
    } catch (err) {
      setError(err.response?.data?.error ?? 'Server error — is the backend running?');
    } finally {
      setLoading(false);
    }
  }, []);

  const startRace = useCallback(() => {
    if (!results) return;
    clearTimers();
    setRacing(true);
    setAnimationSteps({});
    for (const algo of ['greedy', 'heldKarp', 'divideConquer']) {
      if (results[algo]?.route) animateAlgo(algo, results[algo].route.length);
    }
  }, [results]);

  const replayAlgo = useCallback((algo) => {
    if (!results?.[algo]?.route) return;
    animateAlgo(algo, results[algo].route.length);
  }, [results]);

  return { results, loading, error, animationSteps, racing, runOptimize, startRace, replayAlgo };
}
