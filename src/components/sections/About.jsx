import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { personalData } from '../../data/content';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export default function About() {
  const sectionRef = useRef(null);
  const textRef = useRef(null);
  const avatarRef = useRef(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 80%',
        onEnter: () => {
          gsap.to(textRef.current, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out'
          });
          gsap.to(avatarRef.current, {
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: 'power3.out',
            delay: 0.2
          });
        },
        once: true
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReduced]);

  const initialStyle = prefersReduced ? {} : { opacity: 0 };
  const avatarInitialStyle = prefersReduced ? {} : { opacity: 0, transform: 'scale(0.85)' };

  return (
    <section
      ref={sectionRef}
      data-section="about"
      className="relative z-10 flex min-h-screen items-center justify-center px-4 py-16 md:py-24"
    >
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-12 md:flex-row">
        <div
          ref={avatarRef}
          className="h-48 w-48 flex-shrink-0 md:h-64 md:w-64"
          style={avatarInitialStyle}
        >
          <div className="flex h-full w-full items-center justify-center rounded-full border-2 border-amber/40 bg-evergreen/50 shadow-lg shadow-amber/10">
            <span className="font-heading text-5xl font-bold text-amber md:text-6xl">
              {personalData.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
        </div>
        <div ref={textRef} style={initialStyle}>
          <h2 className="font-heading text-3xl font-semibold text-frost md:text-4xl">
            About <span className="text-amber">Me</span>
          </h2>
          <div className="mt-2 h-1 w-16 bg-amber/60" />
          <p className="mt-6 font-body text-base leading-relaxed text-frost/85 md:text-lg">
            {personalData.bio}
          </p>
          <div className="mt-6 flex items-center gap-4">
            <a
              href={personalData.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full border border-amber/40 px-6 py-2 font-body text-sm text-amber transition-all duration-300 hover:bg-amber/10 focus:outline-none focus:ring-2 focus:ring-amber focus:ring-offset-2 focus:ring-offset-dark"
            >
              LinkedIn
              <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
