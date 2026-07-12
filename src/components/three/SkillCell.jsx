import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function SkillCell({ position, color, index }) {
  const mesh = useRef();
  const glowRef = useRef();

  useFrame((state) => {
    if (!mesh.current) return;
    const time = state.clock.elapsedTime;
    const float = Math.sin(time * 0.8 + index * 1.5) * 0.15;
    mesh.current.position.y = position[1] + float;
    mesh.current.rotation.x = Math.sin(time * 0.3 + index) * 0.1;
    mesh.current.rotation.y = time * 0.2 + index;
    mesh.current.scale.setScalar(0.8 + Math.sin(time * 0.5 + index) * 0.05);

    if (glowRef.current) {
      glowRef.current.scale.setScalar(1.2 + Math.sin(time * 0.7 + index) * 0.1);
      glowRef.current.material.opacity = 0.15 + Math.sin(time * 0.6 + index * 2) * 0.08;
    }
  });

  return (
    <group position={[position[0], position[1], position[2]]}>
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshBasicMaterial
          color={color.primary}
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh ref={mesh}>
        <sphereGeometry args={[0.5, 24, 24]} />
        <meshPhysicalMaterial
          color={color.primary}
          emissive={color.primary}
          emissiveIntensity={0.4}
          metalness={0.3}
          roughness={0.2}
          transparent
          opacity={0.9}
        />
      </mesh>
    </group>
  );
}
