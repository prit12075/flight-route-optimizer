import { Router } from 'express';
import { greedyNearestNeighbor } from '../algorithms/greedy.js';
import { heldKarp } from '../algorithms/heldKarp.js';
import { divideConquer } from '../algorithms/divideConquer.js';

const router = Router();

router.post('/', (req, res) => {
  const { cities } = req.body;

  if (!Array.isArray(cities) || cities.length < 2) {
    return res.status(400).json({ error: 'Provide at least 2 cities as [{lat, lng, name}].' });
  }

  for (const c of cities) {
    if (typeof c.lat !== 'number' || typeof c.lng !== 'number') {
      return res.status(400).json({ error: 'Each city must have numeric lat and lng.' });
    }
  }

  const greedy = greedyNearestNeighbor(cities);
  const dp = heldKarp(cities);
  const dc = divideConquer(cities);

  res.json({
    greedy:        { ...greedy, name: 'Nearest Neighbor',  algorithm: 'greedy' },
    heldKarp:      { ...dp,     name: 'Held-Karp DP',      algorithm: 'heldKarp' },
    divideConquer: { ...dc,     name: 'Divide & Conquer',  algorithm: 'divideConquer' },
  });
});

export default router;
