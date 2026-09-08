import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { VRM, VRMUtils } from '@pixiv/three-vrm';

// Cache loaded VRM models so we don't reload the same file.
const vrmCache = new Map<string, Promise<VRM>>();

/**
 * Load a VRM file and return the VRM object.
 * Caches by URL so repeated calls for the same model are instant.
 */
export async function loadVRM(url: string): Promise<VRM> {
  if (vrmCache.has(url)) {
    return vrmCache.get(url)!;
  }

  const promise = (async () => {
    const loader = new GLTFLoader();
    const gltf = await loader.loadAsync(url);
    const vrm = gltf.userData.vrm as VRM | undefined;

    if (!vrm) {
      throw new Error(`File at ${url} is not a valid VRM model.`);
    }

    // Remove unnecessary lights/cameras embedded in the VRM
    VRMUtils.removeUnnecessaryVertices(vrm.scene);
    vrm.scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.frustumCulled = false;
      }
    });

    return vrm;
  })();

  vrmCache.set(url, promise);
  return promise;
}

/**
 * Create a simple placeholder humanoid mesh for when VRM files are not yet provided.
 * Returns a Group shaped roughly like a person with color-coded materials.
 */
export function createPlaceholderCharacter(color: string): THREE.Group {
  const group = new THREE.Group();

  // Body
  const bodyMat = new THREE.MeshStandardMaterial({ color, roughness: 0.7 });
  const headMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(color).offsetHSL(0, -0.1, 0.15),
    roughness: 0.6,
  });

  // Head
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.25, 16, 16), headMat);
  head.position.y = 1.65;
  head.castShadow = true;
  group.add(head);

  // Hair (simple cap)
  const hairMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(color).offsetHSL(0, 0.1, -0.2),
    roughness: 0.8,
  });
  const hair = new THREE.Mesh(new THREE.SphereGeometry(0.28, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.55), hairMat);
  hair.position.y = 1.68;
  hair.castShadow = true;
  group.add(hair);

  // Torso
  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.22, 0.5, 4, 12), bodyMat);
  torso.position.y = 1.1;
  torso.castShadow = true;
  group.add(torso);

  // Arms
  const armGeo = new THREE.CapsuleGeometry(0.07, 0.45, 4, 8);
  const leftArm = new THREE.Mesh(armGeo, bodyMat);
  leftArm.position.set(-0.3, 1.1, 0);
  leftArm.castShadow = true;
  group.add(leftArm);
  const rightArm = new THREE.Mesh(armGeo, bodyMat);
  rightArm.position.set(0.3, 1.1, 0);
  rightArm.castShadow = true;
  group.add(rightArm);

  // Legs
  const legGeo = new THREE.CapsuleGeometry(0.09, 0.5, 4, 8);
  const leftLeg = new THREE.Mesh(legGeo, bodyMat);
  leftLeg.position.set(-0.12, 0.35, 0);
  leftLeg.castShadow = true;
  group.add(leftLeg);
  const rightLeg = new THREE.Mesh(legGeo, bodyMat);
  rightLeg.position.set(0.12, 0.35, 0);
  rightLeg.castShadow = true;
  group.add(rightLeg);

  // Name tag sprite
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.fillRect(0, 0, 256, 64);
  ctx.font = 'bold 28px sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('PLACEHOLDER', 128, 32);
  const texture = new THREE.CanvasTexture(canvas);
  const spriteMat = new THREE.SpriteMaterial({ map: texture, depthTest: false });
  const sprite = new THREE.Sprite(spriteMat);
  sprite.position.y = 2.2;
  sprite.scale.set(1.2, 0.3, 1);
  group.add(sprite);

  return group;
}
