import type { CharacterDef, CharacterId } from '../types';

export const CHARACTERS: Record<CharacterId, CharacterDef> = {
  player: {
    id: 'player',
    name: 'Hiro',
    role: 'player',
    vrmPath: null,
    portraitColor: '#4a90d9',
    bio: 'A transfer student at Sakura Academy. You.',
  },
  sakura: {
    id: 'sakura',
    name: 'Sakura',
    role: 'dateable',
    vrmPath: null,
    portraitColor: '#ff6b9d',
    bio: 'Cheerful class representative who loves cherry blossoms and photography.',
  },
  yuki: {
    id: 'yuki',
    name: 'Yuki',
    role: 'dateable',
    vrmPath: null,
    portraitColor: '#7ec8e3',
    bio: 'Quiet bookworm who spends her time in the library and loves stargazing.',
  },
  haruto: {
    id: 'haruto',
    name: 'Haruto',
    role: 'side',
    vrmPath: null,
    portraitColor: '#52c41a',
    bio: 'Your easygoing best friend and classmate.',
  },
  kenji: {
    id: 'kenji',
    name: 'Kenji',
    role: 'side',
    vrmPath: null,
    portraitColor: '#fa8c16',
    bio: 'Captain of the track team. Always running somewhere.',
  },
  miyuki: {
    id: 'miyuki',
    name: 'Miyuki',
    role: 'side',
    vrmPath: null,
    portraitColor: '#b37feb',
    bio: 'The school nurse who always has advice ready.',
  },
  ren: {
    id: 'ren',
    name: 'Ren',
    role: 'side',
    vrmPath: null,
    portraitColor: '#13c2c2',
    bio: 'The stoic student council president.',
  },
};

export const DATEABLE_IDS: CharacterId[] = ['sakura', 'yuki'];
export const ALL_NPC_IDS: CharacterId[] = ['sakura', 'yuki', 'haruto', 'kenji', 'miyuki', 'ren'];
