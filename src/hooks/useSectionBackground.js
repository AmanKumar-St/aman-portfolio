import { useEffect } from 'react';
import { gsap } from 'gsap';

/**
 * Section background colors in order, matching [data-section] order in the DOM.
 * Index matches NAV_ITEMS order: hero, about, skills, projects, experience, contact.
 */
const SECTION_COLORS = [
  '#0A3625', // 0 - Hero (default dark evergreen)
  '#00A19B', // 1 - About (cyan / teal)
  '#F2EFE7', // 2 - Skills (cream / off-white)
  '#E4DDD3', // 3 - Projects (linen / sand)
  '#0A3625', // 4 - Experience (default dark evergreen)
  '#0A3625', // 5 - Certifications (dark evergreen)
  '#2E1F26', // 6 - Contact (deep plum / wine)
];

/**
 * Attaches an IntersectionObserver to every [data-section] element.
 * When a section crosses the 50% viewport threshold, GSAP smoothly tweens
 * the fixed background layer's background-color to that section's color.
 *
 * @param {React.RefObject<HTMLElement>} bgRef - ref to the fixed background div
 */
export function useSectionBackground(bgRef) {
  useEffect(() => {
    const sections = document.querySelectorAll('[data-section]');
    if (!bgRef.current || sections.length === 0) return;

    // Set initial color immediately (no tween on first load)
    gsap.set(bgRef.current, { backgroundColor: SECTION_COLORS[0] });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          // Find which section index this element corresponds to
          const idx = Array.from(sections).indexOf(entry.target);
          if (idx < 0 || idx >= SECTION_COLORS.length) return;

          gsap.to(bgRef.current, {
            backgroundColor: SECTION_COLORS[idx],
            duration: 0.9,
            ease: 'power2.inOut',
            overwrite: 'auto',
          });
        });
      },
      {
        // Fire when the section is >= 30% visible in the viewport
        threshold: 0.3,
      }
    );

    sections.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [bgRef]);
}
