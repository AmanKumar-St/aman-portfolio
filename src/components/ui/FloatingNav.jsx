import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Menu, X, ExternalLink } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Home', target: 'hero' },
  { label: 'About', target: 'about' },
  { label: 'Skills', target: 'skills' },
  { label: 'Projects', target: 'projects' },
  { label: 'Experience', target: 'experience' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: -8 },
  visible: { opacity: 1, y: 0 },
};

export default function FloatingNav({ section }) {
  const [open, setOpen] = useState(false);
  const activeIndex = Math.min(Math.max(section ?? 0, 0), NAV_ITEMS.length - 1);

  const goTo = (target) => {
    const el = document.querySelector(`[data-section="${target}"]`);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setOpen(false);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      {/* Desktop: Floating glass dock */}
      <nav className="fixed left-1/2 top-4 z-50 hidden -translate-x-1/2 md:block">
        <div className="flex items-center gap-1 rounded-2xl border border-amber/10 bg-dark/70 px-2 py-1.5 shadow-2xl shadow-amber/5 backdrop-blur-2xl">
          <a
            href="#hero"
            onClick={(e) => { e.preventDefault(); goTo('hero'); }}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber/10 text-sm font-bold text-amber transition-colors hover:bg-amber/20"
          >
            AK
          </a>

          <div className="flex items-center">
            {NAV_ITEMS.map((item, i) => (
              <button
                key={item.target}
                onClick={() => goTo(item.target)}
                className={`relative z-10 rounded-lg px-4 py-2 text-xs font-medium uppercase tracking-widest transition-colors duration-200 ${
                  i === activeIndex
                    ? 'text-dark'
                    : 'text-frost/50 hover:text-frost'
                }`}
              >
                {item.label}
                {i === activeIndex && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 -z-10 rounded-lg bg-amber"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 pl-2">
            <a
              href="#"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-frost/40 transition-colors hover:text-frost"
              aria-label="GitHub"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </nav>

      {/* Mobile: Hamburger button */}
      <div className="fixed right-4 top-4 z-50 md:hidden">
        <button
          type="button"
          aria-label="Toggle navigation menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-amber/10 bg-dark/70 backdrop-blur-2xl transition-colors hover:bg-dark/90"
        >
          {open ? (
            <X className="h-5 w-5 text-frost" />
          ) : (
            <Menu className="h-5 w-5 text-frost" />
          )}
        </button>
      </div>

      {/* Mobile: Glass drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.96 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed inset-x-4 top-20 z-40 rounded-2xl border border-amber/10 bg-dark/80 p-3 shadow-2xl shadow-amber/5 backdrop-blur-2xl md:hidden"
          >
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="flex flex-col gap-1"
            >
              {NAV_ITEMS.map((item, i) => (
                <motion.button
                  key={item.target}
                  variants={itemVariants}
                  onClick={() => goTo(item.target)}
                  className={`rounded-lg px-4 py-3 text-left text-sm font-medium uppercase tracking-widest transition-colors ${
                    i === activeIndex
                      ? 'bg-amber/20 text-amber'
                      : 'text-frost/50 hover:bg-white/5 hover:text-frost'
                  }`}
                >
                  {item.label}
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
