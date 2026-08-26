import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Briefcase, GraduationCap } from '@phosphor-icons/react';
import { personalData } from '../../data/content';
import { useReducedMotion } from '../../hooks/useReducedMotion';

// Maps experience roles to relevant icons
const getRoleIcon = (role) => {
  if (role.toLowerCase().includes('intern') || role.toLowerCase().includes('engineer') || role.toLowerCase().includes('developer')) {
    return Briefcase;
  }
  return GraduationCap;
};

export default function Experience() {
  const sectionRef = useRef(null);
  const itemsRef = useRef([]);
  const lineRef = useRef(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: lineRef.current,
        start: 'top 80%',
        onEnter: () => {
          gsap.to(lineRef.current, {
            scaleY: 1,
            duration: 1.5,
            ease: 'power3.inOut',
            transformOrigin: 'top center'
          });
        },
        once: true
      });

      itemsRef.current.forEach((item, i) => {
        ScrollTrigger.create({
          trigger: item,
          start: 'top 85%',
          onEnter: () => {
            gsap.to(item, {
              opacity: 1,
              x: 0,
              duration: 0.8,
              ease: 'power3.out',
              delay: i * 0.2
            });
          },
          once: true
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReduced]);

  return (
    <section
      ref={sectionRef}
      data-section="experience"
      className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-16 md:py-24"
    >
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-16 text-center">
          <h2 className="font-heading text-3xl font-semibold text-frost md:text-4xl">
            My <span className="text-amber">Journey</span>
          </h2>
          <div className="mx-auto mt-2 h-1 w-16 bg-amber/60" />
        </div>

        <div className="relative">
          {/* Vertical timeline line */}
          <div
            ref={lineRef}
            className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-amber/50 via-moss/40 to-transparent md:left-1/2 md:-translate-x-px"
            style={prefersReduced ? {} : { transform: 'scaleY(0)', transformOrigin: 'top center' }}
          />

          <div className="space-y-16">
            {personalData.experience.map((exp, i) => {
              const isLeft = i % 2 === 0;
              const IconComponent = getRoleIcon(exp.role);
              const initialStyle = prefersReduced ? {} : { opacity: 0, transform: `translateX(${isLeft ? '-20px' : '20px'})` };
              return (
                <div
                  key={i}
                  ref={(el) => (itemsRef.current[i] = el)}
                  className="relative flex items-start"
                  style={initialStyle}
                >
                  {/* Mobile: left dot + icon */}
                  <div className="absolute left-4 top-1 flex h-6 w-6 -translate-x-3 items-center justify-center rounded-full border-2 border-amber bg-dark md:hidden">
                    <IconComponent size={12} weight="fill" aria-hidden="true" className="text-amber" />
                  </div>

                  {/* Desktop: center dot + icon */}
                  <div className="absolute left-1/2 top-1 hidden h-6 w-6 -translate-x-3 items-center justify-center rounded-full border-2 border-amber bg-dark md:flex">
                    <IconComponent size={12} weight="fill" aria-hidden="true" className="text-amber" />
                  </div>

                  <div
                    className={`flex w-full flex-col gap-2 ${
                      isLeft ? 'md:pr-14 md:text-right' : 'md:pl-14'
                    } md:w-1/2`}
                    style={{
                      marginLeft: isLeft ? '2rem' : 'auto',
                      paddingLeft: isLeft ? '1.5rem' : '2rem'
                    }}
                  >
                    <span className="font-body text-xs uppercase tracking-wider text-amber/80">
                      {exp.role}
                    </span>
                    <h3 className="font-heading text-xl font-semibold text-frost">
                      {exp.company}
                    </h3>
                    {exp.period && (
                      <span className="font-mono text-xs text-moss/80">{exp.period}</span>
                    )}
                    {exp.description && (
                      <p className="font-body text-sm leading-relaxed text-frost/70">
                        {exp.description}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
