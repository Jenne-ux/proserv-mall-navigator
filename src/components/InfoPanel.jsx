import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { generateDirections, getSimpleDirections } from '../utils/navigation';

function InfoPanel({ store, distance, eta, isSimulating, onSimulate, onPause, progress }) {
  const [showQR, setShowQR] = useState(false);
  const [qrValue, setQrValue] = useState('');
  const [expandedStep, setExpandedStep] = useState(null);
  
  if (!store) {
    return (
      <div className="info-panel">
        <div className="welcome-message">
          <div className="welcome-icon">🏬</div>
          <h2>Welcome to ProServ Mall</h2>
          <p>Select a store from the directory to start navigation</p>
          <div className="instruction">
            <span>👇</span>
            <span>Click any store on the map or sidebar</span>
          </div>
        </div>
      </div>
    );
  }
  
  const handleGetDirections = () => {
    const needsEscalator = store.floor === 'second';
    const simpleDirections = getSimpleDirections(store, needsEscalator);
    
    const plainTextContent = `
PROSERV MALL NAVIGATION
========================

STORE: ${store.name}
FLOOR: ${store.floor === 'ground' ? 'Ground Floor' : 'Second Floor'}
DISTANCE: ${distance} meters
ESTIMATED TIME: ${eta} minutes

DIRECTIONS:
${simpleDirections.map((step, i) => `${i+1}. ${step}`).join('\n')}

Scan this QR code again for live updates.
========================
    `.trim();
    
    setQrValue(plainTextContent);
    setShowQR(true);
  };
  
  const handleCloseQR = () => {
    setShowQR(false);
    setQrValue('');
  };
  
  const needsEscalator = store.floor === 'second';
  const detailedDirections = generateDirections(store, needsEscalator);
  
  return (
    <div className="info-panel">
      {/* Store Header */}
      <div className="store-header">
        <div className="store-icon-large">{store.icon}</div>
        <div className="store-details">
          <h2>{store.name}</h2>
          <div className={`floor-badge ${store.floor}`}>
            {store.floor === 'ground' ? '🏠 Ground Floor' : '⬆️ Second Floor'}
          </div>
          <div className="store-category-badge">{store.category}</div>
        </div>
      </div>
      
      {/* Escalator Alert for Second Floor */}
      {needsEscalator && (
        <div className="alert escalator-alert">
          <span>🪜</span>
          <div>
            <strong>Escalator Required</strong>
            <p>This store is on the second floor. Take the escalator at Central Atrium.</p>
          </div>
        </div>
      )}
      
      {/* Distance and Time Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📏</div>
          <div>
            <div className="stat-label">Distance</div>
            <div className="stat-value">{distance}<span className="stat-unit">m</span></div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏱️</div>
          <div>
            <div className="stat-label">Est. Time</div>
            <div className="stat-value">{eta}<span className="stat-unit">min</span></div>
          </div>
        </div>
      </div>
      
      {/* Detailed Directions */}
      <div className="directions-card">
        <h4>🗺️ Navigation Directions</h4>
        <div className="directions-list">
          {detailedDirections.map((step, idx) => (
            <div 
              key={idx} 
              className={`direction-step ${expandedStep === idx ? 'expanded' : ''}`}
              onClick={() => setExpandedStep(expandedStep === idx ? null : idx)}
            >
              <div className="step-number">
                <span className="step-icon">{step.icon}</span>
                <span className="step-num">{step.step}</span>
              </div>
              <div className="step-content">
                <div className="step-instruction">{step.instruction}</div>
                <div className="step-detail">{step.detail}</div>
                {step.distance && (
                  <div className="step-meta">
                    <span className="meta-distance">📏 {step.distance}</span>
                    {step.side && <span className="meta-side">📍 {step.side} side</span>}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="action-buttons">
        {!isSimulating ? (
          <button className="action-btn simulate-btn" onClick={onSimulate}>
            🚶 Start Walking Simulation
          </button>
        ) : (
          <button className="action-btn pause-btn" onClick={onPause}>
            ⏸️ Pause Simulation
          </button>
        )}
        <button className="action-btn qr-btn" onClick={handleGetDirections}>
          📱 Get Directions on Phone
        </button>
      </div>
      
      {/* Progress Bar */}
      {isSimulating && (
        <div className="progress-container">
          <div className="progress-label">
            <span>Navigation Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      )}
      
      {/* QR Code Modal – text preview removed */}
      {showQR && (
        <div className="qr-modal" onClick={handleCloseQR}>
          <div className="qr-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="qr-close" onClick={handleCloseQR}>×</button>
            <h4>Scan to Navigate to {store.name}</h4>
            
            <div className="qr-code-wrapper">
              <QRCodeSVG 
                value={qrValue}
                size={200}
                bgColor="#ffffff"
                fgColor="#000000"
                level="L"
                includeMargin={true}
              />
            </div>
            
            <div className="qr-info">
              <p><strong>{store.name}</strong></p>
              <p>{store.floor === 'ground' ? 'Ground Floor' : 'Second Floor'}</p>
              <p className="qr-distance">📏 {distance}m • ⏱️ {eta} min</p>
            </div>
            
            <div className="qr-instructions">
              <p>1. Open your phone camera</p>
              <p>2. Point at this QR code</p>
              <p>3. Tap the notification to see directions</p>
            </div>
          </div>
        </div>
      )}
      
      {/* QR Info Footer */}
      <div className="qr-container">
        <div style={{ fontSize: '48px', marginBottom: '8px' }}>📱</div>
        <p>Click "Get Directions on Phone"<br/>to receive a QR code with step-by-step directions</p>
        <p style={{ fontSize: '9px', marginTop: '8px', color: '#aaa' }}>
          Scan with your phone camera to get the full navigation instructions
        </p>
      </div>
    </div>
  );
}

export default InfoPanel;