"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react';
import styles from "../styles/NavBar.module.css";

const NavBar = () => {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [helpMenuOpen, setHelpMenuOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [forceVisible, setForceVisible] = useState(false); // Force navbar to be visible when pill is clicked
  const [isMobile, setIsMobile] = useState(false);
  const lastScroll = useRef(0);

  // Detect if device is mobile/touch-enabled
  useEffect(() => {
    const checkMobile = () => {
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.innerWidth <= 768;
      setIsMobile(isTouchDevice || isSmallScreen);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Scroll visibility effect
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentScroll = window.scrollY;
          
          // Set scrolled state for pill navbar
          setIsScrolled(currentScroll > 100);
          
          // Only hide navbar on scroll down, never on scroll up
          if (currentScroll > lastScroll.current && currentScroll > 100 && !forceVisible) {
            setVisible(false);
          } else if (currentScroll <= 100) {
            setVisible(true);
            setForceVisible(false); // Reset force visible when at top
          }
          
          // If navbar is force visible and user continues scrolling down significantly (more threshold)
          if (forceVisible && currentScroll > lastScroll.current && (currentScroll - lastScroll.current) > 100) {
            setForceVisible(false); // Allow navbar to hide again after scrolling down more
          }
          
          lastScroll.current = currentScroll;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [forceVisible]);

  const menuRef = useRef(null);

  const mainLinks = [
    { label: "Sessions", href: "/#sessions" },
    { label: "Clinics", href: "/clinics", external: true },
    { label: "Memberships", href: "/#memberships" },
    { label: "Youth", href: "/youth", external: true },
  ];

  const moreLinks = [
    { label: "Funds", href: "/#funds" },
    { label: "FAQ", href: "/#faq" },
    { label: "Contact", href: "/#contact" },
  ];

  const helpLinks = [
    { label: "FAQ", href: "/#faq" },
    { label: "Terms", href: "/terms-of-service" },
    { label: "Rules", href: "/code-of-conduct" },
    { label: "Privacy", href: "/privacy-policy" },
  ];

  const svgIcons = [
    {
      icon: <img
        src="/assets/socials/facebook.svg"
        alt="Facebook"
        width="18"
        height="18"
      />,
      href: "#"
    },
    {
      icon: <img
        src="/assets/socials/instagram.svg"
        alt="Instagram"
        width="18"
        height="18"
      />,
      href: "#"
    },
    {
      icon: <img
        src="/assets/socials/tiktok.svg"
        alt="TikTok"
        width="18"
        height="18"
      />,
      href: "#"
    },
    {
      icon: <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5l-8-5V6l8 5l8-5v2z"/>
      </svg>,
      href: "/#contact"
    },
  ];

  const openMenu = () => {
    setMenuOpen(true);
    setMoreMenuOpen(false);
    setHelpMenuOpen(false);
    // Hide body overflow to prevent background page scrolling
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";
  };

  const closeMenu = () => {
    setMenuOpen(false);
    setMoreMenuOpen(false);
    setHelpMenuOpen(false);
    document.body.style.overflow = "unset";
    document.body.style.position = "static";
    document.body.style.width = "auto";
  };

  const toggleMoreMenu = () => {
    setMoreMenuOpen(!moreMenuOpen);
  };

  const toggleHelpMenu = () => {
    setHelpMenuOpen(!helpMenuOpen);
  };

  // Close more menu when clicking outside or on close button
  const closeMoreMenu = () => {
    if (moreMenuOpen) {
      setMoreMenuOpen(false);
    }
  };

  // Enhanced touch/click handler for More menu
  const handleMoreMenuClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setMoreMenuOpen(!moreMenuOpen);
  };

  // Handle touch events for mobile
  const handleMoreMenuTouch = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleMoreMenu();
  };

  // Combined click and touch handler for More menu
  const handleMoreMenuInteraction = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Simple toggle without complex animations for mobile
    setMoreMenuOpen(!moreMenuOpen);
  };

  const createRipple = (event) => {
    const button = event.currentTarget;
    const ripple = document.createElement("span");
    ripple.classList.add("ripple");
    const rect = button.getBoundingClientRect();
    ripple.style.left = `${event.clientX - rect.left}px`;
    ripple.style.top = `${event.clientY - rect.top}px`;
    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  };

  // Handle help menu click for mobile devices
  const handleHelpClick = (e) => {
    if (isMobile) {
      e.preventDefault();
      e.stopPropagation();
      setHelpMenuOpen(!helpMenuOpen);
    }
  };

  // Handle wheel scrolling for menu content only
  useEffect(() => {
    if (menuOpen) {
      const handleWheel = (e) => {
        // Always prevent default wheel behavior when menu is open
        e.preventDefault();
        e.stopPropagation();
        
        // Find the menu container
        const menuContainer = document.querySelector(`.${styles.menuContentContainer}`);
        if (menuContainer) {
          // Scroll the menu container
          const scrollAmount = e.deltaY;
          menuContainer.scrollTop += scrollAmount;
        }
      };

      const handleTouchMove = (e) => {
        // Allow touch scrolling within the container
        e.stopPropagation();
      };

      // Add event listeners to document to catch all wheel events
      document.addEventListener('wheel', handleWheel, { passive: false, capture: true });
      document.addEventListener('touchmove', handleTouchMove, { passive: true, capture: true });

      return () => {
        document.removeEventListener('wheel', handleWheel, { capture: true });
        document.removeEventListener('touchmove', handleTouchMove, { capture: true });
      };
    }
  }, [menuOpen]);

  // Close more menu when main menu closes
  useEffect(() => {
    if (!menuOpen && moreMenuOpen) {
      closeMoreMenu();
    }
  }, [menuOpen, moreMenuOpen]);

  // Close help menu when clicking outside on mobile
  useEffect(() => {
    if (isMobile && helpMenuOpen) {
      const handleClickOutside = (e) => {
        const helpElement = document.getElementById('helpMenu');
        const helpButton = e.target.closest('.help-button');
        
        if (helpElement && !helpElement.contains(e.target) && !helpButton) {
          setHelpMenuOpen(false);
        }
      };

      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isMobile, helpMenuOpen]);

  // Simplified hash navigation handler
  useEffect(() => {
    const scrollToSection = (sectionId) => {
      console.log('Scrolling to section:', sectionId);
      const target = document.getElementById(sectionId);
      if (target) {
        console.log('Found target element:', target);
        console.log('Target offsetTop:', target.offsetTop);
        
        // Scroll directly to the section with consistent offset
        const navbarHeight = 100; // Approximate navbar height
        const targetOffset = target.offsetTop - navbarHeight;
        
        window.scrollTo({
          top: Math.max(0, targetOffset + 900), // Ensure we don't scroll to negative position
          behavior: "smooth"
        });
        return true;
      } else {
        console.log('Section not found:', sectionId);
        return false;
      }
    };

    const handleHashNavigation = () => {
      const hash = window.location.hash;
      if (hash) {
        const sectionId = hash.substring(1);
        console.log('=== HASH NAVIGATION START ===');
        console.log('Navigating to section:', sectionId);
        console.log('Current pathname:', window.location.pathname);
        
        // Try immediate scroll
        if (!scrollToSection(sectionId)) {
          console.log('First attempt failed, retrying...');
          // If not found, wait a bit and try again (for cross-page navigation)
          setTimeout(() => {
            console.log('Second attempt...');
            if (!scrollToSection(sectionId)) {
              console.log('Second attempt failed, trying third attempt...');
              // Try one more time with longer delay for slower loading
              setTimeout(() => {
                console.log('Third attempt...');
                scrollToSection(sectionId);
              }, 1000);
            }
          }, 500);
        } else {
          console.log('First attempt succeeded!');
        }
        console.log('=== HASH NAVIGATION END ===');
      }
    };

    // Close menu when navigation occurs
    const handleRouteChange = () => {
      if (menuOpen) {
        setMenuOpen(false);
        setMoreMenuOpen(false);
        document.body.style.overflow = "unset";
        document.body.style.position = "static";
        document.body.style.width = "auto";
      }
    };

    // Handle hash on initial page load with multiple attempts for cross-page navigation
    const initialTimer = setTimeout(() => {
      console.log('Initial hash navigation attempt - pathname:', window.location.pathname);
      if (window.location.pathname === '/' && window.location.hash) {
        console.log('On home page with hash, attempting navigation');
        handleHashNavigation();
      }
    }, 300);
    
    // Additional attempts for cross-page navigation - more aggressive timing
    const secondTimer = setTimeout(() => {
      if (window.location.pathname === '/' && window.location.hash) {
        console.log('Secondary initial hash navigation attempt');
        handleHashNavigation();
      }
    }, 1000);
    
    const thirdTimer = setTimeout(() => {
      if (window.location.pathname === '/' && window.location.hash) {
        console.log('Third initial hash navigation attempt');
        handleHashNavigation();
      }
    }, 2500);
    
    const fourthTimer = setTimeout(() => {
      if (window.location.pathname === '/' && window.location.hash) {
        console.log('Fourth initial hash navigation attempt');
        handleHashNavigation();
      }
    }, 4000);

    // Listen for hash changes and navigation
    window.addEventListener('hashchange', handleHashNavigation);
    window.addEventListener('popstate', handleHashNavigation);
    
    // Use MutationObserver to detect when sections are added to the DOM
    let observer = null;
    if (window.location.pathname === '/' && window.location.hash) {
      console.log('Setting up DOM observer for hash navigation');
      observer = new MutationObserver((mutations) => {
        const hash = window.location.hash;
        if (hash) {
          const sectionId = hash.substring(1);
          const target = document.getElementById(sectionId);
          if (target) {
            console.log('DOM observer found target section:', sectionId);
            observer.disconnect(); // Stop observing once we find the target
            setTimeout(() => {
              handleHashNavigation();
            }, 100);
          }
        }
      });
      
      // Start observing
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
      
      // Stop observing after 10 seconds to prevent memory leaks
      setTimeout(() => {
        if (observer) {
          observer.disconnect();
          console.log('DOM observer stopped after timeout');
        }
      }, 10000);
    }
    


    // Note: router.events is not available in App Router (next/navigation)
    // Hash navigation is handled by the initial timers and hashchange events
    
    return () => {
      clearTimeout(initialTimer);
      clearTimeout(secondTimer);
      clearTimeout(thirdTimer);
      clearTimeout(fourthTimer);
      window.removeEventListener('hashchange', handleHashNavigation);
      window.removeEventListener('popstate', handleHashNavigation);
      if (observer) {
        observer.disconnect();
      }
    };
  }, [router, menuOpen]);

  // Reset sub-menu states when main menu opens
  useEffect(() => {
    if (menuOpen) {
      setMoreMenuOpen(false);
      setHelpMenuOpen(false);
    }
  }, [menuOpen]);

  // Direct section navigation function
  const handleSectionNavigation = (href, closeMenuFn = closeMenu) => {
    const isSectionLink = href.startsWith("/#");
    if (isSectionLink) {
      const hash = href.substring(2); // Remove "/#"
      console.log('=== NAVIGATION START ===');
      console.log('Target section:', hash);
      console.log('Current path:', window.location.pathname);
      
      // Navigate directly
      if (window.location.pathname !== "/") {
        console.log('Cross-page navigation to:', `/#${hash}`);
        // Close menu first for cross-page navigation
        closeMenuFn();
        // For cross-page navigation, just navigate to the new URL
        // The hash navigation handler will take care of scrolling after page loads
        router.push(`/#${hash}`);
      } else {
        console.log('Same-page navigation to section');
        
        // For same-page navigation, find the target element
        const target = document.getElementById(hash);
        if (!target) {
          console.log('ERROR: Section not found:', hash);
          console.log('Available elements with IDs:', Array.from(document.querySelectorAll('[id]')).map(el => el.id));
          return;
        }
        
        console.log('Found target element:', target);
        console.log('Target position:', target.offsetTop);
        
        // Set hash first
        window.location.hash = hash;
        
        // Close menu and scroll to section
        closeMenuFn();
        
        // Scroll to section with delay for menu closing
        setTimeout(() => {
          // Re-check target exists and get fresh position
          const freshTarget = document.getElementById(hash);
          if (freshTarget) {
            // Calculate offset to account for navbar and padding
            const navbarHeight = 100; // Approximate navbar height
            const targetOffset = freshTarget.offsetTop - navbarHeight;
            console.log('Scrolling to fresh position:', targetOffset);
            
            window.scrollTo({
              top: Math.max(0, targetOffset), // Ensure we don't scroll to negative position
              behavior: "smooth"
            });
          }
        }, 500); // Longer delay to ensure menu is fully closed
      }
      
      console.log('=== NAVIGATION END ===');
    }
  };

  return (
    <>
      {/* Main Navbar - Hidden when menu is open */}
      {!menuOpen && (
        <div 
          className={`${styles.navbarContainer} ${(visible || forceVisible) ? styles.navVisible : styles.navHidden}`}
          style={{
            // Add animation when navbar appears from pill click
            transition: forceVisible ? 'all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)' : 'all 0.3s ease-out',
            transform: forceVisible ? 
              `translateX(-50%) scale(1.05) translateY(0)` : 
              `translateX(-50%) scale(1) translateY(0)`,
            animation: forceVisible ? 'navbarBounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)' : 'none',
            // Performance optimizations
            willChange: 'transform, opacity',
          backfaceVisibility: 'hidden',
          transform3d: 'translateZ(0)' // Hardware acceleration
        }}
      >
        <nav className={`${styles.nav} ${menuOpen ? styles.menuOpen : ''}`}>
          <div className={styles.logo}>
            <Link href="/">
              <img 
                src="/assets/logos/gronsdodgeball.svg" 
                alt="Gron's Dodgeball" 
                className={styles.logoDesktop}
              />
              <img 
                src="/assets/logos/GD.svg" 
                alt="GD" 
                className={styles.logoMobile}
              />
            </Link>
          </div>
          <div className={styles.right}>
            <div className={styles.helpWrapper}>
              <div className={styles.helpArea}>
                <div 
                  className={`${styles.help} help-button`}
                  onMouseEnter={() => !isMobile && setHelpMenuOpen(true)}
                  onMouseLeave={() => !isMobile && setHelpMenuOpen(false)}
                  onClick={handleHelpClick}
                  style={{ cursor: isMobile ? 'pointer' : 'default' }}
                >
                  Help
                  <span className={styles.arrow} aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                      <path d="M7 10l5 5 5-5H7z"/>
                    </svg>
                  </span>
                </div>
                <div 
                  className={styles.helpHoverArea}
                  onMouseEnter={() => !isMobile && setHelpMenuOpen(true)}
                  onMouseLeave={() => !isMobile && setHelpMenuOpen(false)}
                ></div>
                <div 
                  className={styles.helpMenu} 
                  id="helpMenu"
                  onMouseEnter={() => !isMobile && setHelpMenuOpen(true)}
                  onMouseLeave={() => !isMobile && setHelpMenuOpen(false)}
                  style={{ display: helpMenuOpen ? 'flex' : 'none' }}
                >
                  {helpLinks.map((link, index) => (
                    link.href.startsWith('mailto:') ? (
                      <a 
                        key={index} 
                        href={link.href}
                        style={{
                          padding: '12px 20px',
                          fontSize: '0.95rem',
                          color: '#F0EEE7',
                          textDecoration: 'none',
                          transition: 'color 0.25s ease',
                          display: 'block'
                        }}
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link 
                        key={index} 
                        href={link.href}
                        onClick={() => {
                          setHelpMenuOpen(false);
                        }}
                        style={{
                          padding: '12px 20px',
                          fontSize: '0.95rem',
                          color: '#F0EEE7',
                          textDecoration: 'none',
                          transition: 'color 0.25s ease',
                          display: 'block'
                        }}
                      >
                        {link.label}
                      </Link>
                    )
                  ))}
                </div>
              </div>
            </div>
            <button 
              className={styles.menuButton} 
              onClick={(e) => {
                createRipple(e);
                menuOpen ? closeMenu() : openMenu();
              }}
            >
              <span className="flex items-center gap-2">
                {menuOpen ? (
                  <>
                    Close
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </>
                ) : (
                  "Menu"
                )}
              </span>
            </button>
          </div>
        </nav>
      </div>
      )}

      {/* Close Button - Only visible when menu is open */}
      {menuOpen && (
        <button
          onClick={closeMenu}
          className="fixed top-8 right-8 z-[100000] w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110 group"
          style={{ fontFamily: 'var(--font-inter), Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}
        >
          <X className="h-5 w-5 text-white/90 transition-transform duration-300 group-hover:rotate-90" />
        </button>
      )}

      {/* Floating Pill Navbar - Shows navbar when clicked */}
      <AnimatePresence>
        {(!visible && !forceVisible) && (
          <motion.div
            initial={{ 
              opacity: 0, 
              scale: 0.3, 
              y: -80,
              rotate: -180 
            }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              rotate: 0 
            }}
            exit={{ 
              opacity: 0, 
              scale: 0.3, 
              y: -80,
              rotate: 180 
            }}
            transition={{ 
              duration: 0.6, 
              ease: [0.68, -0.55, 0.265, 1.55], // Bouncy easing
              rotate: { duration: 0.8 }
            }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[100000]"
          >
            <motion.button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Pill clicked!'); // Debug log
                console.log('Before click - visible:', visible, 'forceVisible:', forceVisible);
                // Show navbar first, not the menu
                setForceVisible(true);
                setVisible(true);
                console.log('After click - States set: forceVisible=true, visible=true'); // Debug log
                
                // Reset forceVisible after animation completes to allow normal behavior
                setTimeout(() => {
                  setForceVisible(false);
                }, 1000); // Reset after bounce animation completes
              }}
              className="w-[60px] h-[60px] rounded-full flex items-center justify-center transition-all duration-300 shadow-lg cursor-pointer"
              style={{
                backgroundColor: '#141414',
                // Performance optimizations
                willChange: 'transform, opacity',
                backfaceVisibility: 'hidden',
                transform: 'translateZ(0)', // Hardware acceleration
                pointerEvents: 'auto' // Ensure button is clickable
              }}
              whileHover={{ 
                scale: 1.1,
                backgroundColor: '#1a1a1a',
                rotate: 5,
                boxShadow: '0 20px 40px rgba(20, 20, 20, 0.4)'
              }}
              whileTap={{ 
                scale: 0.9,
                rotate: -5 
              }}
              animate={{
                // Subtle floating animation
                y: [0, -3, 0],
              }}
              transition={{
                y: {
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
            >
              <motion.div
                animate={{
                  // Menu icon breathing effect
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Menu className="h-6 w-6 relative z-10" style={{ color: '#F0EEE7' }} />
              </motion.div>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Menu Panel */}
      <div
        ref={menuRef}
        className={`fixed top-0 left-0 w-full h-screen bg-[#141414]/95 backdrop-blur-xl z-[99999] transition-transform duration-500 ease-out ${
          menuOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        {/* Menu Panel - Apple/Larose Style */}
        <div className={`h-screen overflow-hidden ${styles.menuContentContainer}`}>

          {/* Content */}
          <div className={`flex flex-col justify-center items-center h-full px-8 relative overflow-hidden max-w-4xl mx-auto transition-all duration-700 ease-out ${
            menuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            
            {/* Main Navigation Section */}
            <div className="text-center mb-16">
              {/* Primary Links with larger typography */}
              <div className="space-y-3 mb-12">
                {mainLinks.slice(0, 4).map((link, index) => (
                  <div
                    key={index}
                    className="group relative overflow-hidden"
                  >
                    {link.external ? (
                      <Link
                        href={link.href}
                        className={`block py-3 px-8 ${
                          link.label === 'Youth' ? 'text-white/90 hover:text-white' :
                          ['Funds', 'FAQ'].includes(link.label) 
                            ? 'text-white/40 hover:text-white/65' 
                            : 'text-white/90 hover:text-white'
                        } text-[clamp(2.5rem,6vw,4rem)] font-thin hover:font-bold tracking-tight leading-[0.9] transition-all duration-500`}
                        onClick={() => closeMenu()}
                        style={{ fontFamily: 'var(--font-inter), Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <Link
                        href={link.href}
                        onClick={(e) => {
                          const isSectionLink = link.href.startsWith("/#");
                          if (isSectionLink) {
                            e.preventDefault();
                            handleSectionNavigation(link.href);
                          }
                        }}
                        className={`block py-3 px-8 ${
                          link.label === 'Youth' ? 'text-white/90 hover:text-white' :
                          ['Funds', 'FAQ'].includes(link.label) 
                            ? 'text-white/40 hover:text-white/65' 
                            : 'text-white/90 hover:text-white'
                        } text-[clamp(2.5rem,6vw,4rem)] font-thin hover:font-bold tracking-tight leading-[0.9] transition-all duration-500`}
                        style={{ fontFamily: 'var(--font-inter), Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}
                      >
                        {link.label}
                      </Link>
                    )}
                  </div>
                ))}
              </div>

              {/* Secondary Links with smaller typography */}
              {(mainLinks.slice(4).length > 0 || moreLinks.length > 0) && (
                <div className="pt-8 border-t border-white/10">
                  <div className="space-y-2">
                    {/* Remaining main links */}
                    {mainLinks.slice(4).map((link, index) => (
                      <div
                        key={`remaining-${index}`}
                        className="group relative overflow-hidden"
                      >
                        {link.external ? (
                          <Link
                            href={link.href}
                            className={`block py-2 px-6 ${
                              ['Funds', 'Youth', 'FAQ'].includes(link.label) 
                                ? 'text-white/35 hover:text-white/60' 
                                : 'text-white/70 hover:text-white/90'
                            } text-[clamp(1.2rem,3.5vw,1.8rem)] font-thin hover:font-bold tracking-tight leading-[1.2] transition-all duration-500`}
                            onClick={() => closeMenu()}
                            style={{ fontFamily: 'var(--font-inter), Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}
                          >
                            {link.label}
                          </Link>
                        ) : (
                          <Link
                            href={link.href}
                            onClick={(e) => {
                              const isSectionLink = link.href.startsWith("/#");
                              if (isSectionLink) {
                                e.preventDefault();
                                handleSectionNavigation(link.href);
                              }
                            }}
                            className={`block py-2 px-6 ${
                              ['Funds', 'Youth', 'FAQ'].includes(link.label) 
                                ? 'text-white/35 hover:text-white/60' 
                                : 'text-white/70 hover:text-white/90'
                            } text-[clamp(1.2rem,3.5vw,1.8rem)] font-thin hover:font-bold tracking-tight leading-[1.2] transition-all duration-500`}
                            style={{ fontFamily: 'var(--font-inter), Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}
                          >
                            {link.label}
                          </Link>
                        )}
                      </div>
                    ))}
                    
                    {/* More links */}
                    {moreLinks.map((moreLink, moreIndex) => (
                      <div
                        key={`more-${moreIndex}`}
                        className="group relative overflow-hidden"
                      >
                        {moreLink.external ? (
                          <Link
                            href={moreLink.href}
                            className={`block py-2 px-6 ${
                              ['FAQ', 'Contact', 'Funds'].includes(moreLink.label)
                                ? 'text-white/35 hover:text-white/60'
                                : 'text-white/70 hover:text-white/90'
                            } text-[clamp(1.2rem,3.5vw,1.8rem)] font-thin hover:font-bold tracking-tight leading-[1.2] transition-all duration-500`}
                            onClick={() => closeMenu()}
                            style={{ fontFamily: 'var(--font-inter), Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}
                          >
                            {moreLink.label}
                          </Link>
                        ) : (
                          <Link
                            href={moreLink.href}
                            onClick={(e) => {
                              const isSectionLink = moreLink.href.startsWith("/#");
                              if (isSectionLink) {
                                e.preventDefault();
                                handleSectionNavigation(moreLink.href);
                              }
                            }}
                            className={`block py-2 px-6 ${
                              ['FAQ', 'Contact', 'Funds'].includes(moreLink.label)
                                ? 'text-white/35 hover:text-white/60'
                                : 'text-white/70 hover:text-white/90'
                            } text-[clamp(1.2rem,3.5vw,1.8rem)] font-thin hover:font-bold tracking-tight leading-[1.2] transition-all duration-500`}
                            style={{ fontFamily: 'var(--font-inter), Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}
                          >
                            {moreLink.label}
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Social Media - Clean SVG Icons */}
            <div className="flex items-center gap-6 mt-8">
              {svgIcons.map((item, idx) => (
                item.href ? (
                  <a
                    key={idx}
                    href={item.href}
                    onClick={closeMenu}
                    className="group transition-all duration-300 hover:scale-110"
                  >
                    <div className="w-6 h-6 transition-all duration-300" style={{ filter: 'brightness(0) saturate(100%) invert(95%) sepia(6%) saturate(356%) hue-rotate(356deg) brightness(97%) contrast(94%)' }}>
                      {item.icon}
                    </div>
                  </a>
                ) : (
                  <div
                    key={idx}
                    className="group transition-all duration-300 hover:scale-110"
                  >
                    <div className="w-6 h-6 transition-all duration-300" style={{ filter: 'brightness(0) saturate(100%) invert(95%) sepia(6%) saturate(356%) hue-rotate(356deg) brightness(97%) contrast(94%)' }}>
                      {item.icon}
                    </div>
                  </div>
                )
              ))}
            </div>

            {/* Ambient Background Elements removed for solid background */}
          </div>
        </div>
      </div>
    </>
  );
};

export default NavBar;
