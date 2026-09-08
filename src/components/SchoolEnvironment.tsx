import { useMemo } from 'react';
import * as THREE from 'three';
import { Text } from '@react-three/drei';
import { LOCATIONS } from '../data/locations';
import type { LocationId, TimeOfDay } from '../types';

interface SchoolEnvironmentProps {
  activeLocation: LocationId;
  timeOfDay: TimeOfDay;
}

// Lighting presets for each time of day
const TIME_LIGHTING: Record<TimeOfDay, {
  ambient: number;
  ambientColor: string;
  directional: number;
  directionalColor: string;
  directionalPos: [number, number, number];
  fogColor: string;
  fogNear: number;
  fogFar: number;
}> = {
  morning: {
    ambient: 0.7,
    ambientColor: '#fff5e6',
    directional: 1.2,
    directionalColor: '#fffaf0',
    directionalPos: [10, 20, 10] as [number, number, number],
    fogColor: '#e8d5b5',
    fogNear: 15,
    fogFar: 60,
  },
  afternoon: {
    ambient: 0.65,
    ambientColor: '#ffe0b0',
    directional: 1.0,
    directionalColor: '#ffd9a0',
    directionalPos: [5, 15, 15] as [number, number, number],
    fogColor: '#f0c890',
    fogNear: 18,
    fogFar: 65,
  },
  evening: {
    ambient: 0.4,
    ambientColor: '#6b5b95',
    directional: 0.5,
    directionalColor: '#9b7fb8',
    directionalPos: [-10, 10, -5] as [number, number, number],
    fogColor: '#4a3f6b',
    fogNear: 12,
    fogFar: 45,
  },
};

function Room({
  location,
  isActive,
}: {
  location: LocationId;
  isActive: boolean;
}) {
  const loc = LOCATIONS[location];
  const { minX, maxX, minZ, maxZ } = loc.bounds;
  const width = maxX - minX;
  const depth = maxZ - minZ;
  const cx = (minX + maxX) / 2;
  const cz = (minZ + maxZ) / 2;

  // Only render the active location fully, others as faded outlines
  if (!isActive) return null;

  return (
    <group position={[cx, 0, cz]}>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color={loc.color} roughness={0.9} />
      </mesh>

      {/* Walls — back */}
      <mesh position={[0, 2, -depth / 2]} castShadow receiveShadow>
        <boxGeometry args={[width, 4, 0.3]} />
        <meshStandardMaterial color={loc.accentColor} roughness={0.8} />
      </mesh>
      {/* Walls — left */}
      <mesh position={[-width / 2, 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.3, 4, depth]} />
        <meshStandardMaterial color={loc.accentColor} roughness={0.8} />
      </mesh>
      {/* Walls — right */}
      <mesh position={[width / 2, 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.3, 4, depth]} />
        <meshStandardMaterial color={loc.accentColor} roughness={0.8} />
      </mesh>
      {/* Wall — front left (gap for door) */}
      <mesh position={[-width / 4, 2, depth / 2]} castShadow receiveShadow>
        <boxGeometry args={[width / 2 - 1.5, 4, 0.3]} />
        <meshStandardMaterial color={loc.accentColor} roughness={0.8} />
      </mesh>
      {/* Wall — front right */}
      <mesh position={[width / 4, 2, depth / 2]} castShadow receiveShadow>
        <boxGeometry args={[width / 2 - 1.5, 4, 0.3]} />
        <meshStandardMaterial color={loc.accentColor} roughness={0.8} />
      </mesh>

      {/* Location-specific props */}
      {location === 'classroom' && <ClassroomProps width={width} depth={depth} />}
      {location === 'hallway' && <HallwayProps width={width} depth={depth} />}
      {location === 'courtyard' && <CourtyardProps width={width} depth={depth} />}
      {location === 'cafeteria' && <CafeteriaProps width={width} depth={depth} />}

      {/* Location label */}
      <Text
        position={[0, 4.5, -depth / 2 + 0.2]}
        fontSize={0.4}
        color="#333333"
        anchorX="center"
        anchorY="middle"
      >
        {loc.name}
      </Text>
    </group>
  );
}

function ClassroomProps({ width, depth }: { width: number; depth: number }) {
  const desks = useMemo(() => {
    const items: { pos: [number, number, number] }[] = [];
    for (let x = -3; x <= 3; x += 2) {
      for (let z = -3; z <= 1; z += 2) {
        items.push({ pos: [x, 0, z] });
      }
    }
    return items;
  }, []);

  return (
    <group>
      {/* Teacher's desk */}
      <mesh position={[0, 0.5, -depth / 2 + 1.5]} castShadow>
        <boxGeometry args={[2, 1, 0.8]} />
        <meshStandardMaterial color="#8b6f47" roughness={0.7} />
      </mesh>
      {/* Chalkboard */}
      <mesh position={[0, 2.5, -depth / 2 + 0.2]} castShadow>
        <boxGeometry args={[4, 1.5, 0.1]} />
        <meshStandardMaterial color="#2c3e50" roughness={0.3} />
      </mesh>
      {/* Student desks */}
      {desks.map((d, i) => (
        <mesh key={i} position={[d.pos[0], 0.4, d.pos[2]]} castShadow>
          <boxGeometry args={[1, 0.8, 0.6]} />
          <meshStandardMaterial color="#c4a882" roughness={0.7} />
        </mesh>
      ))}
      {/* Windows on left wall */}
      {[-1, 1, 3].map((z) => (
        <mesh key={z} position={[-width / 2 + 0.2, 2.5, z]}>
          <boxGeometry args={[0.05, 1.5, 1.5]} />
          <meshStandardMaterial
            color="#87ceeb"
            transparent
            opacity={0.4}
            metalness={0.1}
            roughness={0.1}
          />
        </mesh>
      ))}
    </group>
  );
}

