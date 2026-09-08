import { GameScene } from './components/GameScene';
import { HUD } from './components/HUD';
import { DialogueUI } from './components/DialogueUI';
import { LocationSwitcher } from './components/LocationSwitcher';
import { useGameStore } from './store/gameStore';

export default function App() {
  const dialogueActive = useGameStore((s) => s.dialogue.active);
  const eventActive = useGameStore((s) => s.eventState.activeEventId !== null);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <GameScene />
      <HUD />
      {!dialogueActive && !eventActive && <LocationSwitcher />}
      <DialogueUI />
    </div>
  );
}
