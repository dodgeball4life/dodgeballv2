"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "../styles/About.module.css";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const cardContainerRef = useRef(null);
  const quoteRef = useRef(null);
  const introRef = useRef(null);
  const whyLoveRef = useRef(null);
  const listItemRefs = useRef([]);
  const lastParagraphRef = useRef(null);

  useEffect(() => {
    listItemRefs.current = []; // clear list on re-render
  }, []);

  const addToListRefs = (el) => {
    if (el && !listItemRefs.current.includes(el)) {
      listItemRefs.current.push(el);
    }
  };

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Title animation
      gsap.from(titleRef.current, {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
          end: "top 30%",
          scrub: 1.2,
        },
      });

      // Card animation
      gsap.from(cardContainerRef.current, {
        scale: 0.95,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
      });

      // Inner content stagger
      gsap
        .timeline({
          scrollTrigger: {
            trigger: cardContainerRef.current,
            start: "top 75%",
          },
        })
        .from(quoteRef.current, {
          opacity: 0,
          y: 30,
          duration: 0.6,
        })
        .from(
          introRef.current,
          {
            opacity: 0,
            y: 20,
            duration: 0.5,
          },
          "-=0.4"
        )
        .from(
          whyLoveRef.current,
          {
            opacity: 0,
            y: 20,
            duration: 0.4,
          },
          "-=0.4"
        )
        .from(
          listItemRefs.current,
          {
            opacity: 0,
            y: 15,
            duration: 0.3,
            stagger: 0.1,
          },
          "-=0.4"
        )
        .from(
          lastParagraphRef.current,
          {
            opacity: 0,
            y: 20,
            duration: 0.4,
          },
          "-=0.3"
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} className=" relative">
      {/* Decorative Top Curve */}


      <section className={styles.about}>
        <main className={styles.main}>
          <div className={`${styles.svgContainer} relative xl:block hidden`}>
            {/*  <img
              src="/assets/AboutUsSvgs/aboutus.svg"
              alt="About Us"
              className={${styles.mainSvg} opacity-50}
              style={{
                width: "950vw", // Change this to make it bigger/smaller
                height: "auto", // Keeps aspect ratio
              }}
            /> */}

            <div className="xl:block hidden relative w-full h-full">
              <img
                src="/assets/AboutUsSvgs/wordcloud.svg"
                alt="wordcloud"
                className={`${styles.mainSvg} opacity-50`}
              />

              <img
                src="/assets/AboutUsSvgs/Asset 15.svg"
                alt="WhatsApp Group"
                className="absolute top-[-55px] left-[-159px] size-40 hover:scale-110 transition-transform duration-300 cursor-pointer"
              />
              <img
                src="/assets/AboutUsSvgs/Asset 16.svg"
                alt="No Experience Needed"
                className="absolute top-[-95px] left-[140px] size-50 hover:scale-110 transition-transform duration-300 cursor-pointer"
              />
              <img
                src="/assets/AboutUsSvgs/Asset 17.svg"
                alt="Community"
                className="absolute top-[-85px] left-[340px] size-25 hover:scale-110 transition-transform duration-300 cursor-pointer"
              />
              <img
                src="/assets/AboutUsSvgs/Asset 18.svg"
                alt="Groningen"
                className="absolute top-[-20px] left-[500px] size-30 hover:scale-110 transition-transform duration-300 cursor-pointer"
              />
              <img
                src="/assets/AboutUsSvgs/Asset 19.svg"
                alt="Foam Dodgeball"
                className="absolute top-[55px] left-[750px] size-35 hover:scale-110 transition-transform duration-300 cursor-pointer"
              />
              <img
                src="/assets/AboutUsSvgs/Asset 20.svg"
                alt="Inclusive Fun"
                className="absolute top-[170px] left-[660px] size-30 hover:scale-110 transition-transform duration-300 cursor-pointer"
              />
              <img
                src="/assets/AboutUsSvgs/Asset 21.svg"
                alt="Afterdodge"
                className="absolute top-[320px] left-[690px] size-28 hover:scale-110 transition-transform duration-300 cursor-pointer"
              />
              <img
                src="/assets/AboutUsSvgs/Asset 22.svg"
                alt="Youth & Adult Sessions"
                className="absolute top-[335px] left-[420px] size-40 hover:scale-110 transition-transform duration-300 cursor-pointer"
              />

              <img
                src="/assets/AboutUsSvgs/Asset 23.svg"
                alt="Coached Sessions"
                className="absolute top-[300px] left-[220px] size-40 hover:scale-110 transition-transform duration-300 cursor-pointer"
              />

              <img
                src="/assets/AboutUsSvgs/Asset 24.svg"
                alt="Open for All"
                className="absolute top-[280px] left-[-40px] size-30 hover:scale-110 transition-transform duration-300 cursor-pointer"
              />

              <img
                src="/assets/AboutUsSvgs/Asset 25.svg"
                alt="Clinics & Team Building"
                className="absolute top-[90px] left-[-130px] size-45 hover:scale-110 transition-transform duration-300 cursor-pointer"
              />

              <img
                src="/assets/AboutUsSvgs/Asset 27.svg"
                alt="About Gron's Dodgeball"
                className="absolute top-[50%] left-[50%] size-60  transform -translate-x-1/2 -translate-y-1/2"
              />
            </div>

            <div className="xl:hidden block w-full h-full">
              <img src="/assets/AboutUsSvgs/Mobile version.svg" alt="" />
            </div>
          </div>
        </main>
      </section>
    </div>
  );
}
