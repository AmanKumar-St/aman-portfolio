import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import SceneManager from './SceneManager';

function SceneWrapper({ scrollProgress, section }) {
  return (
    <SceneManager
      scrollProgress={scrollProgress}
      section={section}
    />
  );
}

export default function SceneCanvas({ scrollProgress, section }) {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance'
        }}
      >
        <Suspense fallback={null}>
          <SceneWrapper
            scrollProgress={scrollProgress}
            section={section}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
