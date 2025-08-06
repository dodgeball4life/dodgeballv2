"use client";
import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const UpcomingSessions = () => {
  const timelineRef = useRef(null);
  const progressFillRef = useRef(null);
  const cardRefs = useRef([]);
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
    const calendarId = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID;
    const timeMin = new Date().toISOString();

    try {
      const res = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
          calendarId
        )}/events?key=${apiKey}&maxResults=10&orderBy=startTime&singleEvents=true&timeMin=${timeMin}`
      );
      const data = await res.json();
      
      if (!data.items || data.items.length === 0) {
        console.warn("No sessions found in the calendar.");
        setSessions([]);
      } else {
        setSessions(data.items);
      }
    } catch (err) {
      console.error("Error fetching sessions:", err);
      setSessions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("nl-NL", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const formatTime = (dateStr) =>
    new Date(dateStr).toLocaleTimeString("nl-NL", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Europe/Amsterdam",
    });

  const handleScroll = () => {
    const el = timelineRef.current;
    if (!el || !progressFillRef.current) return;
    
    const scrollLeft = el.scrollLeft;
    const maxScrollLeft = el.scrollWidth - el.clientWidth;
    const progress = maxScrollLeft > 0 ? (scrollLeft / maxScrollLeft) * 100 : 0;
    progressFillRef.current.style.width = `${progress}%`;
  };

  const handleShare = (title) => {
    const url = 'https://site.gronsdodgeball.nl/#sessions';
    if (navigator.share) {
      navigator.share({ title, url }).catch(console.error);
    } else {
      alert(`Share this session:\n\n${title}\n${url}`);
    }
  };

  // Animate on scroll
  useEffect(() => {
    if (!timelineRef.current || sessions.length === 0) return;

    gsap.fromTo(
      cardRefs.current,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.12,
        ease: "power2.out",
        scrollTrigger: {
          trigger: timelineRef.current,
          start: "top 85%",
        },
      }
    );
  }, [sessions]);

  // Icon pulse animation loop
  useEffect(() => {
    if (sessions.length === 0) return;

    const startIconImpulseLoop = () => {
      let currentIndex = 0;
      
      const loop = () => {
        if (cardRefs.current.length === 0) return;
        
        const card = cardRefs.current[currentIndex];
        if (card) {
          const icons = card.querySelectorAll('.icon-btn');
          gsap.timeline()
            .to(icons, {
              scale: 1.15,
              duration: 0.3,
              ease: "power1.inOut",
              yoyo: true,
              repeat: 1,
              stagger: 0.1,
            })
            .eventCallback('onComplete', () => {
              currentIndex = (currentIndex + 1) % cardRefs.current.length;
              setTimeout(loop, 5000);
            });
        }
      };
      
      setTimeout(loop, 5000);
    };

    startIconImpulseLoop();
  }, [sessions]);

  return (
    <>
      <style jsx>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .main {
          font-family: 'Inter', sans-serif;
          background: none;
          color: #0d0c0b;
          display: flex;
          justify-content: center;
          padding: 3rem 1rem 5rem;
          min-height: 100vh;
          position: relative;
        }

        .container {
          max-width: 900px;
          width: 100%;
        }

        .section-title {
          text-transform: uppercase;
          font-weight: 700;
          font-size: 0.8rem;
          letter-spacing: 0.08em;
          color: #111111;
          text-align: center;
          margin-bottom: 14px;
        }

        .subtitle {
          text-align: center;
          color: #7d7c77;
          font-weight: 500;
          font-size: 1.125rem;
          margin-bottom: 5rem;
          line-height: 1.4;
          margin: 0 0 5rem 0;
        }

        .timeline-wrapper {
          position: relative;
        }

        .timeline {
          display: flex;
          gap: 1.6rem;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          scroll-padding-left: 1rem;
          padding-bottom: 32px;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .timeline::-webkit-scrollbar {
          display: none;
        }

        .card {
          scroll-snap-align: start;
          background: #fff;
          border-radius: 20px;
          padding: 2.4rem 2.4rem 2rem;
          min-width: 280px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          cursor: default;
          user-select: none;
          border: 1px solid #111111;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .card:focus-visible {
          outline: 3px solid #f57f3b;
          outline-offset: 4px;
        }

        .date-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .date-small {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          color: #f57f3b;
          letter-spacing: 0.11em;
          font-variant-numeric: tabular-nums;
        }

        .rsvp-pill {
          background-color: #f57f3b;
          color: white;
          font-size: 0.6rem;
          font-weight: 700;
          padding: 0.1rem 0.4rem;
          border-radius: 999px;
          white-space: nowrap;
          line-height: 1;
        }

        .time-info {
          font-size: 0.85rem;
          font-weight: 500;
          color: #7d7c77;
          margin-top: 0.2rem;
        }

        .title-pill {
          font-weight: 800;
          font-size: 1.45rem;
          color: #0d0c0b;
          line-height: 1.2;
          white-space: normal;
          margin-top: 0.7rem;
          margin-bottom: 0.65rem;
          border-bottom: 3.5px solid #f57f3b;
          padding-bottom: 0.15rem;
          max-width: max-content;
        }

        .card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 0.7rem;
          border-top: 1px solid #e5e2dd;
          padding-top: 1rem;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .location {
          font-size: 0.9rem;
          font-weight: 600;
          color: #111111;
          text-decoration: none;
          transition: color 0.3s ease;
          flex-grow: 1;
        }

        .location:hover,
        .location:focus-visible {
          color: #f57f3b;
          outline: none;
        }

        .icon-group {
          display: flex;
          gap: 12px;
          flex-shrink: 0;
          min-width: 72px;
          justify-content: flex-end;
        }

        .icon-btn {
          width: 32px;
          height: 32px;
          background: #111111;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background-color 0.3s ease;
          border: none;
          text-decoration: none;
        }

        .icon-btn:hover,
        .icon-btn:focus-visible {
          background: #f57f3b;
          outline: none;
        }

        .progress-bar {
          position: absolute;
          bottom: 4px;
          left: 1rem;
          right: 1rem;
          height: 4px;
          background: #f3f1ee;
          border-radius: 2px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #f57f3b, #d96e29);
          width: 0%;
          border-radius: 2px;
          will-change: width;
          transition: width 0.2s ease-out;
        }

        .scroll-hint {
          position: absolute;
          bottom: -26px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 0.8rem;
          color: #bbb;
          display: flex;
          align-items: center;
          gap: 6px;
          user-select: none;
          font-weight: 500;
        }

        .scroll-hint svg {
          width: 18px;
          height: 18px;
          fill: #bbb;
          animation: pulse 2.6s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.7; transform: translateX(0); }
          50% { opacity: 0.3; transform: translateX(6px); }
        }

        .no-sessions {
          font-size: 1.15rem;
          color: #aaa;
          margin: 4rem auto;
          text-align: center;
          width: 100%;
        }

        @media (max-width: 600px) {
          .main {
            padding: 2rem 1rem 4rem;
          }

          .timeline {
            gap: 1.2rem;
            padding-bottom: 24px;
          }

          .card {
            min-width: 260px;
            max-width: 90vw;
            padding: 1.8rem 2rem 1.4rem;
            border-radius: 14px;
          }

          .title-pill {
            font-size: 1.3rem;
          }

          .icon-btn {
            width: 30px;
            height: 30px;
          }

          .scroll-hint {
            font-size: 0.75rem;
          }

          .scroll-hint svg {
            width: 16px;
            height: 16px;
          }
        }
      `}</style>
      
      <main className="main">
        <Image
          src="/assets/bg/claimspot.svg"
          alt="Hero Background"
          width={20}
          height={20}
          className="absolute top-[15%] left-[4%] size-40 xl:block hidden"
        />
        
        <div className="container">
          <div className="section-title">UPCOMING SESSIONS</div>
          <p className="subtitle">Swipe or scroll through upcoming games</p>
          
          <div className="timeline-wrapper" role="region" aria-label="Upcoming dodgeball sessions timeline container">
            <section
              ref={timelineRef}
              className="timeline"
              tabIndex={0}
              aria-label="Upcoming dodgeball sessions timeline"
              onScroll={handleScroll}
            >
              {isLoading ? (
                <p className="no-sessions">Loading sessions...</p>
              ) : sessions.length === 0 ? (
                <p className="no-sessions">No sessions found.</p>
              ) : (
                sessions.map((event, i) => {
                  const start = new Date(event.start.dateTime || event.start.date);
                  const end = new Date(
                    event.end?.dateTime || start.getTime() + 2 * 60 * 60 * 1000
                  );
                  const title = event.summary || "Dodgeball Session";
                  const locationQuery = event.location || "Groningen";
                  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    locationQuery
                  )}`;
                  const isACLO = title.toLowerCase().includes("aclo");
                  const isSummerBreak = title.toLowerCase().includes("summer break");
                  const isYouth = title.toLowerCase().includes("youth");
                  const isKardingerweg = locationQuery.toLowerCase().includes("kardingerweg");

                  return (
                    <article
                      key={i}
                      ref={(el) => (cardRefs.current[i] = el)}
                      className="card"
                      tabIndex={0}
                    >
                      <div className="date-row">
                        <div className="date-small">{formatDate(start)}</div>
                        {isKardingerweg ? (
                          <div className="rsvp-pill">Outdoors</div>
                        ) : isACLO ? (
                          <div className="rsvp-pill">RSVP only</div>
                        ) : isSummerBreak ? (
                          <div className="rsvp-pill">No Dodge</div>
                        ) : isYouth ? (
                          <div className="rsvp-pill">Youth</div>
                        ) : null}
                      </div>
                      <div className="time-info">
                        {formatTime(start)}
                        {event.start.dateTime ? " – " + formatTime(end) : ""}
                      </div>
                      <div className="title-pill">{title}</div>
                      <div className="card-footer">
                        {!isSummerBreak && (
                          <a
                            href={mapsUrl}
                            className="location"
                            target="_blank"
                            rel="noopener"
                          >
                            Click for route
                          </a>
                        )}
                        <div className="icon-group">
                          {!isSummerBreak && !isACLO && (
                            <>
                              <a
                                href={
                                  isYouth
                                    ? "https://scan.gronsdodgeball.nl/payment/form?payment_link=plink_1RmkDNKPJsqZGRQAab51bJFZ"
                                    : "https://scan.gronsdodgeball.nl/payment/form?payment_link=plink_1RNuWuKPJsqZGRQAFNGt76Oz"
                                }
                                className="icon-btn"
                                target="_blank"
                                rel="noopener"
                                aria-label="Buy ticket"
                                title={
                                  isYouth
                                    ? "Youth session – parental consent may apply"
                                    : "Buy ticket"
                                }
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 576 512"
                                  width="20"
                                  height="20"
                                  fill="white"
                                >
                                  <path d="M64 64C28.7 64 0 92.7 0 128v64c0 8.8 7.4 15.7 15.7 18.6C34.5 217.1 48 235 48 256s-13.5 38.9-32.3 45.4C7.4 304.3 0 311.2 0 320v64c0 35.3 28.7 64 64 64h448c35.3 0 64-28.7 64-64v-64c0-8.8-7.4-15.7-15.7-18.6C541.5 294.9 528 277 528 256s13.5-38.9 32.3-45.4c8.3-2.9 15.7-9.8 15.7-18.6v-64c0-35.3-28.7-64-64-64H64z" />
                                </svg>
                              </a>
                              <a
                                href="#"
                                className="icon-btn"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleShare(title);
                                }}
                                aria-label="Share this session"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 512 512"
                                  width="20"
                                  height="20"
                                  fill="white"
                                >
                                  <path d="M307 34.8c-11.5 5.1-19 16.6-19 29.2v64H176C78.8 128 0 206.8 0 304c0 113.3 81.5 163.9 100.2 174.1a18.21 18.21 0 0 0 8.1 1.9c10.9 0 19.7-8.9 19.7-19.7 0-7.5-4.3-14.4-9.8-19.5C108.8 431.9 96 414.4 96 384c0-53 43-96 96-96h96v64c0 12.6 7.4 24.1 19 29.2s25 3 34.4-5.4l160-144c6.7-6.1 10.6-14.7 10.6-23.8s-3.8-17.7-10.6-23.8l-160-144c-9.4-8.5-22.9-10.6-34.4-5.4z" />
                                </svg>
                              </a>
                            </>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })
              )}
            </section>

            <div className="progress-bar" aria-hidden="true">
              <div className="progress-fill" ref={progressFillRef}></div>
            </div>

            <div className="scroll-hint" aria-hidden="true">
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path
                  d="M9 18l6-6-6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
              Swipe to scroll
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default UpcomingSessions;
