import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  EnvelopeSimple,
  MapPin,
  LinkedinLogo,
  CheckCircle,
  PaperPlaneTilt,
  User,
  ChatText,
} from '@phosphor-icons/react';
import { personalData } from '../../data/content';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export default function Contact() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const cardsRef = useRef([]);
  const formRef = useRef(null);
  const [submitted, setSubmitted] = useState(false);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced) return;

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
  }, [prefersReduced]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  const contactItems = [
    {
      title: 'Email',
      value: personalData.contact?.email,
      icon: <EnvelopeSimple size={22} weight="duotone" aria-hidden="true" className="text-amber" />,
      link: `mailto:${personalData.contact?.email}`
    },
    {
      title: 'Location',
      value: personalData.contact?.location,
      icon: <MapPin size={22} weight="duotone" aria-hidden="true" className="text-amber" />,
      link: null
    },
    {
      title: 'LinkedIn',
      value: 'Aman Kumar',
      icon: <LinkedinLogo size={22} weight="fill" aria-hidden="true" className="text-amber" />,
      link: personalData.linkedin
    }
  ];

  const titleInitial = prefersReduced ? {} : { opacity: 0 };
  const formInitial = prefersReduced ? {} : { opacity: 0 };

  return (
    <section
      ref={sectionRef}
      data-section="contact"
      className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-16 md:py-24"
    >
      <div className="mx-auto w-full max-w-4xl">
        <div ref={titleRef} className="mb-16 text-center" style={titleInitial}>
          <h2 className="font-heading text-3xl font-semibold text-frost md:text-4xl">
            Get in <span className="text-amber">Touch</span>
          </h2>
          <div className="mx-auto mt-2 h-1 w-16 bg-amber/60" />
          <p className="mt-4 font-body text-sm text-frost/75 max-w-lg mx-auto leading-relaxed">
            Have a project in mind, an opportunity to discuss, or just want to connect? Send a message below.
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-12">
          {contactItems.map((item, i) => (
            <div
              key={item.title}
              ref={(el) => (cardsRef.current[i] = el)}
              className="flex flex-col items-center justify-center p-6 rounded-2xl border border-amber/20 bg-evergreen/40 backdrop-blur-md transition-all duration-300 hover:border-amber/50 hover:bg-evergreen/60 text-center group"
              style={prefersReduced ? {} : { opacity: 0 }}
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
                  className="font-body text-xs text-amber/90 hover:text-amber transition-colors duration-200 underline decoration-amber/30 underline-offset-4 focus:outline-none focus:ring-2 focus:ring-amber rounded"
                >
                  {item.value}
                </a>
              ) : (
                <span className="font-body text-xs text-frost/75">{item.value}</span>
              )}
            </div>
          ))}
        </div>

        {/* Contact Form */}
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="rounded-2xl border border-amber/20 bg-evergreen/40 backdrop-blur-md p-8 shadow-xl max-w-2xl mx-auto flex flex-col gap-6"
          style={formInitial}
          noValidate
        >
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="contact-name" className="block font-body text-xs uppercase tracking-wider text-amber mb-2">
                <span className="flex items-center gap-1.5">
                  <User size={13} weight="bold" aria-hidden="true" />
                  Your Name
                </span>
              </label>
              <input
                type="text"
                id="contact-name"
                name="name"
                required
                autoComplete="name"
                placeholder="Enter Your Name"
                className="w-full rounded-xl border border-amber/30 bg-dark/60 px-4 py-3 font-body text-sm text-frost placeholder:text-frost/40 focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/50 transition-all duration-200"
              />
            </div>
            <div>
              <label htmlFor="contact-email" className="block font-body text-xs uppercase tracking-wider text-amber mb-2">
                <span className="flex items-center gap-1.5">
                  <EnvelopeSimple size={13} weight="bold" aria-hidden="true" />
                  Your Email
                </span>
              </label>
              <input
                type="email"
                id="contact-email"
                name="email"
                required
                autoComplete="email"
                placeholder="Enter Your Email"
                className="w-full rounded-xl border border-amber/30 bg-dark/60 px-4 py-3 font-body text-sm text-frost placeholder:text-frost/40 focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/50 transition-all duration-200"
              />
            </div>
          </div>

          <div>
            <label htmlFor="contact-message" className="block font-body text-xs uppercase tracking-wider text-amber mb-2">
              <span className="flex items-center gap-1.5">
                <ChatText size={13} weight="bold" aria-hidden="true" />
                Message
              </span>
            </label>
            <textarea
              id="contact-message"
              name="message"
              required
              rows={4}
              placeholder="Lets Connect..."
              className="w-full rounded-xl border border-amber/30 bg-dark/60 px-4 py-3 font-body text-sm text-frost placeholder:text-frost/40 focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/50 transition-all duration-200 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitted}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-amber/60 bg-amber/20 py-3.5 font-heading text-sm font-semibold uppercase tracking-widest text-amber transition-all duration-300 hover:bg-amber hover:text-dark focus:outline-none focus:ring-2 focus:ring-amber shadow-lg disabled:opacity-80 disabled:cursor-not-allowed"
          >
            {submitted ? (
              <>
                <CheckCircle size={18} weight="fill" aria-hidden="true" />
                Message Sent!
              </>
            ) : (
              <>
                <PaperPlaneTilt size={18} weight="fill" aria-hidden="true" />
                Send Message
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  );
}
