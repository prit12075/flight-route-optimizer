import { useState, useCallback } from 'react';

export function useCities() {
  const [cities, setCities] = useState([]);

  const addCity = useCallback((city) => {
    // city: { lat, lng, name }
    setCities((prev) => {
      const exists = prev.some((c) => c.lat === city.lat && c.lng === city.lng);
      return exists ? prev : [...prev, city];
    });
  }, []);

  const removeCity = useCallback((index) => {
    setCities((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const clearCities = useCallback(() => setCities([]), []);

  const loadPreset = useCallback((preset) => setCities(preset), []);

  return { cities, addCity, removeCity, clearCities, loadPreset };
}
