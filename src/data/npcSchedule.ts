import type { CharacterId, TimeOfDay, NPCPlacement } from '../types';

// Where each NPC is at each time of day.
// To change placements, edit this map — the NPC system reads from here.
export const NPC_SCHEDULE: Record<
  string,
  Record<TimeOfDay, NPCPlacement>
> = {
  sakura: {
    morning: { characterId: 'sakura', location: 'classroom', position: [-3, 0, -2], rotation: 0 },
    afternoon: { characterId: 'sakura', location: 'courtyard', position: [4, 0, 3], rotation: Math.PI },
    evening: { characterId: 'sakura', location: 'hallway', position: [5, 0, -1], rotation: -Math.PI / 2 },
  },
  yuki: {
    morning: { characterId: 'yuki', location: 'classroom', position: [3, 0, -2], rotation: 0 },
    afternoon: { characterId: 'yuki', location: 'cafeteria', position: [-4, 0, -3], rotation: Math.PI / 2 },
    evening: { characterId: 'yuki', location: 'courtyard', position: [-5, 0, -5], rotation: Math.PI / 4 },
  },
  haruto: {
    morning: { characterId: 'haruto', location: 'classroom', position: [0, 0, -5], rotation: 0 },
    afternoon: { characterId: 'haruto', location: 'cafeteria', position: [3, 0, 2], rotation: -Math.PI / 2 },
    evening: { characterId: 'haruto', location: 'hallway', position: [-5, 0, 1], rotation: Math.PI / 2 },
  },
  kenji: {
    morning: { characterId: 'kenji', location: 'courtyard', position: [8, 0, -8], rotation: 0 },
    afternoon: { characterId: 'kenji', location: 'courtyard', position: [-8, 0, 8], rotation: Math.PI },
    evening: { characterId: 'kenji', location: 'hallway', position: [0, 0, 2], rotation: 0 },
  },
  miyuki: {
    morning: { characterId: 'miyuki', location: 'hallway', position: [-8, 0, 0], rotation: Math.PI / 2 },
    afternoon: { characterId: 'miyuki', location: 'hallway', position: [8, 0, 0], rotation: -Math.PI / 2 },
    evening: { characterId: 'miyuki', location: 'cafeteria', position: [0, 0, -5], rotation: 0 },
  },
  ren: {
    morning: { characterId: 'ren', location: 'hallway', position: [10, 0, -2], rotation: Math.PI },
    afternoon: { characterId: 'ren', location: 'classroom', position: [5, 0, -5], rotation: 0 },
    evening: { characterId: 'ren', location: 'courtyard', position: [0, 0, 10], rotation: Math.PI },
  },
};

export function getNPCPlacement(
  characterId: CharacterId,
  period: TimeOfDay
): NPCPlacement {
  return NPC_SCHEDULE[characterId]?.[period] ?? NPC_SCHEDULE.sakura.morning;
}
