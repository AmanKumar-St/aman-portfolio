import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { personalData, skillColors } from '../../data/content';

export default function Skills() {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, i) => {
        ScrollTrigger.create({
          trigger: card,
          start: 'top 85%',
          onEnter: () => {
            gsap.to(card, {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: 'power3.out',
              delay: i * 0.15
            });
          },
          once: true
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const categories = Object.entries(personalData.skills);

  return (
    <section
      ref={sectionRef}
      data-section="skills"
      className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-24"
    >
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-16 text-center">
          <h2 className="font-heading text-3xl font-semibold text-frost md:text-4xl">
            Skills & <span className="text-amber">Expertise</span>
          </h2>
          <div className="mx-auto mt-2 h-1 w-16 bg-amber/60" />
          <p className="mt-4 font-body text-frost/50">
            technologies I work with
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {categories.map(([category, skills], i) => {
            const colors = skillColors[category] || { primary: '#D4A853', secondary: '#C49A3E' };
            return (
              <div
                key={category}
                ref={(el) => (cardsRef.current[i] = el)}
                className="group rounded-2xl border border-frost/10 bg-evergreen/30 p-8 backdrop-blur-sm opacity-0"
                style={{ transform: 'translateY(30px)' }}
              >
                <div
                  className="mb-4 h-3 w-3 rounded-full"
                  style={{ backgroundColor: colors.primary }}
                />
                <h3 className="font-heading text-xl font-semibold text-frost">
                  {category}
                </h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-frost/10 px-3 py-1 font-body text-xs text-frost/60 transition-all duration-300 group-hover:border-amber/30 group-hover:text-amber/80"
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
