import { useState, useRef, lazy, Suspense } from 'react';
import Navbar from './components/ui/Navbar';
import HamburgerNav from './components/ui/hamburger-nav';
import Loader from './components/ui/Loader';
import TransitionOverlay from './components/ui/TransitionOverlay';
import Footer from './components/ui/Footer';
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Skills from './components/sections/Skills';
import Projects from './components/sections/Projects';
import Experience from './components/sections/Experience';
import Certifications from './components/sections/Certifications';
import Contact from './components/sections/Contact';
import { useScrollProgress } from './hooks/useScrollProgress';
import { useSectionBackground } from './hooks/useSectionBackground';

const SceneCanvas = lazy(() => import('./components/three/SceneCanvas'));

function App() {
  const [loading, setLoading] = useState(true);
  const { progress, section } = useScrollProgress();
  const bgRef = useRef(null);

  // Smoothly tween the fixed background layer's color as sections scroll into view
  useSectionBackground(bgRef);

  return (
    <>
      {loading && <Loader onComplete={() => setLoading(false)} />}

      {/* Fixed full-screen background layer – GSAP tweens its background-color */}
      <div
        ref={bgRef}
        style={{ backgroundColor: '#0A3625' }}
        className="fixed inset-0 z-0"
        aria-hidden="true"
      />

      <Navbar section={section} />
      <HamburgerNav section={section} />
      <TransitionOverlay />

      <Suspense fallback={null}>
        <SceneCanvas
          scrollProgress={progress}
          section={section}
        />
      </Suspense>

      <div className="relative z-10">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Certifications />
        <Contact />
        <Footer />
      </div>
    </>
  );
}

export default App;
