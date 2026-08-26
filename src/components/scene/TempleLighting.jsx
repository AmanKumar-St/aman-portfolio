export default function TempleLighting() {
  return (
    <group>
      {/* Deep Midnight Fog Fading Distance Elements into Black */}
      <fog attach="fog" args={['#050b14', 8, 30]} />

      {/* Ambient Lighting with Cool Moonlight Tint */}
      <ambientLight color="#101c30" intensity={0.5} />

      {/* Directional Moonlight Source */}
      <directionalLight
        position={[15, 25, 10]}
        color="#8CAAD6"
        intensity={0.7}
      />

      {/* Soft Fill Light from Below Horizon */}
      <directionalLight
        position={[-10, -15, 5]}
        color="#081426"
        intensity={0.3}
      />
    </group>
  );
}
