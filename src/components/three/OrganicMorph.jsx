import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function OrganicMorph({ position = [0, 0, 0], scale = 1, color = '#D4A853', speed = 0.5, intensity = 0.3 }) {
  const mesh = useRef();
  const geometry = useMemo(() => new THREE.IcosahedronGeometry(1.5, 3), []);
  const initialPositions = useMemo(() => {
    const pos = geometry.attributes.position.array.slice();
    return pos;
  }, [geometry]);

  useFrame((state) => {
    if (!mesh.current || !mesh.current.geometry || !mesh.current.geometry.attributes?.position) return;
    const pos = mesh.current.geometry.attributes.position.array;
    const time = state.clock.elapsedTime * speed;

    for (let i = 0; i < pos.length; i += 3) {
      const ix = i / 3;
      const noise = Math.sin(time + ix * 2.1) * Math.cos(time * 0.7 + ix * 1.3) * 0.5 + 0.5;
      const displacement = noise * intensity;
      const len = Math.sqrt(
        initialPositions[i] ** 2 +
        initialPositions[i + 1] ** 2 +
        initialPositions[i + 2] ** 2
      );
      if (len > 0) {
        const normX = initialPositions[i] / len;
        const normY = initialPositions[i + 1] / len;
        const normZ = initialPositions[i + 2] / len;
        pos[i] = initialPositions[i] + normX * displacement;
        pos[i + 1] = initialPositions[i + 1] + normY * displacement;
        pos[i + 2] = initialPositions[i + 2] + normZ * displacement;
      }
    }
    mesh.current.geometry.attributes.position.needsUpdate = true;
    mesh.current.geometry.computeVertexNormals();

    mesh.current.rotation.x = Math.sin(time * 0.2) * 0.1;
    mesh.current.rotation.y = time * 0.1;
  });

  return (
    <mesh ref={mesh} position={position} scale={scale}>
      <primitive object={geometry} />
      <meshPhysicalMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.3}
        metalness={0.1}
        roughness={0.4}
        transparent
        opacity={0.6}
        wireframe={false}
        side={THREE.DoubleSide}
      />
      <mesh scale={1.05}>
        <primitive object={geometry} />
        <meshPhysicalMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.1}
          transparent
          opacity={0.15}
          wireframe
          side={THREE.DoubleSide}
        />
      </mesh>
    </mesh>
  );
}