function HallwayProps({ width, depth }: { width: number; depth: number }) {
  return (
    <group>
      {/* Lockers along the walls */}
      {[-8, -4, 4, 8].map((x) => (
        <mesh key={`l${x}`} position={[x, 1, -depth / 2 + 0.3]} castShadow>
          <boxGeometry args={[1.5, 2, 0.4]} />
          <meshStandardMaterial color="#7a8a99" roughness={0.6} metalness={0.3} />
        </mesh>
      ))}
      {[-8, -4, 4, 8].map((x) => (
        <mesh key={`r${x}`} position={[x, 1, depth / 2 - 0.3]} castShadow>
          <boxGeometry args={[1.5, 2, 0.4]} />
          <meshStandardMaterial color="#7a8a99" roughness={0.6} metalness={0.3} />
        </mesh>
      ))}
      {/* Ceiling lights */}
      {[-6, 0, 6].map((x) => (
        <mesh key={`c${x}`} position={[x, 3.8, 0]}>
          <boxGeometry args={[1, 0.1, 0.5]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#fffaf0"
            emissiveIntensity={0.8}
          />
        </mesh>
      ))}
    </group>
  );
}

function CourtyardProps({ width, depth }: { width: number; depth: number }) {
  const trees = useMemo<
    { pos: [number, number, number]; scale: number }[]
  >(
    () => [
      { pos: [-6, 0, -6], scale: 1.2 },
      { pos: [6, 0, -6], scale: 1.0 },
      { pos: [-7, 0, 5], scale: 0.9 },
      { pos: [7, 0, 5], scale: 1.1 },
      { pos: [0, 0, -8], scale: 1.3 },
    ],
    []
  );

  return (
    <group>
      {/* No walls — open sky. Add a ground texture tint */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <circleGeometry args={[Math.min(width, depth) / 2, 32]} />
        <meshStandardMaterial color="#7a9f5a" roughness={1} />
      </mesh>
      {/* Trees (cherry blossoms) */}
      {trees.map((t, i) => (
        <group key={i} position={t.pos}>
          {/* Trunk */}
          <mesh position={[0, 1, 0]} castShadow>
            <cylinderGeometry args={[0.15, 0.2, 2, 8]} />
            <meshStandardMaterial color="#6b4f3a" roughness={0.9} />
          </mesh>
          {/* Foliage */}
          <mesh position={[0, 2.5, 0]} castShadow>
            <sphereGeometry args={[1.2 * t.scale, 16, 16]} />
            <meshStandardMaterial color="#ffb7c5" roughness={0.8} />
          </mesh>
          <mesh position={[0.4, 3, 0.3]} castShadow>
            <sphereGeometry args={[0.8 * t.scale, 12, 12]} />
            <meshStandardMaterial color="#ffc9d9" roughness={0.8} />
          </mesh>
        </group>
      ))}
      {/* Path */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <planeGeometry args={[2, depth - 4]} />
        <meshStandardMaterial color="#d4c4a8" roughness={0.9} />
      </mesh>
      {/* Fountain */}
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[1.5, 1.8, 0.6, 16]} />
        <meshStandardMaterial color="#a0a0b0" roughness={0.5} metalness={0.3} />
      </mesh>
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[1.2, 1.2, 0.4, 16]} />
        <meshStandardMaterial
          color="#5dade2"
          transparent
          opacity={0.7}
          roughness={0.1}
        />
      </mesh>
    </group>
  );
}

function CafeteriaProps({ width, depth }: { width: number; depth: number }) {
  const tables = useMemo(() => {
    const items: { pos: [number, number, number] }[] = [];
    for (let x = -6; x <= 6; x += 4) {
      for (let z = -4; z <= 4; z += 4) {
        items.push({ pos: [x, 0, z] });
      }
    }
    return items;
  }, []);

  return (
    <group>
      {/* Serving counter */}
      <mesh position={[0, 0.75, -depth / 2 + 1]} castShadow>
        <boxGeometry args={[8, 1.5, 1]} />
        <meshStandardMaterial color="#b09070" roughness={0.6} />
      </mesh>
      {/* Tables */}
      {tables.map((t, i) => (
        <group key={i} position={t.pos}>
          <mesh position={[0, 0.4, 0]} castShadow>
            <boxGeometry args={[2, 0.1, 1.2]} />
            <meshStandardMaterial color="#d4a76a" roughness={0.7} />
          </mesh>
          <mesh position={[-0.7, 0.2, 0]} castShadow>
            <boxGeometry args={[0.3, 0.4, 0.3]} />
            <meshStandardMaterial color="#8b6f47" roughness={0.8} />
          </mesh>
          <mesh position={[0.7, 0.2, 0]} castShadow>
            <boxGeometry args={[0.3, 0.4, 0.3]} />
            <meshStandardMaterial color="#8b6f47" roughness={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export function SchoolEnvironment({
  activeLocation,
  timeOfDay,
}: SchoolEnvironmentProps) {
  const lighting = TIME_LIGHTING[timeOfDay];

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={lighting.ambient} color={lighting.ambientColor} />
      <directionalLight
        intensity={lighting.directional}
        color={lighting.directionalColor}
        position={lighting.directionalPos}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      <hemisphereLight
        intensity={0.3}
        color={lighting.ambientColor}
        groundColor={lighting.fogColor}
      />

      {/* Fog */}
      <fog
        attach="fog"
        args={[lighting.fogColor, lighting.fogNear, lighting.fogFar]}
      />

      {/* Sky / background */}
      <color attach="background" args={[lighting.fogColor]} />

      {/* Active room */}
      <Room location={activeLocation} isActive={true} />
    </>
  );
}
