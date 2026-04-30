const R = 6371; // Earth radius in km

export function haversine(a, b) {
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}

export function buildMatrix(cities) {
  const n = cities.length;
  const matrix = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i !== j) matrix[i][j] = haversine(cities[i], cities[j]);
    }
  }
  return matrix;
}

export function totalDistance(route, matrix) {
  let dist = 0;
  for (let i = 0; i < route.length - 1; i++) {
    dist += matrix[route[i]][route[i + 1]];
  }
  dist += matrix[route[route.length - 1]][route[0]];
  return dist;
}
