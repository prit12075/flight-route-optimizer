import { buildMatrix, totalDistance } from '../utils/distanceMatrix.js';

export function greedyNearestNeighbor(cities) {
  const n = cities.length;
  const matrix = buildMatrix(cities);
  const visited = new Array(n).fill(false);
  const route = [0];
  visited[0] = true;
  let steps = 0;

  while (route.length < n) {
    const current = route[route.length - 1];
    let nearest = -1;
    let nearestDist = Infinity;

    for (let j = 0; j < n; j++) {
      steps++;
      if (!visited[j] && matrix[current][j] < nearestDist) {
        nearest = j;
        nearestDist = matrix[current][j];
      }
    }

    visited[nearest] = true;
    route.push(nearest);
  }

  return {
    route,
    distance: totalDistance(route, matrix),
    steps,
    complexity: 'O(n²)',
  };
}
