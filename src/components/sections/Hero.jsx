import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { personalData } from '../../data/content';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export default function Hero() {
  const textRef = useRef(null);
  const subtitleRef = useRef(null);
  const scrollHintRef = useRef(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced) return; // content already visible via CSS fallback

    const ctx = gsap.context(() => {
      gsap.fromTo(textRef.current,
        { opacity: 0, y: 60, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 1.5, ease: 'power3.out', delay: 0.5 }
      );
      gsap.fromTo(subtitleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', delay: 1 }
      );
      gsap.fromTo(scrollHintRef.current,
        { opacity: 0 },
        { opacity: 0.7, duration: 1, ease: 'power2.out', delay: 2 }
      );
      gsap.to(scrollHintRef.current, {
        y: 8,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
      });
    });

    return () => ctx.revert();
  }, [prefersReduced]);

  return (
    <section
      data-section="hero"
      className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-16 md:py-24"
    >
      <div className="text-center">
        <div className="mb-6 inline-block">
          <span className="font-body text-xs uppercase tracking-[0.3em] text-moss">
            Portfolio
          </span>
        </div>
        <h1
          ref={textRef}
          className="font-heading text-6xl font-bold text-frost md:text-8xl lg:text-9xl"
          style={prefersReduced ? {} : { opacity: 0 }}
        >
          {personalData.name}
        </h1>
        <p
          ref={subtitleRef}
          className="mt-4 font-body text-lg text-frost/80 md:text-xl"
          style={prefersReduced ? {} : { opacity: 0 }}
        >
          {personalData.title}
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <span className="h-px w-8 bg-amber/40" />
          <span className="font-body text-xs uppercase tracking-[0.2em] text-amber/80">
            Scroll to explore
          </span>
          <span className="h-px w-8 bg-amber/40" />
        </div>
      </div>

      <div
        ref={scrollHintRef}
        aria-hidden="true"
        className="absolute bottom-10 flex flex-col items-center gap-2"
        style={prefersReduced ? {} : { opacity: 0 }}
      >
        {/* SVG chevron — no emoji */}
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-frost/50"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </section>
  );
}
