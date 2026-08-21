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
          <h2 className="font-heading text-3xl font-bold text-[#0A3625] md:text-4xl">
            Skills & <span className="text-[#8b004a]">Expertise</span>
          </h2>
          <div className="mx-auto mt-2 h-1 w-16 bg-[#8b004a]" />
          <p className="mt-4 font-body font-medium text-[#1F3A34]/80">
            technologies I work with
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {categories.map(([category, skills], i) => {
            const colors = skillColors[category] || { primary: '#8b004a', secondary: '#C49A3E' };
            return (
              <div
                key={category}
                ref={(el) => (cardsRef.current[i] = el)}
                className="group rounded-2xl border border-[#0A3625]/15 bg-white/80 p-8 backdrop-blur-md opacity-0 shadow-lg hover:shadow-xl transition-all duration-300"
                style={{ transform: 'translateY(30px)' }}
              >
                <div
                  className="mb-4 h-3.5 w-3.5 rounded-full"
                  style={{ backgroundColor: colors.primary }}
                />
                <h3 className="font-heading text-xl font-bold text-[#0A3625]">
                  {category}
                </h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-[#0A3625]/20 bg-[#0A3625]/5 px-3 py-1 font-body text-xs font-semibold text-[#0A3625] transition-all duration-300 group-hover:border-[#8b004a] group-hover:bg-[#8b004a] group-hover:text-white"
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
