import { useEffect, useRef, useState } from 'react';

const NAV_ITEMS = [
  { label: 'Home', target: 'hero' },
  { label: 'About', target: 'about' },
  { label: 'Skills', target: 'skills' },
  { label: 'Projects', target: 'projects' },
  { label: 'Experience', target: 'experience' },
];

export default function HamburgerNav({ section }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  const goTo = (target) => {
    const el = document.querySelector(`[data-section="${target}"]`);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setOpen(false);
  };

  // Close on outside click or Escape.
  useEffect(() => {
    if (!open) return;
    const onDocClick = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('click', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="fixed right-6 top-4 z-50">
      <button
        type="button"
        aria-label="Toggle navigation menu"
        aria-expanded={open}
        aria-controls="hamburger-panel"
        onClick={() => setOpen((o) => !o)}
        className="flex h-12 w-12 flex-col items-center justify-center gap-1.5 rounded-full border border-amber/40 bg-evergreen/40 backdrop-blur-md transition-colors duration-300 hover:bg-evergreen/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber"
      >
        <span
          className={`h-0.5 w-6 rounded-full bg-amber transition-transform duration-300 ${
            open ? 'translate-y-2 rotate-45' : ''
          }`}
        />
        <span
          className={`h-0.5 w-6 rounded-full bg-amber transition-opacity duration-300 ${
            open ? 'opacity-0' : 'opacity-100'
          }`}
        />
        <span
          className={`h-0.5 w-6 rounded-full bg-amber transition-transform duration-300 ${
            open ? '-translate-y-2 -rotate-45' : ''
          }`}
        />
      </button>

      <div
        id="hamburger-panel"
        role="menu"
        aria-hidden={!open}
        className={`absolute right-0 mt-3 w-52 origin-top-right rounded-xl border border-amber/20 bg-dark/70 p-2 shadow-xl backdrop-blur-md transition-all duration-300 ${
          open
            ? 'visible translate-y-0 opacity-100'
            : 'invisible -translate-y-2 opacity-0'
        }`}
      >
        {NAV_ITEMS.map((item, i) => (
          <button
            key={item.target}
            type="button"
            role="menuitem"
            aria-current={section === i ? 'true' : undefined}
            onClick={() => goTo(item.target)}
            className={`block w-full rounded-lg px-4 py-2 text-left font-body text-sm uppercase tracking-widest transition-colors duration-200 ${
              section === i
                ? 'text-amber bg-amber/10'
                : 'text-frost/70 hover:bg-amber/5 hover:text-frost'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
