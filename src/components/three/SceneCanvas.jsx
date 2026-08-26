import TempleNightBackground from '../scene/TempleNightBackground';

export default function SceneCanvas({ scrollProgress, section }) {
  return (
    <TempleNightBackground
      scrollProgress={scrollProgress}
      section={section}
    />
  );
}
