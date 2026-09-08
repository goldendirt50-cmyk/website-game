import type * as THREE from 'three';

// ===== Time System =====
export type TimeOfDay = 'morning' | 'afternoon' | 'evening';

export interface TimeState {
  day: number;
  period: TimeOfDay;
}

// ===== Characters =====
export type CharacterId =
  | 'player'
  | 'sakura'
  | 'yuki'
  | 'haruto'
  | 'kenji'
  | 'miyuki'
  | 'ren';

export type CharacterRole = 'player' | 'dateable' | 'side';

export interface CharacterDef {
  id: CharacterId;
  name: string;
  role: CharacterRole;
  vrmPath: string | null;
  portraitColor: string;
  bio: string;
}

// ===== Animations =====
export type AnimClipName =
  | 'idle'
  | 'walk'
  | 'run'
  | 'wave'
  | 'sit'
  | 'talk';

export interface AnimClipDef {
  name: AnimClipName;
  url: string;
}

// ===== Locations =====
export type LocationId =
  | 'classroom'
  | 'hallway'
  | 'courtyard'
  | 'cafeteria';

export interface LocationDef {
  id: LocationId;
  name: string;
  bounds: { minX: number; maxX: number; minZ: number; maxZ: number };
  spawnPoint: [number, number, number];
  color: string;
  accentColor: string;
}

// ===== NPC Placement =====
export interface NPCPlacement {
  characterId: CharacterId;
  location: LocationId;
  position: [number, number, number];
  rotation: number;
}

// ===== Dialogue =====
export interface DialogueChoice {
  id: string;
  text: string;
  affinityDelta?: Partial<Record<CharacterId, number>>;
  setFlag?: string;
  nextNodeId?: string;
  requiresFlag?: string;
}

export interface DialogueNode {
  id: string;
  speaker: CharacterId;
  text: string;
  choices?: DialogueChoice[];
  nextNodeId?: string;
  requiresFlag?: string;
}

export interface DialogueTree {
  id: string;
  characterId: CharacterId;
  startNodeId: string;
  nodes: Record<string, DialogueNode>;
}

// ===== Events / Activities =====
export type EventId =
  | 'walk_date_sakura'
  | 'cafeteria_date_yuki'
  | 'festival_event';

export interface EventDef {
  id: EventId;
  name: string;
  description: string;
  characterId: CharacterId;
  requiredAffinity: number;
  requiredTime?: TimeOfDay;
  requiredFlag?: string;
  setFlag?: string;
  affinityReward?: number;
  location: LocationId;
}

// ===== Game State =====
export interface GameFlags {
  [key: string]: boolean;
}

export interface AffinityState {
  sakura: number;
  yuki: number;
}

export interface PlayerState {
  position: [number, number, number];
  rotation: number;
  location: LocationId;
}

export interface DialogueState {
  active: boolean;
  treeId: string | null;
  currentNodeId: string | null;
  speakerId: CharacterId | null;
}

export interface InteractionState {
  nearbyNPCId: CharacterId | null;
  promptVisible: boolean;
}

export interface EventState {
  activeEventId: EventId | null;
  completedEvents: EventId[];
}

// ===== Animation State =====
export type AnimState = 'idle' | 'walking' | 'running' | 'waving' | 'sitting' | 'talking';

// ===== VRM =====
export interface VRMAnimationMap {
  idle: THREE.AnimationAction | null;
  walk: THREE.AnimationAction | null;
  run: THREE.AnimationAction | null;
  wave: THREE.AnimationAction | null;
  sit: THREE.AnimationAction | null;
  talk: THREE.AnimationAction | null;
}
