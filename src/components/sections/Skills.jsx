import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Brain,
  ShieldCheck,
  Code,
} from '@phosphor-icons/react';
import { personalData, skillColors } from '../../data/content';
import { useReducedMotion } from '../../hooks/useReducedMotion';

// Map category names to appropriate Phosphor icons
const CATEGORY_ICONS = {
  'AI & Machine Learning': Brain,
  'Cybersecurity': ShieldCheck,
  'Frontend Development': Code,
};

export default function Skills() {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, i) => {
        ScrollTrigger.create({
          trigger: card,
          start: 'top 85%',
          onEnter: () => {
            gsap.to(card, {
              opacity: 1,
              y: 0,
              duration: 0.5,
              ease: 'bounce',
              delay: i * 0.05
            });
          },
          once: true
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReduced]);

  const categories = Object.entries(personalData.skills);

  return (
    <section
      ref={sectionRef}
      data-section="skills"
      className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-16 md:py-24"
    >
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-16 text-center">
          <h2 className="font-heading text-3xl font-semibold text-frost md:text-4xl">
            Skills &amp; <span className="text-amber">Expertise</span>
          </h2>
          <div className="mx-auto mt-2 h-1 w-16 bg-amber/60" />
          <p className="mt-4 font-body text-frost/75">
            Technologies I work with
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {categories.map(([category, skills], i) => {
            const colors = skillColors[category] || { primary: '#D4A853', secondary: '#C49A3E' };
            const IconComponent = CATEGORY_ICONS[category];
            const initialStyle = prefersReduced ? {} : { opacity: 0, transform: 'translateY(30px)' };
            return (
              <div
                key={category}
                ref={(el) => (cardsRef.current[i] = el)}
                className="group rounded-2xl border border-frost/10 bg-evergreen/30 p-8 backdrop-blur-sm transition-all duration-300 hover:border-amber/30 hover:bg-evergreen/50"
                style={initialStyle}
              >
                <div className="mb-4 flex items-center gap-3">
                  {IconComponent ? (
                    <IconComponent
                      size={22}
                      weight="duotone"
                      aria-hidden="true"
                      style={{ color: colors.primary }}
                    />
                  ) : (
                    <div
                      className="h-3 w-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: colors.primary }}
                    />
                  )}
                  <h3 className="font-heading text-xl font-semibold text-frost">
                    {category}
                  </h3>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-frost/15 px-3 py-1 font-body text-xs text-frost/75 transition-all duration-300 group-hover:border-amber/40 group-hover:text-amber/90"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
