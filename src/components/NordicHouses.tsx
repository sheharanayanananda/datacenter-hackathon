import React, { useMemo } from 'react'
import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'
import { HouseInfo } from '../types'

// Fallback / Procedural Nordic House in case GLTF is loading or for customized variations
const ProceduralNordicHouse: React.FC<{
  color: 'yellow' | 'red' | 'slate' | 'brown';
  scale?: number;
}> = ({ color, scale = 1 }) => {
  const wallColors = {
    yellow: '#eab308', // Ochre Nordic yellow
    red: '#dc2626',    // Falu red
    slate: '#475569',  // Scandinavian modern charcoal
    brown: '#92400e',  // Nordic timber
  }

  const wallColor = wallColors[color] || wallColors.yellow

  return (
    <group scale={[scale, scale, scale]}>
      {/* House Stone/Concrete Base */}
      <mesh position={[0, 0.12, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.24, 1.2]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.8} />
      </mesh>

      {/* Main Wood Siding Walls */}
      <mesh position={[0, 0.65, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.4, 0.8, 1.1]} />
        <meshStandardMaterial color={wallColor} roughness={0.6} />
      </mesh>

      {/* Gable / Pitched Roof */}
      <mesh position={[0, 1.3, 0]} rotation={[0, Math.PI / 2, 0]} castShadow receiveShadow>
        <coneGeometry args={[0.95, 0.7, 4]} />
        <meshStandardMaterial color="#1e293b" roughness={0.5} />
      </mesh>

      {/* Chimney */}
      <mesh position={[0.4, 1.45, 0.2]} castShadow>
        <boxGeometry args={[0.2, 0.5, 0.2]} />
        <meshStandardMaterial color="#78350f" roughness={0.7} />
      </mesh>

      {/* White Trim Windows */}
      <mesh position={[0, 0.7, 0.56]}>
        <boxGeometry args={[0.3, 0.3, 0.02]} />
        <meshStandardMaterial color="#ffffff" roughness={0.2} />
      </mesh>
      <mesh position={[0.42, 0.7, 0.56]}>
        <boxGeometry args={[0.26, 0.3, 0.02]} />
        <meshStandardMaterial color="#ffffff" roughness={0.2} />
      </mesh>

      {/* Warm lit window pane glow */}
      <mesh position={[0, 0.7, 0.57]}>
        <boxGeometry args={[0.22, 0.22, 0.01]} />
        <meshStandardMaterial color="#fef08a" emissive="#facc15" emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[0.42, 0.7, 0.57]}>
        <boxGeometry args={[0.18, 0.22, 0.01]} />
        <meshStandardMaterial color="#fef08a" emissive="#facc15" emissiveIntensity={0.8} />
      </mesh>

      {/* Front Door */}
      <mesh position={[-0.4, 0.5, 0.56]}>
        <boxGeometry args={[0.25, 0.5, 0.03]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[-0.4, 0.5, 0.58]}>
        <boxGeometry args={[0.18, 0.42, 0.01]} />
        <meshStandardMaterial color="#78350f" />
      </mesh>

      {/* Front Steps */}
      <mesh position={[-0.4, 0.06, 0.68]}>
        <boxGeometry args={[0.35, 0.12, 0.2]} />
        <meshStandardMaterial color="#cbd5e1" />
      </mesh>

      {/* District Heating Connection Inlet box at foundation */}
      <mesh position={[-0.65, 0.15, 0.4]}>
        <boxGeometry args={[0.12, 0.18, 0.12]} />
        <meshStandardMaterial color="#ea580c" emissive="#f97316" emissiveIntensity={1.2} />
      </mesh>
    </group>
  )
}

const ModelHouse: React.FC<{
  color: 'yellow' | 'red' | 'slate' | 'brown';
  scale?: number;
}> = ({ color, scale = 1 }) => {
  try {
    const gltf = useGLTF('/assets/models/house_nordic.glb')
    const clonedScene = useMemo(() => {
      const clone = gltf.scene.clone(true)
      const wallColors = {
        yellow: '#eab308',
        red: '#dc2626',
        slate: '#475569',
        brown: '#92400e',
      }
      const chosenColor = new THREE.Color(wallColors[color] || wallColors.yellow)

      clone.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh
          mesh.castShadow = true
          mesh.receiveShadow = true
          if (Array.isArray(mesh.material)) {
            mesh.material = mesh.material.map((m) => m.clone())
          } else if (mesh.material) {
            mesh.material = mesh.material.clone()
            // Tint default wall material if name matches or by default
            if (
              mesh.material.name === '_defaultMat' ||
              mesh.material.name.includes('wall') ||
              mesh.material.name.includes('base')
            ) {
              ;(mesh.material as THREE.MeshStandardMaterial).color = chosenColor
            }
          }
        }
      })
      return clone
    }, [gltf, color])

    return (
      <group scale={[scale * 0.9, scale * 0.9, scale * 0.9]}>
        <primitive object={clonedScene} />
        {/* Glow indicator at foundation for district heating */}
        <mesh position={[0, 0.1, 0.6]}>
          <sphereGeometry args={[0.07, 8, 8]} />
          <meshStandardMaterial color="#f97316" emissive="#ea580c" emissiveIntensity={1.8} />
        </mesh>
      </group>
    )
  } catch (e) {
    return <ProceduralNordicHouse color={color} scale={scale} />
  }
}

