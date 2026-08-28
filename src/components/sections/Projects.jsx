import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowSquareOut, GithubLogo, CaretLeft, CaretRight } from '@phosphor-icons/react';
import { personalData } from '../../data/content';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import MorphSlider from '../ui/MorphSlider';

gsap.registerPlugin(ScrollTrigger);

export default function Projects() {
  const sectionRef = useRef(null);
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const prefersReduced = useReducedMotion();

  const totalProjects = personalData.projects ? personalData.projects.length : 0;

  useEffect(() => {
    if (prefersReduced || totalProjects <= 1) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const track = trackRef.current;
        const viewport = viewportRef.current;
        if (!track || !viewport) return;

        const getScrollAmount = () => track.scrollWidth - viewport.clientWidth;

        const tween = gsap.to(track, {
          x: () => -getScrollAmount(),
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            pin: true,
            start: "top top",
            end: () => `+=${getScrollAmount()}`,
            scrub: 1,
            invalidateOnRefresh: true,
            snap: totalProjects > 1 ? {
              snapTo: 1 / (totalProjects - 1),
              duration: { min: 0.2, max: 0.5 },
              delay: 0.1,
              ease: "power1.inOut"
            } : false,
            onUpdate: (self) => {
              const idx = Math.round(self.progress * (totalProjects - 1));
              setActiveIndex(idx);
            }
          }
        });

        return () => {
          tween.kill();
        };
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReduced, totalProjects]);

  const handleMobileScroll = (e) => {
    if (window.innerWidth >= 768 || totalProjects <= 1) return;
    const target = e.currentTarget;
    const scrollPosition = target.scrollLeft;
    const slideWidth = target.clientWidth * 0.8;
    const newIndex = Math.min(
      Math.max(0, Math.round(scrollPosition / slideWidth)),
      totalProjects - 1
    );
    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex);
    }
  };

  const scrollToSlide = (index) => {
    if (index < 0 || index >= totalProjects) return;
    setActiveIndex(index);

    if (window.innerWidth >= 768 && !prefersReduced && totalProjects > 1) {
      const st = ScrollTrigger.getAll().find((s) => s.trigger === sectionRef.current);
      if (st) {
        const targetScroll = st.start + (index / (totalProjects - 1)) * (st.end - st.start);
        window.scrollTo({ top: targetScroll, behavior: 'smooth' });
      }
    } else if (trackRef.current) {
      const slide = trackRef.current.children[index];
      if (slide) {
        slide.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  };

  return (
    <section
      ref={sectionRef}
      data-section="projects"
      className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-16 md:py-24 overflow-hidden"
    >
      <div className="mx-auto w-full max-w-6xl">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="font-heading text-3xl font-semibold text-frost md:text-4xl">
            Featured <span className="text-amber">Projects</span>
          </h2>
          <div className="mx-auto mt-2 h-1 w-16 bg-amber/60" />
        </div>

        {/* Slider Viewport Container */}
        <div ref={viewportRef} className="relative w-full overflow-hidden">
          {/* Horizontal Track */}
          <div
            ref={trackRef}
            onScroll={handleMobileScroll}
            className={`flex gap-6 py-4 px-4 sm:px-6 overflow-x-auto snap-x snap-mandatory scrollbar-none md:overflow-visible md:px-0 md:py-8 ${
              prefersReduced || totalProjects <= 1 ? 'md:grid md:grid-cols-2 md:gap-8' : 'md:flex-nowrap'
            }`}
          >
            {personalData.projects.map((project, i) => {
              const sliderItems = project.images || [
                { image: project.image || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1600&auto=format&fit=crop', caption: project.title }
              ];

              return (
                <div
                  key={project.title || i}
                  className={`w-[85vw] max-w-[340px] sm:w-[450px] flex-shrink-0 snap-center ${
                    prefersReduced || totalProjects <= 1
                      ? 'md:w-full md:max-w-none md:flex-shrink'
                      : 'md:w-[650px] lg:w-[720px]'
                  }`}
                >
                  <div className="group relative h-full overflow-hidden rounded-2xl border border-frost/10 bg-evergreen/20 p-6 sm:p-8 backdrop-blur-sm transition-all duration-300 hover:border-amber/30 flex flex-col justify-between">
                    {/* Glow */}
                    <div className="project-glow pointer-events-none absolute -inset-1 opacity-20 transition-opacity duration-500 group-hover:opacity-40">
                      <div
                        className="h-full w-full rounded-2xl blur-xl"
                        style={{
                          background:
                            project.type === 'treasure'
                              ? 'radial-gradient(ellipse at center, rgba(212,168,83,0.2), transparent)'
                              : 'radial-gradient(ellipse at center, rgba(124,111,224,0.2), transparent)'
                        }}
                      />
                    </div>

                    <div className="relative">
                      {/* Embedded WebGL MorphSlider for each project */}
                      <div className="relative w-full h-[240px] sm:h-[300px] mb-6 rounded-xl overflow-hidden border border-frost/15 shadow-lg">
                        <MorphSlider
                          items={sliderItems}
                          transition="melt"
                          intensity={0.55}
                          aberration={0.35}
                          drift={0.4}
                          autoplay={true}
                          autoplayDelay={4}
                          showCaptions={true}
                          showControls={true}
                          showIndicators={true}
                          radius={12}
                          className="w-full h-full"
                        />
                      </div>

                      <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
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
                        <span className="font-mono text-xs text-moss/60 md:hidden">
                          {String(i + 1).padStart(2, '0')} / {String(totalProjects).padStart(2, '0')}
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
                    </div>

                    <div className="relative mt-6 pt-4 border-t border-frost/10">
                      <div className="mb-5 flex flex-wrap gap-2">
                        {project.tech.map((t) => (
                          <span
                            key={t}
                            className="rounded-full border border-frost/15 px-3 py-1 font-body text-xs text-frost/75"
                          >
                            {t}
                          </span>
                        ))}
                      </div>

                      <div className="flex flex-wrap items-center gap-4">
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
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation / Progress Indicator */}
        {totalProjects > 1 && (
          <div className="mt-8 flex items-center justify-between px-2 text-frost/60">
            {/* Counter */}
            <div className="font-mono text-sm tracking-wider text-amber">
              {String(activeIndex + 1).padStart(2, '0')}{' '}
              <span className="text-frost/40">/</span>{' '}
              {String(totalProjects).padStart(2, '0')}
            </div>

            {/* Dots Navigation */}
            <div className="flex items-center gap-2">
              {personalData.projects.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => scrollToSlide(idx)}
                  className={`h-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber ${
                    idx === activeIndex
                      ? 'w-8 bg-amber'
                      : 'w-2 bg-frost/20 hover:bg-frost/40'
                  }`}
                  aria-label={`Go to project slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Prev / Next Arrows */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => scrollToSlide(activeIndex - 1)}
                disabled={activeIndex === 0}
                className="p-1.5 rounded-lg border border-frost/15 text-frost/80 hover:text-amber hover:border-amber/40 disabled:opacity-30 disabled:hover:text-frost/80 disabled:hover:border-frost/15 transition-colors focus:outline-none focus:ring-2 focus:ring-amber"
                aria-label="Previous project"
              >
                <CaretLeft size={18} />
              </button>
              <button
                onClick={() => scrollToSlide(activeIndex + 1)}
                disabled={activeIndex === totalProjects - 1}
                className="p-1.5 rounded-lg border border-frost/15 text-frost/80 hover:text-amber hover:border-amber/40 disabled:opacity-30 disabled:hover:text-frost/80 disabled:hover:border-frost/15 transition-colors focus:outline-none focus:ring-2 focus:ring-amber"
                aria-label="Next project"
              >
                <CaretRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
