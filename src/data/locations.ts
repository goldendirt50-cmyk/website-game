import type { LocationDef, LocationId } from '../types';

export const LOCATIONS: Record<LocationId, LocationDef> = {
  classroom: {
    id: 'classroom',
    name: 'Classroom 2-B',
    bounds: { minX: -8, maxX: 8, minZ: -8, maxZ: 8 },
    spawnPoint: [0, 0, 6],
    color: '#f5e6d3',
    accentColor: '#c4a882',
  },
  hallway: {
    id: 'hallway',
    name: 'School Hallway',
    bounds: { minX: -20, maxX: 20, minZ: -4, maxZ: 4 },
    spawnPoint: [0, 0, 0],
    color: '#e8e0d0',
    accentColor: '#a0927a',
  },
  courtyard: {
    id: 'courtyard',
    name: 'School Courtyard',
    bounds: { minX: -15, maxX: 15, minZ: -15, maxZ: 15 },
    spawnPoint: [0, 0, 0],
    color: '#a8d8a0',
    accentColor: '#5b9a4f',
  },
  cafeteria: {
    id: 'cafeteria',
    name: 'School Cafeteria',
    bounds: { minX: -12, maxX: 12, minZ: -10, maxZ: 10 },
    spawnPoint: [0, 0, 8],
    color: '#f0d4a8',
    accentColor: '#cc9952',
  },
};

export const ALL_LOCATION_IDS: LocationId[] = ['classroom', 'hallway', 'courtyard', 'cafeteria'];
