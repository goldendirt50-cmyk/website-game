import { create } from 'zustand';
import type {
  AffinityState,
  CharacterId,
  DialogueState,
  EventId,
  EventState,
  GameFlags,
  InteractionState,
  LocationId,
  PlayerState,
  TimeOfDay,
} from '../types';
import { getDialogueTreeId, DIALOGUE_TREES, EVENTS } from '../data/dialogue';

const TIME_ORDER: TimeOfDay[] = ['morning', 'afternoon', 'evening'];

export interface GameStore {
  // Player
  player: PlayerState;
  setPlayerPosition: (pos: [number, number, number]) => void;
  setPlayerRotation: (rot: number) => void;
  setPlayerLocation: (loc: LocationId) => void;

  // Time
  day: number;
  period: TimeOfDay;
  advanceTime: () => void;

  // Affinity
  affinity: AffinityState;
  changeAffinity: (charId: CharacterId, delta: number) => void;

  // Flags
  flags: GameFlags;
  setFlag: (flag: string) => void;
  hasFlag: (flag: string) => boolean;

  // Dialogue
  dialogue: DialogueState;
  startDialogue: (charId: CharacterId) => void;
  advanceDialogue: () => void;
  chooseDialogueOption: (choiceId: string) => void;
  endDialogue: () => void;

  // Interaction
  interaction: InteractionState;
  setNearbyNPC: (id: CharacterId | null) => void;

  // Events
  eventState: EventState;
  triggerEvent: (eventId: EventId) => void;
  completeEvent: (eventId: EventId) => void;
  endEvent: () => void;
  availableEvents: () => EventId[];

  // Save / Load (in-memory snapshot)
  save: () => void;
  load: () => void;
  hasSave: boolean;
  reset: () => void;
}

interface SaveSnapshot {
  player: PlayerState;
  day: number;
  period: TimeOfDay;
  affinity: AffinityState;
  flags: GameFlags;
  eventState: EventState;
}

let savedSnapshot: SaveSnapshot | null = null;

const initialPlayer: PlayerState = {
  position: [0, 0, 6],
  rotation: 0,
  location: 'classroom',
};

const initialAffinity: AffinityState = {
  sakura: 0,
  yuki: 0,
};

const initialFlags: GameFlags = {};

const initialEventState: EventState = {
  activeEventId: null,
  completedEvents: [],
};

const initialDialogue: DialogueState = {
  active: false,
  treeId: null,
  currentNodeId: null,
  speakerId: null,
};

const initialInteraction: InteractionState = {
  nearbyNPCId: null,
  promptVisible: false,
};

