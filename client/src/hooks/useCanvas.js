import { useRef, useState, useCallback } from 'react';

export function useCanvas() {
  const [cities, setCities] = useState([]);
  const [draggingIndex, setDraggingIndex] = useState(null);
  const canvasRef = useRef(null);

  const getCanvasCoords = useCallback((e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }, []);

  const handleMouseDown = useCallback((e) => {
    const pos = getCanvasCoords(e);
    const HIT = 14;

    // Check if clicking near an existing city to drag it
    const idx = cities.findIndex(
      (c) => Math.hypot(c.x - pos.x, c.y - pos.y) < HIT
    );

    if (idx !== -1) {
      setDraggingIndex(idx);
    } else {
      setCities((prev) => [...prev, pos]);
    }
  }, [cities, getCanvasCoords]);

  const handleMouseMove = useCallback((e) => {
    if (draggingIndex === null) return;
    const pos = getCanvasCoords(e);
    setCities((prev) =>
      prev.map((c, i) => (i === draggingIndex ? pos : c))
    );
  }, [draggingIndex, getCanvasCoords]);

  const handleMouseUp = useCallback(() => {
    setDraggingIndex(null);
  }, []);

  const clearCities = useCallback(() => setCities([]), []);

  const loadPreset = useCallback((preset) => setCities(preset), []);

  return {
    cities,
    canvasRef,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    clearCities,
    loadPreset,
  };
}
