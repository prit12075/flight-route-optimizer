import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents } from 'react-leaflet';
import { motion } from 'framer-motion';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { reverseGeocode } from '../../services/geocode';

// Fix default Leaflet icon paths broken by bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Gold custom pin
function goldIcon(label) {
  return L.divIcon({
    className: '',
    iconAnchor: [14, 14],
    popupAnchor: [0, -18],
    html: `
      <div style="position:relative;display:flex;flex-direction:column;align-items:center;gap:2px;">
        <div style="
          width:28px;height:28px;border-radius:50%;
          background:radial-gradient(circle at 35% 35%,#e8c96a,#a07c30);
          border:2px solid #c9a84c;
          box-shadow:0 0 12px rgba(201,168,76,0.7),0 2px 6px rgba(0,0,0,0.5);
          display:flex;align-items:center;justify-content:center;
          font-family:'IBM Plex Mono',monospace;font-size:10px;font-weight:500;color:#0a0f1e;
        ">${label}</div>
      </div>`,
  });
}

const ALGO_COLORS = {
  greedy:        '#00d4ff',
  heldKarp:      '#c9a84c',
  divideConquer: '#a78bfa',
};

// Closes the route ring: route + first city
function routeToLatLngs(route, cities) {
  if (!route || route.length < 2) return [];
  const pts = route.map((i) => [cities[i].lat, cities[i].lng]);
  pts.push(pts[0]); // close loop
  return pts;
}

// Handles map click → reverse-geocode → add city
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

const CITY_LABELS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export default function LeafletMap({ cities, results, activeAlgo, onAddCity, onRemoveCity }) {
  const activeResult = results?.[activeAlgo];
  const routeLatLngs = activeResult?.route
    ? routeToLatLngs(activeResult.route, cities)
    : [];

  const lineColor = ALGO_COLORS[activeAlgo] ?? '#00d4ff';
  const isOptimal = activeAlgo === 'heldKarp';

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden" style={{ border: '1px solid rgba(201,168,76,0.15)' }}>
      <MapContainer
        center={[20, 0]}
        zoom={2}
        style={{ width: '100%', height: '100%', background: '#0a0f1e' }}
        zoomControl={false}
      >
        {/* Dark CartoDB tiles */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          subdomains="abcd"
          maxZoom={20}
        />

        <ClickHandler onAddCity={onAddCity} />

        {/* Route polyline */}
        {routeLatLngs.length > 1 && (
          <Polyline
            positions={routeLatLngs}
            pathOptions={{
              color: lineColor,
              weight: isOptimal ? 2.5 : 2,
              opacity: 0.85,
              dashArray: isOptimal ? null : '8 5',
            }}
          />
        )}

        {/* City markers */}
        {cities.map((city, i) => (
          <Marker
            key={`${city.lat}-${city.lng}-${i}`}
            position={[city.lat, city.lng]}
            icon={goldIcon(CITY_LABELS[i % 26])}
          >
            <Popup
              className="flight-popup"
              closeButton={false}
            >
              <div
                style={{
                  background: '#0d1426',
                  border: '1px solid rgba(201,168,76,0.3)',
                  borderRadius: 8,
                  padding: '8px 10px',
                  minWidth: 140,
                  fontFamily: "'IBM Plex Mono', monospace",
                }}
              >
                <div style={{ color: '#c9a84c', fontSize: 11, fontWeight: 500, marginBottom: 4 }}>
                  {CITY_LABELS[i % 26]} — {city.name}
                </div>
                <div style={{ color: '#64748b', fontSize: 10 }}>
                  {city.lat.toFixed(4)}, {city.lng.toFixed(4)}
                </div>
                <button
                  onClick={() => onRemoveCity(i)}
                  style={{
                    marginTop: 8,
                    fontSize: 10,
                    color: '#ef4444aa',
                    background: 'none',
                    border: '1px solid rgba(239,68,68,0.2)',
                    borderRadius: 4,
                    padding: '2px 8px',
                    cursor: 'pointer',
                    width: '100%',
                  }}
                >
                  Remove city
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* City count badge */}
      {cities.length > 0 && (
        <div
          className="absolute top-3 right-3 z-[500] px-2 py-1 rounded text-[10px] font-mono text-gold/60 border border-gold/15"
          style={{ background: 'rgba(10,15,30,0.85)' }}
        >
          {cities.length} {cities.length === 1 ? 'city' : 'cities'}
        </div>
      )}

      {/* Click hint */}
      {cities.length === 0 && (
        <div className="absolute inset-0 flex items-end justify-center pb-10 pointer-events-none z-[500]">
          <div
            className="px-4 py-2 rounded-full text-xs font-mono text-slate-400 border border-gold/10"
            style={{ background: 'rgba(10,15,30,0.85)' }}
          >
            Click anywhere on the map to drop a city pin
          </div>
        </div>
      )}
    </div>
  );
}
