import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function TempleSky() {
  const starsRef = useRef();

  // Create random star field positions & sizes
  const [starPositions, starSizes] = useMemo(() => {
    const count = 350;
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const radius = 35 + Math.random() * 20;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI * 0.5; // Upper sky dome

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.cos(phi) - 5;
      positions[i * 3 + 2] = -radius * Math.sin(phi) * Math.sin(theta) - 10;

      sizes[i] = 1.0 + Math.random() * 2.5;
    }
    return [positions, sizes];
  }, []);

  useFrame((state) => {
    if (starsRef.current) {
      starsRef.current.rotation.y = state.clock.elapsedTime * 0.005;
    }
  });

  return (
    <group>
      {/* Sky Background Sphere with dark midnight gradient */}
      <mesh scale={[-60, -60, -60]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color="#040914"
          side={THREE.BackSide}
        />
      </mesh>

      {/* Distant Soft Moon / Celestial Glow */}
      <mesh position={[12, 18, -25]}>
        <sphereGeometry args={[3.5, 32, 32]} />
        <meshBasicMaterial color="#E0ECF8" transparent opacity={0.85} />
      </mesh>
      {/* Outer Moon Glow Halo */}
      <mesh position={[12, 18, -25.5]}>
        <sphereGeometry args={[6.5, 32, 32]} />
        <meshBasicMaterial color="#7C9BC0" transparent opacity={0.2} />
      </mesh>

      {/* Twinkling Star Points */}
      <points ref={starsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[starPositions, 3]}
          />
          <bufferAttribute
            attach="attributes-size"
            args={[starSizes, 1]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#E8F1F5"
          size={0.15}
          transparent
          opacity={0.7}
          sizeAttenuation
        />
      </points>
    </group>
  );
}
