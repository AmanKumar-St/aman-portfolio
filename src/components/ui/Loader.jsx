import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function Loader({ onComplete }) {
  const containerRef = useRef(null);
  const counterRef = useRef(null);
  const progressLineRef = useRef(null);
  const pathRef = useRef(null);

  useEffect(() => {
    // Prevent scrolling while loading
    document.body.style.overflow = 'hidden';

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          // Allow scrolling again once the loading completes
          document.body.style.overflow = '';
          if (onComplete) onComplete();
        }
      });

      // 1. Initial State: Characters start hidden below the overflow clip
      gsap.set('.char', { y: '110%' });

      // 2. Animate elements in
      tl.to('.char', {
        y: '0%',
        duration: 1.2,
        stagger: 0.08,
        ease: 'power4.out',
        delay: 0.2
      });

      // 3. Simulated progress counter (0 to 100)
      const progress = { value: 0 };
      tl.to(progress, {
        value: 100,
        duration: 2.8,
        ease: 'power2.out',
        onUpdate: () => {
          if (counterRef.current) {
            counterRef.current.innerText = Math.floor(progress.value)
              .toString()
              .padStart(2, '0');
          }
        }
      }, '<'); // Starts concurrently with the letters

      // 4. Progress bar line growing
      tl.to(progressLineRef.current, {
        scaleX: 1,
        duration: 2.8,
        ease: 'power2.out'
      }, '<');

      // 5. Short pause at 100% for satisfying visual weight
      tl.to({}, { duration: 0.3 });

      // 6. Exit transition: Text and counter slide up and fade out elegantly
      tl.to(['.char', counterRef.current, progressLineRef.current], {
        y: -100,
        opacity: 0,
        duration: 0.8,
        stagger: 0.05,
        ease: 'power3.in'
      });

      // 7. Liquid Curtain Slide-Up (SVG Morphing)
      // First stage: Pull up the corners (sides), making the center loop downward (fluid drape effect)
      tl.to(pathRef.current, {
        attr: { d: 'M 0 0 L 100 0 L 100 0 Q 50 80 0 0 Z' },
        duration: 0.8,
        ease: 'power3.in'
      }, '-=0.4'); // Slight overlap with text exit for cohesive motion

      // Second stage: Snap the remaining center curve flat to the top
      tl.to(pathRef.current, {
        attr: { d: 'M 0 0 L 100 0 L 100 0 Q 50 0 0 0 Z' },
        duration: 0.4,
        ease: 'power2.out'
      });

      // Fade out the overall container to complete unmounting safely
      tl.to(containerRef.current, {
        opacity: 0,
        duration: 0.1
      });
    }, containerRef);

    return () => {
      document.body.style.overflow = '';
      ctx.revert();
    };
  }, [onComplete]);

  // Split title and subtitle for staggered animation
  const title = 'AMAN';
  const subtitle = 'PORTFOLIO';

  return (
    <div
      ref={containerRef}
      role="status"
      aria-label="Loading"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center select-none overflow-hidden"
    >
      <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path
          ref={pathRef}
          d="M 0 0 L 100 0 L 100 100 Q 50 100 0 100 Z"
          fill="#0a1411"
        />
      </svg>

      {/* Main Content Layout */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center">
        {/* Counter Presentation (Large background watermark) */}
        <div className="mb-4 font-body text-7xl md:text-8xl font-extralight text-amber/15 tracking-tight select-none">
          <span ref={counterRef}>00</span>
          <span className="text-3xl md:text-4xl text-amber/10 ml-1">%</span>
        </div>

        {/* Brand Reveal Grid */}
        <div className="flex flex-col items-center gap-1">
          {/* AMAN Word */}
          <div className="flex overflow-hidden pb-1">
            {title.split('').map((char, index) => (
              <span
                key={`title-${index}`}
                className="char font-heading text-5xl md:text-7xl font-bold tracking-widest text-frost inline-block"
              >
                {char}
              </span>
            ))}
          </div>

          {/* PORTFOLIO Word */}
          <div className="flex overflow-hidden pb-1">
            {subtitle.split('').map((char, index) => (
              <span
                key={`sub-${index}`}
                className="char font-body text-[10px] md:text-xs uppercase tracking-[0.4em] text-amber inline-block"
              >
                {char}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Fluid Accent Progress Line */}
      <div className="absolute bottom-16 left-12 right-12 md:left-24 md:right-24 h-[1px] bg-frost/5 overflow-hidden z-10">
        <div
          ref={progressLineRef}
          className="h-full w-full bg-amber origin-left scale-x-0"
        />
      </div>
    </div>
  );
}