export const useGameStore = create<GameStore>((set, get) => ({
  player: { ...initialPlayer },
  setPlayerPosition: (pos) =>
    set((s) => ({ player: { ...s.player, position: pos } })),
  setPlayerRotation: (rot) =>
    set((s) => ({ player: { ...s.player, rotation: rot } })),
  setPlayerLocation: (loc) =>
    set((s) => ({ player: { ...s.player, location: loc } })),

  day: 1,
  period: 'morning',
  advanceTime: () => {
    const state = get();
    const currentIdx = TIME_ORDER.indexOf(state.period);
    if (currentIdx < TIME_ORDER.length - 1) {
      set({ period: TIME_ORDER[currentIdx + 1] });
    } else {
      set({ period: 'morning', day: state.day + 1 });
    }
  },

  affinity: { ...initialAffinity },
  changeAffinity: (charId, delta) => {
    if (charId !== 'sakura' && charId !== 'yuki') return;
    set((s) => ({
      affinity: {
        ...s.affinity,
        [charId]: Math.max(0, Math.min(100, s.affinity[charId] + delta)),
      },
    }));
  },

  flags: { ...initialFlags },
  setFlag: (flag) =>
    set((s) => ({ flags: { ...s.flags, [flag]: true } })),
  hasFlag: (flag) => get().flags[flag] === true,

  dialogue: { ...initialDialogue },
  startDialogue: (charId) => {
    const { period } = get();
    const treeId = getDialogueTreeId(charId, period);
    if (!treeId || !DIALOGUE_TREES[treeId]) return;
    const tree = DIALOGUE_TREES[treeId];
    const startNode = tree.nodes[tree.startNodeId];
    if (!startNode) return;
    set({
      dialogue: {
        active: true,
        treeId,
        currentNodeId: tree.startNodeId,
        speakerId: charId,
      },
    });
  },
  advanceDialogue: () => {
    const { dialogue } = get();
    if (!dialogue.active || !dialogue.treeId || !dialogue.currentNodeId) return;
    const tree = DIALOGUE_TREES[dialogue.treeId];
    if (!tree) return;
    const node = tree.nodes[dialogue.currentNodeId];
    if (!node) return;
    if (node.nextNodeId) {
      const next = tree.nodes[node.nextNodeId];
      if (next) {
        // Check flag requirement
        if (next.requiresFlag && !get().hasFlag(next.requiresFlag)) {
          get().endDialogue();
          return;
        }
        set({ dialogue: { ...dialogue, currentNodeId: node.nextNodeId } });
      } else {
        get().endDialogue();
      }
    } else {
      // No next node and no choices = end dialogue
      if (!node.choices || node.choices.length === 0) {
        get().endDialogue();
      }
    }
  },
  chooseDialogueOption: (choiceId) => {
    const { dialogue } = get();
    if (!dialogue.active || !dialogue.treeId || !dialogue.currentNodeId) return;
    const tree = DIALOGUE_TREES[dialogue.treeId];
    if (!tree) return;
    const node = tree.nodes[dialogue.currentNodeId];
    if (!node || !node.choices) return;
    const choice = node.choices.find((c) => c.id === choiceId);
    if (!choice) return;

    // Apply affinity changes
    if (choice.affinityDelta) {
      for (const [charId, delta] of Object.entries(choice.affinityDelta)) {
        get().changeAffinity(charId as CharacterId, delta as number);
      }
    }
    // Set flag
    if (choice.setFlag) {
      get().setFlag(choice.setFlag);
    }
    // Navigate to next node or end
    if (choice.nextNodeId) {
      const next = tree.nodes[choice.nextNodeId];
      if (next) {
        if (next.requiresFlag && !get().hasFlag(next.requiresFlag)) {
          get().endDialogue();
          return;
        }
        set({ dialogue: { ...dialogue, currentNodeId: choice.nextNodeId } });
      } else {
        get().endDialogue();
      }
    } else {
      get().endDialogue();
    }
  },
  endDialogue: () =>
    set({ dialogue: { ...initialDialogue } }),

  interaction: { ...initialInteraction },
  setNearbyNPC: (id) =>
    set({ interaction: { nearbyNPCId: id, promptVisible: id !== null } }),

  eventState: { ...initialEventState },
  triggerEvent: (eventId) => {
    const ev = EVENTS[eventId];
    if (!ev) return;
    set((s) => ({ eventState: { ...s.eventState, activeEventId: eventId } }));
  },
  completeEvent: (eventId) => {
    const ev = EVENTS[eventId];
    if (!ev) return;
    set((s) => ({
      eventState: {
        activeEventId: null,
        completedEvents: s.eventState.completedEvents.includes(eventId)
          ? s.eventState.completedEvents
          : [...s.eventState.completedEvents, eventId],
      },
    }));
    if (ev.setFlag) get().setFlag(ev.setFlag);
    if (ev.affinityReward) get().changeAffinity(ev.characterId, ev.affinityReward);
  },
  endEvent: () =>
    set((s) => ({ eventState: { ...s.eventState, activeEventId: null } })),
  availableEvents: () => {
    const { affinity, flags, period, eventState } = get();
    return (Object.keys(EVENTS) as EventId[]).filter((id) => {
      const ev = EVENTS[id];
      if (eventState.completedEvents.includes(id)) return false;
      if (affinity[ev.characterId as keyof AffinityState] < ev.requiredAffinity) return false;
      if (ev.requiredTime && ev.requiredTime !== period) return false;
      if (ev.requiredFlag && !flags[ev.requiredFlag]) return false;
      return true;
    });
  },

  hasSave: false,
  save: () => {
    const s = get();
    savedSnapshot = {
      player: { ...s.player },
      day: s.day,
      period: s.period,
      affinity: { ...s.affinity },
      flags: { ...s.flags },
      eventState: { ...s.eventState },
    };
    set({ hasSave: true });
  },
  load: () => {
    if (!savedSnapshot) return;
    set({
      player: { ...savedSnapshot.player },
      day: savedSnapshot.day,
      period: savedSnapshot.period,
      affinity: { ...savedSnapshot.affinity },
      flags: { ...savedSnapshot.flags },
      eventState: { ...savedSnapshot.eventState },
      dialogue: { ...initialDialogue },
      interaction: { ...initialInteraction },
    });
  },
  reset: () =>
    set({
      player: { ...initialPlayer },
      day: 1,
      period: 'morning',
      affinity: { ...initialAffinity },
      flags: { ...initialFlags },
      eventState: { ...initialEventState },
      dialogue: { ...initialDialogue },
      interaction: { ...initialInteraction },
    }),
}));
