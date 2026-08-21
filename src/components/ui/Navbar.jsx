import { useEffect, useRef, useState } from 'react';
import { NAV_ITEMS } from '../../constants/nav';
import { triggerSectionTransition } from '../../utils/navigation';

const WHEEL_COOLDOWN = 120;

const clamp = (value, lo, hi) => Math.min(hi, Math.max(lo, value));

// Opacity for an item given its angular offset from the active (centered) slot.
const angleOpacity = (offsetRad, upFade, downFull, downFade) => {
  if (offsetRad < 0) return clamp(1 + offsetRad / upFade, 0, 1);
  return clamp(1 - (offsetRad - downFull) / downFade, 0, 1);
};

// Fixed geometry layout for radial nav
const CONFIG = {
  radius: 80,
  anchorAngle: 0, // degrees; 0 = east (right of the badge)
  badgeX: 24, // px, left
  badgeY: 24, // px, top
  upFade: 0.5,
  downFull: 0.3,
  downFade: 0.5,
  spacing: 60, // degrees between consecutive options (adjusted for 6 items)
  curvature: 1, // vertical radius / horizontal radius (1 = circle)
  optionOffset: [0, 0, 0, 0, 0, 0], // per-option angular nudge (degrees)
};

export default function Navbar({ section }) {
  const dialRef = useRef(null);
  const lastWheel = useRef(0);
  const sectionRef = useRef(section);
  useEffect(() => {
    sectionRef.current = section;
  }, [section]);

  const [cfg] = useState(CONFIG);
  const activeIndex = clamp(section ?? 0, 0, NAV_ITEMS.length - 1);

  const navigateTo = (idx) => {
    const targetItem = NAV_ITEMS[idx];
    if (!targetItem) return;
    triggerSectionTransition(targetItem.target, targetItem.label);
  };

  const goToSection = (dir) => {
    const current = clamp(sectionRef.current ?? 0, 0, NAV_ITEMS.length - 1);
    const next = clamp(current + dir, 0, NAV_ITEMS.length - 1);
    if (next === current) return false;
    navigateTo(next);
    return true;
  };

  useEffect(() => {
    const el = dialRef.current;
    if (!el) return;
    const onWheel = (e) => {
      const moved = goToSection(e.deltaY > 0 ? 1 : -1);
      if (!moved) return;
      e.preventDefault();
      const now = performance.now();
      if (now - lastWheel.current < WHEEL_COOLDOWN) return;
      lastWheel.current = now;
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      goToSection(1);
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      goToSection(-1);
    }
  };

  const center = { x: cfg.badgeX + 24, y: cfg.badgeY + 24 };
  const anchorRad = (cfg.anchorAngle * Math.PI) / 180;
  const stepRad = (cfg.spacing * Math.PI) / 180;
  const rx = cfg.radius;
  const ry = cfg.radius * cfg.curvature;

  return (
    <nav aria-label="Section navigation">
      {/* Static profile logo */}
      <div
        className="fixed z-50 flex h-12 w-12 items-center justify-center rounded-full border border-amber/40 bg-evergreen/40 font-heading text-lg font-semibold text-amber backdrop-blur-md shadow-lg"
        style={{ left: cfg.badgeX, top: cfg.badgeY }}
      >
        AK
      </div>

      {/* Radial nav layer */}
      <div
        ref={dialRef}
        className="fixed inset-0 z-30 pointer-events-none"
        onKeyDown={handleKeyDown}
      >
        {NAV_ITEMS.map((item, i) => {
          const offset =
            (i - activeIndex) * stepRad +
            anchorRad +
            ((cfg.optionOffset[i] || 0) * Math.PI) / 180;
          const x = center.x + rx * Math.cos(offset);
          const y = center.y + ry * Math.sin(offset);
          const isActive = i === activeIndex;
          const opacity = angleOpacity(offset, cfg.upFade, cfg.downFull, cfg.downFade);
          const slideX = center.x - x;
          const slideY = center.y - y;

          return (
            <button
              key={item.target}
              type="button"
              role="menuitem"
              aria-label={`${item.label} section`}
              aria-current={isActive ? 'true' : undefined}
              tabIndex={0}
              onClick={() => navigateTo(i)}
              className="radial-nav-item pointer-events-auto absolute left-0 top-0 flex flex-col items-center justify-center focus:outline-none cursor-pointer"
              style={{
                width: 84,
                transform: `translate(${x}px, ${y}px) translate(-50%, -50%)`,
                opacity,
              }}
            >
              <span
                className="nav-enter flex flex-col items-center justify-center"
                style={{
                  '--sx': `${slideX}px`,
                  '--sy': `${slideY}px`,
                  animationDelay: `${i * 60}ms`,
                }}
              >
                <span className="h-px w-7 bg-amber/40" />
                <span
                  className={`my-1 font-body text-xs uppercase tracking-widest transition-all duration-300 ${
                    isActive ? 'scale-110 text-amber nav-glow' : 'text-frost/40 hover:text-amber'
                  }`}
                >
                  {item.label}
                </span>
                <span className="h-px w-7 bg-amber/40" />
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
