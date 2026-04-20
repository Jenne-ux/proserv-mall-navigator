import React from 'react';
import proservLogo from '../assets/proserv_plus_logo-removebg-preview.png';

function Header({ floor, onFloorChange, onReset, selectedStore }) {
  return (
    <header className="header">
      <div className="logo-section">
        <div className="logo-image">🏬</div>
        <div className="logo-text">
          <h1>ProServ Mall Navigator</h1>
          <p>Smart Navigation Kiosk</p>
        </div>
      </div>
      
      <div className="floor-controls-wrapper">
        <div className="floor-controls">
          <button 
            className={`floor-btn ${floor === 'ground' ? 'active' : ''}`}
            onClick={() => onFloorChange('ground')}
          >
            🏠 Ground Floor
          </button>
          <button 
            className={`floor-btn ${floor === 'second' ? 'active' : ''}`}
            onClick={() => onFloorChange('second')}
          >
            ⬆️ Second Floor
          </button>
        </div>
        
        <button className="reset-btn" onClick={onReset}>
          🔄 Reset Navigation
        </button>
      </div>
      
      <div className="active-destination">
        {selectedStore ? (
          <>
            <span>📍</span>
            <span>{selectedStore.name}</span>
          </>
        ) : (
          <span>&nbsp;</span> // empty placeholder to maintain layout
        )}
      </div>

      <div className="powered-by">
        <div className="powered-text">Powered by</div>
        <img src={proservLogo} alt="ProServ Plus" className="proserv-logo" />
      </div>
    </header>
  );
}

export default Header;