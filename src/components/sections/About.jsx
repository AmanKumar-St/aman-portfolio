import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { personalData } from '../../data/content';

export default function About() {
  const sectionRef = useRef(null);
  const textRef = useRef(null);
  const avatarRef = useRef(null);

  useEffect(() => {
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
  }, []);

  return (
    <section
      ref={sectionRef}
      data-section="about"
      className="relative z-10 flex min-h-screen items-center justify-center px-4 py-24 bg-[#00A19B] transition-colors duration-500"
    >
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-12 md:flex-row">
        <div
          ref={avatarRef}
          className="h-48 w-48 flex-shrink-0 opacity-0 md:h-64 md:w-64"
          style={{ transform: 'scale(0.8)' }}
        >
          <div className="flex h-full w-full items-center justify-center rounded-full border-2 border-white/40 bg-white/10 backdrop-blur-md shadow-xl">
            <span className="font-heading text-5xl font-bold text-white md:text-6xl drop-shadow-md">
              {personalData.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
        </div>

        <div ref={textRef} className="opacity-0" style={{ transform: 'translateY(30px)' }}>
          <h2 className="font-heading text-3xl font-bold text-white md:text-4xl">
            About <span className="text-[#F2b759]">Me</span>
          </h2>
          <div className="mt-2 h-1 w-16 bg-[#F2b759]" />
          <p className="mt-6 font-body text-base leading-relaxed text-white/95 md:text-lg drop-shadow-sm font-medium">
            {personalData.bio}
          </p>
          <div className="mt-6 flex items-center gap-4">
            <a
              href={personalData.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/10 px-6 py-2.5 font-body text-sm font-semibold text-white backdrop-blur-md transition-all duration-300 hover:bg-white hover:text-[#00A19B] shadow-md"
            >
              LinkedIn
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
