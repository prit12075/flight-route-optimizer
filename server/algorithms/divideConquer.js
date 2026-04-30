import { buildMatrix, totalDistance } from '../utils/distanceMatrix.js';

function greedyCluster(indices, matrix) {
  if (indices.length === 0) return [];
  if (indices.length === 1) return [indices[0]];

  const visited = new Set();
  const route = [indices[0]];
  visited.add(indices[0]);

  while (route.length < indices.length) {
    const current = route[route.length - 1];
    let nearest = -1;
    let nearestDist = Infinity;
    for (const idx of indices) {
      if (!visited.has(idx) && matrix[current][idx] < nearestDist) {
        nearest = idx;
        nearestDist = matrix[current][idx];
      }
    }
    visited.add(nearest);
    route.push(nearest);
  }
  return route;
}

export function divideConquer(cities) {
  const n = cities.length;
  const matrix = buildMatrix(cities);

  if (n <= 3) {
    const route = cities.map((_, i) => i);
    return { route, distance: totalDistance(route, matrix), steps: n, complexity: 'O(n log n)' };
  }

  // Split by median longitude
  const indices = cities.map((_, i) => i);
  const sorted = [...indices].sort((a, b) => cities[a].lng - cities[b].lng);
  const mid = Math.floor(sorted.length / 2);
  const leftIndices = sorted.slice(0, mid);
  const rightIndices = sorted.slice(mid);

  const leftRoute  = greedyCluster(leftIndices, matrix);
  const rightRoute = greedyCluster(rightIndices, matrix);

  // Find best stitch point between the two halves
  let bestDist = Infinity;
  let bestLeftEnd = leftRoute.length - 1;
  let bestRightStart = 0;

  for (let i = 0; i < leftRoute.length; i++) {
    for (let j = 0; j < rightRoute.length; j++) {
      const d = matrix[leftRoute[i]][rightRoute[j]];
      if (d < bestDist) {
        bestDist = d;
        bestLeftEnd = i;
        bestRightStart = j;
      }
    }
  }

  const left  = [...leftRoute.slice(0, bestLeftEnd + 1), ...leftRoute.slice(bestLeftEnd + 1)];
  const right = [...rightRoute.slice(bestRightStart), ...rightRoute.slice(0, bestRightStart)];
  const route = [...left, ...right];
  const steps = leftIndices.length ** 2 + rightIndices.length ** 2;

  return { route, distance: totalDistance(route, matrix), steps, complexity: 'O(n log n)' };
}
