import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { reverseGeocode } from '../../services/geocode';

// Fix bundler-broken default icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const CITY_LABELS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const ALGO_COLORS = {
  greedy:        '#00d4ff',
  heldKarp:      '#c9a84c',
  divideConquer: '#a78bfa',
};

function goldIcon(label) {
  return L.divIcon({
    className: '',
    iconAnchor: [14, 14],
    popupAnchor: [0, -20],
    html: `<div style="
      width:28px;height:28px;border-radius:50%;
      background:radial-gradient(circle at 35% 35%,#e8c96a,#a07c30);
      border:2px solid #c9a84c;
      box-shadow:0 0 12px rgba(201,168,76,0.7),0 2px 6px rgba(0,0,0,0.5);
      display:flex;align-items:center;justify-content:center;
      font-family:'IBM Plex Mono',monospace;font-size:10px;font-weight:600;color:#0a0f1e;
    ">${label}</div>`,
  });
}

function routeToLatLngs(route, cities) {
  if (!route || route.length < 2) return [];
  const pts = route.map((i) => [cities[i].lat, cities[i].lng]);
  pts.push(pts[0]);
  return pts;
}

// Auto-fit map to city bounds whenever cities change
function BoundsFitter({ cities }) {
  const map = useMap();
  useEffect(() => {
    if (cities.length === 0) return;
    if (cities.length === 1) {
      map.setView([cities[0].lat, cities[0].lng], 8, { animate: true });
      return;
    }
    const bounds = L.latLngBounds(cities.map((c) => [c.lat, c.lng]));
    map.fitBounds(bounds, { padding: [60, 60], animate: true, maxZoom: 10 });
  }, [cities.length]);
  return null;
}

// Map click → reverse geocode → add city
function ClickHandler({ onAddCity }) {
  useMapEvents({
    async click(e) {
      const { lat, lng } = e.latlng;
      const name = await reverseGeocode(lat, lng);
      onAddCity({ lat, lng, name });
    },
  });
  return null;
}

export default function LeafletMap({
  cities,
  results,
  activeAlgo,
  showAllRoutes,
  onAddCity,
  onRemoveCity,
}) {
  const algosToShow = showAllRoutes
    ? ['greedy', 'heldKarp', 'divideConquer']
    : [activeAlgo];

  return (
    <div
      className="relative w-full h-full rounded-xl overflow-hidden"
      style={{ border: '1px solid rgba(201,168,76,0.15)' }}
    >
      <MapContainer
        center={[20, 0]}
        zoom={2}
        style={{ width: '100%', height: '100%', background: '#0a0f1e' }}
        zoomControl={true}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          subdomains="abcd"
          maxZoom={20}
        />

        <BoundsFitter cities={cities} />
        <ClickHandler onAddCity={onAddCity} />

        {/* Route polylines */}
        {results &&
          algosToShow.map((algo) => {
            const r = results[algo];
            if (!r?.route) return null;
            const latlngs = routeToLatLngs(r.route, cities);
            const isOptimal = algo === 'heldKarp';
            return (
              <Polyline
                key={algo}
                positions={latlngs}
                pathOptions={{
                  color:     ALGO_COLORS[algo],
                  weight:    algo === activeAlgo ? 3 : 1.5,
                  opacity:   algo === activeAlgo ? 0.9 : 0.4,
                  dashArray: isOptimal ? null : '8 5',
                }}
              />
            );
          })}

        {/* City markers */}
        {cities.map((city, i) => (
          <Marker
            key={`${city.lat}-${city.lng}-${i}`}
            position={[city.lat, city.lng]}
            icon={goldIcon(CITY_LABELS[i % 26])}
          >
            <Popup closeButton={false}>
              <div style={{
                background: '#0d1426',
                border: '1px solid rgba(201,168,76,0.3)',
                borderRadius: 8,
                padding: '8px 10px',
                minWidth: 150,
                fontFamily: "'IBM Plex Mono',monospace",
              }}>
                <div style={{ color: '#c9a84c', fontSize: 11, fontWeight: 600, marginBottom: 4 }}>
                  {CITY_LABELS[i % 26]} — {city.name}
                </div>
                <div style={{ color: '#64748b', fontSize: 10, marginBottom: 6 }}>
                  {city.lat.toFixed(4)}, {city.lng.toFixed(4)}
                </div>
                <button
                  onClick={() => onRemoveCity(i)}
                  style={{
                    fontSize: 10, color: '#ef4444aa',
                    background: 'none', border: '1px solid rgba(239,68,68,0.25)',
                    borderRadius: 4, padding: '2px 8px', cursor: 'pointer', width: '100%',
                  }}
                >
                  ✕ Remove
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* City count badge */}
      {cities.length > 0 && (
        <div className="absolute top-3 right-12 z-[500] px-2 py-1 rounded text-[10px] font-mono text-gold/60 border border-gold/15"
          style={{ background: 'rgba(10,15,30,0.9)' }}>
          {cities.length} {cities.length === 1 ? 'city' : 'cities'}
        </div>
      )}

      {/* Click hint */}
      {cities.length === 0 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[500] pointer-events-none">
          <div className="px-4 py-2 rounded-full text-xs font-mono text-slate-400 border border-gold/10"
            style={{ background: 'rgba(10,15,30,0.9)' }}>
            Click the map to drop city pins · or search above
          </div>
        </div>
      )}

      {/* All-routes legend */}
      {showAllRoutes && results && (
        <div className="absolute bottom-8 right-3 z-[500] flex flex-col gap-1 p-2 rounded-lg"
          style={{ background: 'rgba(10,15,30,0.9)', border: '1px solid rgba(201,168,76,0.1)' }}>
          {Object.entries(ALGO_COLORS).map(([algo, color]) => (
            <div key={algo} className="flex items-center gap-1.5 text-[9px] font-mono" style={{ color }}>
              <span className="w-4 h-px inline-block" style={{ background: color }} />
              {algo === 'greedy' ? 'Nearest Neighbor' : algo === 'heldKarp' ? 'Held-Karp' : 'Divide & Conquer'}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
