import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CharacterModel } from './CharacterModel';
import { Text, Billboard } from '@react-three/drei';
import { useGameStore } from '../store/gameStore';
import { getNPCPlacement } from '../data/npcSchedule';
import { CHARACTERS } from '../data/characters';
import { ALL_NPC_IDS } from '../data/characters';
import type { CharacterId, AnimState } from '../types';

interface NPCInstance {
  characterId: CharacterId;
  position: [number, number, number];
  rotation: number;
  animState: AnimState;
}

/**
 * Manages all NPC characters in the scene.
 * Reads the NPC schedule (location by time of day) and places characters accordingly.
 * Shows interaction prompts when the player is nearby.
 */
export function NPCManager() {
  const period = useGameStore((s) => s.period);
  const playerLocation = useGameStore((s) => s.player.location);
  const nearbyNPCId = useGameStore((s) => s.interaction.nearbyNPCId);
  const dialogueActive = useGameStore((s) => s.dialogue.active);
  const dialogueSpeakerId = useGameStore((s) => s.dialogue.speakerId);

  // Compute NPC placements for current time period
  const npcs: NPCInstance[] = ALL_NPC_IDS.map((id) => {
    const placement = getNPCPlacement(id, period);
    return {
      characterId: id,
      position: placement.position,
      rotation: placement.rotation,
      animState: 'idle' as AnimState,
    };
  }).filter((npc) => {
    // Only show NPCs in the same location as the player
    const placement = getNPCPlacement(npc.characterId, period);
    return placement.location === playerLocation;
  });

  // Register NPC positions on window for player proximity checks
  useEffect(() => {
    const map = (window as any).__npcPositions as Map<string, THREE.Vector3>;
    if (!map) return;
    map.clear();
    for (const npc of npcs) {
      map.set(
        npc.characterId,
        new THREE.Vector3(npc.position[0], npc.position[1], npc.position[2])
      );
    }
  }, [npcs, period]);

  return (
    <>
      {npcs.map((npc) => (
        <NPCCharacter
          key={npc.characterId}
          characterId={npc.characterId}
          position={npc.position}
          rotation={npc.rotation}
          isNearby={nearbyNPCId === npc.characterId}
          isTalking={dialogueActive && dialogueSpeakerId === npc.characterId}
        />
      ))}
    </>
  );
}

function NPCCharacter({
  characterId,
  position,
  rotation,
  isNearby,
  isTalking,
}: {
  characterId: CharacterId;
  position: [number, number, number];
  rotation: number;
  isNearby: boolean;
  isTalking: boolean;
}) {
  const char = CHARACTERS[characterId];
  const [animState, setAnimState] = useState<AnimState>('idle');

  useEffect(() => {
    if (isTalking) {
      setAnimState('talking');
    } else {
      setAnimState('idle');
    }
  }, [isTalking]);

  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <CharacterModel characterId={characterId} animState={animState} />

      {/* Name tag above NPC */}
      <Billboard position={[0, 2.2, 0]}>
        <Text
          fontSize={0.22}
          color="#ffffff"
          outlineWidth={0.02}
          outlineColor="#000000"
          anchorX="center"
          anchorY="middle"
        >
          {char.name}
        </Text>
      </Billboard>

      {/* Interaction prompt */}
      {isNearby && !isTalking && (
        <Billboard position={[0, 2.6, 0]}>
          <group>
            <mesh position={[0, 0, -0.01]}>
              <planeGeometry args={[1.2, 0.4]} />
              <meshBasicMaterial color="#000000" transparent opacity={0.7} />
            </mesh>
            <Text
              fontSize={0.18}
              color="#ffdd44"
              outlineWidth={0.01}
              outlineColor="#000000"
              anchorX="center"
              anchorY="middle"
            >
              Press E to Talk
            </Text>
          </group>
        </Billboard>
      )}
    </group>
  );
}
