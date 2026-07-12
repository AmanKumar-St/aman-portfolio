import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { createSeededRandom } from '../../utils/random';
import { PARTICLE_COUNT, PARTICLE_BOUNDARY, PARTICLE_RADIUS_MIN, PARTICLE_RADIUS_MAX } from '../../constants/scene';

export default function ParticleField({ count = PARTICLE_COUNT, scrollProgress = 0 }) {
  const mesh = useRef();
  const { pointer } = useThree();

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const amber = new THREE.Color('#D4A853');
    const moss = new THREE.Color('#5A7D6E');
    const rand = createSeededRandom(42);

    const colorMix = new THREE.Color();
    for (let i = 0; i < count; i++) {
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(2 * rand() - 1);
      const r = PARTICLE_RADIUS_MIN + rand() * PARTICLE_RADIUS_MAX;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.cos(phi) - 5 + rand() * PARTICLE_RADIUS_MAX;
      pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

      colorMix.lerpColors(amber, moss, rand());
      col[i * 3] = colorMix.r + (rand() - 0.5) * 0.1;
      col[i * 3 + 1] = colorMix.g + (rand() - 0.5) * 0.1;
      col[i * 3 + 2] = colorMix.b + (rand() - 0.5) * 0.1;
    }
    return [pos, col];
  }, [count]);

  useFrame((state) => {
    if (!mesh.current) return;
    const pos = mesh.current.geometry.attributes.position.array;

    const mx = (pointer.x - 0.5) * 2;
    const my = (pointer.y - 0.5) * 2;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      pos[i3] += Math.sin(state.clock.elapsedTime * 0.3 + i * 0.01) * 0.0008 + mx * 0.0003;
      pos[i3 + 1] += Math.cos(state.clock.elapsedTime * 0.2 + i * 0.015) * 0.0008 + my * 0.0003;
      pos[i3 + 2] += Math.sin(state.clock.elapsedTime * 0.25 + i * 0.012) * 0.0008;

      if (Math.abs(pos[i3]) > PARTICLE_BOUNDARY) pos[i3] *= -0.8;
      if (Math.abs(pos[i3 + 1]) > PARTICLE_BOUNDARY) pos[i3 + 1] *= -0.8;
      if (Math.abs(pos[i3 + 2]) > PARTICLE_BOUNDARY) pos[i3 + 2] *= -0.8;
    }
    mesh.current.geometry.attributes.position.needsUpdate = true;
    mesh.current.rotation.y = scrollProgress * Math.PI * 1.5;
    mesh.current.rotation.x = Math.sin(scrollProgress * Math.PI) * 0.1;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        vertexColors
        sizeAttenuation
        transparent
        opacity={0.7}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}