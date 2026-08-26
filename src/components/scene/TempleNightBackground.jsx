import { useEffect, useRef, useState } from 'react';
import { createTempleNightRenderer } from './templeNightRenderer.js';
import './temple-night.css';

export default function TempleNightBackground({ scrollProgress = 0, section = 0, className = '' }) {
  const hostRef = useRef(null);
  const canvasRef = useRef(null);
  const rendererRef = useRef(null);
  const [state, setState] = useState('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;

    let renderer;
    try {
      renderer = createTempleNightRenderer(canvas);
      rendererRef.current = renderer;
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unknown renderer error');
      setState('unavailable');
      return;
    }
    if (!renderer) {
      setState('unavailable');
      return;
    }

    let frame = 0;
    let visible = true;
    let disposed = false;
    let rendered = false;

    const schedule = () => {
      if (!disposed && visible && !document.hidden && !frame) {
        frame = requestAnimationFrame(render);
      }
    };

    const render = (time) => {
      frame = 0;
      renderer.render(time);
      if (!rendered) {
        rendered = true;
        setState('ready');
      }
      if (!renderer.reducedMotion) schedule();
    };

    const resize = () => {
      renderer.resize();
      schedule();
    };

    const setPointer = (event) => {
      const bounds = canvas.getBoundingClientRect();
      const x = ((event.clientX - bounds.left) / Math.max(1, bounds.width)) * 2 - 1;
      const y = 1 - ((event.clientY - bounds.top) / Math.max(1, bounds.height)) * 2;
      renderer.setPointer(x, y, true);
      schedule();
    };

    const clearPointer = () => {
      renderer.setPointer(0, 0, false);
      schedule();
    };

    const onVisibility = () => {
      if (document.hidden && frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      } else {
        schedule();
      }
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true;
      if (!visible && frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      } else {
        schedule();
      }
    });
    intersectionObserver.observe(host);

    window.addEventListener('pointermove', setPointer, { passive: true });
    window.addEventListener('blur', clearPointer);
    document.addEventListener('visibilitychange', onVisibility);
    resize();

    return () => {
      disposed = true;
      if (frame) cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener('pointermove', setPointer);
      window.removeEventListener('blur', clearPointer);
      document.removeEventListener('visibilitychange', onVisibility);
      renderer.dispose();
      rendererRef.current = null;
    };
  }, []);

  // Sync scroll progress and section with camera positioning
  useEffect(() => {
    if (rendererRef.current && rendererRef.current.setScrollProgress) {
      rendererRef.current.setScrollProgress(scrollProgress, 5);
    }
  }, [scrollProgress, section]);

  return (
    <div className={`temple-night-scene fixed inset-0 z-0 ${className}`} ref={hostRef} data-state={state}>
      <canvas
        ref={canvasRef}
        className={`temple-night-canvas${state === 'ready' ? ' is-ready' : ''}`}
        aria-label="Interactive Kage mountain temple world after dark"
      />
      {state === 'unavailable' && (
        <p className="temple-night-unavailable" role="status">
          WebGL is unavailable: {errorMessage || 'unsupported context'}.
        </p>
      )}
    </div>
  );
}
