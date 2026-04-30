const NOMINATIM = 'https://nominatim.openstreetmap.org';

export async function searchCities(query) {
  if (!query || query.trim().length < 2) return [];
  const params = new URLSearchParams({
    q: query,
    format: 'json',
    limit: 6,
    featuretype: 'city',
    addressdetails: 1,
  });
  const res = await fetch(`${NOMINATIM}/search?${params}`, {
    headers: { 'Accept-Language': 'en' },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.map((r) => ({
    name: r.display_name.split(',').slice(0, 2).join(',').trim(),
    lat: parseFloat(r.lat),
    lng: parseFloat(r.lon),
  }));
}

export async function reverseGeocode(lat, lng) {
  const params = new URLSearchParams({ lat, lon: lng, format: 'json', zoom: 10 });
  const res = await fetch(`${NOMINATIM}/reverse?${params}`, {
    headers: { 'Accept-Language': 'en' },
  });
  if (!res.ok) return `${lat.toFixed(3)}, ${lng.toFixed(3)}`;
  const data = await res.json();
  const addr = data.address ?? {};
  return (
    addr.city ||
    addr.town ||
    addr.village ||
    addr.county ||
    data.display_name?.split(',')[0] ||
    `${lat.toFixed(3)}, ${lng.toFixed(3)}`
  );
}
