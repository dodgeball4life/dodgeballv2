import React, { useEffect, useState } from "react";
import "./globals.css";

const LoadingIndicator = ({ onLoaded }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Simple loading timer - adjust if actually needed
    const timer = setTimeout(() => {
      setIsVisible(false);
      onLoaded?.();
    }, 1500); // Short 1.5 second loading

    return () => clearTimeout(timer);
  }, [onLoaded]);

  // Prevent body scroll
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <>
      <style jsx>{`
        .loading-screen {
          position: fixed;
          inset: 0;
          z-index: 999999;
          background: linear-gradient(135deg, #F0EEE7, #d4cec1);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 2rem;
          overflow: hidden;
        }

        .logo img {
          width: clamp(120px, 30vw, 160px);
          height: auto;
          animation: logoFloat 2s ease-in-out infinite;
        }

        @keyframes logoFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }

        .loading-text {
          font-family: 'Inter', sans-serif;
          font-size: 1rem;
          color: #0d0c0b;
          opacity: 0.7;
          animation: pulse 1.5s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }

        .loading-dots {
          display: flex;
          gap: 4px;
        }

        .dot {
          width: 8px;
          height: 8px;
          background: #0d0c0b;
          border-radius: 50%;
          animation: dotBounce 1.4s ease-in-out infinite both;
        }

        .dot:nth-child(1) { animation-delay: -0.32s; }
        .dot:nth-child(2) { animation-delay: -0.16s; }
        .dot:nth-child(3) { animation-delay: 0s; }

        @keyframes dotBounce {
          0%, 80%, 100% {
            transform: scale(0.8);
            opacity: 0.5;
          }
          40% {
            transform: scale(1.2);
            opacity: 1;
          }
        }
      `}</style>
      
      <div className="loading-screen">
        <div className="logo">
          <img src="/assets/logo.svg" alt="Groningen's Dodgeball" />
        </div>
        
        <div className="loading-text">
          Loading
        </div>
        
        <div className="loading-dots">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      </div>
    </>
  );
};

export default LoadingIndicator;
