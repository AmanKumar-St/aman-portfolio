import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createSeededRandom } from '../../utils/random';

export default function ProjectCrystal({ position, color = '#D4A853', scale = 1, speed = 1 }) {
  const mesh = useRef();
  const glowRef = useRef();

  const geometry = useMemo(() => {
    const geo = new THREE.OctahedronGeometry(1, 0);
    const pos = geo.attributes.position.array;
    const rand = createSeededRandom(456);
    for (let i = 0; i < pos.length; i += 3) {
      const stretch = 0.7 + rand() * 0.6;
      pos[i] *= stretch;
      pos[i + 1] *= stretch;
      pos[i + 2] *= stretch;
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  useFrame((state) => {
    if (!mesh.current) return;
    const time = state.clock.elapsedTime * speed;
    mesh.current.rotation.x = Math.sin(time * 0.3) * 0.2;
    mesh.current.rotation.y = time * 0.3;
    mesh.current.rotation.z = Math.cos(time * 0.2) * 0.1;
    mesh.current.position.y = position[1] + Math.sin(time * 0.5) * 0.15;

    if (glowRef.current) {
      glowRef.current.rotation.y = -time * 0.2;
      glowRef.current.material.opacity = 0.2 + Math.sin(time * 0.8) * 0.1;
    }
  });

  return (
    <group position={[position[0], position[1], position[2]]} scale={scale}>
      <mesh ref={glowRef} scale={1.8}>
        <octahedronGeometry args={[1, 0]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          wireframe
        />
      </mesh>
      <mesh ref={mesh}>
        <primitive object={geometry} />
        <meshPhysicalMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
          metalness={0.6}
          roughness={0.15}
          transparent
          opacity={0.85}
          clearcoat={0.3}
          envMapIntensity={1}
        />
      </mesh>
      <mesh scale={1.02}>
        <primitive object={geometry} />
        <meshPhysicalMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.1}
          transparent
          opacity={0.2}
          wireframe
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}