export const NordicHouses: React.FC<{
  onSelectHouse?: (house: HouseInfo) => void;
}> = ({ onSelectHouse }) => {
  // Positions arranged around the road loop matching the reference screenshot:
  const houses: HouseInfo[] = [
    // South-West Yellow House (directly receives glowing pipe)
    {
      id: 'house-sw-yellow',
      name: 'Residential Villa A-12',
      position: [-3.8, 0, 3.8],
      rotation: 0.25,
      color: 'yellow',
      scale: 1.05,
      heatConnected: true,
    },
    // South Middle Red House (receives pipe)
    {
      id: 'house-s-red',
      name: 'Family Home B-04',
      position: [-1.2, 0, 4.3],
      rotation: 0.1,
      color: 'red',
      scale: 1.0,
      heatConnected: true,
    },
    // South-East Red House (receives pipe)
    {
      id: 'house-se-red',
      name: 'Townhouse C-09',
      position: [2.0, 0, 4.0],
      rotation: -0.2,
      color: 'red',
      scale: 1.1,
      heatConnected: true,
    },
    // Far South-East Slate House
    {
      id: 'house-se-slate',
      name: 'Residences D-01',
      position: [4.4, 0, 2.2],
      rotation: -0.5,
      color: 'slate',
      scale: 1.0,
      heatConnected: true,
    },
    // West Yellow House
    {
      id: 'house-w-yellow',
      name: 'Villa West 01',
      position: [-4.6, 0, 1.4],
      rotation: 1.4,
      color: 'yellow',
      scale: 0.95,
      heatConnected: true,
    },
    // West-North Slate House
    {
      id: 'house-wn-slate',
      name: 'Villa North-West',
      position: [-3.7, 0, -2.4],
      rotation: 1.2,
      color: 'slate',
      scale: 1.0,
      heatConnected: true,
    },
    // North Yellow House
    {
      id: 'house-n-yellow',
      name: 'Hillside Home 05',
      position: [-1.2, 0, -3.8],
      rotation: 3.0,
      color: 'yellow',
      scale: 1.0,
      heatConnected: false,
    },
    // Far North Slate House on road curve
    {
      id: 'house-fn-slate',
      name: 'Ridge House 02',
      position: [1.8, 0, -5.2],
      rotation: 2.8,
      color: 'slate',
      scale: 0.95,
      heatConnected: false,
    },
    // Upper Hillside Yellow House along the extended winding road
    {
      id: 'house-hill-yellow',
      name: 'Highland Cabin 07',
      position: [4.2, 0, -9.8],
      rotation: 2.5,
      color: 'yellow',
      scale: 0.9,
      heatConnected: false,
    },
    // Lakeside Cottage
    {
      id: 'house-lakeside',
      name: 'Lakeside Residence 03',
      position: [5.2, 0, -1.8],
      rotation: -1.2,
      color: 'slate',
      scale: 0.95,
      heatConnected: false,
    },
  ]

  return (
    <group>
      {houses.map((house) => (
        <group
          key={house.id}
          position={house.position}
          rotation={[0, house.rotation, 0]}
          onClick={(e) => {
            e.stopPropagation()
            onSelectHouse?.(house)
          }}
        >
          {/* Use Model House with procedural fallback */}
          <ProceduralNordicHouse color={house.color} scale={house.scale} />

          {/* Small snow patch next to house */}
          <mesh position={[0.7, 0.02, 0.6]} rotation={[-Math.PI / 2, 0, 0.4]} receiveShadow>
            <circleGeometry args={[0.45, 7]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.9} />
          </mesh>

          {/* White wooden fence segment */}
          <group position={[0, 0, 1.05]}>
            <mesh position={[-0.4, 0.15, 0]}>
              <boxGeometry args={[0.04, 0.3, 0.04]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
            <mesh position={[0.4, 0.15, 0]}>
              <boxGeometry args={[0.04, 0.3, 0.04]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
            <mesh position={[0, 0.18, 0]}>
              <boxGeometry args={[0.8, 0.04, 0.02]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
          </group>
        </group>
      ))}
    </group>
  )
}

useGLTF.preload('/assets/models/house_nordic.glb')
