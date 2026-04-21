import { useState, useCallback, useEffect, useRef } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MapView from './components/MapView';
import InfoPanel from './components/InfoPanel';
import SplashScreen from './components/SplashScreen';
import { generatePath, calculateDistanceFromPath, calculateETA, getSimpleDirections, createSmoothPath, generateQRData } from './utils/navigation';
import './styles/kiosk.css';

function App() {
  const [showSplash, setShowSplash] = useState(true);
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
  
  const handleSplashComplete = () => {
    setShowSplash(false);
  };
  
  const returnToHome = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
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
    setShowSplash(true);
  }, []);
  
  const startSimulation = useCallback((points, store, path) => {
    if (!points.length || !store) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    setIsSimulating(true);
    setSimulationIndex(0);
    hasSwitchedFloor.current = false;
    
    // For multi‑floor routes, start on ground floor
    if (path.multiFloor) {
      setCurrentFloor('ground');
      setDisplayPath(path.groundPath);
    } else {
      setCurrentFloor(store.floor);
      setDisplayPath(store.floor === 'ground' ? path.groundPath : path.secondPath);
    }
    
    intervalRef.current = setInterval(() => {
      setSimulationIndex(prev => {
        const next = prev + 1;
        if (next >= points.length - 1) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          setIsSimulating(false);
          return points.length - 1;
        }
        return next;
      });
    }, 40);
  }, []);
  
  const selectStore = useCallback((store) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsSimulating(false);
    setSimulationIndex(0);
    hasSwitchedFloor.current = false;
    setSelectedStore(store);
    
    const path = generatePath(store, store.floor);
    setPathData(path);
    
    const allPoints = [...path.groundPath, ...path.secondPath];
    const dist = calculateDistanceFromPath(allPoints);
    setDistance(dist);
    
    const needsEscalator = store.floor === 'second';
    const time = calculateETA(dist, needsEscalator);
    setEta(time);
    
    const simpleDirs = getSimpleDirections(store, needsEscalator);
    setDirections(simpleDirs);
    
    const smooth = createSmoothPath(allPoints, 25);
    setSmoothPoints(smooth);
    
    // IMPORTANT: For multi‑floor routes, show ground path first
    if (path.multiFloor) {
      setCurrentFloor('ground');
      setDisplayPath(path.groundPath);
    } else {
      setCurrentFloor(store.floor);
      setDisplayPath(store.floor === 'ground' ? path.groundPath : path.secondPath);
    }
    
    const qr = generateQRData(store);
    setQrData(qr);
    
    // Start simulation after a short delay
    setTimeout(() => startSimulation(smooth, store, path), 50);
  }, [startSimulation]);
  
  const handleFloorChange = useCallback((floor) => {
    setCurrentFloor(floor);
    if (selectedStore && pathData) {
      if (floor === 'ground' && pathData.groundPath?.length) {
        setDisplayPath(pathData.groundPath);
      } else if (floor === 'second' && pathData.secondPath?.length) {
        setDisplayPath(pathData.secondPath);
      } else {
        setDisplayPath([]);
      }
    }
  }, [selectedStore, pathData]);
  
  // Auto floor switching during simulation
  useEffect(() => {
    if (!isSimulating || !smoothPoints.length || !pathData?.multiFloor) return;
    if (hasSwitchedFloor.current) return;
    
    const currentPoint = smoothPoints[simulationIndex];
    if (!currentPoint) return;
    
    const isAtEscalator = currentPoint.y >= 165 && currentPoint.y <= 185 && 
                          currentPoint.x >= 470 && currentPoint.x <= 500;
    
    if (isAtEscalator && simulationIndex > 5 && currentFloor === 'ground') {
      hasSwitchedFloor.current = true;
      setCurrentFloor('second');
      if (pathData.secondPath?.length) setDisplayPath(pathData.secondPath);
    }
  }, [simulationIndex, isSimulating, smoothPoints, pathData, currentFloor]);
  
  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);
  
  const userPosition = smoothPoints.length && simulationIndex > 0 && isSimulating
    ? { ...smoothPoints[simulationIndex], isMoving: true }
    : null;
  
  const progress = smoothPoints.length > 1 && simulationIndex > 0 
    ? (simulationIndex / (smoothPoints.length - 1)) * 100 
    : 0;
  
  if (showSplash) return <SplashScreen onComplete={handleSplashComplete} />;
  
  return (
    <div className="app">
      <Header 
        floor={currentFloor} 
        onFloorChange={handleFloorChange} 
        onReturnHome={returnToHome}
        selectedStore={selectedStore}
      />
      <div className="main-layout">
        <Sidebar floor={currentFloor} onSelectStore={selectStore} selectedStore={selectedStore} />
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
          progress={progress}
          qrData={qrData}
        />
      </div>
    </div>
  );
}

export default App;