import { useState } from 'react';
import { stores } from '../data/stores';
import personIcon from '../assets/people.png';
import walkingManIcon from '../assets/man-walking.png';

function MapView({ floor, selectedStore, onSelectStore, pathPoints, userPosition, showPath }) {
  const [hoveredStore, setHoveredStore] = useState(null);
  const currentStores = stores[floor] || [];
  const isGroundFloor = floor === 'ground';
  
  return (
    <div className="map-container">
      <svg className="map-svg" viewBox="0 0 950 620" preserveAspectRatio="xMidYMid meet">
        
        <defs>
          <pattern id="walkwayPattern" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
            <rect width="12" height="12" fill="#d1d7e0"/>
            <rect x="0" y="0" width="5" height="5" fill="#c0c8d0"/>
            <rect x="7" y="7" width="5" height="5" fill="#c0c8d0"/>
          </pattern>
          
          <pattern id="atriumPattern" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
            <rect width="30" height="30" fill="#e8f0fe"/>
            <rect x="0" y="0" width="14" height="14" fill="#d0e0fc"/>
            <rect x="16" y="16" width="14" height="14" fill="#d0e0fc"/>
          </pattern>
          
          <linearGradient id="escalatorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fef3c7"/>
            <stop offset="100%" stopColor="#fde68a"/>
          </linearGradient>
          
          <filter id="storeShadow" x="-5%" y="-5%" width="115%" height="115%">
            <feDropShadow dx="2" dy="3" stdDeviation="3" floodColor="#000" floodOpacity="0.25"/>
          </filter>
          
          <filter id="pathGlow">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Building Outline */}
        <rect x="10" y="10" width="930" height="600" fill="#fafafa" stroke="#c0c0c0" strokeWidth="2" rx="12" />
        
        {/* Walkways - Centered paths */}
        <rect x="195" y="230" width="560" height="30" fill="url(#walkwayPattern)" stroke="#aaa" strokeWidth="1.5" />
        <rect x="195" y="100" width="560" height="30" fill="url(#walkwayPattern)" stroke="#aaa" strokeWidth="1" />
        <rect x="195" y="350" width="560" height="30" fill="url(#walkwayPattern)" stroke="#aaa" strokeWidth="1" />
        <rect x="195" y="530" width="560" height="30" fill="url(#walkwayPattern)" stroke="#aaa" strokeWidth="1" />
        
        {/* Vertical Spines */}
        <rect x="195" y="10" width="30" height="600" fill="url(#walkwayPattern)" stroke="#aaa" strokeWidth="1.5" />
        <rect x="725" y="10" width="30" height="600" fill="url(#walkwayPattern)" stroke="#aaa" strokeWidth="1.5" />
        <rect x="305" y="200" width="20" height="400" fill="url(#walkwayPattern)" stroke="#aaa" strokeWidth="0.5" />
        <rect x="625" y="200" width="20" height="400" fill="url(#walkwayPattern)" stroke="#aaa" strokeWidth="0.5" />
        
        {/* Walkway Labels */}
        <text x="475" y="215" textAnchor="middle" fontSize="9" fill="#888" fontWeight="bold" letterSpacing="5">MAIN CONCOURSE</text>
        <text x="475" y="90" textAnchor="middle" fontSize="8" fill="#888" letterSpacing="3">UPPER WALKWAY</text>
        <text x="475" y="338" textAnchor="middle" fontSize="8" fill="#888" letterSpacing="3">MIDDLE WALKWAY</text>
        <text x="475" y="520" textAnchor="middle" fontSize="8" fill="#888" letterSpacing="3">LOWER WALKWAY</text>
        
        <text x="183" y="310" textAnchor="middle" fontSize="9" fill="#888" transform="rotate(-90, 183, 310)" letterSpacing="4">WEST WING</text>
        <text x="753" y="300" textAnchor="middle" fontSize="9" fill="#888" transform="rotate(90, 757, 310)" letterSpacing="4">EAST WING</text>
        
        {/* Central Atrium */}
        <circle cx="475" cy="260" r="35" fill="url(#atriumPattern)" stroke="#3b82f6" strokeWidth="2" />
        <circle cx="475" cy="260" r="35" fill="none" stroke="#60a5fa" strokeWidth="1" strokeDasharray="5,5" />
        <text x="475" y="255" textAnchor="middle" fontSize="10" fill="#1e3a8a" fontWeight="bold">CENTRAL</text>
        <text x="475" y="270" textAnchor="middle" fontSize="10" fill="#1e3a8a" fontWeight="bold">ATRIUM</text>
        
        {/* Escalator */}
        <rect x="445" y="155" width="60" height="40" fill="url(#escalatorGrad)" stroke="#d69e2e" strokeWidth="2" rx="6" />
        <text x="475" y="172" textAnchor="middle" fontSize="16">⬆️</text>
        <text x="475" y="190" textAnchor="middle" fontSize="16">⬇️</text>
        <text x="475" y="150" textAnchor="middle" fontSize="7" fill="#975a16" fontWeight="bold">ESCALATOR</text>
        
        {/* Elevator */}
        <rect x="390" y="155" width="35" height="35" fill="#e2e8f0" stroke="#a0aec0" strokeWidth="1.5" rx="4" />
        <text x="407" y="170" textAnchor="middle" fontSize="10">⬆️</text>
        <text x="407" y="182" textAnchor="middle" fontSize="10">⬇️</text>
        <text x="407" y="150" textAnchor="middle" fontSize="6" fill="#718096">ELEVATOR</text>
        
        {/* Stores */}
        {currentStores.map(store => (
          <g key={store.id}>
            <rect 
              x={store.x} 
              y={store.y} 
              width={store.width} 
              height={store.height} 
              fill={store.color}
              stroke={selectedStore?.id === store.id ? '#ef4444' : (hoveredStore?.id === store.id ? '#3b82f6' : '#555')}
              strokeWidth={selectedStore?.id === store.id ? 3 : (hoveredStore?.id === store.id ? 2 : 1.5)}
              rx="6"
              className="store-rect"
              style={{ cursor: 'pointer', filter: 'url(#storeShadow)' }}
              onClick={() => onSelectStore(store)}
              onMouseEnter={() => setHoveredStore(store)}
              onMouseLeave={() => setHoveredStore(null)}
              opacity="0.94"
            />
            
            <text x={store.x + store.width/2} y={store.y + store.height/2 - 5} textAnchor="middle" fontSize={store.width > 100 ? 26 : 22}>
              {store.icon}
            </text>
            
            <text 
              x={store.x + store.width/2} 
              y={store.y + store.height - 8} 
              textAnchor="middle" 
              fontSize={store.width > 100 ? 8 : 7}
              fill="white"
              fontWeight="bold"
              style={{ textShadow: '0 1px 1px rgba(0,0,0,0.3)' }}
            >
              {store.name.length > 12 ? store.name.substring(0, 10) + '..' : store.name}
            </text>
            
            {hoveredStore?.id === store.id && (
              <>
                <rect 
                  x={store.x + store.width/2 - 40} 
                  y={store.y - 20} 
                  width="80" 
                  height="18" 
                  fill="#333" 
                  rx="8"
                />
                <text x={store.x + store.width/2} y={store.y - 8} textAnchor="middle" fontSize="8" fill="white">
                  {store.category}
                </text>
              </>
            )}
          </g>
        ))}
        
        {/* Navigation Path – uses raw pathPoints (no smoothing) */}
        {showPath && pathPoints && pathPoints.length > 1 && (
          <>
            {/* Outer glow */}
            <polyline 
              points={pathPoints.map(p => `${p.x},${p.y}`).join(' ')} 
              stroke="#ef4444" 
              strokeWidth="6" 
              strokeDasharray="10,6" 
              fill="none"
              opacity="0.2"
            />
            {/* Main marching ants line */}
            <polyline 
              points={pathPoints.map(p => `${p.x},${p.y}`).join(' ')} 
              stroke="#ef4444" 
              strokeWidth="3" 
              strokeDasharray="10,6" 
              fill="none"
              className="marching-ants"
              filter="url(#pathGlow)"
            />
          </>
        )}
        
        {/* Main Entrance */}
        <rect x="455" y="598" width="40" height="10" fill="#666" rx="2" />
        <rect x="458" y="600" width="12" height="6" fill="#ccc" rx="1" />
        <rect x="480" y="600" width="12" height="6" fill="#ccc" rx="1" />
        <text x="475" y="592" textAnchor="middle" fontSize="8" fill="#666" fontWeight="bold">ENTRANCE</text>
        
        {/* User Position */}
        {userPosition ? (
          <g className={userPosition.isMoving ? 'walking-animation' : ''}>
            <image 
              href={userPosition.isMoving ? walkingManIcon : personIcon} 
              x={userPosition.x - 12} 
              y={userPosition.y - 12} 
              width="24" 
              height="24"
              style={{ pointerEvents: 'none' }}
            />
            {userPosition.isMoving && (
              <circle cx={userPosition.x} cy={userPosition.y} r="18" fill="none" stroke="#3b82f6" strokeWidth="2" opacity="0.5">
                <animate attributeName="r" from="18" to="28" dur="1s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.5" to="0" dur="1s" repeatCount="indefinite" />
              </circle>
            )}
          </g>
        ) : (
          <g>
            <circle cx="475" cy="585" r="22" fill="#3b82f6" opacity="0.15">
              <animate attributeName="r" from="22" to="34" dur="1.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" from="0.15" to="0" dur="1.5s" repeatCount="indefinite" />
            </circle>
            <image 
              href={personIcon} 
              x="463" 
              y="573" 
              width="24" 
              height="24"
              style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
            />
            <rect 
              x="420" 
              y="560" 
              width="110" 
              height="18" 
              fill="#2d3748" 
              rx="9" 
              opacity="0.95"
              style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))' }}
            />
            <text 
              x="475" 
              y="573" 
              textAnchor="middle" 
              fontSize="9" 
              fill="white" 
              fontWeight="bold"
            >
              📍 YOU ARE HERE
            </text>
          </g>
        )}
        
        {/* Destination Marker */}
        {selectedStore && (
          <g>
            <circle cx={selectedStore.entranceX} cy={selectedStore.entranceY} r="10" fill="#ef4444" stroke="white" strokeWidth="2.5" />
            <circle cx={selectedStore.entranceX} cy={selectedStore.entranceY} r="14" fill="#ef4444" opacity="0.3">
              <animate attributeName="r" from="14" to="20" dur="1.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" from="0.3" to="0" dur="1.5s" repeatCount="indefinite" />
            </circle>
            <text x={selectedStore.entranceX} y={selectedStore.entranceY + 3} textAnchor="middle" fontSize="11" fill="white">🎯</text>
            <text x={selectedStore.entranceX} y={selectedStore.entranceY - 14} textAnchor="middle" fontSize="6" fill="#ef4444" fontWeight="bold">DEST</text>
          </g>
        )}
        
        {/* Floor Label */}
        <rect x="20" y="20" width="130" height="30" fill="#2d3748" rx="6" />
        <text x="85" y="40" textAnchor="middle" fontSize="11" fill="white" fontWeight="bold">
          {isGroundFloor ? '🏠 GROUND FLOOR' : '⬆️ SECOND FLOOR'}
        </text>
        
        {/* Emergency Exits */}
        <rect x="10" y="10" width="20" height="20" fill="#e53e3e" rx="3" />
        <text x="20" y="24" textAnchor="middle" fontSize="11" fill="white">🚪</text>
        <rect x="920" y="10" width="20" height="20" fill="#e53e3e" rx="3" />
        <text x="930" y="24" textAnchor="middle" fontSize="11" fill="white">🚪</text>
        <rect x="10" y="590" width="20" height="20" fill="#e53e3e" rx="3" />
        <text x="20" y="604" textAnchor="middle" fontSize="11" fill="white">🚪</text>
        <rect x="920" y="590" width="20" height="20" fill="#e53e3e" rx="3" />
        <text x="930" y="604" textAnchor="middle" fontSize="11" fill="white">🚪</text>
        
        {/* Info Signs */}
        <rect x="280" y="598" width="55" height="16" fill="#2d3748" rx="3" />
        <text x="307" y="609" textAnchor="middle" fontSize="8" fill="white">ℹ️ INFO</text>
        <rect x="560" y="598" width="55" height="16" fill="#2d3748" rx="3" />
        <text x="587" y="609" textAnchor="middle" fontSize="8" fill="white">🛗 ELEV</text>
        
      </svg>
    </div>
  );
}

export default MapView;