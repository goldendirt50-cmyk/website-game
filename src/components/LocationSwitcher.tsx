import { useGameStore } from '../store/gameStore';
import { ALL_LOCATION_IDS, LOCATIONS } from '../data/locations';
import type { LocationId } from '../types';

/**
 * Floating buttons that let the player switch between school locations.
 * Each location is a separate "room" — the player, NPCs, and environment
 * reload when switching.
 */
export function LocationSwitcher() {
  const currentLocation = useGameStore((s) => s.player.location);
  const setPlayerLocation = useGameStore((s) => s.setPlayerLocation);
  const setPlayerPosition = useGameStore((s) => s.setPlayerPosition);
  const dialogueActive = useGameStore((s) => s.dialogue.active);
  const eventActive = useGameStore((s) => s.eventState.activeEventId !== null);

  const switchTo = (loc: LocationId) => {
    if (dialogueActive || eventActive) return;
    const def = LOCATIONS[loc];
    setPlayerLocation(loc);
    setPlayerPosition([...def.spawnPoint]);
  };

  return (
    <div style={containerStyle}>
      {ALL_LOCATION_IDS.map((loc) => {
        const def = LOCATIONS[loc];
        const isActive = currentLocation === loc;
        return (
          <button
            key={loc}
            style={isActive ? activeBtnStyle : btnStyle}
            onClick={() => switchTo(loc)}
            disabled={dialogueActive || eventActive}
          >
            {def.name}
          </button>
        );
      })}
    </div>
  );
}

const containerStyle: React.CSSProperties = {
  position: 'absolute',
  bottom: 60,
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  gap: '8px',
  zIndex: 50,
};

const btnStyle: React.CSSProperties = {
  padding: '8px 16px',
  background: 'rgba(20,20,35,0.85)',
  border: '1px solid rgba(255,255,255,0.15)',
  borderRadius: '8px',
  color: 'rgba(255,255,255,0.7)',
  fontSize: '13px',
  cursor: 'pointer',
  transition: 'all 0.15s',
  backdropFilter: 'blur(8px)',
};

const activeBtnStyle: React.CSSProperties = {
  ...btnStyle,
  background: 'rgba(255,107,157,0.2)',
  border: '1px solid rgba(255,107,157,0.5)',
  color: '#ff6b9d',
  fontWeight: 'bold',
};
