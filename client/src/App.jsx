import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from './components/UI/Navbar';
import Loader from './components/UI/Loader';
import LeafletMap from './components/Map/LeafletMap';
import CitySearchBar from './components/Map/CitySearchBar';
import CityControls from './components/Controls/CityControls';
import RaceMode from './components/Controls/RaceMode';
import AlgorithmPanel from './components/Algorithms/AlgorithmPanel';
import StatsPanel from './components/Stats/StatsPanel';
import CityListPanel from './components/Stats/CityListPanel';
import { useCities } from './hooks/useCities';
import { useAlgorithm } from './hooks/useAlgorithm';

export default function App() {
  const { cities, addCity, removeCity, clearCities, loadPreset } = useCities();
  const {
    results, loading, error,
    animationSteps, racing,
    runOptimize, startRace, replayAlgo,
  } = useAlgorithm();

  const [activeAlgo, setActiveAlgo]       = useState('greedy');
  const [showAllRoutes, setShowAllRoutes] = useState(false);

  function handleOptimize() {
    runOptimize(cities);
    setActiveAlgo('greedy');
    setShowAllRoutes(false);
  }

  function handleSelectAlgo(algo) {
    setActiveAlgo(algo);
    setShowAllRoutes(false);
    if (results?.[algo]?.route) replayAlgo(algo);
  }

  return (
    <div className="flex flex-col min-h-screen" style={{ background: '#0a0f1e' }}>
      <Navbar />

      <main className="flex flex-1 gap-0 overflow-hidden" style={{ height: 'calc(100vh - 65px)' }}>

        {/* ── Left panel: map + controls ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col gap-3 p-4"
          style={{ width: '60%', minWidth: 0 }}
        >
          <CitySearchBar onAddCity={addCity} />

          <div className="flex-1 min-h-0">
            <LeafletMap
              cities={cities}
              results={results}
              activeAlgo={activeAlgo}
              showAllRoutes={showAllRoutes}
              onAddCity={addCity}
              onRemoveCity={removeCity}
            />
          </div>

          <CityControls
            onLoadPreset={loadPreset}
            onClear={clearCities}
            onOptimize={handleOptimize}
            cityCount={cities.length}
            loading={loading}
          />

          {error && (
            <p className="text-xs font-mono text-red-400 px-1">{error}</p>
          )}

          {results && (
            <RaceMode
              results={results}
              animationSteps={animationSteps}
              onStartRace={startRace}
              racing={racing}
            />
          )}
        </motion.div>

        {/* ── Right panel: algorithms + stats ── */}
        <div
          className="flex flex-col gap-3 p-4 overflow-y-auto"
          style={{
            width: '40%',
            borderLeft: '1px solid rgba(201,168,76,0.08)',
            background: 'rgba(10,15,30,0.5)',
          }}
        >
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader />
            </div>
          ) : (
            <>
              <AlgorithmPanel
                results={results}
                activeAlgo={activeAlgo}
                showAllRoutes={showAllRoutes}
                onSelectAlgo={handleSelectAlgo}
                onReplay={replayAlgo}
                onToggleAllRoutes={() => setShowAllRoutes((v) => !v)}
              />
              <StatsPanel results={results} />
              <CityListPanel
                cities={cities}
                onRemove={removeCity}
                onClear={clearCities}
              />
            </>
          )}
        </div>
      </main>
    </div>
  );
}
