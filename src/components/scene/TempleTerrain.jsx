import { useMemo } from 'react';
import * as THREE from 'three';

function MountainRange({ position, scale, color, peaksCount = 10, width = 60, height = 12 }) {
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-width / 2, -height / 2);

    const step = width / peaksCount;
    for (let i = 0; i <= peaksCount; i++) {
      const x = -width / 2 + i * step;
      // Procedural height noise for natural mountain silhouette
      const hNoise = Math.sin(i * 1.7) * 2.5 + Math.cos(i * 3.1) * 1.5;
      const y = i === 0 || i === peaksCount ? -height / 2 : height / 2 + hNoise;
      shape.lineTo(x, y);
    }

    shape.lineTo(width / 2, -height / 2);
    shape.closePath();

    return new THREE.ShapeGeometry(shape);
  }, [width, height, peaksCount]);

  return (
    <mesh position={position} scale={scale} geometry={geometry}>
      <meshBasicMaterial color={color} side={THREE.DoubleSide} />
    </mesh>
  );
}

export default function TempleTerrain() {
  // Generate terrain layers down the vertical spine (y: 0 to y: -30)
  const verticalLevels = [0, -6, -12, -18, -24, -30];

  return (
    <group>
      {verticalLevels.map((yOffset, i) => (
        <group key={i} position={[0, yOffset, 0]}>
          {/* Layer 1: Distant Deep Mountain Silhouettes */}
          <MountainRange
            position={[0, 2, -22]}
            scale={[1.2, 1.1, 1]}
            color="#050d1a"
            peaksCount={12}
            width={70}
            height={14}
          />

          {/* Layer 2: Midground Mountain Silhouettes */}
          <MountainRange
            position={[(i % 2 === 0 ? 3 : -3), 0, -15]}
            scale={[1.1, 0.9, 1]}
            color="#061122"
            peaksCount={10}
            width={60}
            height={10}
          />

          {/* Layer 3: Near Hill Ridge */}
          <MountainRange
            position={[(i % 2 === 0 ? -4 : 4), -3, -9]}
            scale={[1, 0.8, 1]}
            color="#040914"
            peaksCount={8}
            width={50}
            height={8}
          />
        </group>
      ))}
    </group>
  );
}
