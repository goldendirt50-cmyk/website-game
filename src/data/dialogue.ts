import type { DialogueTree, EventDef, EventId } from '../types';

// ===== DIALOGUE TREES =====
// Placeholder dialogue — replace text and choices freely.
// Each tree belongs to a character. Nodes link via nextNodeId or choices[].nextNodeId.
// Use requiresFlag to gate nodes behind story progress.
// Use setFlag / affinityDelta on choices to drive state changes.

export const DIALOGUE_TREES: Record<string, DialogueTree> = {
  sakura_morning: {
    id: 'sakura_morning',
    characterId: 'sakura',
    startNodeId: 's1',
    nodes: {
      s1: {
        id: 's1',
        speaker: 'sakura',
        text: 'Oh! Good morning, Hiro! Did you sleep well? The cherry blossoms looked so pretty last night — I tried to photograph them!',
        choices: [
          {
            id: 's1a',
            text: 'That sounds amazing! I would love to see the photos sometime.',
            affinityDelta: { sakura: 5 },
            nextNodeId: 's2',
          },
          {
            id: 's1b',
            text: 'I slept okay. You really like photography, huh?',
            affinityDelta: { sakura: 2 },
            nextNodeId: 's2b',
          },
        ],
      },
      s2: {
        id: 's2',
        speaker: 'sakura',
        text: 'Really?! I would love to show you! Maybe we could go to the courtyard together during lunch? I know the best spot for photos!',
        choices: [
          {
            id: 's2a',
            text: 'I would love that! Let us go together.',
            affinityDelta: { sakura: 5 },
            setFlag: 'sakura_lunch_date',
            nextNodeId: 's3',
          },
          {
            id: 's2b',
            text: 'Maybe later, I have some things to do first.',
            affinityDelta: { sakura: -2 },
            nextNodeId: 's3',
          },
        ],
      },
      s2b: {
        id: 's2b',
        speaker: 'sakura',
        text: 'Yep! Photography is my passion. Every moment is worth capturing, you know? Like this one — talking with you!',
        nextNodeId: 's3',
      },
      s3: {
        id: 's3',
        speaker: 'sakura',
        text: 'Well, class is about to start. See you later, Hiro! I will be in the courtyard if you want to find me!',
      },
    },
  },

  sakura_afternoon: {
    id: 'sakura_afternoon',
    characterId: 'sakura',
    startNodeId: 'sa1',
    nodes: {
      sa1: {
        id: 'sa1',
        speaker: 'sakura',
        text: 'Hiro! You came! Look — the light is perfect right now. Here, let me show you the photos from this morning!',
        choices: [
          {
            id: 'sa1a',
            text: 'These are really beautiful, Sakura. You have talent.',
            affinityDelta: { sakura: 8 },
            nextNodeId: 'sa2',
          },
          {
            id: 'sa1b',
            text: 'They are nice. So what do you usually do out here?',
            affinityDelta: { sakura: 3 },
            nextNodeId: 'sa2',
          },
        ],
      },
      sa2: {
        id: 'sa2',
        speaker: 'sakura',
        text: 'Thank you! I just... I love finding beautiful moments. And lately, talking with you has been one of them.',
        choices: [
          {
            id: 'sa2a',
            text: 'I feel the same way, Sakura.',
            affinityDelta: { sakura: 10 },
            setFlag: 'sakura_close',
            nextNodeId: 'sa3',
          },
          {
            id: 'sa2b',
            text: 'That is really sweet of you to say.',
            affinityDelta: { sakura: 5 },
            nextNodeId: 'sa3',
          },
        ],
      },
      sa3: {
        id: 'sa3',
        speaker: 'sakura',
        text: 'We should spend more time together. Come find me again, okay?',
      },
    },
  },

  sakura_evening: {
    id: 'sakura_evening',
    characterId: 'sakura',
    startNodeId: 'se1',
    nodes: {
      se1: {
        id: 'se1',
        speaker: 'sakura',
        text: 'Hiro, you are still here? The evening light is so warm... I was just thinking about you.',
        choices: [
          {
            id: 'se1a',
            text: 'I was looking for you, actually.',
            affinityDelta: { sakura: 8 },
            nextNodeId: 'se2',
          },
          {
            id: 'se1b',
            text: 'Just passing by. What are you up to?',
            affinityDelta: { sakura: 2 },
            nextNodeId: 'se2',
          },
        ],
      },
      se2: {
        id: 'se2',
        speaker: 'sakura',
        text: 'I was about to head home, but... would you want to walk together? The cherry blossoms are even prettier at dusk.',
        choices: [
          {
            id: 'se2a',
            text: 'I would love to. Let us go.',
            affinityDelta: { sakura: 12 },
            setFlag: 'sakura_walk_date_ready',
            nextNodeId: 'se3',
          },
          {
            id: 'se2b',
            text: 'Maybe another time? I need to get going.',
            affinityDelta: { sakura: -3 },
            nextNodeId: 'se3',
          },
        ],
      },
      se3: {
        id: 'se3',
        speaker: 'sakura',
        text: 'Goodnight, Hiro. See you tomorrow!',
      },
    },
  },

  yuki_morning: {
    id: 'yuki_morning',
    characterId: 'yuki',
    startNodeId: 'y1',
    nodes: {
      y1: {
        id: 'y1',
        speaker: 'yuki',
        text: '...Oh. Good morning, Hiro. I was just reading. Did you need something?',
        choices: [
          {
            id: 'y1a',
            text: 'Just wanted to say hi. What are you reading?',
            affinityDelta: { yuki: 5 },
            nextNodeId: 'y2',
          },
          {
            id: 'y1b',
            text: 'Nothing really. You always seem so quiet.',
            affinityDelta: { yuki: 1 },
            nextNodeId: 'y2b',
          },
        ],
      },
      y2: {
        id: 'y2',
        speaker: 'yuki',
        text: 'It is a novel about a girl who travels across the stars to find her way home. I like stories about quiet journeys.',
        choices: [
          {
            id: 'y2a',
            text: 'That sounds beautiful. I would love to hear more about it.',
            affinityDelta: { yuki: 7 },
            nextNodeId: 'y3',
          },
          {
            id: 'y2b',
            text: 'Sounds interesting. Do you ever wish you could travel like that?',
            affinityDelta: { yuki: 4 },
            nextNodeId: 'y3',
          },
        ],
      },
      y2b: {
        id: 'y2b',
        speaker: 'yuki',
        text: 'I am not quiet. I just... prefer to listen. There is a difference. But I do not mind talking with you.',
        nextNodeId: 'y3',
      },
      y3: {
        id: 'y3',
        speaker: 'yuki',
        text: '...Class is starting. You can find me in the cafeteria at lunch if you want. I will be at the corner table.',
      },
    },
  },

  yuki_afternoon: {
    id: 'yuki_afternoon',
    characterId: 'yuki',
    startNodeId: 'ya1',
    nodes: {
      ya1: {
        id: 'ya1',
        speaker: 'yuki',
        text: 'You came. I saved the seat across from me... if you want it.',
        choices: [
          {
            id: 'ya1a',
            text: 'Of course. Thank you, Yuki.',
            affinityDelta: { yuki: 6 },
            nextNodeId: 'ya2',
          },
          {
            id: 'ya1b',
            text: 'I can only stay a minute, but I wanted to see you.',
            affinityDelta: { yuki: 3 },
            nextNodeId: 'ya2',
          },
        ],
      },
      ya2: {
        id: 'ya2',
        speaker: 'yuki',
        text: 'I was reading about constellations last night. Did you know that the stars we see now are light from thousands of years ago?',
        choices: [
          {
            id: 'ya2a',
            text: 'That is incredible. Would you teach me about the stars sometime?',
            affinityDelta: { yuki: 10 },
            setFlag: 'yuki_stargazing',
            nextNodeId: 'ya3',
          },
          {
            id: 'ya2b',
            text: 'I did not know that. You really love the stars.',
            affinityDelta: { yuki: 5 },
            nextNodeId: 'ya3',
          },
        ],
      },
      ya3: {
        id: 'ya3',
        speaker: 'yuki',
        text: 'I... I would like that. I will be in the courtyard this evening, if you want to find me. The sky should be clear.',
      },
    },
  },

  yuki_evening: {
    id: 'yuki_evening',
    characterId: 'yuki',
    startNodeId: 'ye1',
    nodes: {
      ye1: {
        id: 'ye1',
        speaker: 'yuki',
        text: 'You came. Look up — the first stars are appearing. I picked this spot because the sky is clearest here.',
        choices: [
          {
            id: 'ye1a',
            text: 'It is beautiful, Yuki. Thank you for sharing this with me.',
            affinityDelta: { yuki: 12 },
            setFlag: 'yuki_cafeteria_date_ready',
            nextNodeId: 'ye2',
          },
          {
            id: 'ye1b',
            text: 'I can see why you love stargazing. It is peaceful.',
            affinityDelta: { yuki: 8 },
            nextNodeId: 'ye2',
          },
        ],
      },
      ye2: {
        id: 'ye2',
        speaker: 'yuki',
        text: 'When I look at the stars, I feel like anything is possible. And lately... when I am with you, I feel the same way.',
        choices: [
          {
            id: 'ye2a',
            text: 'I feel the same, Yuki. Let us keep watching together.',
            affinityDelta: { yuki: 15 },
            setFlag: 'yuki_close',
            nextNodeId: 'ye3',
          },
          {
            id: 'ye2b',
            text: 'That means a lot, coming from you.',
            affinityDelta: { yuki: 8 },
            nextNodeId: 'ye3',
          },
        ],
      },
      ye3: {
        id: 'ye3',
        speaker: 'yuki',
        text: 'Goodnight, Hiro. I will remember this evening for a long time.',
      },
    },
  },

  haruto_generic: {
    id: 'haruto_generic',
    characterId: 'haruto',
    startNodeId: 'h1',
    nodes: {
      h1: {
        id: 'h1',
        speaker: 'haruto',
        text: 'Yo, Hiro! How is it going? You settling in okay? This school is pretty chill once you get used to it.',
        choices: [
          {
            id: 'h1a',
            text: 'Yeah, everyone has been really welcoming.',
            nextNodeId: 'h2',
          },
          {
            id: 'h1b',
            text: 'Still getting used to it, honestly.',
            nextNodeId: 'h2',
          },
        ],
      },
      h2: {
        id: 'h2',
        speaker: 'haruto',
        text: 'Hey, if you ever need someone to show you around, I am your guy. Also, between us — Sakura and Yuki both seem interested in you. Lucky guy!',
      },
    },
  },

  kenji_generic: {
    id: 'kenji_generic',
    characterId: 'kenji',
    startNodeId: 'k1',
    nodes: {
      k1: {
        id: 'k1',
        speaker: 'kenji',
        text: 'Hiro! Good to see you. I was just doing my laps. You should join the track team — you look like you can move!',
        choices: [
          {
            id: 'k1a',
            text: 'Maybe I will! I used to run back at my old school.',
            nextNodeId: 'k2',
          },
          {
            id: 'k1b',
            text: 'I am more of a walker, honestly.',
            nextNodeId: 'k2',
          },
        ],
      },
      k2: {
        id: 'k2',
        speaker: 'kenji',
        text: 'Either way, staying active is important! Keep moving and you will feel great. See you out here!',
      },
    },
  },

  miyuki_generic: {
    id: 'miyuki_generic',
    characterId: 'miyuki',
    startNodeId: 'm1',
    nodes: {
      m1: {
        id: 'm1',
        speaker: 'miyuki',
        text: 'Oh, hello there. You are the new transfer student, are you not? How are you adjusting? My door is always open if you need to talk.',
        choices: [
          {
            id: 'm1a',
            text: 'Thank you, Miyuki. I appreciate that.',
            nextNodeId: 'm2',
          },
          {
            id: 'm1b',
            text: 'I am doing well, but I will keep that in mind.',
            nextNodeId: 'm2',
          },
        ],
      },
      m2: {
        id: 'm2',
        speaker: 'miyuki',
        text: 'Take care of yourself, and do not push too hard. School is about the friends you make, not just the grades.',
      },
    },
  },

  ren_generic: {
    id: 'ren_generic',
    characterId: 'ren',
    startNodeId: 'r1',
    nodes: {
      r1: {
        id: 'r1',
        speaker: 'ren',
        text: 'Hiro. I have been watching you. You carry yourself well. The student council could use someone like you.',
        choices: [
          {
            id: 'r1a',
            text: 'I am honored. Tell me more about the council.',
            nextNodeId: 'r2',
          },
          {
            id: 'r1b',
            text: 'I am not sure I am council material.',
            nextNodeId: 'r2',
          },
        ],
      },
      r2: {
        id: 'r2',
        speaker: 'ren',
        text: 'Think about it. A school is only as strong as the people who care for it. I expect great things from you, Hiro.',
      },
    },
  },
};

