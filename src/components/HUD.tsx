import { useGameStore } from '../store/gameStore';
import { CHARACTERS, DATEABLE_IDS } from '../data/characters';
import { LOCATIONS } from '../data/locations';
import { EVENTS } from '../data/dialogue';
import type { TimeOfDay } from '../types';

const TIME_ICONS: Record<TimeOfDay, string> = {
  morning: '☀️',
  afternoon: '🌤️',
  evening: '🌙',
};

const TIME_LABELS: Record<TimeOfDay, string> = {
  morning: 'Morning',
  afternoon: 'Afternoon',
  evening: 'Evening',
};

/**
 * Heads-up display overlay: day/time, affinity bars, location name,
 * available events, controls hint, and save/load buttons.
 */
export function HUD() {
  const day = useGameStore((s) => s.day);
  const period = useGameStore((s) => s.period);
  const advanceTime = useGameStore((s) => s.advanceTime);
  const affinity = useGameStore((s) => s.affinity);
  const playerLocation = useGameStore((s) => s.player.location);
  const availableEvents = useGameStore((s) => s.availableEvents);
  const triggerEvent = useGameStore((s) => s.triggerEvent);
  const eventState = useGameStore((s) => s.eventState);
  const completeEvent = useGameStore((s) => s.completeEvent);
  const endEvent = useGameStore((s) => s.endEvent);
  const save = useGameStore((s) => s.save);
  const load = useGameStore((s) => s.load);
  const hasSave = useGameStore((s) => s.hasSave);
  const reset = useGameStore((s) => s.reset);
  const flags = useGameStore((s) => s.flags);

  const loc = LOCATIONS[playerLocation];
  const activeEvent = eventState.activeEventId ? EVENTS[eventState.activeEventId] : null;

  return (
    <>
      {/* Top-left: Day/Time + Location */}
      <div style={topLeftStyle}>
        <div style={dayTimeStyle}>
          <span style={{ fontSize: '24px' }}>{TIME_ICONS[period]}</span>
          <div>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#fff' }}>
              Day {day} — {TIME_LABELS[period]}
            </div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>
              {loc.name}
            </div>
          </div>
        </div>
        <button style={advanceTimeBtnStyle} onClick={advanceTime}>
          Advance Time →
        </button>
      </div>

      {/* Top-right: Affinity bars */}
      <div style={topRightStyle}>
        <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff', marginBottom: '8px' }}>
          Affinity
        </div>
        {DATEABLE_IDS.map((id) => {
          const char = CHARACTERS[id];
          const score = affinity[id as keyof typeof affinity];
          return (
            <div key={id} style={{ marginBottom: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '13px', color: char.portraitColor, fontWeight: 'bold' }}>
                  {char.name}
                </span>
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                  {score}/100
                </span>
              </div>
              <div style={barBgStyle}>
                <div style={barFillStyle(char.portraitColor, score)} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom-left: Controls hint */}
      <div style={bottomLeftStyle}>
        <div style={controlsStyle}>
          <span style={keyStyle}>WASD</span> Move
          <span style={keyStyle}>Shift</span> Run
          <span style={keyStyle}>E</span> Talk / Advance
          <span style={keyStyle}>Esc</span> Close dialogue
        </div>
      </div>

      {/* Bottom-right: Save / Load / Reset */}
      <div style={bottomRightStyle}>
        <button style={saveBtnStyle} onClick={save}>Save</button>
        <button
          style={saveBtnStyle}
          onClick={load}
          disabled={!hasSave}
        >
          Load
        </button>
        <button style={saveBtnStyle} onClick={reset}>Reset</button>
      </div>

      {/* Available events notification */}
      {availableEvents().length > 0 && !activeEvent && (
        <div style={eventBannerStyle}>
          <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
            ✦ New Event Available ✦
          </div>
          {availableEvents().map((eventId) => {
            const ev = EVENTS[eventId];
            return (
              <div key={eventId} style={{ marginBottom: '6px' }}>
                <span style={{ color: '#ffdd44', fontWeight: 'bold' }}>{ev.name}</span>
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginLeft: '8px' }}>
                  {ev.description}
                </span>
                <button
                  style={{ ...startEventBtnStyle, marginLeft: '8px' }}
                  onClick={() => triggerEvent(eventId)}
                >
                  Start
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Active event overlay */}
      {activeEvent && (
        <div style={eventOverlayStyle}>
          <div style={eventCardStyle}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff', marginBottom: '12px' }}>
              {activeEvent.name}
            </h2>
            <p style={{ fontSize: '16px', color: '#e8e8f0', lineHeight: '1.6', marginBottom: '20px' }}>
              {activeEvent.description}
            </p>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', marginBottom: '20px' }}>
              You share a special moment with {CHARACTERS[activeEvent.characterId].name}.
              Your bond grows stronger (+{activeEvent.affinityReward} affinity).
            </p>
            <button
              style={completeEventBtnStyle}
              onClick={() => completeEvent(activeEvent.id)}
            >
              Complete Event
            </button>
            <button style={cancelEventBtnStyle} onClick={endEvent}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// ===== Styles =====
const topLeftStyle: React.CSSProperties = {
  position: 'absolute',
  top: 16,
  left: 16,
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  zIndex: 50,
};

const dayTimeStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  background: 'rgba(20,20,35,0.85)',
  padding: '10px 16px',
  borderRadius: '10px',
  border: '1px solid rgba(255,255,255,0.1)',
  backdropFilter: 'blur(8px)',
};

const advanceTimeBtnStyle: React.CSSProperties = {
  padding: '6px 16px',
  background: 'rgba(255,221,68,0.15)',
  border: '1px solid rgba(255,221,68,0.4)',
  borderRadius: '8px',
  color: '#ffdd44',
  fontSize: '13px',
  fontWeight: 'bold',
  cursor: 'pointer',
  transition: 'background 0.15s',
};

const topRightStyle: React.CSSProperties = {
  position: 'absolute',
  top: 16,
  right: 16,
  background: 'rgba(20,20,35,0.85)',
  padding: '14px 16px',
  borderRadius: '10px',
  border: '1px solid rgba(255,255,255,0.1)',
  backdropFilter: 'blur(8px)',
  minWidth: '180px',
  zIndex: 50,
};

const barBgStyle: React.CSSProperties = {
  width: '100%',
  height: '6px',
  background: 'rgba(255,255,255,0.1)',
  borderRadius: '3px',
  overflow: 'hidden',
};

const barFillStyle = (color: string, score: number): React.CSSProperties => ({
  width: `${score}%`,
  height: '100%',
  background: color,
  borderRadius: '3px',
  transition: 'width 0.4s ease',
});

const bottomLeftStyle: React.CSSProperties = {
  position: 'absolute',
  bottom: 16,
  left: 16,
  zIndex: 50,
};

const controlsStyle: React.CSSProperties = {
  display: 'flex',
  gap: '12px',
  alignItems: 'center',
  background: 'rgba(20,20,35,0.7)',
  padding: '8px 14px',
  borderRadius: '8px',
  fontSize: '12px',
  color: 'rgba(255,255,255,0.7)',
  backdropFilter: 'blur(8px)',
};

const keyStyle: React.CSSProperties = {
  display: 'inline-block',
  padding: '2px 8px',
  background: 'rgba(255,255,255,0.1)',
  border: '1px solid rgba(255,255,255,0.2)',
  borderRadius: '4px',
  fontSize: '11px',
  fontWeight: 'bold',
  color: '#fff',
  marginRight: '4px',
};

const bottomRightStyle: React.CSSProperties = {
  position: 'absolute',
  bottom: 16,
  right: 16,
  display: 'flex',
  gap: '8px',
  zIndex: 50,
};

const saveBtnStyle: React.CSSProperties = {
  padding: '6px 14px',
  background: 'rgba(20,20,35,0.85)',
  border: '1px solid rgba(255,255,255,0.15)',
  borderRadius: '8px',
  color: 'rgba(255,255,255,0.8)',
  fontSize: '13px',
  cursor: 'pointer',
  transition: 'background 0.15s',
};

const eventBannerStyle: React.CSSProperties = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  background: 'rgba(20,20,35,0.95)',
  border: '2px solid rgba(255,221,68,0.4)',
  borderRadius: '12px',
  padding: '20px 24px',
  color: '#fff',
  fontSize: '14px',
  textAlign: 'center',
  zIndex: 60,
  maxWidth: '400px',
  boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
};

const startEventBtnStyle: React.CSSProperties = {
  padding: '4px 12px',
  background: 'rgba(255,221,68,0.2)',
  border: '1px solid rgba(255,221,68,0.5)',
  borderRadius: '6px',
  color: '#ffdd44',
  fontSize: '12px',
  fontWeight: 'bold',
  cursor: 'pointer',
};

const eventOverlayStyle: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'rgba(0,0,0,0.6)',
  zIndex: 200,
  backdropFilter: 'blur(4px)',
};

const eventCardStyle: React.CSSProperties = {
  background: 'linear-gradient(135deg, rgba(30,30,50,0.98), rgba(20,20,35,0.98))',
  border: '2px solid rgba(255,255,255,0.15)',
  borderRadius: '16px',
  padding: '32px',
  maxWidth: '500px',
  textAlign: 'center',
  boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
};

const completeEventBtnStyle: React.CSSProperties = {
  padding: '10px 28px',
  background: 'linear-gradient(135deg, #ff6b9d, #ff8fab)',
  border: 'none',
  borderRadius: '10px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  cursor: 'pointer',
  marginRight: '8px',
  boxShadow: '0 4px 16px rgba(255,107,157,0.3)',
};

const cancelEventBtnStyle: React.CSSProperties = {
  padding: '10px 20px',
  background: 'rgba(255,255,255,0.1)',
  border: '1px solid rgba(255,255,255,0.2)',
  borderRadius: '10px',
  color: 'rgba(255,255,255,0.7)',
  fontSize: '14px',
  cursor: 'pointer',
};
