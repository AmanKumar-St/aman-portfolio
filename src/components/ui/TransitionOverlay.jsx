import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import * as THREE from 'three';

// Vertex & Fragment Shaders for Transition #2 (WebGL Value Noise Dissolve)
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  uniform float uProgress;
  uniform vec3 uColor;

  float rand(vec2 n) {
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
  }

  float noise(vec2 p){
    vec2 ip = floor(p);
    vec2 u = fract(p);
    u = u * u * (3.0 - 2.0 * u);
    float res = mix(
      mix(rand(ip), rand(ip + vec2(1.0, 0.0)), u.x),
      mix(rand(ip + vec2(0.0, 1.0)), rand(ip + vec2(1.0, 1.0)), u.x),
      u.y
    );
    return res * res;
  }

  void main(){
    float n = noise(vUv * 5.0);
    float edge = 0.185;
    float dissolve = smoothstep(1.0 - uProgress - edge, 1.0 - uProgress + edge, n);
    float alpha = 1.0 - dissolve;
    gl_FragColor = vec4(uColor, alpha);
  }
`;

export default function TransitionOverlay() {
  const isTransitioningRef = useRef(false);

  // References for Transition Elements
  const containerRef = useRef(null);

  // Transition #2 (WebGL Noise)
  const webglCanvasRef = useRef(null);
  const webglSceneRef = useRef(null);

  // Transition #3 (SVG Morph)
  const svgMorphContainerRef = useRef(null);
  const svgMorphPathRef = useRef(null);

  // Transition #4 (Bloom Title Overlay)
  const titleOverlayRef = useRef(null);
  const titleTextRef = useRef(null);
  const [destinationTitle, setDestinationTitle] = useState('');

  // Transition #5 (Draw SVG Spiral)
  const svgDrawContainerRef = useRef(null);
  const svgDrawPathRef = useRef(null);

  // Transition #6 (Dual Curtain Lift)
  const curtainOverlayRef = useRef(null);

  useEffect(() => {
    // Initialize WebGL Scene for Transition #2
    if (webglCanvasRef.current) {
      const canvas = webglCanvasRef.current;
      const width = window.innerWidth;
      const height = window.innerHeight;

      const scene = new THREE.Scene();
      const cameraZ = 100;
      const fov = 2 * Math.atan(height / 2 / cameraZ) * (180 / Math.PI);
      const camera = new THREE.PerspectiveCamera(fov, width / height, 0.1, 1000);
      camera.position.z = cameraZ;

      const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      const geometry = new THREE.PlaneGeometry(width, height);
      const material = new THREE.ShaderMaterial({
        uniforms: {
          uColor: { value: new THREE.Vector3(0.04, 0.21, 0.15) }, // evergreen/dark color
          uProgress: { value: 1.5 }
        },
        vertexShader,
        fragmentShader,
        transparent: true
      });

      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      webglSceneRef.current = { scene, camera, renderer, material, mesh };

      const handleResize = () => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        camera.aspect = w / h;
        camera.fov = 2 * Math.atan(h / 2 / cameraZ) * (180 / Math.PI);
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
        mesh.scale.set(1, 1, 1);
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        geometry.dispose();
        material.dispose();
        renderer.dispose();
      };
    }
  }, []);

  useEffect(() => {
    const handleTransitionEvent = (e) => {
      const { target, label } = e.detail || {};
      if (!target || isTransitioningRef.current) return;
      executeSectionTransition(target, label || target);
    };

    window.addEventListener('trigger-section-transition', handleTransitionEvent);
    return () => window.removeEventListener('trigger-section-transition', handleTransitionEvent);
  }, []);

  const scrollToSection = (target) => {
    const el = document.querySelector(`[data-section="${target}"]`);
    if (el) {
      el.scrollIntoView({ behavior: 'auto' });
    }
  };

  const executeSectionTransition = (target, label) => {
    isTransitioningRef.current = true;

    // Route Target Mapping to Transition Index:
    // 'hero' / 'home' -> 1 (Scale & Clip Inset Wipe)
    // 'about'         -> 2 (WebGL Value Noise Shader Dissolve)
    // 'skills'        -> 3 (GSAP SVG Bezier Curve Morph)
    // 'projects'      -> 4 (Dynamic Title Overlay & Polygon Clip)
    // 'experience'    -> 5 (GSAP Draw SVG Spiral & Stroke Inflation)
    // 'contact'       -> 6 (Dual Clip-Path & Curtain Lift Overlay)

    if (target === 'hero' || target === 'home') {
      runTransition1(target);
    } else if (target === 'about') {
      runTransition2(target);
    } else if (target === 'skills') {
      runTransition3(target);
    } else if (target === 'projects') {
      runTransition4(target, label);
    } else if (target === 'experience') {
      runTransition5(target);
    } else if (target === 'contact') {
      runTransition6(target);
    } else {
      runTransition4(target, label);
    }
  };

  // ==========================================
  // TRANSITION #1: Scale & Clip-Path Wipe (Home/Hero)
  // ==========================================
  const runTransition1 = (target) => {
    const targetEl = document.querySelector(`[data-section="${target}"]`);
    const activeSectionEl = document.querySelector('[data-section]:not([hidden])');

    const tl = gsap.timeline({
      onComplete: () => {
        if (targetEl) gsap.set(targetEl, { clearProps: 'all' });
        isTransitioningRef.current = false;
        tl.kill();
      }
    });

    if (activeSectionEl) {
      tl.to(activeSectionEl, {
        scale: 0.85,
        opacity: 0.5,
        duration: 0.5,
        ease: 'power3.inOut'
      });
    }

    tl.call(() => scrollToSection(target));

    if (targetEl) {
      gsap.set(targetEl, {
        clipPath: 'inset(100% 0 0 0)',
        scale: 0.95,
        opacity: 1
      });

      tl.to(targetEl, {
        clipPath: 'inset(0% 0 0 0)',
        duration: 0.7,
        ease: 'power3.inOut'
      });

      tl.to(targetEl, {
        scale: 1,
        duration: 0.4,
        ease: 'power2.out'
      });
    }
  };

  // ==========================================
  // TRANSITION #2: WebGL Value Noise Dissolve (About)
  // ==========================================
  const runTransition2 = (target) => {
    const webgl = webglSceneRef.current;
    if (!webgl) {
      scrollToSection(target);
      isTransitioningRef.current = false;
      return;
    }

    const canvas = webglCanvasRef.current;
    const { scene, camera, renderer, material } = webgl;

    const renderLoop = () => {
      renderer.render(scene, camera);
      if (isTransitioningRef.current) {
        requestAnimationFrame(renderLoop);
      }
    };

    gsap.set(canvas, {
      pointerEvents: 'auto',
      autoAlpha: 1,
      visibility: 'visible'
    });

    renderLoop();

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(canvas, {
          pointerEvents: 'none',
          autoAlpha: 0,
          visibility: 'hidden'
        });
        isTransitioningRef.current = false;
        tl.kill();
      }
    });

    // Animate uProgress down to -0.75 (dissolving shader in over the screen)
    tl.to(material.uniforms.uProgress, {
      value: -0.75,
      duration: 0.9,
      ease: 'power2.inOut'
    });

    tl.call(() => scrollToSection(target));

    // Animate uProgress back to 1.5 (dissolving shader out revealing new page)
    tl.to(material.uniforms.uProgress, {
      value: 1.5,
      duration: 0.9,
      ease: 'power2.inOut',
      delay: 0.1
    });
  };

  // ==========================================
  // TRANSITION #3: SVG Bezier Curve Morphing (Skills)
  // ==========================================
  const runTransition3 = (target) => {
    const container = svgMorphContainerRef.current;
    const path = svgMorphPathRef.current;
    if (!container || !path) {
      scrollToSection(target);
      isTransitioningRef.current = false;
      return;
    }

    gsap.set(container, {
      pointerEvents: 'auto',
      autoAlpha: 1,
      visibility: 'visible'
    });

    const startPath = 'M 0 100 V 100 Q 50 100 100 100 V 100 z';
    const curve1 = 'M 0 100 V 50 Q 50 0 100 50 V 100 z';
    const fullRect = 'M 0 100 V 0 Q 50 0 100 0 V 100 z';
    const curve2 = 'M 0 0 V 50 Q 50 0 100 50 V 0 z';
    const endPath = 'M 0 0 V 0 Q 50 0 100 0 V 0 z';

    gsap.set(path, { attr: { d: startPath } });

    const morphObj = { qy: 100, vy: 100 };

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(container, {
          pointerEvents: 'none',
          autoAlpha: 0,
          visibility: 'hidden'
        });
        gsap.set(path, { attr: { d: startPath } });
        isTransitioningRef.current = false;
        tl.kill();
      }
    });

    // Stage 1: Morph curve upward
    tl.to(morphObj, {
      qy: 0,
      vy: 50,
      duration: 0.45,
      ease: 'power2.in',
      onUpdate: () => {
        path.setAttribute('d', `M 0 100 V ${morphObj.vy} Q 50 ${morphObj.qy} 100 ${morphObj.vy} V 100 z`);
      }
    });

    // Stage 2: Fill screen
    tl.to(morphObj, {
      vy: 0,
      duration: 0.35,
      ease: 'power2.out',
      onUpdate: () => {
        path.setAttribute('d', `M 0 100 V ${morphObj.vy} Q 50 0 100 ${morphObj.vy} V 100 z`);
      }
    });

    tl.call(() => scrollToSection(target));

    // Stage 3: Reverse curve collapse to top
    tl.to(morphObj, {
      qy: 50,
      vy: 0,
      duration: 0.4,
      ease: 'power2.in',
      onUpdate: () => {
        path.setAttribute('d', `M 0 0 V ${morphObj.vy} Q 50 ${morphObj.qy} 100 ${morphObj.vy} V 0 z`);
      }
    });

    tl.to(morphObj, {
      qy: 0,
      vy: 0,
      duration: 0.35,
      ease: 'sine.out',
      onUpdate: () => {
        path.setAttribute('d', `M 0 0 V 0 Q 50 ${morphObj.qy} 100 0 V 0 z`);
      }
    });
  };

  // ==========================================
  // TRANSITION #4: Dynamic Title Overlay & Polygon Clip (Projects)
  // ==========================================
  const runTransition4 = (target, label) => {
    const overlay = titleOverlayRef.current;
    const titleEl = titleTextRef.current;
    if (!overlay || !titleEl) {
      scrollToSection(target);
      isTransitioningRef.current = false;
      return;
    }

    setDestinationTitle(label || target);

    const titleBounds = titleEl.getBoundingClientRect();
    const halfHeightTitle = (titleBounds.height || 60) / 2;
    const halfHeightViewport = window.innerHeight / 2;
    const verticalClipPercent = Math.min(30, Math.max(10, (halfHeightTitle / halfHeightViewport) * 50));

    const topBound = 50 - verticalClipPercent;
    const bottomBound = 50 + verticalClipPercent;

    const initialClip = `polygon(0% ${topBound}%, 0% ${topBound}%, 0% ${bottomBound}%, 0% ${bottomBound}%)`;
    const horizontalExpandClip = `polygon(0% ${topBound}%, 100% ${topBound}%, 100% ${bottomBound}%, 0% ${bottomBound}%)`;
    const fullScreenClip = `polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)`;
    const retractClip = `polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)`;

    gsap.set(overlay, {
      pointerEvents: 'auto',
      autoAlpha: 1,
      visibility: 'visible',
      clipPath: initialClip,
      webkitClipPath: initialClip
    });

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(overlay, {
          pointerEvents: 'none',
          autoAlpha: 0,
          visibility: 'hidden'
        });
        isTransitioningRef.current = false;
        tl.kill();
      }
    });

    tl.to(overlay, {
      clipPath: horizontalExpandClip,
      webkitClipPath: horizontalExpandClip,
      duration: 0.45,
      ease: 'expo.inOut'
    });

    tl.to(overlay, {
      clipPath: fullScreenClip,
      webkitClipPath: fullScreenClip,
      duration: 0.45,
      ease: 'expo.inOut'
    });

    tl.call(() => scrollToSection(target));

    tl.to(
      overlay,
      {
        clipPath: retractClip,
        webkitClipPath: retractClip,
        duration: 0.55,
        ease: 'power4.inOut'
      },
      '+=0.15'
    );
  };

  // ==========================================
  // TRANSITION #5: GSAP Draw SVG Spiral & Stroke Inflation (Experience)
  // ==========================================
  const runTransition5 = (target) => {
    const container = svgDrawContainerRef.current;
    const path = svgDrawPathRef.current;
    if (!container || !path) {
      scrollToSection(target);
      isTransitioningRef.current = false;
      return;
    }

    const totalLength = path.getTotalLength ? path.getTotalLength() : 4000;

    gsap.set(container, {
      pointerEvents: 'auto',
      autoAlpha: 1,
      visibility: 'visible'
    });

    gsap.set(path, {
      strokeDasharray: totalLength,
      strokeDashoffset: totalLength,
      strokeWidth: 100,
      opacity: 0
    });

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(container, {
          pointerEvents: 'none',
          autoAlpha: 0,
          visibility: 'hidden'
        });
        isTransitioningRef.current = false;
        tl.kill();
      }
    });

    tl.to(path, { opacity: 1, duration: 0.3 });

    // Draw spiral stroke 0% -> 100% while inflating stroke-width 100 -> 400
    tl.to(
      path,
      {
        strokeDashoffset: 0,
        duration: 0.9,
        ease: 'sine.inOut'
      },
      '<'
    );

    tl.to(
      path,
      {
        strokeWidth: 450,
        duration: 0.8,
        ease: 'sine.inOut'
      },
      '<+=0.15'
    );

    tl.call(() => scrollToSection(target));

    // Deflate stroke-width and erase stroke 100% -> 0%
    tl.to(path, {
      strokeWidth: 100,
      duration: 0.5,
      ease: 'sine.inOut'
    });

    tl.to(
      path,
      {
        strokeDashoffset: -totalLength,
        duration: 0.65,
        ease: 'sine.inOut'
      },
      '<+=0.1'
    );
  };

  // ==========================================
  // TRANSITION #6: Dual Clip-Path & Curtain Lift Overlay (Contact)
  // ==========================================
  const runTransition6 = (target) => {
    const curtain = curtainOverlayRef.current;
    const targetEl = document.querySelector(`[data-section="${target}"]`);

    if (!curtain) {
      scrollToSection(target);
      isTransitioningRef.current = false;
      return;
    }

    gsap.set(curtain, {
      pointerEvents: 'auto',
      autoAlpha: 1,
      visibility: 'visible',
      clipPath: 'inset(0 0 0% 0)'
    });

    if (targetEl) {
      gsap.set(targetEl, {
        clipPath: 'polygon(15% 75%, 85% 75%, 85% 75%, 15% 75%)'
      });
    }

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(curtain, {
          pointerEvents: 'none',
          autoAlpha: 0,
          visibility: 'hidden'
        });
        if (targetEl) gsap.set(targetEl, { clearProps: 'clipPath' });
        isTransitioningRef.current = false;
        tl.kill();
      }
    });

    tl.call(() => scrollToSection(target));

    // Lift curtain overlay up while expanding target section box outward
    tl.to(curtain, {
      clipPath: 'inset(0 0 100% 0)',
      duration: 0.95,
      ease: 'power4.inOut'
    });

    if (targetEl) {
      tl.to(
        targetEl,
        {
          clipPath: 'polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)',
          duration: 0.95,
          ease: 'power4.inOut'
        },
        '<'
      );
    }
  };

  return (
    <div ref={containerRef} className="transition-system-root">
      {/* TRANSITION #2: WebGL Canvas Overlay (About) */}
      <canvas
        ref={webglCanvasRef}
        id="transition-webgl-canvas"
        className="fixed inset-0 z-[100] pointer-events-none opacity-0 invisible"
      />

      {/* TRANSITION #3: SVG Bezier Curve Morph Overlay (Skills) */}
      <div
        ref={svgMorphContainerRef}
        className="fixed inset-0 z-[100] pointer-events-none opacity-0 invisible"
      >
        <svg
          className="w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <path
            ref={svgMorphPathRef}
            fill="var(--color-evergreen, #1F3A34)"
            d="M 0 100 V 100 Q 50 100 100 100 V 100 z"
          />
        </svg>
      </div>

      {/* TRANSITION #4: Dynamic Title Overlay & Clip Polygon (Projects) */}
      <div
        ref={titleOverlayRef}
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-dark/95 backdrop-blur-xl border-y border-amber/40 pointer-events-none opacity-0 invisible overflow-hidden shadow-2xl"
        style={{ willChange: 'clip-path' }}
      >
        <div className="flex flex-col items-center justify-center p-6 text-center">
          <span className="font-body text-xs uppercase tracking-[0.3em] text-amber/70 mb-3 animate-pulse">
            Navigating To
          </span>
          <h2
            ref={titleTextRef}
            className="font-heading text-4xl sm:text-6xl md:text-7xl font-bold uppercase tracking-wider text-amber drop-shadow-[0_0_25px_rgba(212,168,83,0.6)]"
          >
            {destinationTitle || 'Projects'}
          </h2>
          <div className="mt-4 h-0.5 w-24 bg-gradient-to-r from-transparent via-amber to-transparent" />
        </div>
      </div>

      {/* TRANSITION #5: GSAP Draw SVG Spiral Overlay (Experience) */}
      <div
        ref={svgDrawContainerRef}
        className="fixed inset-0 z-[100] pointer-events-none opacity-0 invisible overflow-hidden flex items-center justify-center bg-dark/40 backdrop-blur-sm"
      >
        <svg
          className="w-[125%] h-full aspect-square block"
          viewBox="-360 -360 760 760"
          preserveAspectRatio="xMidYMid slice"
        >
          <path
            ref={svgDrawPathRef}
            d="m0 0c3.36 0.06 6.6-2.82 7.07-7.07 0.59-4.19-1.79-9.6-7.07-12.93-5.18-3.4-13.27-4.43-21.21-1.21-7.92 3.09-15.48 10.7-18.79 21.21-3.42 10.46-2.3 23.68 4.64 35.36 6.83 11.64 19.57 21.35 35.36 24.64 15.69 3.43 34.14 0.2 49.5-10.5 15.38-10.52 27.21-28.47 30.5-49.5 3.43-20.92-1.92-44.6-16.36-63.64-14.2-19.1-37.37-33.1-63.64-36.36-26.16-3.45-55.05 4.06-77.78 22.22-22.82 17.9-38.98 46.25-42.22 77.78-3.48 31.43 6.2 65.49 28.08 91.92 21.58 26.55 55.16 44.87 91.92 48.08 36.66 3.5 75.94-8.33 106.07-33.93 30.27-25.28 50.74-64.07 53.93-106.07 3.53-41.9-10.46-86.4-39.79-120.21-28.97-33.99-72.97-56.62-120.21-59.79-47.13-3.56-96.85 12.6-134.35 45.65-37.71 32.65-62.51 81.88-65.65 134.35-3.55 52.4 14.72 107.29 51.51 148.49 36.35 41.41 90.75 68.41 148.49 71.51 57.63 3.58 117.75-16.86 162.63-57.37 45.14-40.03 74.29-99.66 77.37-162.63 3.62-62.86-19.02-128.21-63.22-176.78-43.73-48.85-108.57-80.17-176.78-83.22-68.13-3.64-138.65 21.15-190.92 69.08-52.57 47.43-86.06 117.45-89.08 190.92-3.66 73.36 23.29 149.1 74.94 205.06 51.12 56.3 126.35 91.94 205.06 94.94 78.6 3.69 159.56-25.42 219.2-80.8 60.03-54.8 97.82-135.26 100.8-219.2 3.72-83.84-27.56-170.01-86.65-233.35-58.51-63.77-144.14-103.69-233.35-106.65-89.07-3.71-180.46 29.68-247.49 92.51-67.51 62.18-109.54 153.08-112.51 247.49-3.74 94.33 31.82 190.91 98.37 261.63 65.88 71.23 161.96 115.43 261.63 118.37 99.57 3.76 201.36-33.95 275.77-104.23 74.96-69.57 121.31-170.86 124.23-275.77"
            fill="none"
            stroke="var(--color-amber, #D4A853)"
            strokeWidth="100"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* TRANSITION #6: Curtain Overlay for Dual Clip Lift (Contact) */}
      <div
        ref={curtainOverlayRef}
        className="fixed inset-0 z-[100] bg-evergreen/95 backdrop-blur-xl border-t-2 border-amber pointer-events-none opacity-0 invisible"
        style={{ willChange: 'clip-path' }}
      />
    </div>
  );
}


