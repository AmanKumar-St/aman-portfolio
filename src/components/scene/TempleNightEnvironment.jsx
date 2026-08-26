import TempleSky from './TempleSky';
import TempleTerrain from './TempleTerrain';
import TempleArchitecture from './TempleArchitecture';
import TempleForeground from './TempleForeground';
import TempleAtmosphere from './TempleAtmosphere';
import TempleLighting from './TempleLighting';

export default function TempleNightEnvironment({ scrollProgress, section }) {
  return (
    <group data-name="TempleNightEnvironment">
      <TempleLighting />
      <TempleSky />
      <TempleTerrain />
      <TempleArchitecture />
      <TempleForeground />
      <TempleAtmosphere />
    </group>
  );
}
