import { useEffect, useState } from 'react';
import { NAV_ITEMS } from '@/constants/nav';

export default function ProfileLogo({ section }) {
  const [animatedSection, setAnimatedSection] = useState(section);
  const [animationState, setAnimationState] = useState('enter'); // 'enter' or 'exit'

  useEffect(() => {
    if (section !== animatedSection) {
      // Trigger exit animation
      setAnimationState('exit');

      // After exit animation completes, update section and trigger enter
      const timeout = setTimeout(() => {
        setAnimatedSection(section);
        setAnimationState('enter');
      }, 400); // Match CSS animation duration

      return () => clearTimeout(timeout);
    }
  }, [section, animatedSection]);

  return (
    <nav aria-label="Section navigation">
      {/* Static profile logo (the arc is anchored on it). Always visible. */}
      <div
        className="fixed z-50 flex h-12 w-12 items-center justify-center rounded-full border border-amber/40 bg-evergreen/40 font-heading text-lg font-semibold text-amber backdrop-blur-md shadow-lg"
        style={{ left: 24, top: 24 }}
      >
        AK
      </div>

      {/* Animated section label */}
      <div
        className={`fixed z-50 flex h-12 items-center justify-center left-14 top-64 ${
          animationState === 'exit' ? 'section-label-exit' : 'section-label-enter'
        }`}
      >
        {NAV_ITEMS[animatedSection]?.label}
      </div>
    </nav>
  );
}