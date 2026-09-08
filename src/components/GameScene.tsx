import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import * as THREE from 'three';
import { SchoolEnvironment } from './SchoolEnvironment';
import { PlayerController } from './PlayerController';
import { NPCManager } from './NPCManager';
import { useGameStore } from '../store/gameStore';

/**
 * The 3D scene: canvas + environment + player + NPCs.
 * Reads current location and time-of-day from the game store.
 */
export function GameScene() {
  const playerLocation = useGameStore((s) => s.player.location);
  const timeOfDay = useGameStore((s) => s.period);

  return (
    <Canvas
      shadows
      camera={{ fov: 60, near: 0.1, far: 100, position: [0, 5, 10] }}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.0,
      }}
      style={{ width: '100%', height: '100%' }}
    >
      <Suspense fallback={null}>
        <SchoolEnvironment
          activeLocation={playerLocation}
          timeOfDay={timeOfDay}
        />
        <PlayerController />
        <NPCManager />
      </Suspense>
    </Canvas>
  );
}
