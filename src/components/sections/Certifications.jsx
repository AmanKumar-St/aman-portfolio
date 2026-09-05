import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { certifications } from '../../data/certifications';
import CertificationSlider from '../ui/CertificationSlider';
import { useReducedMotion } from '../../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export default function Certifications() {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top 80%',
        onEnter: () => {
          gsap.fromTo(
            containerRef.current,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: 'power3.out',
            }
          );
        },
        once: true,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReduced]);

  return (
    <section
      ref={sectionRef}
      data-section="certifications"
      className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-16 md:py-24 overflow-hidden"
    >
      <div ref={containerRef} className="mx-auto w-full max-w-6xl">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="font-heading text-3xl font-semibold text-frost md:text-4xl">
            My <span className="text-amber">Certifications</span>
          </h2>
          <div className="mx-auto mt-2 h-1 w-16 bg-amber/60" />
        </div>

        {/* Interactive Slider */}
        <CertificationSlider items={certifications} />
      </div>
    </section>
  );
}
