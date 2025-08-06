"use client";

import React, { useRef, useEffect, useState } from "react";

const NavBar = () => {
  const [visible, setVisible] = useState(true);
  const lastScroll = useRef(0);

  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentScroll = window.scrollY;
          
          if (currentScroll > lastScroll.current && currentScroll > 100) {
            setVisible(false);
          } else if (currentScroll < lastScroll.current || currentScroll <= 100) {
            setVisible(true);
          }
          
          lastScroll.current = currentScroll;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleRipple = (e) => {
    const btn = e.currentTarget;
    const ripple = document.createElement("span");
    ripple.classList.add("ripple");
    const rect = btn.getBoundingClientRect();
    ripple.style.left = `${e.clientX - rect.left}px`;
    ripple.style.top = `${e.clientY - rect.top}px`;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  };

  return (
    <>
      <style jsx>{`
        nav.nav {
          background: #141414;
          color: #F5E6D3;
          border-radius: 999px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 20px;
          width: 100%;
          max-width: 336px;
          margin: 0 auto;
          gap: 30px;
          position: fixed;
          top: 20px;
          left: 50%;
          z-index: 9998;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          transform: translateX(-50%);
        }

        @media (min-width: 768px) and (max-width: 1024px) {
          nav.nav {
            max-width: 400px;
            padding: 16px 24px;
            gap: 40px;
            top: 24px;
          }
        }

        @media (min-width: 1025px) {
          nav.nav {
            max-width: 450px;
            padding: 18px 28px;
            gap: 50px;
            top: 28px;
          }
        }

        @media (min-width: 768px) {
          nav.nav {
            max-width: 864px;
          }
        }

        @keyframes fadeSlideDown {
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }

        .logo {
          margin-left: 15px;
        }

        .logo img {
          height: 20px;
          filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.4));
        }

        .logo-desktop {
          display: block;
        }

        .logo-mobile {
          display: none;
        }

        @media (max-width: 767px) {
          .logo {
            margin-left: 5px;
          }
          
          .logo img {
            height: 16px;
          }
          
          .logo-desktop {
            display: none;
          }
          
          .logo-mobile {
            display: block;
          }
        }

        .right {
          display: flex;
          align-items: center;
          gap: 20px;
          position: relative;
        }

        .help-wrapper {
          position: relative;
          display: inline-block;
        }

        .help-area {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }

        .help {
          font-size: 1rem;
          font-weight: 500;
          color: #F5E6D3;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          position: relative;
          padding: 6px;
          transition: all 0.3s ease;
        }

        .arrow {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.3s ease;
          margin-left: 2px;
          transform: rotate(180deg);
        }

        .help-area:hover .arrow {
          transform: rotate(0deg);
        }

        .help-hover-area {
          position: absolute;
          top: 100%;
          right: 0;
          width: 100%;
          height: 15px;
        }

        .help:hover + .help-hover-area + .help-menu,
        .help-area:hover .help-menu,
        .help-hover-area:hover + .help-menu,
        .help-menu:hover {
          display: flex;
        }

        .help-menu {
          position: absolute;
          top: calc(100% + 12px);
          right: 0;
          background: #141414;
          border-radius: 12px;
          box-shadow: 0 12px 24px rgba(0,0,0,0.5);
          padding: 8px 0;
          display: none;
          flex-direction: column;
          min-width: 180px;
          z-index: 9999;
        }

        .help-menu a {
          padding: 12px 20px;
          font-size: 0.95rem;
          color: #F5E6D3;
          text-decoration: none;
          transition: color 0.25s ease;
        }

        .help-menu a:hover {
          color: #D5DF26;
          background: transparent;
        }

        .menu-button {
          background: transparent;
          border: 2px solid #F5E6D3;
          color: #F5E6D3;
          padding: 8px 24px;
          border-radius: 999px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: background 0.3s ease, color 0.3s ease, border-color 0.3s ease;
        }

        .menu-button span {
          position: relative;
          z-index: 2;
        }

        .ripple {
          position: absolute;
          width: 20px;
          height: 20px;
          background: #F5E6D3;
          opacity: 0.4;
          border-radius: 50%;
          transform: scale(0);
          animation: ripple-animation 0.6s ease-out;
          pointer-events: none;
          z-index: 1;
        }

        @keyframes ripple-animation {
          to {
            transform: scale(8);
            opacity: 0;
          }
        }

        .menu-button:hover {
          color: #141414;
          background: #D5DF26;
          border-color: #D5DF26;
        }

        .nav--hidden {
          opacity: 0;
          transform: translateX(-50%) translateY(-100%);
          pointer-events: none;
        }

        .nav--visible {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
          pointer-events: auto;
        }
      `}</style>
      <nav className={`nav ${visible ? "nav--visible" : "nav--hidden"}`}>
        <div className="logo">
          <a href="https://www.gronsdodgeball.nl" target="_blank">
            <img 
              src="/assets/logos/gronsdodgeball.svg" 
              alt="Gron's Dodgeball" 
              className="logo-desktop"
            />
            <img 
              src="/assets/logos/GD.svg" 
              alt="GD" 
              className="logo-mobile"
            />
          </a>
        </div>
        <div className="right">
          <div className="help-wrapper">
            <div className="help-area">
              <div className="help">
                Help
                <span className="arrow" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M7 10l5 5 5-5H7z"/>
                  </svg>
                </span>
              </div>
              <div className="help-hover-area"></div>
              <div className="help-menu" id="helpMenu">
                <a href="#">Email Us</a>
                <a href="#">FAQ</a>
                <a href="#">Terms</a>
                <a href="#">Rules</a>
                <a href="#">Privacy</a>
              </div>
            </div>
          </div>
          <button className="menu-button" id="menuBtn" onClick={handleRipple}>
            <span>Menu</span>
          </button>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
