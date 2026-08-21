import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { personalData } from '../../data/content';

export default function Contact() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const cardsRef = useRef([]);
  const formRef = useRef(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: titleRef.current,
        start: 'top 85%',
        onEnter: () => {
          gsap.fromTo(
            titleRef.current,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
          );
        },
        once: true
      });

      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        ScrollTrigger.create({
          trigger: card,
          start: 'top 85%',
          onEnter: () => {
            gsap.fromTo(
              card,
              { opacity: 0, y: 25 },
              { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: i * 0.15 }
            );
          },
          once: true
        });
      });

      if (formRef.current) {
        ScrollTrigger.create({
          trigger: formRef.current,
          start: 'top 85%',
          onEnter: () => {
            gsap.fromTo(
              formRef.current,
              { opacity: 0, y: 30 },
              { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: 0.3 }
            );
          },
          once: true
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  const contactItems = [
    {
      title: 'Email',
      value: personalData.contact?.email || 'aman.kumar.dev@example.com',
      icon: (
        <svg className="h-5 w-5 text-amber" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 002-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      link: `mailto:${personalData.contact?.email}`
    },
    {
      title: 'Location',
      value: personalData.contact?.location || 'Punjab, India',
      icon: (
        <svg className="h-5 w-5 text-amber" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      link: null
    },
    {
      title: 'LinkedIn',
      value: 'Aman Kumar',
      icon: (
        <svg className="h-5 w-5 text-amber" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      ),
      link: personalData.linkedin
    }
  ];

  return (
    <section
      ref={sectionRef}
      data-section="contact"
      className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-24"
    >
      <div className="mx-auto w-full max-w-4xl">
        <div ref={titleRef} className="mb-16 text-center">
          <h2 className="font-heading text-3xl font-semibold text-frost md:text-4xl">
            Get in <span className="text-amber">Touch</span>
          </h2>
          <div className="mx-auto mt-2 h-1 w-16 bg-amber/60" />
          <p className="mt-4 font-body text-sm text-frost/60 max-w-lg mx-auto leading-relaxed">
            Have a project in mind, an opportunity to discuss, or just want to connect? Send a message below.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 mb-12">
          {contactItems.map((item, i) => (
            <div
              key={item.title}
              ref={(el) => (cardsRef.current[i] = el)}
              className="flex flex-col items-center justify-center p-6 rounded-2xl border border-amber/20 bg-evergreen/40 backdrop-blur-md transition-all duration-300 hover:border-amber/50 hover:bg-evergreen/60 text-center group"
            >
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-amber/30 bg-dark/60 group-hover:scale-110 transition-transform duration-300">
                {item.icon}
              </div>
              <h3 className="font-heading text-base font-semibold text-frost mb-1">{item.title}</h3>
              {item.link ? (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-xs text-amber/80 hover:text-amber transition-colors duration-200 underline decoration-amber/30 underline-offset-4"
                >
                  {item.value}
                </a>
              ) : (
                <span className="font-body text-xs text-frost/60">{item.value}</span>
              )}
            </div>
          ))}
        </div>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="rounded-2xl border border-amber/20 bg-evergreen/40 backdrop-blur-md p-8 shadow-xl max-w-2xl mx-auto flex flex-col gap-6"
        >
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="block font-body text-xs uppercase tracking-wider text-amber mb-2">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                required
                placeholder="John Doe"
                className="w-full rounded-xl border border-amber/30 bg-dark/60 px-4 py-3 font-body text-sm text-frost placeholder:text-frost/30 focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber transition-all duration-200"
              />
            </div>
            <div>
              <label htmlFor="email" className="block font-body text-xs uppercase tracking-wider text-amber mb-2">
                Your Email
              </label>
              <input
                type="email"
                id="email"
                required
                placeholder="john@example.com"
                className="w-full rounded-xl border border-amber/30 bg-dark/60 px-4 py-3 font-body text-sm text-frost placeholder:text-frost/30 focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber transition-all duration-200"
              />
            </div>
          </div>

          <div>
            <label htmlFor="message" className="block font-body text-xs uppercase tracking-wider text-amber mb-2">
              Message
            </label>
            <textarea
              id="message"
              required
              rows={4}
              placeholder="Tell me about your project or inquiry..."
              className="w-full rounded-xl border border-amber/30 bg-dark/60 px-4 py-3 font-body text-sm text-frost placeholder:text-frost/30 focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber transition-all duration-200 resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl border border-amber/60 bg-amber/20 py-3.5 font-heading text-sm font-semibold uppercase tracking-widest text-amber transition-all duration-300 hover:bg-amber hover:text-dark focus:outline-none focus:ring-2 focus:ring-amber shadow-lg"
          >
            {submitted ? '✓ Message Sent!' : 'Send Message'}
          </button>
        </form>
      </div>
    </section>
  );
}
