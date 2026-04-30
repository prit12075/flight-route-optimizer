import { buildMatrix, totalDistance } from '../utils/distanceMatrix.js';

export function heldKarp(cities) {
  const n = cities.length;
  const matrix = buildMatrix(cities);

  // Cap at 12 to avoid exponential blowup
  if (n > 12) {
    return {
      route: null,
      distance: null,
      steps: null,
      complexity: 'O(n² · 2ⁿ)',
      skipped: true,
      reason: 'Held-Karp is limited to ≤12 cities to avoid exponential time.',
    };
  }

  const FULL = (1 << n) - 1;
  // dp[mask][i] = min cost to reach city i having visited cities in mask
  const dp = Array.from({ length: 1 << n }, () => new Array(n).fill(Infinity));
  const parent = Array.from({ length: 1 << n }, () => new Array(n).fill(-1));
  dp[1][0] = 0;
  let steps = 0;

  for (let mask = 1; mask <= FULL; mask++) {
    if (!(mask & 1)) continue; // must include city 0
    for (let u = 0; u < n; u++) {
      if (!(mask & (1 << u))) continue;
      if (dp[mask][u] === Infinity) continue;
      for (let v = 0; v < n; v++) {
        steps++;
        if (mask & (1 << v)) continue;
        const nextMask = mask | (1 << v);
        const newCost = dp[mask][u] + matrix[u][v];
        if (newCost < dp[nextMask][v]) {
          dp[nextMask][v] = newCost;
          parent[nextMask][v] = u;
        }
      }
    }
  }

  // Find best ending city
  let last = -1;
  let minCost = Infinity;
  for (let u = 1; u < n; u++) {
    const cost = dp[FULL][u] + matrix[u][0];
    if (cost < minCost) {
      minCost = cost;
      last = u;
    }
  }

  // Reconstruct path
  const route = [];
  let mask = FULL;
  let cur = last;
  while (cur !== -1) {
    route.push(cur);
    const prev = parent[mask][cur];
    mask ^= (1 << cur);
    cur = prev;
  }
  route.reverse();

  return {
    route,
    distance: totalDistance(route, matrix),
    steps,
    complexity: 'O(n² · 2ⁿ)',
  };
}
