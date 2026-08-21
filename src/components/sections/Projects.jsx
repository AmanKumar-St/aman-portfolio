import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { personalData } from '../../data/content';

export default function Projects() {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, i) => {
        ScrollTrigger.create({
          trigger: card,
          start: 'top 80%',
          onEnter: () => {
            gsap.to(card, {
              opacity: 1,
              y: 0,
              duration: 1,
              ease: 'power3.out',
              delay: i * 0.2
            });
            gsap.to(card.querySelector('.project-glow'), {
              opacity: 0.3,
              duration: 1,
              delay: i * 0.2 + 0.5
            });
          },
          once: true
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      data-section="projects"
      className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-24 bg-[#E4DDD3] transition-colors duration-500"
    >
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-16 text-center">
          <h2 className="font-heading text-3xl font-bold text-[#0A3625] md:text-4xl">
            Featured <span className="text-[#00a19b]">Projects</span>
          </h2>
          <div className="mx-auto mt-2 h-1 w-16 bg-[#00a19b]" />
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {personalData.projects.map((project, i) => (
            <div
              key={project.title}
              ref={(el) => (cardsRef.current[i] = el)}
              className="group relative overflow-hidden rounded-2xl border border-[#0A3625]/15 bg-white/90 p-8 backdrop-blur-md opacity-0 shadow-lg hover:shadow-2xl transition-all duration-300"
              style={{ transform: 'translateY(30px)' }}
            >
              <div className="project-glow pointer-events-none absolute -inset-1 opacity-0 transition-opacity duration-500">
                <div
                  className="h-full w-full rounded-2xl blur-xl"
                  style={{
                    background: project.type === 'treasure'
                      ? 'radial-gradient(ellipse at center, rgba(0,161,155,0.2), transparent)'
                      : 'radial-gradient(ellipse at center, rgba(124,111,224,0.2), transparent)'
                  }}
                />
              </div>

              <div className="relative">
                <div className="mb-4 flex items-center gap-2">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{
                      backgroundColor: project.type === 'treasure' ? '#00a19b' : '#7C6FE0'
                    }}
                  />
                  <span className="font-body text-xs font-semibold uppercase tracking-wider text-[#0A3625]/70">
                    {project.type === 'treasure' ? 'Web Design' : 'Full Stack'}
                  </span>
                </div>

                <h3 className="font-heading text-2xl font-bold text-[#0A3625] transition-colors duration-300 group-hover:text-[#00a19b]">
                  {project.title}
                </h3>

                <p className="mt-3 font-body text-sm leading-relaxed text-[#1F3A34]/90 font-medium">
                  {project.description}
                </p>

                <p className="mt-4 font-body text-xs italic text-[#00a19b] font-semibold">
                  {project.tagline}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-[#0A3625]/20 bg-[#0A3625]/5 px-3 py-1 font-body text-xs font-semibold text-[#0A3625]"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center gap-2 font-body text-sm font-bold text-[#00a19b] transition-all duration-300 hover:text-[#00736e]"
                  >
                    View on GitHub →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
