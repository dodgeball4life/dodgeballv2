import React, { useEffect, useState } from "react";
import "./globals.css";

const LoadingIndicator = ({ onLoaded }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  useEffect(() => {
    // Simple loading timer - adjust if actually needed
    const timer = setTimeout(() => {
      setIsAnimatingOut(true);
      // Give time for slideUp animation then remove
      setTimeout(() => {
        setIsVisible(false);
        onLoaded?.();
      }, 800); // Match the slideUp animation duration
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
    <div 
      id="loader" 
      className={`loading-screen ${isAnimatingOut ? 'animate-out' : ''}`}
    >
      <div className="logo-wrapper">
        <img src="/assets/logo.svg" alt="Groningen's Dodgeball" className="logo-loader" />
        
        <div className="loading-text">
          Loading
        </div>
        
        <div className="loading-dots">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingIndicator;
