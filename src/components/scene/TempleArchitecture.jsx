import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Procedural Pagoda Roof tier component
function PagodaRoofTier({ position, scale = [1, 1, 1] }) {
  return (
    <group position={position} scale={scale}>
      {/* Curved Eaves Roof Mesh */}
      <mesh position={[0, 0, 0]}>
        <coneGeometry args={[2.2, 0.7, 4, 1]} />
        <meshStandardMaterial color="#050a14" roughness={0.9} />
      </mesh>
      {/* Roof Edge Rim Accent */}
      <mesh position={[0, -0.3, 0]} rotation={[0, Math.PI / 4, 0]}>
        <boxGeometry args={[3.2, 0.1, 3.2]} />
        <meshStandardMaterial color="#0b1626" roughness={0.8} />
      </mesh>
    </group>
  );
}

// Procedural Pagoda Tower Structure
function PagodaTower({ position, scale = 1 }) {
  return (
    <group position={position} scale={[scale, scale, scale]}>
      <PagodaRoofTier position={[0, 4.5, 0]} scale={[0.7, 0.7, 0.7]} />
      <PagodaRoofTier position={[0, 3.0, 0]} scale={[0.9, 0.9, 0.9]} />
      <PagodaRoofTier position={[0, 1.5, 0]} scale={[1.1, 1.1, 1.1]} />

      {/* Pagoda Base & Pillars */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.8, 3.0, 1.8]} />
        <meshStandardMaterial color="#040810" roughness={0.9} />
      </mesh>

      {/* Spire Top Pin */}
      <mesh position={[0, 5.8, 0]}>
        <cylinderGeometry args={[0.05, 0.15, 1.5, 8]} />
        <meshStandardMaterial color="#D4A853" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

// Procedural Japanese Stone Lantern with glowing warm light
function StoneLantern({ position, lightIntensityRef }) {
  const glowRef = useRef();

  useFrame((state) => {
    if (glowRef.current) {
      const flicker = Math.sin(state.clock.elapsedTime * 4 + position[0]) * 0.15 + 0.85;
      glowRef.current.material.emissiveIntensity = 1.4 * flicker;
    }
  });

  return (
    <group position={position}>
      {/* Lantern Stone Base */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.25, 0.35, 0.8, 6]} />
        <meshStandardMaterial color="#08101d" roughness={0.9} />
      </mesh>

      {/* Glowing Warm Fire Chamber */}
      <mesh ref={glowRef} position={[0, 0.6, 0]}>
        <boxGeometry args={[0.45, 0.45, 0.45]} />
        <meshStandardMaterial
          color="#F5B041"
          emissive="#F5B041"
          emissiveIntensity={1.4}
          toneMapped={false}
        />
      </mesh>

      {/* Localized Warm Point Light */}
      <pointLight
        position={[0, 0.6, 0]}
        color="#F5B041"
        intensity={ lightIntensityRef || 1.8}
        distance={8}
        decay={2}
      />

      {/* Lantern Cap Roof */}
      <mesh position={[0, 0.95, 0]}>
        <coneGeometry args={[0.4, 0.3, 4]} />
        <meshStandardMaterial color="#040914" roughness={0.8} />
      </mesh>
    </group>
  );
}

export default function TempleArchitecture() {
  return (
    <group>
      {/* Section 0 (Hero): Distant Pagoda Silhouette on Hill */}
      <PagodaTower position={[10, 1, -16]} scale={1.4} />

      {/* Lanterns flanking Hero section */}
      <StoneLantern position={[-6.5, -1, -6]} />
      <StoneLantern position={[6.5, -1, -6]} />

      {/* Section 1 (About/Bio): Midground Temple Roofs & Lanterns */}
      <PagodaTower position={[-11, -5, -14]} scale={1.1} />
      <StoneLantern position={[-5.5, -6, -5]} />
      <StoneLantern position={[5.5, -6.5, -5.5]} />

      {/* Section 2 (Skills): Shrine Gate Framework & Warm Glow */}
      <StoneLantern position={[-6, -11.5, -5]} />
      <StoneLantern position={[6, -12, -5.5]} />

      {/* Section 3 (Projects): Distant Pagoda & Lanterns */}
      <PagodaTower position={[12, -15, -16]} scale={1.3} />
      <StoneLantern position={[-6.5, -17.5, -5]} />
      <StoneLantern position={[6.5, -18, -5]} />

      {/* Section 4 (Experience): Experience Journey Lanterns */}
      <StoneLantern position={[-6, -23.5, -5]} />
      <StoneLantern position={[6, -24, -5.5]} />

      {/* Section 5 (Contact): Warm Destination Lanterns */}
      <PagodaTower position={[-10, -27, -15]} scale={1.2} />
      <StoneLantern position={[-4.5, -29, -4.5]} />
      <StoneLantern position={[4.5, -29.5, -4.5]} />
    </group>
  );
}
