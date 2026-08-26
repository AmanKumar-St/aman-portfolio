import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowSquareOut, GithubLogo } from '@phosphor-icons/react';
import { personalData } from '../../data/content';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export default function Projects() {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced) return;

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
  }, [prefersReduced]);

  return (
    <section
      ref={sectionRef}
      data-section="projects"
      className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-16 md:py-24"
    >
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-16 text-center">
          <h2 className="font-heading text-3xl font-semibold text-frost md:text-4xl">
            Featured <span className="text-amber">Projects</span>
          </h2>
          <div className="mx-auto mt-2 h-1 w-16 bg-amber/60" />
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {personalData.projects.map((project, i) => {
            const initialStyle = prefersReduced ? {} : { opacity: 0, transform: 'translateY(30px)' };
            return (
              <div
                key={project.title}
                ref={(el) => (cardsRef.current[i] = el)}
                className="group relative overflow-hidden rounded-2xl border border-frost/10 bg-evergreen/20 p-8 backdrop-blur-sm cursor-default transition-all duration-300 hover:border-amber/30"
                style={initialStyle}
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
                      className="inline-block h-2 w-2 rounded-full flex-shrink-0"
                      style={{
                        backgroundColor: project.type === 'treasure' ? '#D4A853' : '#7C6FE0'
                      }}
                    />
                    <span className="font-body text-xs uppercase tracking-wider text-frost/60">
                      {project.type === 'treasure' ? 'Web Design' : 'Full Stack'}
                    </span>
                  </div>

                  <h3 className="font-heading text-2xl font-semibold text-frost transition-colors duration-300 group-hover:text-amber">
                    {project.title}
                  </h3>

                  <p className="mt-3 font-body text-sm leading-relaxed text-frost/75">
                    {project.description}
                  </p>

                  <p className="mt-4 font-body text-xs italic text-amber/80">
                    {project.tagline}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.tech.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-frost/15 px-3 py-1 font-body text-xs text-frost/75"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 flex flex-wrap items-center gap-4">
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 font-body text-sm text-amber transition-all duration-300 hover:text-amber/80 focus:outline-none focus:ring-2 focus:ring-amber rounded"
                        aria-label={`View ${project.title} on GitHub`}
                      >
                        <GithubLogo size={16} weight="fill" aria-hidden="true" />
                        View on GitHub
                        <ArrowSquareOut size={14} aria-hidden="true" />
                      </a>
                    )}
                    {project.demo && (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 font-body text-sm text-frost/70 transition-all duration-300 hover:text-frost focus:outline-none focus:ring-2 focus:ring-amber rounded"
                        aria-label={`View ${project.title} live demo`}
                      >
                        Live Demo
                        <ArrowSquareOut size={14} aria-hidden="true" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
