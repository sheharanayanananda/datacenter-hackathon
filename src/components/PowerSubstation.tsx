import React from 'react'

export const PowerSubstation: React.FC = () => {
  return (
    <group position={[-6.0, 0, 0.2]}>
      {/* Substation Gravel Foundation */}
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <boxGeometry args={[2.4, 0.1, 1.8]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.9} />
      </mesh>

      {/* Perimeter Safety Fence Posts */}
      {[-1.1, 1.1].map((x, i) =>
        [-0.8, 0.8].map((z, j) => (
          <mesh key={`${i}-${j}`} position={[x, 0.4, z]} castShadow>
            <cylinderGeometry args={[0.03, 0.03, 0.8, 8]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.7} />
          </mesh>
        ))
      )}
      {/* Fence Rails */}
      <mesh position={[0, 0.65, -0.8]}>
        <boxGeometry args={[2.2, 0.04, 0.02]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.7} />
      </mesh>
      <mesh position={[0, 0.65, 0.8]}>
        <boxGeometry args={[2.2, 0.04, 0.02]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.7} />
      </mesh>
      <mesh position={[-1.1, 0.65, 0]}>
        <boxGeometry args={[0.02, 0.04, 1.6]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.7} />
      </mesh>

      {/* Main High-Voltage Transformer Unit 1 */}
      <group position={[-0.4, 0.5, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.8, 0.7, 0.7]} />
          <meshStandardMaterial color="#64748b" metalness={0.6} roughness={0.4} />
        </mesh>
        {/* Cooling Fins */}
        {[-0.2, 0, 0.2].map((xOffset, k) => (
          <mesh key={k} position={[xOffset, 0, 0.38]}>
            <boxGeometry args={[0.08, 0.6, 0.04]} />
            <meshStandardMaterial color="#475569" />
          </mesh>
        ))}
        {/* Bushing / Insulators on Top */}
        {[-0.2, 0.2].map((xOffset, k) => (
          <mesh key={k} position={[xOffset, 0.5, 0]} castShadow>
            <cylinderGeometry args={[0.05, 0.06, 0.3, 10]} />
            <meshStandardMaterial color="#b45309" roughness={0.3} />
          </mesh>
        ))}
      </group>

      {/* Transformer Unit 2 */}
      <group position={[0.55, 0.45, -0.1]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.6, 0.6, 0.6]} />
          <meshStandardMaterial color="#64748b" metalness={0.6} roughness={0.4} />
        </mesh>
        {/* Insulator */}
        <mesh position={[0, 0.45, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.06, 0.25, 10]} />
          <meshStandardMaterial color="#b45309" roughness={0.3} />
        </mesh>
      </group>

      {/* Power Pole nearby */}
      <group position={[1.4, 0, 0.7]}>
        <mesh position={[0, 1.2, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.08, 2.4, 10]} />
          <meshStandardMaterial color="#78350f" roughness={0.8} />
        </mesh>
        {/* Crossarm */}
        <mesh position={[0, 2.2, 0]} castShadow>
          <boxGeometry args={[0.9, 0.08, 0.08]} />
          <meshStandardMaterial color="#451a03" />
        </mesh>
        {/* Insulators */}
        {[-0.35, 0, 0.35].map((x, idx) => (
          <mesh key={idx} position={[x, 2.3, 0]}>
            <cylinderGeometry args={[0.03, 0.04, 0.12, 8]} />
            <meshStandardMaterial color="#0284c7" />
          </mesh>
        ))}
      </group>
    </group>
  )
}
