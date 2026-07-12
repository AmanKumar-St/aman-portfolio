import { useState, lazy, Suspense } from 'react';
import Navbar from './components/ui/Navbar';
import HamburgerNav from './components/ui/hamburger-nav';
import Loader from './components/ui/Loader';
import Footer from './components/ui/Footer';
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Skills from './components/sections/Skills';
import Projects from './components/sections/Projects';
import Experience from './components/sections/Experience';
import { useScrollProgress } from './hooks/useScrollProgress';

const SceneCanvas = lazy(() => import('./components/three/SceneCanvas'));

function App() {
  const [loading, setLoading] = useState(true);
  const { progress, section } = useScrollProgress();

  return (
    <>
      {loading && <Loader onComplete={() => setLoading(false)} />}

      <Navbar section={section} />
      <HamburgerNav section={section} />

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
        <Footer />
      </div>
    </>
  );
}

export default App;