// Helper to get the right dialogue tree for an NPC at a given time.
export function getDialogueTreeId(
  characterId: string,
  period: string
): string | null {
  const keyed = `${characterId}_${period}`;
  if (DIALOGUE_TREES[keyed]) return keyed;
  const generic = `${characterId}_generic`;
  if (DIALOGUE_TREES[generic]) return generic;
  return null;
}

// ===== EVENTS =====
export const EVENTS: Record<EventId, EventDef> = {
  walk_date_sakura: {
    id: 'walk_date_sakura',
    name: 'A Walk Among Cherry Blossoms',
    description: 'Walk through the courtyard with Sakura as the sun sets.',
    characterId: 'sakura',
    requiredAffinity: 40,
    requiredTime: 'evening',
    requiredFlag: 'sakura_walk_date_ready',
    setFlag: 'sakura_walk_date_done',
    affinityReward: 15,
    location: 'courtyard',
  },
  cafeteria_date_yuki: {
    id: 'cafeteria_date_yuki',
    name: 'A Quiet Lunch Together',
    description: 'Share a quiet lunch with Yuki in the cafeteria.',
    characterId: 'yuki',
    requiredAffinity: 40,
    requiredTime: 'afternoon',
    requiredFlag: 'yuki_cafeteria_date_ready',
    setFlag: 'yuki_cafeteria_date_done',
    affinityReward: 15,
    location: 'cafeteria',
  },
  festival_event: {
    id: 'festival_event',
    name: 'The School Festival',
    description: 'The annual school festival — a night of lights, food, and memories.',
    characterId: 'sakura',
    requiredAffinity: 70,
    requiredFlag: 'sakura_walk_date_done',
    setFlag: 'festival_done',
    affinityReward: 25,
    location: 'courtyard',
  },
};

export const ALL_EVENT_IDS: EventId[] = ['walk_date_sakura', 'cafeteria_date_yuki', 'festival_event'];
