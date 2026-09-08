Place your .vrm character model files in this directory.

Then update the vrmPath in src/data/characters.ts for each character:

  sakura: {
    ...
    vrmPath: '/models/sakura.vrm',  // path to your VRM file
    ...
  }

Characters without a vrmPath will use a colored placeholder mesh.

Characters defined:
  - player (Hiro)       - male protagonist
  - sakura              - dateable girl 1
  - yuki                - dateable girl 2
  - haruto              - side character (best friend)
  - kenji               - side character (track captain)
  - miyuki              - side character (school nurse)
  - ren                 - side character (council president)
