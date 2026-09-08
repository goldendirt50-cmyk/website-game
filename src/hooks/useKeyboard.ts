import { useEffect, useRef } from 'react';

export type KeyState = {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  run: boolean;
  interact: boolean;
};

/**
 * Tracks WASD + Shift (run) + E (interact) key presses.
 * Returns a ref that always holds the current state — read in useFrame without causing re-renders.
 */
export function useKeyboard() {
  const keys = useRef<KeyState>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    run: false,
    interact: false,
  });

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW': case 'ArrowUp': keys.current.forward = true; break;
        case 'KeyS': case 'ArrowDown': keys.current.backward = true; break;
        case 'KeyA': case 'ArrowLeft': keys.current.left = true; break;
        case 'KeyD': case 'ArrowRight': keys.current.right = true; break;
        case 'ShiftLeft': case 'ShiftRight': keys.current.run = true; break;
        case 'KeyE': case 'Enter': case 'Space':
          keys.current.interact = true;
          break;
      }
    };
    const up = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW': case 'ArrowUp': keys.current.forward = false; break;
        case 'KeyS': case 'ArrowDown': keys.current.backward = false; break;
        case 'KeyA': case 'ArrowLeft': keys.current.left = false; break;
        case 'KeyD': case 'ArrowRight': keys.current.right = false; break;
        case 'ShiftLeft': case 'ShiftRight': keys.current.run = false; break;
        case 'KeyE': case 'Enter': case 'Space':
          keys.current.interact = false;
          break;
      }
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, []);

  return keys;
}
