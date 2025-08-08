"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react';
import styles from "../styles/NavBar.module.css";

const NavBar = () => {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [helpMenuOpen, setHelpMenuOpen] = useState(false);
  const [gsapReady, setGsapReady] = useState(false);
  const [visible, setVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [forceVisible, setForceVisible] = useState(false); // Force navbar to be visible when pill is clicked
  const [isMobile, setIsMobile] = useState(false);
  const lastScroll = useRef(0);

  // Ensure GSAP is properly loaded
  useEffect(() => {
    const checkGSAP = () => {
      if (typeof gsap !== 'undefined' && gsap && typeof gsap.timeline === 'function') {
        setGsapReady(true);
      } else {
        // Retry after a short delay
        setTimeout(checkGSAP, 100);
      }
    };
    
    checkGSAP();
  }, []);

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

  // Safe GSAP wrapper function
  const safeGSAP = (operation) => {
    if (typeof gsap === 'undefined' || !gsap || !gsapReady) {
      return null;
    }
    
    try {
      return operation();
    } catch (error) {
      console.error('GSAP operation failed:', error);
      return null;
    }
  };

  // Reset GSAP properties on menu links to prevent state persistence
  const resetLinkStyles = () => {
    safeGSAP(() => {
      const allLinks = [...linkRefs.current, ...moreItemRefs.current].filter(link => link !== null);
      if (allLinks.length > 0) {
        gsap.set(allLinks, { 
          clearProps: "all" // Clear all GSAP-set properties
        });
      }
    });
  };

  const coverRef = useRef(null);
  const overlayRef = useRef(null);
  const menuRef = useRef(null);
  const linkRefs = useRef([]);
  const moreItemRefs = useRef([]);
  const moreBoxRefs = useRef([]);
  const boxRefs = useRef([]);
  const contactItemRefs = useRef([]);

  const mainLinks = [
    { label: "Sessions", href: "/#sessions" },
    { label: "Clinics", href: "/clinics", external: true },
    { label: "Memberships", href: "/#memberships" },
    { label: "Contact", href: "/#contact" },
  ];

  const moreLinks = [
    { label: "Funds", href: "/#funds" },
    { label: "Youth", href: "/youth", external: true },
    { label: "FAQ", href: "/#faq" },
  ];

  const helpLinks = [
    { label: "Email Us", href: "mailto:hello@hello.com" },
    { label: "FAQ", href: "/#faq" },
    { label: "Terms", href: "/terms-of-service" },
    { label: "Rules", href: "/code-of-conduct" },
    { label: "Privacy", href: "/privacy-policy" },
  ];

  const svgIcons = [
    <img
      src="/assets/socials/facebook.svg"
      alt="Facebook"
      width="18"
      height="18"
    />,
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path
        fill="currentColor"
        d="M12.001 2c5.523 0 10 4.477 10 10s-4.477 10-10 10a9.95 9.95 0 0 1-5.03-1.355L2.005 22l1.352-4.968A9.95 9.95 0 0 1 2.001 12c0-5.523 4.477-10 10-10M8.593 7.3l-.2.008a1 1 0 0 0-.372.1a1.3 1.3 0 0 0-.294.228c-.12.113-.188.211-.261.306A2.73 2.73 0 0 0 6.9 9.62c.002.49.13.967.33 1.413c.409.902 1.082 1.857 1.97 2.742c.214.213.424.427.65.626a9.45 9.45 0 0 0 3.84 2.046l.568.087c.185.01.37-.004.556-.013a2 2 0 0 0 .833-.231a5 5 0 0 0 .383-.22q.001.002.125-.09c.135-.1.218-.171.33-.288q.126-.13.21-.302c.078-.163.156-.474.188-.733c.024-.198.017-.306.014-.373c-.004-.107-.093-.218-.19-.265l-.582-.261s-.87-.379-1.402-.621a.5.5 0 0 0-.176-.041a.48.48 0 0 0-.378.127c-.005-.002-.072.055-.795.931a.35.35 0 0 1-.368.13a1.4 1.4 0 0 1-.191-.066c-.124-.052-.167-.072-.252-.108a6 6 0 0 1-1.575-1.003c-.126-.11-.243-.23-.363-.346a6.3 6.3 0 0 1-1.02-1.268l-.059-.095a1 1 0 0 1-.102-.205c-.038-.147.061-.265.061-.265s.243-.266.356-.41c.11-.14.203-.276.263-.373c.118-.19.155-.385.093-.536q-.42-1.026-.868-2.041c-.059-.134-.234-.23-.393-.249q-.081-.01-.162-.016a3 3 0 0 0-.403.004z"
      />
    </svg>,
    <img
      src="/assets/socials/instagram.svg"
      alt="Instagram"
      width="18"
      height="18"
    />,
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 14 14"
    >
      <g fill="none">
        <g clipPath="url(#primeTwitter0)">
          <path
            fill="currentColor"
            d="M11.025.656h2.147L8.482 6.03L14 13.344H9.68L6.294 8.909l-3.87 4.435H.275l5.016-5.75L0 .657h4.43L7.486 4.71zm-.755 11.4h1.19L3.78 1.877H2.504z"
          />
        </g>
        <defs>
          <clipPath id="primeTwitter0">
            <path fill="#fff" d="M0 0h14v14H0z" />
          </clipPath>
        </defs>
      </g>
    </svg>,
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
    >
      <path
        fill="currentColor"
        d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5l-8-5V6l8 5l8-5v2z"
      />
    </svg>,
  ];

  const openMenu = () => {
    setMenuOpen(true);
    // Hide body overflow to prevent background page scrolling
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";

    // Check if required elements exist
    if (!menuRef.current || !overlayRef.current || !coverRef.current) {
      return;
    }

    // Reset any lingering GSAP properties before starting animation
    resetLinkStyles();

    safeGSAP(() => {
      gsap.killTweensOf(linkRefs.current);
      gsap.set(linkRefs.current, { yPercent: 100, opacity: 1 });
      gsap.set(contactItemRefs.current, { opacity: 0, y: 30 });
      gsap.set(menuRef.current, { y: "100%" });
      gsap.set(overlayRef.current, { opacity: 0 });
      gsap.set(coverRef.current, { y: "100%", display: "block" });

      const tl = gsap.timeline();

      tl.fromTo(
        coverRef.current,
        { y: "100%" },
        { y: "0%", duration: 0.6, ease: "power2.out" }
      )
        .to(
          coverRef.current,
          { y: "-100%", duration: 0.6, ease: "power2.inOut" },
          "+=0.1"
        )
        .set(coverRef.current, { display: "none" })
        .set(overlayRef.current, { display: "block" })
        .to(overlayRef.current, { opacity: 1, duration: 0.3 }, "-=0.4")
        .to(
          menuRef.current,
          { y: "0%", duration: 0.6, ease: "power3.out" },
          "-=0.4"
        )
        .to(
          linkRefs.current,
          {
            yPercent: 0,
            opacity: 1, // Explicitly set opacity to 1
            duration: 0.6,
            ease: "power3.out",
            stagger: 0.12,
          },
          "-=0.2"
        )
        .to(
          contactItemRefs.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            stagger: 0.15,
          },
          "-=0.3"
        );
    });
  };

  const closeMenu = () => {
    // Check if required elements exist
    if (!menuRef.current || !overlayRef.current || !coverRef.current) {
      setMenuOpen(false);
      setMoreMenuOpen(false);
      document.body.style.overflow = "unset";
      document.body.style.position = "static";
      document.body.style.width = "auto";
      return;
    }

    const timeline = safeGSAP(() => {
      const tl = gsap.timeline();

      tl.to(contactItemRefs.current.slice().reverse(), {
        y: 50,
        opacity: 0,
        duration: 0.4,
        ease: "power2.inOut",
        stagger: 0.1,
      })
        .to(
          linkRefs.current.slice().reverse(),
          {
            yPercent: 100,
            opacity: 0,
            duration: 0.6,
            ease: "power2.inOut",
            stagger: 0.08,
          },
          "-=0.3"
        )
        .to(
          menuRef.current,
          {
            y: "100%",
            duration: 0.5,
            ease: "power3.in",
          },
          "-=0.3"
        )
        .to(
          overlayRef.current,
          {
            opacity: 0,
            duration: 0.3,
            ease: "power2.inOut",
          },
          "-=0.4"
        )
        .set(overlayRef.current, { display: "none" })
        .set(coverRef.current, { display: "block" })
        .fromTo(
          coverRef.current,
          { y: "-100%" },
          { y: "0%", duration: 0.5, ease: "power2.out" },
          "+=0.1"
        )
        .to(
          coverRef.current,
          { y: "100%", duration: 0.6, ease: "power2.inOut" },
          "+=0.1"
        )
        .set(coverRef.current, { display: "none" })
        .add(() => {
          setMenuOpen(false);
          setMoreMenuOpen(false);
          linkRefs.current.reverse();
          document.body.style.overflow = "unset";
          document.body.style.position = "static";
          document.body.style.width = "auto";
          
          // Reset GSAP properties after closing to prevent state persistence
          resetLinkStyles();
        });

      return tl;
    });

    // If GSAP failed, use fallback
    if (!timeline) {
      setMenuOpen(false);
      setMoreMenuOpen(false);
      document.body.style.overflow = "unset";
      document.body.style.position = "static";
      document.body.style.width = "auto";
      // Also reset styles in fallback
      resetLinkStyles();
    }
  };

  const handleMouseEnter = (index) => {
    // Check if elements exist
    if (!boxRefs.current[index] || !linkRefs.current[index]) {
      return;
    }

    safeGSAP(() => {
      gsap.killTweensOf([boxRefs.current[index], linkRefs.current[index]]);
      gsap.set(boxRefs.current[index], { x: "-100%" });

      const tl = gsap.timeline();

      tl.to(linkRefs.current[index], {
        duration: 0.3,
        ease: "power2.inOut",
      });

      tl.to(
        boxRefs.current[index],
        { x: "0%", duration: 0.3, ease: "power2.out" },
        "-=0.2"
      );

      tl.to(
        boxRefs.current[index],
        { x: "100%", duration: 0.3, ease: "power2.in" },
        "+=0.1"
      );

      tl.to(
        linkRefs.current[index],
        { duration: 0.3, ease: "power2.inOut" },
        "-=0.2"
      );
    });
  };

  const handleMoreMouseEnter = (index) => {
    // Check if elements exist
    if (!moreBoxRefs.current[index] || !moreItemRefs.current[index]) {
      return;
    }

    safeGSAP(() => {
      gsap.killTweensOf([
        moreBoxRefs.current[index],
        moreItemRefs.current[index],
      ]);
      gsap.set(moreBoxRefs.current[index], { x: "-100%" });

      const tl = gsap.timeline();

      tl.to(moreItemRefs.current[index], {
        duration: 0.3,
        ease: "power2.inOut",
      });

      tl.to(
        moreBoxRefs.current[index],
        { x: "0%", duration: 0.3, ease: "power2.out" },
        "-=0.2"
      );

      tl.to(
        moreBoxRefs.current[index],
        { x: "100%", duration: 0.3, ease: "power2.in" },
        "+=0.1"
      );

      tl.to(
        moreItemRefs.current[index],
        { duration: 0.3, ease: "power2.inOut" },
        "-=0.2"
      );
    });
  };

  const toggleMoreMenu = () => {
    const newState = !moreMenuOpen;
    setMoreMenuOpen(newState);

    // Wait for the next tick to ensure DOM elements are rendered
    setTimeout(() => {
      safeGSAP(() => {
        if (newState) {
          // Opening animation - check if elements exist first
          const moreItems = moreItemRefs.current.filter(item => item !== null);
          if (moreItems.length > 0) {
            gsap.set(moreItems, { opacity: 0, y: 20, display: "block" });
            gsap.to(moreItems, {
              opacity: 1,
              y: 0,
              duration: 0.4,
              ease: "power2.out",
              stagger: 0.1,
              onComplete: () => {
                // Ensure items are visible after animation
                gsap.set(moreItems, { display: "block" });
              }
            });
          }
        } else {
          // Closing animation - check if elements exist first
          const moreItems = moreItemRefs.current.filter(item => item !== null);
          if (moreItems.length > 0) {
            gsap.to(moreItems, {
              opacity: 0,
              y: 20,
              duration: 0.3,
              ease: "power2.in",
              stagger: 0.05,
              onComplete: () => {
                // Hide items after animation completes
                gsap.set(moreItems, { display: "none" });
              }
            });
          }
        }
      });
    }, 10); // Small delay to ensure DOM update
  };

  // Close more menu when clicking outside or on close button
  const closeMoreMenu = () => {
    if (moreMenuOpen) {
      setMoreMenuOpen(false);
      
      // Animate closing
      setTimeout(() => {
        safeGSAP(() => {
          const moreItems = moreItemRefs.current.filter(item => item !== null);
          if (moreItems.length > 0) {
            gsap.to(moreItems, {
              opacity: 0,
              y: 20,
              duration: 0.3,
              ease: "power2.in",
              stagger: 0.05,
              onComplete: () => {
                gsap.set(moreItems, { display: "none" });
              }
            });
          }
        });
      }, 10);
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

  // Reset GSAP properties on component mount and route changes
  useEffect(() => {
    // Reset GSAP properties when component mounts
    resetLinkStyles();
  }, []);

  // Reset GSAP properties when gsapReady state changes
  useEffect(() => {
    if (gsapReady) {
      resetLinkStyles();
    }
  }, [gsapReady]);

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
      {/* Main Navbar - Original functionality preserved */}
      <div 
        className={`${styles.navbarContainer} ${menuOpen ? styles.menuOpen : ''} ${(visible || forceVisible) ? styles.navVisible : styles.navHidden}`}
        style={{
          // Add animation when navbar appears from pill click
          transition: forceVisible ? 'all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)' : 'all 0.3s ease-out',
          transform: forceVisible ? 
            `translateX(-50%) scale(1.05) translateY(0)` : 
            `translateX(-50%) scale(1) translateY(0)`,
          animation: forceVisible ? 'navbarBounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)' : 'none'
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

      {/* Floating Pill Navbar - Shows navbar when clicked */}
      <AnimatePresence>
        {isScrolled && !visible && !forceVisible && (
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
              onClick={() => {
                console.log('Pill clicked!'); // Debug log
                console.log('Before click - visible:', visible, 'forceVisible:', forceVisible);
                // Immediately set the states
                setForceVisible(true);
                setVisible(true);
                console.log('After click - States set: forceVisible=true, visible=true'); // Debug log
                
                // Reset forceVisible after animation completes to allow normal behavior
                setTimeout(() => {
                  setForceVisible(false);
                }, 1000); // Reset after bounce animation completes
              }}
              className="w-[60px] h-[60px] rounded-full flex items-center justify-center transition-all duration-300 shadow-lg"
              style={{
                backgroundColor: '#141414'
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

      {/* Sliding Cover */}
      <div
        ref={coverRef}
        className="fixed top-0 left-0 w-full h-screen bg-[#161616] z-[99999] hidden"
        style={{ transform: "translateY(100%)" }}
      />

      {/* Overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-[#161616] z-[99999] hidden"
        style={{ opacity: 0 }}
      />

      {/* Menu Panel */}
      <div
        ref={menuRef}
        className="fixed top-0 left-0 w-full h-screen bg-[#F1EEE7] z-[99999]"
        style={{ transform: "translateY(100%)" }}
      >
        {/* Fixed Height Container with Overflow */}
        <div className={`h-[80vh] bg-[#F1EEE7] mt-32 sm:mt-28 ${styles.menuContentContainer}`} style={{ overflowY: 'auto', overflowX: 'hidden' }}>

          {/* Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 flex flex-col md:flex-row md:items-end justify-start gap-6 sm:gap-12 md:gap-0">
            {/* Menu Links */}
            <div className="flex flex-col gap-2 flex-1">
              {/* First three menu items: Sessions, Clinics, Memberships */}
              {mainLinks.slice(0, 3).map((link, index) => (
                <div
                  key={index}
                  className="overflow-hidden uppercase h-fit w-fit"
                >
                  <div
                    className="relative w-fit group cursor-pointer flex items-start gap-2"
                    onMouseEnter={() => handleMouseEnter(index)}
                  >
                    {link.external ? (
                      <Link
                        href={link.href}
                        ref={(el) => (linkRefs.current[index] = el)}
                        className="main-menu-link text-3xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl hover:pl-6 transition-all duration-600 leading-none font-bebas-neue font-bold block w-fit"
                        style={{ color: '#000000' }} // Explicit black color
                        onClick={() => {
                          setTimeout(() => {
                            closeMenu();
                          }, 600);
                        }}
                      >
                        {link.label}
                        <div
                          ref={(el) => (boxRefs.current[index] = el)}
                          className="absolute top-0 left-0 h-full bg-[#F1EEE7]/90 z-0"
                          style={{
                            width: "100%",
                            transform: "translateX(-100%)",
                          }}
                        />
                      </Link>
                    ) : (
                      <Link
                        href={link.href}
                        ref={(el) => (linkRefs.current[index] = el)}
                        onClick={(e) => {
                          const isSectionLink = link.href.startsWith("/#");
                          if (isSectionLink) {
                            e.preventDefault();
                            handleSectionNavigation(link.href);
                          }
                        }}
                        className="main-menu-link text-3xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl leading-none hover:pl-6 transition-all duration-600 block w-fit font-bebas-neue font-bold"
                        style={{ color: '#000000' }} // Explicit black color
                      >
                        {link.label}
                        <div
                          ref={(el) => (boxRefs.current[index] = el)}
                          className="absolute top-0 left-0 h-full bg-[#F1EEE7]/90 z-0"
                          style={{
                            width: "100%",
                            transform: "translateX(-100%)",
                          }}
                        />
                      </Link>
                    )}
                  </div>
                </div>
              ))}

              {/* More Menu Button - Second Last */}
              <div className="overflow-hidden uppercase h-fit w-fit">
                <button
                  className={`relative w-fit group cursor-pointer flex items-start gap-2 ${styles.moreMenuButton} bg-transparent border-none p-0`}
                  onClick={handleMoreMenuClick}
                  style={{ touchAction: 'manipulation' }}
                >
                  <div
                    ref={(el) => (linkRefs.current[3] = el)}
                    className="main-menu-link text-3xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl leading-none transition-all duration-600 block w-fit font-bebas-neue font-bold flex items-center gap-2 select-none"
                    style={{ color: '#000000' }} // Explicit black color
                  >
                    More
                    <span className="text-xl sm:text-xl md:text-2xl lg:text-4xl font-normal transition-all duration-300">
                      {moreMenuOpen ? "−" : "+"}
                    </span>
                  </div>
                </button>
              </div>

              {/* More Menu Items */}
              {moreMenuOpen && (
                <div className={`${styles.moreMenuContainer} mb-8 sm:mb-8`}>
                  {moreLinks.map((moreLink, moreIndex) => (
                    <div
                      key={moreIndex}
                      className={`${styles.moreMenuItem} mb-4`}
                    >
                      <div
                          className="relative w-fit group cursor-pointer"
                          onMouseEnter={() => handleMoreMouseEnter(moreIndex)}
                          style={{ touchAction: 'manipulation' }}
                        >
                        {moreLink.external ? (
                          <Link
                            href={moreLink.href}
                            ref={(el) => (moreItemRefs.current[moreIndex] = el)}
                            className={`${styles.moreMenuLink} text-lg sm:text-xl md:text-2xl lg:text-4xl xl:text-5xl leading-none hover:pl-6 transition-all duration-600 font-bebas-neue font-bold block w-fit text-black`}
                            style={{ color: '#000000' }} // Explicit black color
                            onClick={() => {
                              closeMenu();
                              closeMoreMenu();
                            }}
                          >
                            {moreLink.label}
                            <div
                              ref={(el) =>
                                (moreBoxRefs.current[moreIndex] = el)
                              }
                              className="absolute top-0 left-0 h-full bg-[#F1EEE7]/90 z-0"
                              style={{
                                width: "100%",
                                transform: "translateX(-100%)",
                              }}
                            />
                          </Link>
                        ) : (
                          <Link
                            href={moreLink.href}
                            ref={(el) => (moreItemRefs.current[moreIndex] = el)}
                            onClick={(e) => {
                              const isSectionLink = moreLink.href.startsWith("/#");
                              if (isSectionLink) {
                                e.preventDefault();
                                handleSectionNavigation(moreLink.href, () => {
                                  closeMenu();
                                  closeMoreMenu();
                                });
                              } else {
                                closeMenu();
                                closeMoreMenu();
                              }
                            }}
                            className={`${styles.moreMenuLink} text-lg sm:text-xl md:text-2xl lg:text-4xl xl:text-5xl leading-none hover:pl-6 transition-all duration-600 font-bebas-neue font-bold block w-fit`}
                            style={{ color: '#000000' }} // Explicit black color
                          >
                            {moreLink.label}
                            <div
                              ref={(el) =>
                                (moreBoxRefs.current[moreIndex] = el)
                              }
                              className="absolute top-0 left-0 h-full bg-[#F1EEE7]/90 z-0"
                              style={{
                                width: "100%",
                                transform: "translateX(-100%)",
                              }}
                            />
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Contact Menu Item - Last */}
              <div className="overflow-hidden uppercase h-fit w-fit">
                <div
                  className="relative w-fit group cursor-pointer flex items-start gap-2"
                  onMouseEnter={() => handleMouseEnter(4)}
                >
                  <Link
                    href={mainLinks[3].href}
                    ref={(el) => (linkRefs.current[4] = el)}
                    onClick={(e) => {
                      const isSectionLink = mainLinks[3].href.startsWith("/#");
                      if (isSectionLink) {
                        e.preventDefault();
                        handleSectionNavigation(mainLinks[3].href);
                      }
                    }}
                    className="main-menu-link text-3xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl leading-none hover:pl-6 transition-all duration-600 block w-fit font-bebas-neue font-bold"
                    style={{ color: '#000000' }} // Explicit black color
                  >
                    {mainLinks[3].label}
                    <div
                      ref={(el) => (boxRefs.current[4] = el)}
                      className="absolute top-0 left-0 h-full bg-[#F1EEE7]/90 z-0"
                      style={{
                        width: "100%",
                        transform: "translateX(-100%)",
                      }}
                    />
                  </Link>
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <div className="flex flex-col items-start md:items-end gap-2 flex-1 mt-8 md:mt-0">
              <a
                href="mailto:hello@hello.com"
                ref={(el) => (contactItemRefs.current[0] = el)}
                className="text-base sm:text-base md:text-lg lg:text-xl text-gray-700 hover:pr-4 transition-all duration-300 uppercase font-semibold hover:scale-105 hover:text-black"
              >
                hello@hello.com
              </a>
              <a
                href="tel:+1 234 5678 910"
                ref={(el) => (contactItemRefs.current[1] = el)}
                className="text-base sm:text-base md:text-lg lg:text-xl font-semibold text-gray-700 hover:opacity-70 hover:pr-4 transition-all duration-300 hover:scale-105 hover:text-black"
              >
                +1 234 5678 910
              </a>
              <div className="flex items-center gap-3 mt-5">
                {svgIcons.map((icon, idx) => (
                  <div
                    key={idx}
                    className="bg-black/20 rounded-full w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex items-center justify-center cursor-pointer hover:bg-black/40 transition duration-300"
                  >
                    {icon}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavBar;
