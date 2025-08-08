"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue } from "framer-motion";

const reviews = [
  {
    name: "Cindy",
    text: "I really love being part of this dodgeball community! Everyone is super friendly and welcoming.",
  },
  {
    name: "Tijmen",
    text: "I had such a great day!! I loved dodgeball in high-school, and I was just as fanatic as then.",
  },
  {
    name: "Lotte",
    text: "I had such a fun and active day. It's a great way to meet new people while doing something sporty.",
  },
  {
    name: "Lucas",
    text: "Joining as a complete beginner, I still felt welcome. There's a good balance of games and coaching.",
  },
  {
    name: "Anastasia",
    text: "I had such a fun time! It was a great way to get active and meet some really lovely people.",
  },
  {
    name: "Daniel",
    text: "Didn’t think I’d get into dodgeball again haha, but it’s seriously the highlight of my week now!",
  },
  {
    name: "Evelina",
    text: "I usually stay quiet in groups but this felt so safe and fun!!! Honestly one of the best things I’ve joined.",
  },
  {
    name: "Marva",
    text: "Came alone and was sooo nervous, but I felt at home right away!",
  },
  {
    name: "James",
    text: "This group really came out of nowhere but has quickly become the main event of my week.",
  },
  {
    name: "Jeffrey",
    text: "Super fun dodgeball club! It reminds me of gym class in school. Very welcoming and chill vibe.",
  },
];

const ReviewCard = ({ name, text }) => {
  const [windowWidth, setWindowWidth] = useState(0);
  
  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  const isMobile = windowWidth <= 768;
  
  return (
    <div style={{
      ...styles.card,
      width: isMobile ? "calc(100vw - 40px)" : "auto",
      maxWidth: isMobile ? "none" : 400,
      minWidth: isMobile ? "auto" : 240,
    }}>
      <div style={styles.cardTextContainer}>
        <p style={styles.cardText}>"{text}"</p>
      </div>
      <div style={styles.cardFooter}>
        <strong style={styles.cardFooterStrong}>{name}</strong>
        <span style={styles.cardFooterSpan}>Groningen</span>
      </div>
    </div>
  );
};

/* const WriteReviewCard = () => (
  <div style={{ ...styles.card, background: "#fefaf1", border: "none" }}>
    <p style={styles.cardText}>
      <strong>Want to share your experience?</strong> <br />
      We'd love to hear from you!
    </p>
    <button style={styles.writeButton}>Write a Review</button>
  </div>
); */

const WriteReviewCard = () => {
  const [step, setStep] = useState("initial");
  const [name, setName] = useState("");
  const [review, setReview] = useState("");
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth <= 768;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() && review.trim()) {
      setStep("submitted");
    }
  };

  return (
    <div style={{
      ...styles.card,
      height: step === "form" ? 220 : 160,
      width: isMobile ? "calc(100vw - 40px)" : "auto",
      maxWidth: isMobile ? "none" : 400,
      minWidth: isMobile ? "auto" : 240,
    }}>
      {step === "initial" && (
        <div style={styles.writeCardContent}>
          <p style={styles.cardText}>
            <strong>Want to share your experience?</strong> <br />
            We'd love to hear from you!
          </p>
          <button onClick={() => setStep("form")} style={styles.writeButton}>
            Write a Review
          </button>
        </div>
      )}

      {step === "form" && (
        <form onSubmit={handleSubmit} style={styles.formContent}>
          <h3 style={styles.formTitle}>Add your experience</h3>
          <input
            type="text"
            placeholder="Your name"
            style={styles.formInput}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <textarea
            placeholder="Write your experience..."
            style={styles.formTextarea}
            rows={2}
            value={review}
            onChange={(e) => setReview(e.target.value)}
          />
          <button
            type="submit"
            style={styles.submitButton}
          >
            Submit
          </button>
        </form>
      )}

      {step === "submitted" && (
        <>
          <div style={styles.cardTextContainer}>
            <p style={styles.cardText}>"{review}"</p>
          </div>
          <div style={styles.cardFooter}>
            <strong style={styles.cardFooterStrong}>{name}</strong>
            <span style={styles.cardFooterSpan}>Groningen</span>
          </div>
        </>
      )}
    </div>
  );
};

