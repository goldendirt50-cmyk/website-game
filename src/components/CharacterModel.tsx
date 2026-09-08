import { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { CharacterId, AnimState } from '../types';
import { loadVRM, createPlaceholderCharacter } from '../utils/vrmLoader';
import { CHARACTERS } from '../data/characters';
import { ANIMATION_CLIPS } from '../data/animations';
import type { VRM } from '@pixiv/three-vrm';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

interface CharacterModelProps {
  characterId: CharacterId;
  position?: [number, number, number];
  rotation?: number;
  animState: AnimState;
  scale?: number;
}

/**
 * Renders a character (VRM if available, placeholder otherwise).
 * Loads animation clips from URLs and blends between them based on animState.
 * To add a new animation: add the clip to ANIMATION_CLIPS and the name to AnimClipName.
 */
export function CharacterModel({
  characterId,
  position = [0, 0, 0],
  rotation = 0,
  animState,
  scale = 1,
}: CharacterModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const actionsRef = useRef<Map<string, THREE.AnimationAction>>(new Map());
  const currentActionRef = useRef<THREE.AnimationAction | null>(null);
  const vrmRef = useRef<VRM | null>(null);

  const [modelGroup, setModelGroup] = useState<THREE.Group | null>(null);
  const [loadError, setLoadError] = useState(false);

  // Load character model (VRM or placeholder)
  useEffect(() => {
    let cancelled = false;
    const char = CHARACTERS[characterId];

    if (char.vrmPath) {
      loadVRM(char.vrmPath)
        .then((vrm) => {
          if (cancelled) return;
          vrmRef.current = vrm;
          setModelGroup(vrm.scene);
        })
        .catch((err) => {
          console.warn(`Failed to load VRM for ${characterId}:`, err);
          if (!cancelled) {
            setLoadError(true);
            setModelGroup(createPlaceholderCharacter(char.portraitColor));
          }
        });
    } else {
      // No VRM path provided yet — use placeholder
      setModelGroup(createPlaceholderCharacter(char.portraitColor));
    }

    return () => {
      cancelled = true;
    };
  }, [characterId]);

  // Load animation clips and set up mixer
  useEffect(() => {
    if (!modelGroup) return;

    const mixer = new THREE.AnimationMixer(modelGroup);
    mixerRef.current = mixer;
    actionsRef.current.clear();

    const loader = new GLTFLoader();
    let clipsLoaded = 0;
    let clipsTotal = 0;

    // Load each animation clip defined in ANIMATION_CLIPS
    for (const [clipName, clipDef] of Object.entries(ANIMATION_CLIPS)) {
      clipsTotal++;
      loader.load(
        clipDef.url,
        (gltf) => {
          if (gltf.animations.length > 0) {
            const clip = gltf.animations[0];
            const action = mixer.clipAction(clip, modelGroup);
            action.clampWhenFinished = true;
            actionsRef.current.set(clipName, action);
          }
          clipsLoaded++;
          // If all clips attempted, set initial animation
          if (clipsLoaded >= clipsTotal) {
            playAnimation('idle');
          }
        },
        undefined,
        () => {
          // Clip failed to load (expected when files not yet provided)
          clipsLoaded++;
          if (clipsLoaded >= clipsTotal) {
            playAnimation('idle');
          }
        }
      );
    }

    function playAnimation(state: AnimState) {
      const action = actionsRef.current.get(state);
      if (!action) {
        // Fallback: try idle, or just stop
        const idleAction = actionsRef.current.get('idle');
        if (idleAction && currentActionRef.current !== idleAction) {
          currentActionRef.current?.fadeOut(0.2);
          idleAction.reset().fadeIn(0.2).play();
          currentActionRef.current = idleAction;
        }
        return;
      }
      if (currentActionRef.current === action) return;
      currentActionRef.current?.fadeOut(0.2);
      action.reset().fadeIn(0.2).play();
      currentActionRef.current = action;
    }

    return () => {
      mixer.stopAllAction();
      mixer.uncacheRoot(modelGroup);
      mixerRef.current = null;
    };
  }, [modelGroup]);

  // Switch animation when animState changes
  useEffect(() => {
    if (!mixerRef.current || actionsRef.current.size === 0) return;

    const action = actionsRef.current.get(animState);
    if (action) {
      if (currentActionRef.current === action) return;
      currentActionRef.current?.fadeOut(0.2);
      action.reset().fadeIn(0.2).play();
      currentActionRef.current = action;
    } else {
      // Fallback to idle
      const idle = actionsRef.current.get('idle');
      if (idle && currentActionRef.current !== idle) {
        currentActionRef.current?.fadeOut(0.2);
        idle.reset().fadeIn(0.2).play();
        currentActionRef.current = idle;
      }
    }
  }, [animState, modelGroup]);

  // Update mixer + VRM each frame
  useFrame((_, delta) => {
    mixerRef.current?.update(delta);
    vrmRef.current?.update(delta);
  });

  if (!modelGroup) return null;

  return (
    <group ref={groupRef} position={position} rotation={[0, rotation, 0]} scale={scale}>
      <primitive object={modelGroup} />
    </group>
  );
}
