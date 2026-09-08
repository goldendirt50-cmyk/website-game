Place your Mixamo animation FBX files in this directory.

Expected files (names must match):
  idle.fbx    - Standing idle loop
  walk.fbx   - Walking loop
  run.fbx    - Running loop
  wave.fbx   - Waving (one-shot)
  sit.fbx    - Sitting idle
  talk.fbx   - Talking gesture loop

To add a new animation:
1. Add the FBX file here (e.g. "dance.fbx")
2. Add an entry in src/data/animations.ts:
     dance: { name: 'dance', url: '/animations/dance.fbx' }
3. Add the clip name to AnimClipName in src/types/index.ts:
     | 'dance'
4. Use the new animation state in your component logic.
