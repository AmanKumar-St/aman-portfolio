import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { personalData } from '../../data/content';

export default function Experience() {
  const sectionRef = useRef(null);
  const itemsRef = useRef([]);
  const lineRef = useRef(null);

  useEffect(() => {
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
  }, []);

  return (
    <section
      ref={sectionRef}
      data-section="experience"
      className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-24"
    >
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-16 text-center">
          <h2 className="font-heading text-3xl font-semibold text-frost md:text-4xl">
            My <span className="text-amber">Journey</span>
          </h2>
          <div className="mx-auto mt-2 h-1 w-16 bg-amber/60" />
        </div>

        <div className="relative">
          <div
            ref={lineRef}
            className="absolute left-4 top-0 h-full w-px scale-y-0 bg-gradient-to-b from-amber/40 via-moss/40 to-transparent md:left-1/2 md:-translate-x-px"
          />

          <div className="space-y-16">
            {personalData.experience.map((exp, i) => {
              const isLeft = i % 2 === 0;
              return (
                <div
                  key={i}
                  ref={(el) => (itemsRef.current[i] = el)}
                  className="relative flex items-start opacity-0"
                  style={{ transform: `translateX(${isLeft ? '-20px' : '20px'})` }}
                >
                  <div
                    className={`flex w-full flex-col gap-2 ${
                      isLeft ? 'md:pr-12 md:text-right' : 'md:pl-12'
                    } md:w-1/2`}
                    style={{
                      marginLeft: isLeft ? '2rem' : 'auto',
                      paddingLeft: isLeft ? '0' : '2rem'
                    }}
                  >
                    <div className="absolute left-4 top-1 h-3 w-3 -translate-x-1.5 rounded-full border-2 border-amber bg-evergreen md:hidden" />
                    <span className="font-body text-xs uppercase tracking-wider text-amber/60">
                      {exp.role}
                    </span>
                    <h3 className="font-heading text-xl font-semibold text-frost">
                      {exp.company}
                    </h3>
                    {exp.description && (
                      <p className="font-body text-sm leading-relaxed text-frost/50">
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
