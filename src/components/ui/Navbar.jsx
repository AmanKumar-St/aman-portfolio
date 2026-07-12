import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const navItems = ['Home', 'About', 'Skills', 'Projects', 'Experience'];

export default function Navbar({ section }) {
  const navRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(navRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.5 }
      );
    });

    return () => ctx.revert();
  }, []);

  const handleClick = (e, index) => {
    e.preventDefault();
    const sections = document.querySelectorAll('[data-section]');
    if (sections[index]) {
      sections[index].scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
  };

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-md bg-gradient-to-b from-dark/80 to-transparent"
    >
      <span className="font-heading text-lg font-semibold text-frost">
        AK<span className="text-amber">.</span>
      </span>

      <div className="hidden items-center gap-6 md:flex">
        {navItems.map((item, i) => (
          <button
            key={item}
            onClick={(e) => handleClick(e, i)}
            aria-current={section === i ? 'true' : undefined}
            className={`font-body text-xs uppercase tracking-widest transition-all duration-300 ${
              section === i
                ? 'text-amber'
                : 'text-frost/40 hover:text-frost/70'
            }`}
          >
            {item}
          </button>
        ))}
      </div>
    </nav>
  );
}
