import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import ParticleField from './ParticleField';
import OrganicMorph from './OrganicMorph';
import SkillCell from './SkillCell';
import ProjectCrystal from './ProjectCrystal';
import ExperienceVine from './ExperienceVine';
import { personalData, skillColors } from '../../data/content';
import { CAMERA_SECTIONS, CAMERA_DEFAULT_Z } from '../../constants/scene';
import { COLORS } from '../../constants/colors';

const DEFAULT_CAMERA_SECTION = { y: 0, z: CAMERA_DEFAULT_Z, rot: 0 };

const cameraTarget = new THREE.Vector3();

export default function SceneManager({ scrollProgress, section }) {
  const { camera } = useThree();
  const groupRef = useRef();

  const skillPositions = useMemo(() => {
    const categories = Object.keys(personalData.skills);
    return categories.map((_, i) => {
      const angle = (i / categories.length) * Math.PI * 2 - Math.PI / 2;
      return [Math.cos(angle) * 3, Math.sin(angle) * 1.5 - 2, -1];
    });
  }, []);

  const projectPositions = useMemo(() => {
    return [
      [-1.5, 2, 0],
      [1.5, 2, 0]
    ];
  }, []);

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;
    const smooth = Math.min(1, delta * 3);

    const { y: targetY, z: targetZ, rot: rotY } = CAMERA_SECTIONS[section] || DEFAULT_CAMERA_SECTION;

    const interY = targetY + Math.sin(time * 0.1) * 0.2;
    const interZ = targetZ + Math.sin(time * 0.15) * 0.1;

    cameraTarget.set(0, interY, interZ);
    camera.position.lerp(cameraTarget, smooth);
    camera.lookAt(0, interY, 0);

    if (groupRef.current) {
      groupRef.current.rotation.y += (rotY - groupRef.current.rotation.y) * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      <ParticleField scrollProgress={scrollProgress} />

      <OrganicMorph
        position={[0, 0, -2]}
        scale={1.2}
        color={COLORS.amber}
        speed={0.4}
        intensity={0.4}
      />

      {section >= 1 && (
        <OrganicMorph
          position={[3, -5, -3]}
          scale={0.8}
          color={COLORS.moss}
          speed={0.3}
          intensity={0.3}
        />
      )}

      {section >= 2 &&
        Object.keys(personalData.skills).map((key, i) => (
          <SkillCell
            key={key}
            position={skillPositions[i]}
            color={skillColors[key] || { primary: COLORS.amber, secondary: '#C49A3E' }}
            index={i}
          />
        ))}

      {section >= 3 &&
        personalData.projects.map((project, i) => (
          <ProjectCrystal
            key={project.title}
            position={projectPositions[i]}
            color={project.type === 'treasure' ? COLORS.amber : COLORS.purple}
            scale={0.8}
            speed={0.5 + i * 0.2}
          />
        ))}

      {section >= 4 && <ExperienceVine scrollProgress={scrollProgress} />}

      <ambientLight intensity={0.3} color={COLORS.moss} />
      <pointLight position={[0, 5, 5]} intensity={0.8} color={COLORS.amber} />
      <pointLight position={[-5, -3, 3]} intensity={0.4} color={COLORS.moss} />
      <pointLight position={[5, 0, 4]} intensity={0.3} color={COLORS.purple} />
      <fog attach="fog" args={[COLORS.dark, 8, 20]} />
    </group>
  );
}