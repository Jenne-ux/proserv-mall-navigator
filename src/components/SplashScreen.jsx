import React, { useState, useEffect } from 'react';
import proservLogo from '../assets/proserv_plus_logo-removebg-preview.png';

function SplashScreen({ onComplete }) {
  const [fadeOut, setFadeOut] = useState(false);
  const [pulse, setPulse] = useState(true);

  const handleTap = () => {
    setFadeOut(true);
    setTimeout(() => {
      onComplete();
    }, 500);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(prev => !prev);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`splash-screen ${fadeOut ? 'fade-out' : ''}`} onClick={handleTap}>
      <div className="splash-content">
        <div className="logo-container">
          <div className="logo-mark">
            <img 
              src={proservLogo} 
              alt="ProServ Plus Logo" 
              className="logo-image"
            />
          </div>
          <h1 className="logo-text">PROSERV</h1>
          <div className="logo-divider"></div>
        </div>
        
        <h2 className="splash-title">Mall Navigator</h2>
        <p className="splash-subtitle">Smart Navigation Kiosk System</p>
        
        <div className="tap-container">
          <div className={`tap-button ${pulse ? 'pulse' : ''}`}>
            <span className="tap-text">TAP HERE TO START</span>
          </div>
          <p className="tap-subtext">Touch anywhere on screen to continue</p>
        </div>
        
        <div className="splash-footer">
        </div>
      </div>
      
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap');
        
        .splash-screen {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at center, 
            #f0f8ff 0%,
            #e6f3ff 15%,
            #d6edff 30%,
            #c0e4ff 50%,
            #a8d4f0 70%,
            #8bc1e0 85%,
            #6aaed0 100%
          );
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          cursor: pointer;
          transition: opacity 0.6s ease;
        }
        
        .splash-screen.fade-out {
          opacity: 0;
          pointer-events: none;
        }
        
        .splash-content {
          text-align: center;
          padding: 50px;
          max-width: 700px;
          width: 90%;
          animation: fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .logo-container {
          margin-bottom: 48px;
        }
        
        .logo-mark {
          margin-bottom: 24px;
          display: inline-block;
          animation: logoFloat 2s ease-in-out infinite;
        }
        
        .logo-image {
          width: 260px;   /* exactly 260px as requested */
          height: auto;
          max-width: 100%;
          transition: transform 0.3s ease;
          display: block;
          background: transparent;
        }
        
        .logo-image:hover {
          transform: scale(1.02);
        }
        
        .logo-text {
          font-size: 42px;
          font-weight: 700;
          font-family: 'Montserrat', 'Helvetica Neue', sans-serif;
          background: linear-gradient(135deg, #2c5f8a 0%, #4a90e2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0 0 16px 0;
          letter-spacing: 4px;
        }
        
        .logo-divider {
          width: 80px;
          height: 2px;
          background: linear-gradient(90deg, transparent, #4a90e2, #2c5f8a, transparent);
          margin: 0 auto;
        }
        
        .splash-title {
          font-size: 36px;
          font-weight: 600;
          font-family: 'Montserrat', 'Helvetica Neue', sans-serif;
          color: #1a4a6e;
          margin: 0 0 12px 0;
          letter-spacing: -0.5px;
        }
        
        .splash-subtitle {
          font-size: 16px;
          font-weight: 400;
          font-family: 'Inter', 'Segoe UI', sans-serif;
          color: #4a7a9e;
          margin: 0 0 48px 0;
          letter-spacing: 0.3px;
        }
        
        .tap-container {
          margin: 48px 0;
        }
        
        .tap-button {
          background: linear-gradient(135deg, #4a90e2 0%, #2c5f8a 100%);
          padding: 16px 40px;
          border-radius: 60px;
          display: inline-block;
          transition: all 0.3s ease;
          cursor: pointer;
          box-shadow: 0 8px 20px rgba(42, 95, 138, 0.25);
        }
        
        .tap-button.pulse {
          transform: scale(1.05);
          box-shadow: 0 12px 30px rgba(42, 95, 138, 0.35);
        }
        
        .tap-text {
          font-size: 18px;
          font-weight: 600;
          font-family: 'Montserrat', 'Helvetica Neue', sans-serif;
          color: #ffffff;
          letter-spacing: 2px;
        }
        
        .tap-subtext {
          font-size: 13px;
          font-weight: 400;
          font-family: 'Inter', 'Segoe UI', sans-serif;
          color: #4a7a9e;
          margin-top: 20px;
          letter-spacing: 0.5px;
        }
        
        .splash-footer {
          margin-top: 60px;
          padding-top: 24px;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes logoFloat {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .tap-button:hover {
          transform: scale(1.05);
          box-shadow: 0 12px 30px rgba(42, 95, 138, 0.35);
        }
        
        @media (max-width: 768px) {
          .splash-content {
            padding: 30px 20px;
            max-width: 600px;
          }
          .logo-text {
            font-size: 32px;
          }
          .logo-image {
            width: 200px;   /* scaled proportionally */
          }
          .splash-title {
            font-size: 28px;
          }
          .splash-subtitle {
            font-size: 14px;
          }
          .tap-text {
            font-size: 16px;
          }
          .tap-button {
            padding: 14px 32px;
          }
        }
        
        @media (max-width: 480px) {
          .logo-text {
            font-size: 28px;
          }
          .logo-image {
            width: 150px;   /* scaled proportionally */
          }
          .splash-title {
            font-size: 24px;
          }
          .splash-subtitle {
            font-size: 12px;
          }
          .tap-text {
            font-size: 14px;
          }
          .tap-subtext {
            font-size: 11px;
          }
          .tap-button {
            padding: 12px 28px;
          }
        }
      `}</style>
    </div>
  );
}

export default SplashScreen;