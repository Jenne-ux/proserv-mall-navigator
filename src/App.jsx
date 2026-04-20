import { useState, useCallback, useEffect, useRef } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MapView from './components/MapView';
import InfoPanel from './components/InfoPanel';
import { generatePath, calculateDistanceFromPath, calculateETA, getSimpleDirections, createSmoothPath, generateQRData } from './utils/navigation';
import './styles/kiosk.css';

function App() {
  const [currentFloor, setCurrentFloor] = useState('ground');
  const [selectedStore, setSelectedStore] = useState(null);
  const [pathData, setPathData] = useState(null);
  const [distance, setDistance] = useState(0);
  const [eta, setEta] = useState(0);
  const [directions, setDirections] = useState([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationIndex, setSimulationIndex] = useState(0);
  const [smoothPoints, setSmoothPoints] = useState([]);
  const [displayPath, setDisplayPath] = useState([]);
  const [qrData, setQrData] = useState(null);
  const intervalRef = useRef(null);
  const hasSwitchedFloor = useRef(false);
  
  const selectStore = useCallback((store) => {
    // Clear any ongoing simulation
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    setIsSimulating(false);
    setSimulationIndex(0);
    hasSwitchedFloor.current = false;
    
    // Set selected store and floor
    setSelectedStore(store);
    setCurrentFloor(store.floor);
    
    // Generate navigation path
    const path = generatePath(store, store.floor);
    setPathData(path);
    
    // Calculate distance using all points
    const allPoints = [...path.groundPath, ...path.secondPath];
    const dist = calculateDistanceFromPath(allPoints);
    setDistance(dist);
    
    // Calculate ETA
    const needsEscalator = store.floor === 'second';
    const time = calculateETA(dist, needsEscalator);
    setEta(time);
    
    // Generate simple text directions for display
    const simpleDirs = getSimpleDirections(store, needsEscalator);
    setDirections(simpleDirs);
    
    // Create smooth path for animation
    const smooth = createSmoothPath(allPoints, 25);
    setSmoothPoints(smooth);
    
    // Set display path based on store's floor
    if (store.floor === 'ground') {
      setDisplayPath(path.groundPath);
    } else {
      setDisplayPath(path.secondPath);
    }
    
    // Generate QR data
    const qr = generateQRData(store);
    setQrData(qr);
  }, []);
  
  const startSimulation = useCallback(() => {
    if (!smoothPoints.length || !selectedStore) {
      console.warn('No smooth points or selected store available');
      return;
    }
    
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    setIsSimulating(true);
    setSimulationIndex(0);
    hasSwitchedFloor.current = false;
    
    // Ensure we're on the correct floor
    setCurrentFloor(selectedStore.floor);
    if (selectedStore.floor === 'ground') {
      setDisplayPath(pathData?.groundPath || []);
    } else {
      setDisplayPath(pathData?.secondPath || []);
    }
    
    // Start animation interval - smoother movement
    intervalRef.current = setInterval(() => {
      setSimulationIndex(prev => {
        const next = prev + 1;
        
        // Check if animation is complete
        if (next >= smoothPoints.length - 1) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          setIsSimulating(false);
          return smoothPoints.length - 1;
        }
        
        return next;
      });
    }, 40); // 40ms for smooth walking animation
  }, [smoothPoints, selectedStore, pathData]);
  
  const pauseSimulation = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsSimulating(false);
  }, []);
  
  const reset = useCallback(() => {
    // Clear simulation
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // Reset all state
    setSelectedStore(null);
    setPathData(null);
    setSimulationIndex(0);
    setIsSimulating(false);
    setCurrentFloor('ground');
    setDisplayPath([]);
    setSmoothPoints([]);
    setDistance(0);
    setEta(0);
    setDirections([]);
    setQrData(null);
    hasSwitchedFloor.current = false;
  }, []);
  
  const handleFloorChange = useCallback((floor) => {
    setCurrentFloor(floor);
    
    // Update displayed path based on selected floor and store
    if (selectedStore && pathData) {
      if (floor === 'ground' && pathData.groundPath && pathData.groundPath.length > 0) {
        setDisplayPath(pathData.groundPath);
      } else if (floor === 'second' && pathData.secondPath && pathData.secondPath.length > 0) {
        setDisplayPath(pathData.secondPath);
      } else {
        setDisplayPath([]);
      }
    }
  }, [selectedStore, pathData]);
  
  // Handle floor switching during simulation (for multi-floor navigation)
  useEffect(() => {
    if (!isSimulating || !smoothPoints.length || !pathData?.multiFloor) return;
    if (hasSwitchedFloor.current) return;
    
    const currentPoint = smoothPoints[simulationIndex];
    if (!currentPoint) return;
    
    // Check if we're at the escalator (around y=165-185)
    const isAtEscalator = currentPoint.y >= 165 && currentPoint.y <= 185 && 
                          currentPoint.x >= 470 && currentPoint.x <= 500;
    
    if (isAtEscalator && simulationIndex > 5 && currentFloor === 'ground') {
      hasSwitchedFloor.current = true;
      setCurrentFloor('second');
      if (pathData.secondPath && pathData.secondPath.length > 0) {
        setDisplayPath(pathData.secondPath);
      }
    }
  }, [simulationIndex, isSimulating, smoothPoints, pathData, currentFloor]);
  
  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);
  
  // Get current user position for display
  const userPosition = smoothPoints.length && simulationIndex > 0 && isSimulating
    ? { ...smoothPoints[simulationIndex], isMoving: true }
    : null;
  
  // Calculate progress percentage
  const progress = smoothPoints.length > 1 && simulationIndex > 0 
    ? (simulationIndex / (smoothPoints.length - 1)) * 100 
    : 0;
  
  return (
    <div className="app">
      <Header 
        floor={currentFloor} 
        onFloorChange={handleFloorChange} 
        onReset={reset}
        selectedStore={selectedStore}
      />
      
      <div className="main-layout">
        <Sidebar 
          floor={currentFloor} 
          onSelectStore={selectStore} 
          selectedStore={selectedStore}
        />
        
        <MapView 
          floor={currentFloor}
          selectedStore={selectedStore}
          onSelectStore={selectStore}
          pathPoints={displayPath}
          userPosition={userPosition}
          showPath={!!selectedStore}
        />
        
        <InfoPanel 
          store={selectedStore}
          distance={distance}
          eta={eta}
          directions={directions}
          isSimulating={isSimulating}
          onSimulate={startSimulation}
          onPause={pauseSimulation}
          progress={progress}
          qrData={qrData}
        />
      </div>
    </div>
  );
}

export default App;