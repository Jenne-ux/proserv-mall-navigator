import React, { useMemo } from 'react';
import { stores } from '../data/stores';

function Sidebar({ floor, onSelectStore, selectedStore }) {
  const currentStores = stores[floor] || [];
  
  const categories = useMemo(() => {
    const cats = {};
    currentStores.forEach(store => {
      if (!cats[store.category]) cats[store.category] = [];
      cats[store.category].push(store);
    });
    return cats;
  }, [currentStores]);
  
  // Quick access stores - different for each floor
  const quickStores = useMemo(() => {
    if (floor === 'ground') {
      return currentStores.filter(s => 
        ['Food Court', 'Coffee Shop', 'Restrooms', 'Customer Service'].includes(s.category) || 
        s.name === 'Customer Service'
      ).slice(0, 5);
    } else {
      // Second floor quick access
      return currentStores.filter(s => 
        ['Cafe', 'Dining', 'Facilities', 'Entertainment'].includes(s.category)
      ).slice(0, 5);
    }
  }, [currentStores, floor]);
  
  return (
    <div className="sidebar">
      <div className="location-card">
        <div className="location-label">YOUR LOCATION</div>
        <div className="location-floor">
          {floor === 'ground' ? '🏠 Ground Floor' : '⬆️ Second Floor'}
        </div>
        <div className="location-name">Main Entrance • Central Atrium</div>
      </div>
      
      <div className="directory">
        <h3>📋 Mall Directory</h3>
        <div className="store-list">
          {Object.entries(categories).map(([category, storesList]) => (
            <div key={category} className="category-group">
              <div className="category-title">{category}</div>
              {storesList.map(store => (
                <div 
                  key={store.id}
                  className={`store-item ${selectedStore?.id === store.id ? 'selected' : ''}`}
                  onClick={() => onSelectStore(store)}
                >
                  <div className="store-icon">{store.icon}</div>
                  <div className="store-info">
                    <div className="store-name">{store.name}</div>
                    <div className="store-location">
                      {store.floor === 'ground' ? '🏠 GF' : '⬆️ 2F'} • {store.category}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      
      <div className="quick-access">
        <h4>⚡ Quick Access</h4>
        <div className="quick-buttons">
          {quickStores.map(store => (
            <button 
              key={store.id}
              className="quick-btn"
              onClick={() => onSelectStore(store)}
            >
              {store.icon} {store.name}
            </button>
          ))}
        </div>
      </div>
      
      <div className="legend">
        <h4>📖 Map Legend</h4>
        <div className="legend-items">
          <div className="legend-item"><div className="legend-color anchor"></div>Anchor Store</div>
          <div className="legend-item"><div className="legend-color dining"></div>Dining/Food</div>
          <div className="legend-item"><div className="legend-color retail"></div>Retail</div>
          <div className="legend-item"><div className="legend-color service"></div>Services</div>
          <div className="legend-item"><div className="legend-color walkway"></div>Walkway</div>
          <div className="legend-item"><div className="legend-color you"></div>Your Position</div>
          <div className="legend-item"><div className="legend-color destination"></div>Destination</div>
          <div className="legend-item"><div className="legend-color path"></div>Navigation Path</div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;