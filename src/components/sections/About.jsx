import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { personalData } from '../../data/content';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import ProfileCard from '../ui/ProfileCard';
import heroImage from '../../assets/Profile_pic-bg.png';
import { triggerSectionTransition } from '../../utils/navigation';

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

  const handleContactClick = () => {
    triggerSectionTransition('contact', 'Contact');
  };

  return (
    <section
      ref={sectionRef}
      data-section="about"
      className="relative z-10 flex min-h-screen items-center justify-center px-4 py-16 md:py-24"
    >
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-12 md:flex-row">
        <div
          ref={avatarRef}
          className="w-full flex-shrink-0 flex justify-center max-w-[320px] sm:max-w-[340px] md:max-w-[360px]"
          style={avatarInitialStyle}
        >
          <ProfileCard
            name={personalData.name}
            title={personalData.title}
            handle="aman"
            status="Online"
            contactText="Contact Me"
            avatarUrl={heroImage}
            showUserInfo={true}
            enableTilt={!prefersReduced}
            enableMobileTilt={false}
            onContactClick={handleContactClick}
            behindGlowEnabled={true}
            innerGradient="linear-gradient(145deg, rgba(10, 54, 37, 0.85) 0%, rgba(212, 168, 83, 0.25) 100%)"
          />
        </div>
        <div ref={textRef} style={initialStyle} className="flex-1">
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

