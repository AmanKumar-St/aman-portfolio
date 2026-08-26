import { useMemo } from 'react';
import * as THREE from 'three';

// Procedural Pine Tree Silhouette
function PineTreeSilhouette({ position, scale = 1, rotationY = 0 }) {
  return (
    <group position={position} scale={[scale, scale, scale]} rotation={[0, rotationY, 0]}>
      {/* Trunk */}
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.15, 0.3, 3, 6]} />
        <meshBasicMaterial color="#02050b" />
      </mesh>

      {/* Layered Foliage Cones */}
      <mesh position={[0, 4.2, 0]}>
        <coneGeometry args={[1.2, 2.2, 5]} />
        <meshBasicMaterial color="#030712" />
      </mesh>

      <mesh position={[0, 3.0, 0]}>
        <coneGeometry args={[1.7, 2.5, 5]} />
        <meshBasicMaterial color="#02050c" />
      </mesh>

      <mesh position={[0, 1.8, 0]}>
        <coneGeometry args={[2.2, 2.8, 5]} />
        <meshBasicMaterial color="#01040a" />
      </mesh>
    </group>
  );
}

export default function TempleForeground() {
  const sectionsY = [0, -6, -12, -18, -24, -30];

  return (
    <group>
      {sectionsY.map((y, index) => (
        <group key={index} position={[0, y, 0]}>
          {/* Left Foreground Pine Tree Frame */}
          <PineTreeSilhouette
            position={[-8.5, -2, -3]}
            scale={1.3 + (index % 3) * 0.2}
            rotationY={index * 0.4}
          />

          {/* Right Foreground Pine Tree Frame */}
          <PineTreeSilhouette
            position={[8.5, -2.5, -3.5]}
            scale={1.4 + ((index + 1) % 3) * 0.2}
            rotationY={-index * 0.5}
          />
        </group>
      ))}
    </group>
  );
}
