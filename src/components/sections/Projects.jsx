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
      className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-24"
    >
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-16 text-center">
          <h2 className="font-heading text-3xl font-semibold text-frost md:text-4xl">
            Featured <span className="text-amber">Projects</span>
          </h2>
          <div className="mx-auto mt-2 h-1 w-16 bg-amber/60" />
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {personalData.projects.map((project, i) => (
            <div
              key={project.title}
              ref={(el) => (cardsRef.current[i] = el)}
              className="group relative overflow-hidden rounded-2xl border border-frost/10 bg-evergreen/20 p-8 backdrop-blur-sm opacity-0"
              style={{ transform: 'translateY(30px)' }}
            >
              <div className="project-glow pointer-events-none absolute -inset-1 opacity-0 transition-opacity duration-500">
                <div
                  className="h-full w-full rounded-2xl blur-xl"
                  style={{
                    background: project.type === 'treasure'
                      ? 'radial-gradient(ellipse at center, rgba(212,168,83,0.15), transparent)'
                      : 'radial-gradient(ellipse at center, rgba(124,111,224,0.15), transparent)'
                  }}
                />
              </div>

              <div className="relative">
                <div className="mb-4 flex items-center gap-2">
                  <span
                    className="inline-block h-2 w-2 rounded-full"
                    style={{
                      backgroundColor: project.type === 'treasure' ? '#D4A853' : '#7C6FE0'
                    }}
                  />
                  <span className="font-body text-xs uppercase tracking-wider text-frost/40">
                    {project.type === 'treasure' ? 'Web Design' : 'Full Stack'}
                  </span>
                </div>

                <h3 className="font-heading text-2xl font-semibold text-frost transition-colors duration-300 group-hover:text-amber">
                  {project.title}
                </h3>

                <p className="mt-3 font-body text-sm leading-relaxed text-frost/60">
                  {project.description}
                </p>

                <p className="mt-4 font-body text-xs italic text-amber/60">
                  {project.tagline}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-frost/10 px-3 py-1 font-body text-xs text-frost/50"
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
                    className="mt-6 inline-flex items-center gap-2 font-body text-sm text-amber transition-all duration-300 hover:text-amber/80"
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
