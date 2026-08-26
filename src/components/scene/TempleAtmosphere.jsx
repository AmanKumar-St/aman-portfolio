import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function TempleAtmosphere() {
  const firefliesRef = useRef();

  // Create floating fireflies / warm embers positions
  const [fireflyPositions, fireflyInitialY] = useMemo(() => {
    const count = 180;
    const positions = new Float32Array(count * 3);
    const initialY = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 24; // x
      const y = (Math.random() - 0.5) * 36 - 15; // y spanning sections
      positions[i * 3 + 1] = y;
      initialY[i] = y;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 12 - 2; // z
    }
    return [positions, initialY];
  }, []);

  useFrame((state) => {
    if (firefliesRef.current) {
      const positions = firefliesRef.current.geometry.attributes.position.array;
      const time = state.clock.elapsedTime;

      for (let i = 0; i < positions.length / 3; i++) {
        // Subtle floating motion
        const ix = i * 3;
        positions[ix] += Math.sin(time * 0.5 + i) * 0.005;
        positions[ix + 1] = fireflyInitialY[i] + Math.sin(time * 0.8 + i * 2) * 0.3;
      }
      firefliesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* Floating Warm Golden Firefly Embers */}
      <points ref={firefliesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[fireflyPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#F5B041"
          size={0.18}
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
        />
      </points>

      {/* Volumetric Layered Drifting Mist Plane 1 */}
      <mesh position={[0, -10, -10]} rotation={[-Math.PI * 0.05, 0, 0]}>
        <planeGeometry args={[60, 50]} />
        <meshBasicMaterial
          color="#0d1b2a"
          transparent
          opacity={0.15}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
