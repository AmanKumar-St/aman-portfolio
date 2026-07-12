import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createSeededRandom } from '../../utils/random';
import { VINE_SEGMENTS, VINE_LEAF_INTERVAL, VINE_TUBE_SEGMENTS, VINE_TUBE_RADIUS, VINE_TUBE_RADIAL_SEGMENTS } from '../../constants/scene';

export default function ExperienceVine({ scrollProgress = 0 }) {
  const groupRef = useRef();

  const { points, leaves } = useMemo(() => {
    const pts = [];
    const lvs = [];
    const rand = createSeededRandom(123);
    for (let i = 0; i <= VINE_SEGMENTS; i++) {
      const t = i / VINE_SEGMENTS;
      const x = Math.sin(t * Math.PI * 3) * 0.8;
      const y = t * 12 - 6;
      const z = Math.cos(t * Math.PI * 2) * 0.3;
      pts.push(new THREE.Vector3(x, y, z));
      if (i % VINE_LEAF_INTERVAL === 0 && i > 0) {
        lvs.push({
          pos: new THREE.Vector3(x + 0.5, y, z),
          rot: rand() * Math.PI,
          scale: 0.3 + rand() * 0.2,
          index: i / VINE_LEAF_INTERVAL
        });
      }
    }
    return { points: pts, leaves: lvs };
  }, []);

  const curve = useMemo(() => new THREE.CatmullRomCurve3(points), [points]);

  const tubeGeo = useMemo(() => {
    const tube = new THREE.TubeGeometry(curve, VINE_TUBE_SEGMENTS, VINE_TUBE_RADIUS, VINE_TUBE_RADIAL_SEGMENTS, false);
    return tube;
  }, [curve]);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.05) * 0.1;
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <primitive object={tubeGeo} />
        <meshPhysicalMaterial
          color="#5A7D6E"
          emissive="#5A7D6E"
          emissiveIntensity={0.2}
          roughness={0.7}
          metalness={0.1}
          transparent
          opacity={0.8}
        />
      </mesh>
      {leaves.map((leaf, i) => {
        const visible = scrollProgress > (i + 1) * 0.15;
        if (!visible) return null;
        return (
          <group key={i} position={leaf.pos} rotation={[0, leaf.rot, Math.PI / 4]}>
            <mesh scale={[leaf.scale, leaf.scale * 0.5, leaf.scale * 0.1]}>
              <planeGeometry args={[1, 1]} />
              <meshPhysicalMaterial
                color="#7C9E8E"
                emissive="#5A7D6E"
                emissiveIntensity={0.1}
                transparent
                opacity={0.7}
                side={THREE.DoubleSide}
              />
            </mesh>
          </group>
        );
      })}
      {leaves.map((leaf, i) => {
        const visible = scrollProgress > (i + 1) * 0.15;
        if (!visible) return null;
        return (
          <group key={i + 'mirror'} position={leaf.pos} rotation={[0, -leaf.rot, -Math.PI / 4]}>
            <mesh scale={[leaf.scale * 1.2, leaf.scale * 0.6, leaf.scale * 0.1]}>
              <planeGeometry args={[1, 1]} />
              <meshPhysicalMaterial
                color="#8DAB9B"
                emissive="#5A7D6E"
                emissiveIntensity={0.08}
                transparent
                opacity={0.5}
                side={THREE.DoubleSide}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}