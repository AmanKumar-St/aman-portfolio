import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { personalData } from '../../data/content';

export default function Hero() {
  const textRef = useRef(null);
  const subtitleRef = useRef(null);
  const scrollHintRef = useRef(null);

  useEffect(() => {
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
        { opacity: 0.6, duration: 1, ease: 'power2.out', delay: 2 }
      );
      gsap.to(scrollHintRef.current, {
        y: 10,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      data-section="hero"
      className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 sm:px-8 lg:px-12 py-20 md:py-28 lg:py-32"
    >
      <div className="text-center">
        <div className="mb-6 inline-block">
          <span className="font-body text-xs font-semibold uppercase tracking-[0.3em] text-amber">
            Portfolio
          </span>
        </div>
        <h1
          ref={textRef}
          className="font-heading text-6xl font-bold text-frost md:text-8xl lg:text-9xl"
        >
          {personalData.name}
        </h1>
        <p
          ref={subtitleRef}
          className="mt-4 font-body text-lg text-frost/90 md:text-xl font-medium"
        >
          {personalData.title}
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <span className="h-px w-8 bg-amber/60" />
          <span className="font-body text-xs uppercase tracking-[0.2em] text-amber font-semibold">
            Scroll to explore
          </span>
          <span className="h-px w-8 bg-amber/60" />
        </div>
      </div>

      <div
        ref={scrollHintRef}
        aria-hidden="true"
        className="absolute bottom-10 flex flex-col items-center gap-2"
      >
        <span className="font-body text-xs text-frost/70 font-semibold">↓</span>
      </div>
    </section>
  );
}
