import { useRef, useEffect, useCallback, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { CharacterModel } from './CharacterModel';
import { useKeyboard } from '../hooks/useKeyboard';
import { useGameStore } from '../store/gameStore';
import { LOCATIONS } from '../data/locations';
import type { AnimState } from '../types';

const MOVE_SPEED = 3.5;
const RUN_SPEED = 7;
const ROT_SPEED = 8;
const CAMERA_DISTANCE = 5;
const CAMERA_HEIGHT = 3.5;
const CAMERA_SMOOTH = 0.08;
const INTERACT_DISTANCE = 2.5;

/**
 * Player character with WASD movement and a smooth third-person follow camera.
 * Detects nearby NPCs and triggers interaction / dialogue.
 */
export function PlayerController() {
  const keys = useKeyboard();
  const { camera } = useThree();

  const playerRef = useRef<THREE.Group>(null);
  const velocity = useRef(new THREE.Vector3());
  const currentRotation = useRef(0);
  const targetRotation = useRef(0);
  const [animState, setAnimState] = useState<AnimState>('idle');
  const animStateRef = useRef<AnimState>('idle');

  const player = useGameStore((s) => s.player);
  const setPlayerPosition = useGameStore((s) => s.setPlayerPosition);
  const setPlayerRotation = useGameStore((s) => s.setPlayerRotation);
  const dialogueActive = useGameStore((s) => s.dialogue.active);
  const eventActive = useGameStore((s) => s.eventState.activeEventId !== null);
  const setNearbyNPC = useGameStore((s) => s.setNearbyNPC);
  const startDialogue = useGameStore((s) => s.startDialogue);
  const interaction = useGameStore((s) => s.interaction);

  const npcPositionsRef = useRef<Map<string, THREE.Vector3>>(new Map());

  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.position.set(...player.position);
      currentRotation.current = player.rotation;
      targetRotation.current = player.rotation;
    }
  }, []);

  useEffect(() => {
    (window as any).__npcPositions = npcPositionsRef.current;
  }, []);

  const interactPressed = useRef(false);
  const handleInteraction = useCallback(() => {
    if (dialogueActive || eventActive) return;
    if (!keys.current.interact) {
      interactPressed.current = false;
      return;
    }
    if (interactPressed.current) return;
    interactPressed.current = true;

    if (interaction.nearbyNPCId) {
      startDialogue(interaction.nearbyNPCId);
    }
  }, [dialogueActive, eventActive, interaction.nearbyNPCId, startDialogue, keys]);

  const updateAnimState = (newState: AnimState) => {
    if (animStateRef.current !== newState) {
      animStateRef.current = newState;
      setAnimState(newState);
    }
  };

  useFrame((_, delta) => {
    if (!playerRef.current) return;

    if (dialogueActive || eventActive) {
      velocity.current.set(0, 0, 0);
      updateAnimState('idle');
      handleInteraction();
      return;
    }

    const moveDir = new THREE.Vector3();
    if (keys.current.forward) moveDir.z -= 1;
    if (keys.current.backward) moveDir.z += 1;
    if (keys.current.left) moveDir.x -= 1;
    if (keys.current.right) moveDir.x += 1;

    const isMoving = moveDir.lengthSq() > 0;
    const isRunning = keys.current.run && isMoving;
    const speed = isRunning ? RUN_SPEED : MOVE_SPEED;

    if (isMoving) {
      moveDir.normalize();
      const camForward = new THREE.Vector3();
      camera.getWorldDirection(camForward);
      camForward.y = 0;
      camForward.normalize();

      const camRight = new THREE.Vector3();
      camRight.crossVectors(camForward, new THREE.Vector3(0, 1, 0)).normalize();

      const worldMove = new THREE.Vector3();
      worldMove.addScaledVector(camForward, -moveDir.z);
      worldMove.addScaledVector(camRight, moveDir.x);
      worldMove.normalize();

      velocity.current.copy(worldMove).multiplyScalar(speed * delta);
      targetRotation.current = Math.atan2(worldMove.x, worldMove.z);
      updateAnimState(isRunning ? 'running' : 'walking');
    } else {
      velocity.current.set(0, 0, 0);
      updateAnimState('idle');
    }

    const pos = playerRef.current.position;
    pos.add(velocity.current);

    const loc = LOCATIONS[player.location];
    if (loc) {
      pos.x = THREE.MathUtils.clamp(pos.x, loc.bounds.minX, loc.bounds.maxX);
      pos.z = THREE.MathUtils.clamp(pos.z, loc.bounds.minZ, loc.bounds.maxZ);
    }
    pos.y = 0;

    let diff = targetRotation.current - currentRotation.current;
    while (diff > Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;
    currentRotation.current += diff * ROT_SPEED * delta;
    playerRef.current.rotation.y = currentRotation.current;

    setPlayerPosition([pos.x, pos.y, pos.z]);
    setPlayerRotation(currentRotation.current);

    // NPC proximity check
    let nearestNPC: string | null = null;
    let nearestDist = INTERACT_DISTANCE;
    npcPositionsRef.current.forEach((npcPos, npcId) => {
      const dist = pos.distanceTo(npcPos);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearestNPC = npcId;
      }
    });
    setNearbyNPC(nearestNPC as any);

    // Camera follow
    const behindDir = new THREE.Vector3(
      Math.sin(currentRotation.current),
      0,
      Math.cos(currentRotation.current)
    );
    const desiredCamPos = new THREE.Vector3().copy(pos);
    desiredCamPos.addScaledVector(behindDir, -CAMERA_DISTANCE);
    desiredCamPos.y = pos.y + CAMERA_HEIGHT;

    const camTarget = new THREE.Vector3().copy(pos);
    camTarget.y += 1.5;

    camera.position.lerp(desiredCamPos, CAMERA_SMOOTH);
    camera.lookAt(camTarget);

    handleInteraction();
  });

  return (
    <group ref={playerRef}>
      <CharacterModel characterId="player" animState={animState} />
    </group>
  );
}
