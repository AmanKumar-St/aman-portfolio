import { useState, useRef, useCallback } from 'react';
import { CaretLeft, CaretRight, FilePdf, ArrowSquareOut, CheckCircle } from '@phosphor-icons/react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export default function CertificationSlider({ items = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const prefersReduced = useReducedMotion();
  const count = items.length;

  // Pointer drag state
  const dragRef = useRef({
    isDragging: false,
    startX: 0,
    currentX: 0,
  });

  const nextSlide = useCallback(() => {
    if (count <= 1) return;
    setActiveIndex((prev) => (prev + 1) % count);
  }, [count]);

  const prevSlide = useCallback(() => {
    if (count <= 1) return;
    setActiveIndex((prev) => (prev - 1 + count) % count);
  }, [count]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextSlide();
      }
    },
    [nextSlide, prevSlide]
  );

  // Pointer Event Handlers (shared mouse & touch)
  const handlePointerDown = (e) => {
    if (count <= 1) return;
    dragRef.current = {
      isDragging: true,
      startX: e.clientX,
      currentX: e.clientX,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!dragRef.current.isDragging) return;
    dragRef.current.currentX = e.clientX;
  };

  const handlePointerUp = (e) => {
    if (!dragRef.current.isDragging) return;
    const deltaX = dragRef.current.currentX - dragRef.current.startX;
    dragRef.current.isDragging = false;

    // Threshold of 40px for swipe gesture
    if (deltaX < -40) {
      nextSlide();
    } else if (deltaX > 40) {
      prevSlide();
    }

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Ignore if pointer capture already released
    }
  };

  const handlePointerCancel = (e) => {
    dragRef.current.isDragging = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Ignore
    }
  };

  if (!items || items.length === 0) {
    return null;
  }

  const activeCert = items[activeIndex];

  return (
    <div
      className="relative w-full max-w-5xl mx-auto focus:outline-none select-none"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label="Certifications Slider"
      role="region"
    >
      {/* Main 3D / Horizontal Carousel Stage */}
      <div
        className="relative flex items-center justify-center min-h-[320px] sm:min-h-[400px] md:min-h-[440px] px-2 py-6 overflow-hidden cursor-grab active:cursor-grabbing"
        style={{ touchAction: 'pan-y' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
      >
        {items.map((cert, index) => {
          // Calculate shortest cyclic distance from active index for dynamic infinite carousel layout
          let diff = index - activeIndex;
          if (diff > count / 2) diff -= count;
          if (diff < -count / 2) diff += count;

          const isActive = diff === 0;
          const isPrev = diff === -1 || (count === 2 && index !== activeIndex && activeIndex === 1);
          const isNext = diff === 1 || (count === 2 && index !== activeIndex && activeIndex === 0);
          const isVisible = isActive || isPrev || isNext;

          if (!isVisible) return null;

          // Compute responsive 3D transforms for center-focused layout
          let translateX = '0%';
          let scale = 1;
          let opacity = 1;
          let zIndex = 20;
          let rotateY = 0;

          if (!isActive) {
            scale = 0.78;
            opacity = 0.45;
            zIndex = 5;
            if (isPrev) {
              translateX = '-65%';
              rotateY = 15;
            } else if (isNext) {
              translateX = '65%';
              rotateY = -15;
            }
          }

          // Reduced motion overrides
          const cardStyle = prefersReduced
            ? {
                display: isActive ? 'block' : 'none',
                opacity: 1,
              }
            : {
                transform: `translateX(${translateX}) scale(${scale}) perspective(1000px) rotateY(${rotateY}deg)`,
                opacity,
                zIndex,
                transition: 'all 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
              };

          return (
            <div
              key={cert.id || index}
              onClick={() => {
                if (!isActive) setActiveIndex(index);
              }}
              style={cardStyle}
              className={`absolute top-4 w-[85%] sm:w-[70%] md:w-[60%] max-w-[540px] rounded-2xl border transition-all ${
                isActive
                  ? 'border-amber/50 bg-dark/90 shadow-[0_12px_40px_rgba(212,168,83,0.18)]'
                  : 'border-frost/15 bg-evergreen/40 shadow-lg cursor-pointer hover:opacity-75'
              }`}
            >
              {/* Certificate Image Frame */}
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-black/40 p-2 sm:p-3">
                <img
                  src={cert.image}
                  alt={`${cert.name} certificate`}
                  className="h-full w-full object-contain rounded-lg shadow-inner pointer-events-none"
                  loading="lazy"
                />

                {isActive && (
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full border border-amber/40 bg-dark/85 px-3 py-1 text-xs font-medium text-amber backdrop-blur-md">
                    <CheckCircle size={14} weight="fill" className="text-amber" />
                    <span>Verified</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Certificate Details & Actions */}
      {activeCert && (
        <div className="mt-4 text-center px-4 max-w-2xl mx-auto space-y-4">
          <div className="space-y-1">
            <span className="font-body text-xs uppercase tracking-widest text-amber/90">
              {activeCert.issuer}
            </span>
            <h3 className="font-heading text-xl sm:text-2xl font-semibold text-frost leading-snug">
              {activeCert.name}
            </h3>
            {activeCert.issueDate && (
              <p className="font-mono text-xs text-moss">
                Issued: {activeCert.issueDate}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {activeCert.pdf && (
              <a
                href={activeCert.pdf}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-amber bg-amber/15 px-5 py-2.5 font-body text-sm font-medium text-amber transition-all duration-300 hover:bg-amber hover:text-dark focus:outline-none focus:ring-2 focus:ring-amber shadow-md"
                aria-label={`Open PDF certificate for ${activeCert.name}`}
              >
                <FilePdf size={18} weight="fill" />
                <span>View Certificate (PDF)</span>
                <ArrowSquareOut size={16} />
              </a>
            )}

            {activeCert.credentialUrl && (
              <a
                href={activeCert.credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-frost/20 bg-evergreen/30 px-4 py-2.5 font-body text-sm text-frost/80 transition-all duration-300 hover:border-frost/40 hover:text-frost focus:outline-none focus:ring-2 focus:ring-amber"
                aria-label={`Verify credential for ${activeCert.name}`}
              >
                <span>Verify Link</span>
                <ArrowSquareOut size={14} />
              </a>
            )}
          </div>
        </div>
      )}

      {/* Slider Controls & Progress Indicator */}
      {count > 1 && (
        <div className="mt-8 flex items-center justify-between px-4 sm:px-8 text-frost/70">
          {/* Slide Counter */}
          <div className="font-mono text-sm tracking-wider text-amber">
            {String(activeIndex + 1).padStart(2, '0')}{' '}
            <span className="text-frost/40">/</span>{' '}
            {String(count).padStart(2, '0')}
          </div>

          {/* Dot Navigation Indicators */}
          <div className="flex items-center gap-2">
            {items.map((item, idx) => (
              <button
                key={item.id || idx}
                onClick={() => setActiveIndex(idx)}
                className={`h-2.5 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber cursor-pointer ${
                  idx === activeIndex
                    ? 'w-8 bg-amber'
                    : 'w-2.5 bg-frost/20 hover:bg-frost/40'
                }`}
                aria-label={`Go to certificate ${idx + 1}: ${item.name}`}
              />
            ))}
          </div>

          {/* Prev / Next Arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={prevSlide}
              className="p-2 rounded-xl border border-frost/15 bg-evergreen/30 text-frost hover:text-amber hover:border-amber/40 transition-colors focus:outline-none focus:ring-2 focus:ring-amber cursor-pointer"
              aria-label="Previous certificate"
            >
              <CaretLeft size={20} weight="bold" />
            </button>
            <button
              onClick={nextSlide}
              className="p-2 rounded-xl border border-frost/15 bg-evergreen/30 text-frost hover:text-amber hover:border-amber/40 transition-colors focus:outline-none focus:ring-2 focus:ring-amber cursor-pointer"
              aria-label="Next certificate"
            >
              <CaretRight size={20} weight="bold" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
