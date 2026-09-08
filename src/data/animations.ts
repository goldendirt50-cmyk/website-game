import type { AnimClipDef, AnimClipName } from '../types';

// Animation URLs — replace with your own Mixamo FBX clips.
// The animation system loads these per-character and maps them by name.
// To add a new clip: add an entry here and add the name to AnimClipName in types/index.ts.
export const ANIMATION_CLIPS: Record<AnimClipName, AnimClipDef> = {
  idle: { name: 'idle', url: '/animations/idle.fbx' },
  walk: { name: 'walk', url: '/animations/walk.fbx' },
  run: { name: 'run', url: '/animations/run.fbx' },
  wave: { name: 'wave', url: '/animations/wave.fbx' },
  sit: { name: 'sit', url: '/animations/sit.fbx' },
  talk: { name: 'talk', url: '/animations/talk.fbx' },
};

export const ALL_CLIP_NAMES: AnimClipName[] = ['idle', 'walk', 'run', 'wave', 'sit', 'talk'];
