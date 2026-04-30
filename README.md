# Flight Route Optimizer — TSP Algorithm Visualizer

An interactive, full-stack web application that visualizes and solves the Travelling Salesman Problem using three algorithms side by side.

## Tech Stack

- **Frontend**: React 18 + Vite, TailwindCSS, Framer Motion
- **Backend**: Node.js + Express (ESM)

## Quick Start

### 1. Install dependencies

```bash
# Backend
cd server && npm install

# Frontend
cd ../client && npm install
```

### 2. Run the backend

```bash
cd server
npm run dev      # Node --watch (no nodemon needed)
# Runs on http://localhost:3001
```

### 3. Run the frontend

```bash
cd client
npm run dev
# Runs on http://localhost:5173
```

Open **http://localhost:5173** in your browser.

## Algorithms

| Algorithm | Approach | Complexity | City Limit |
|---|---|---|---|
| Nearest Neighbor (Greedy) | Always move to closest unvisited city | O(n²) | Unlimited |
| Held-Karp DP | Exact optimal via bitmask DP | O(n² · 2ⁿ) | ≤ 12 cities |
| Divide & Conquer | Split by median X, solve halves, merge | O(n log n) | Unlimited |

## Features

- **Interactive canvas** — click to place cities, drag to reposition
- **Algorithm cards** — click any card to display its route on the map with animated edge drawing
- **Race Mode** — all 3 algorithms animate simultaneously on mini-canvases
- **Stats Panel** — live comparison table with optimality gap
- **India Metro Hubs preset** — loads 8 real Indian cities instantly
- **Premium aviation UI** — dark navy, gold pins, electric cyan routes
