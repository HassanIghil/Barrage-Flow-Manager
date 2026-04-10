import React from 'react';

const LoadingOverlay = ({ message = "Chargement en cours" }) => {
  return (
    <div className="loading-overlay">
      <div className="loader-box">
        <div className="loader-spinner" />
        <div className="loader-text" style={{ 
          fontFamily: 'var(--font-headline)', 
          fontSize: '18px', 
          fontWeight: 800, 
          color: '#1A3A42' 
        }}>
          {message}
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