export default function Reviews() {
  const containerRef = useRef(null);

  // Manual drag values
  const dragX1 = useMotionValue(0);
  const dragX2 = useMotionValue(0);

  const [windowWidth, setWindowWidth] = useState(0);
  // For cursor feedback
  const [isDragging1, setIsDragging1] = useState(false);
  const [isDragging2, setIsDragging2] = useState(false);
  
  // Mobile single card navigation - separate for each row
  const [currentCardIndex1, setCurrentCardIndex1] = useState(0);
  const [currentCardIndex2, setCurrentCardIndex2] = useState(0);
  const isMobile = windowWidth <= 768;

  useEffect(() => {
    // Only runs on client
    setWindowWidth(window.innerWidth);

    // Optional: update on resize
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Set initial drag offset when windowWidth changes
  useEffect(() => {
    if (windowWidth > 0) {
      // Adjust initial offset based on screen size
      const offset1 = windowWidth > 768 ? -windowWidth * 0.2 : -windowWidth * 0.05;
      const offset2 = windowWidth > 768 ? -windowWidth * 0.1 : -windowWidth * 0.02;
      dragX1.set(offset1);
      dragX2.set(offset2);
    }
  }, [windowWidth, dragX1, dragX2]);

  // Split reviews
  const half = Math.ceil(reviews.length / 2);
  const row1 = [...reviews.slice(0, half)];
  const row2 = [...reviews.slice(half)];
  
  // Place write card at the beginning of row1 for mobile, middle for desktop
  if (isMobile) {
    row1.unshift({ isWriteCard: true }); // Add to beginning
  } else {
    row1.splice(Math.floor(row1.length / 2), 0, { isWriteCard: true }); // Add to middle
  }
  
  // Mobile swipe handlers for row 1
  const nextCard1 = () => {
    setCurrentCardIndex1((prev) => (prev + 1) % row1.length);
  };
  
  const prevCard1 = () => {
    setCurrentCardIndex1((prev) => (prev - 1 + row1.length) % row1.length);
  };
  
  // Mobile swipe handlers for row 2
  const nextCard2 = () => {
    setCurrentCardIndex2((prev) => (prev + 1) % row2.length);
  };
  
  const prevCard2 = () => {
    setCurrentCardIndex2((prev) => (prev - 1 + row2.length) % row2.length);
  };

  return (
    <div className="relative z-[50]" ref={containerRef}>
       <div className="absolute lg:top-[-60px] md:top-[-50px] top-[-13px] z-[100] left-0 w-full">
        <svg
          viewBox="0 0 1440 14"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          style={{ width: '100%', height: '15px', color: "#111111 !important" }}
        >
          <path
            d="
              M0,7
              C10,4 20,10 30,7
              C40,5 50,9 60,7
              C70,6 80,8 90,7
              C100,5 110,9 120,7
              C130,6 140,8 150,7
              C160,4 170,10 180,7
              C190,6 200,8 210,7
              C220,5 230,9 240,7
              C250,6 260,8 270,7
              C280,4 290,10 300,7
              C310,5 320,9 330,7
              C340,6 350,8 360,7
              C370,5 380,9 390,7
              C400,6 410,8 420,7
              C430,4 440,10 450,7
              C460,5 470,9 480,7
              C490,6 500,8 510,7
              C520,5 530,9 540,7
              C550,6 560,8 570,7
              C580,4 590,10 600,7
              C610,6 620,8 630,7
              C640,5 650,9 660,7
              C670,6 680,8 690,7
              C700,4 710,10 720,7
              C730,5 740,9 750,7
              C760,6 770,8 780,7
              C790,5 800,9 810,7
              C820,6 830,8 840,7
              C850,4 860,10 870,7
              C880,5 890,9 900,7
              C910,6 920,8 930,7
              C940,5 950,9 960,7
              C970,6 980,8 990,7
              C1000,4 1010,10 1020,7
              C1030,5 1040,9 1050,7
              C1060,6 1070,8 1080,7
              C1090,5 1100,9 1110,7
              C1120,6 1130,8 1140,7
              C1150,4 1160,10 1170,7
              C1180,5 1190,9 1200,7
              C1210,6 1220,8 1230,7
              C1240,5 1250,9 1260,7
              C1270,6 1280,8 1290,7
              C1300,4 1310,10 1320,7
              C1330,5 1340,9 1350,7
              C1360,6 1370,8 1380,7
              C1390,5 1400,9 1410,7
              C1420,6 1430,8 1440,7
              L1440,14
              L0,14
              Z"
            fill="#111111"
          />
        </svg>
      </div>

      <section style={styles.section}>
        <div className="px-4">
          <div style={styles.stars}>★★★★★</div>
          <div style={styles.subheading}>What others say</div>
          <div style={styles.title}>Experiences from our Dodgers</div>
          <div style={styles.subtitle}>
            A sport that <strong style={{ color: "white" }}>connects</strong>. A
            community that{" "}
            <strong style={{ color: "white" }}>makes you smile</strong>.
          </div>
        </div>

        {/* Mobile: Two row single card view */}
        {isMobile ? (
          <div style={styles.mobileWrapper}>
            {/* Row 1 */}
            <div style={styles.mobileRowContainer}>
              <motion.div
                key={`row1-${currentCardIndex1}`}
                drag="x"
                dragConstraints={{ left: -100, right: 100 }}
                onDragEnd={(event, info) => {
                  if (info.offset.x > 50) {
                    prevCard1();
                  } else if (info.offset.x < -50) {
                    nextCard1();
                  }
                }}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                style={styles.mobileCardContainer}
              >
                {row1[currentCardIndex1]?.isWriteCard ? (
                  <WriteReviewCard />
                ) : (
                  <ReviewCard {...row1[currentCardIndex1]} />
                )}
              </motion.div>
              
              {/* Navigation dots for row 1 */}
              <div style={styles.dotsContainer}>
                {row1.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentCardIndex1(index)}
                    style={{
                      ...styles.dot,
                      backgroundColor: index === currentCardIndex1 ? "#f57f3b" : "#666"
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Row 2 */}
            <div style={styles.mobileRowContainer}>
              <motion.div
                key={`row2-${currentCardIndex2}`}
                drag="x"
                dragConstraints={{ left: -100, right: 100 }}
                onDragEnd={(event, info) => {
                  if (info.offset.x > 50) {
                    prevCard2();
                  } else if (info.offset.x < -50) {
                    nextCard2();
                  }
                }}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                style={styles.mobileCardContainer}
              >
                <ReviewCard {...row2[currentCardIndex2]} />
              </motion.div>
              
              {/* Navigation dots for row 2 */}
              <div style={styles.dotsContainer}>
                {row2.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentCardIndex2(index)}
                    style={{
                      ...styles.dot,
                      backgroundColor: index === currentCardIndex2 ? "#f57f3b" : "#666"
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Desktop: Original marquee layout */
          <div style={styles.marqueeWrapper}>
            {/* ✅ Top Row - Only drag, no scroll effect */}
            <div style={{
              ...styles.marqueeOuter,
              paddingLeft: "200px"
            }}>
              <motion.div
                drag="x"
                dragConstraints={{ left: -1500, right: 0 }}
                style={{
                  ...styles.marqueeInner,
                  x: dragX1,
                  cursor: isDragging1 ? "grabbing" : "grab",
                }}
                onDragStart={() => setIsDragging1(true)}
                onDragEnd={() => setIsDragging1(false)}
                transition={{ type: "tween", ease: "easeInOut", duration: 0.5 }}
              >
                {row1.map((r, i) =>
                  r.isWriteCard ? (
                    <div
                      key="write"
                      style={{ flexShrink: 0 }}
                    >
                      <WriteReviewCard />
                    </div>
                  ) : (
                    <ReviewCard key={`r1-${i}`} {...r} />
                  )
                )}
              </motion.div>
            </div>

            {/* ✅ Bottom Row - Only drag, no scroll effect, and staggered */}
            <div style={{
              ...styles.marqueeOuter,
              paddingLeft: "200px"
            }}>
              <motion.div
                drag="x"
                dragConstraints={{ left: -1000, right: 0 }}
                style={{
                  ...styles.marqueeInner,
                  x: dragX2,
                  cursor: isDragging2 ? "grabbing" : "grab",
                }}
                onDragStart={() => setIsDragging2(true)}
                onDragEnd={() => setIsDragging2(false)}
                transition={{ type: "tween", ease: "easeInOut", duration: 0.5 }}
              >
                {row2.map((r, i) => (
                  <ReviewCard key={`r2-${i}`} {...r} />
                ))}
              </motion.div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

const styles = {
  section: {
    minHeight: "100vh",
    padding: "64px 16px",
    textAlign: "center",
    // background: "red",
    color: "#fff",
    fontFamily: "'Inter', sans-serif",
    overflow: "hidden",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  stars: {
    color: "#f57f3b",
    fontSize: 20,
    marginBottom: 8,
  },
  subheading: {
    textTransform: "uppercase",
    fontWeight: 600,
    fontSize: 12,
    color: "#bbb",
    letterSpacing: 1,
    marginBottom: 6,
  },
  title: {
    fontSize: "2rem",
    fontWeight: 700,
    marginBottom: 10,
    color: "white",
  },
  subtitle: {
    fontSize: "1rem",
    color: "#ccc",
    marginBottom: 40,
  },
  marqueeWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: 30,
  },
  marqueeOuter: {
    overflow: "hidden",
    width: "100%",
  },
  marqueeInner: {
    display: "flex",
    gap: 16,
    width: "auto",
    alignItems: "self-start",
    userSelect: "none",
    cursor: "grab",
  },
  card: {
    background: "#fefaf1",
    color: "#0d0c0b",
    padding: "20px 22px",
    borderRadius: 24,
    boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: 160,
    minWidth: 240,
    maxWidth: 400,
    flexShrink: 0,
    textAlign: "left",
    transition: "all 0.5s cubic-bezier(0.4,0,0.2,1)",
  },
  // Mobile-specific styles
  mobileWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: 40,
    width: "100%",
  },
  mobileRowContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 20,
    width: "100%",
    padding: "0 20px",
  },
  mobileCardContainer: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
    cursor: "grab",
  },
  dotsContainer: {
    display: "flex",
    gap: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  cardTextContainer: {
    flex: 1,
    overflowY: "auto",
    overflowX: "hidden",
    maxHeight: "6rem", // Approximately 4 lines (1.5rem line-height * 4)
    marginBottom: 12,
    wordWrap: "break-word",
    wordBreak: "break-word",
  },
  cardText: {
    fontSize: 16,
    fontWeight: 500,
    lineHeight: 1.5,
    margin: 0,
    whiteSpace: "pre-wrap",
  },
  cardFooter: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    fontSize: 13,
    lineHeight: 1.2,
    color: "#888",
  },
  cardFooterStrong: {
    color: "#0d0c0b",
    fontSize: 14,
  },
  cardFooterSpan: {
    fontSize: 13,
  },
  writeButton: {
    background: "#0d0c0b",
    color: "#fff",
    border: "none",
    padding: "12px 16px",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "10px",
  },
  writeCardContent: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    height: "100%",
    justifyContent: "space-between",
  },
  formContent: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    height: "100%",
    justifyContent: "space-between",
  },
  formTitle: {
    fontSize: "1.1rem",
    fontWeight: 600,
    color: "#0d0c0b",
  },
  formInput: {
    border: "1px solid #0d0c0b",
    borderRadius: "8px",
    padding: "8px 12px",
    fontSize: "0.9rem",
    color: "#0d0c0b",
  },
  formTextarea: {
    border: "1px solid #0d0c0b",
    borderRadius: "8px",
    padding: "8px 12px",
    fontSize: "0.9rem",
    color: "#0d0c0b",
    resize: "none",
    minHeight: "40px",
    maxHeight: "80px",
    overflowY: "auto",
    overflowX: "hidden",
    wordWrap: "break-word",
    wordBreak: "break-word",
    whiteSpace: "pre-wrap",
  },
  submitButton: {
    background: "#f57f3b",
    color: "#fff",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "10px",
    alignSelf: "flex-start",
    fontSize: "0.9rem",
  },
};
