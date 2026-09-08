import { useEffect, useState, useCallback } from 'react';
import { useGameStore } from '../store/gameStore';
import { DIALOGUE_TREES } from '../data/dialogue';
import { CHARACTERS } from '../data/characters';
import type { CharacterId } from '../types';

/**
 * Dialogue text-box UI overlay.
 * Shows portrait, name, text, and branching choices.
 * Press E/Enter/Space to advance text without choices.
 * Click or press number keys to select choices.
 */
export function DialogueUI() {
  const dialogue = useGameStore((s) => s.dialogue);
  const advanceDialogue = useGameStore((s) => s.advanceDialogue);
  const chooseDialogueOption = useGameStore((s) => s.chooseDialogueOption);
  const endDialogue = useGameStore((s) => s.endDialogue);

  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showChoices, setShowChoices] = useState(false);

  const currentNode = dialogue.active && dialogue.treeId && dialogue.currentNodeId
    ? DIALOGUE_TREES[dialogue.treeId]?.nodes[dialogue.currentNodeId]
    : null;

  const speaker = currentNode
    ? CHARACTERS[currentNode.speaker as CharacterId]
    : null;

  // Typewriter effect for text
  useEffect(() => {
    if (!currentNode) return;
    setDisplayedText('');
    setShowChoices(false);
    setIsTyping(true);

    const fullText = currentNode.text;
    let charIndex = 0;
    const interval = setInterval(() => {
      charIndex++;
      setDisplayedText(fullText.slice(0, charIndex));
      if (charIndex >= fullText.length) {
        clearInterval(interval);
        setIsTyping(false);
        if (currentNode.choices && currentNode.choices.length > 0) {
          setShowChoices(true);
        }
      }
    }, 25);

    return () => clearInterval(interval);
  }, [currentNode?.id]);

  // Handle advance / select
  const handleAdvance = useCallback(() => {
    if (isTyping) {
      // Skip typewriter, show full text
      setIsTyping(false);
      if (currentNode) {
        setDisplayedText(currentNode.text);
        if (currentNode.choices && currentNode.choices.length > 0) {
          setShowChoices(true);
        }
      }
      return;
    }
    // If there are choices, don't advance on E — player must choose
    if (currentNode?.choices && currentNode.choices.length > 0) return;
    advanceDialogue();
  }, [isTyping, currentNode, advanceDialogue]);

  // Keyboard input for dialogue
  useEffect(() => {
    if (!dialogue.active) return;
    const handler = (e: KeyboardEvent) => {
      if (e.code === 'KeyE' || e.code === 'Enter' || e.code === 'Space') {
        e.preventDefault();
        handleAdvance();
      } else if (e.code === 'Escape') {
        endDialogue();
      } else if (showChoices && currentNode?.choices) {
        const num = parseInt(e.key);
        if (num >= 1 && num <= currentNode.choices.length) {
          chooseDialogueOption(currentNode.choices[num - 1].id);
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [dialogue.active, handleAdvance, showChoices, currentNode, chooseDialogueOption, endDialogue]);

  if (!dialogue.active || !currentNode || !speaker) return null;

  return (
    <div style={overlayStyle}>
      <div style={dialogueBoxStyle}>
        {/* Portrait */}
        <div style={portraitStyle(speaker.portraitColor)}>
          <div style={portraitInnerStyle}>
            <span style={portraitTextStyle}>
              {speaker.name.charAt(0)}
            </span>
          </div>
        </div>

        {/* Name + Text */}
        <div style={contentStyle}>
          <div style={nameStyle(speaker.portraitColor)}>
            {speaker.name}
          </div>
          <div style={textStyle}>
            {displayedText}
            {isTyping && <span style={cursorStyle}>▌</span>}
          </div>

          {/* Choices */}
          {showChoices && currentNode.choices && (
            <div style={choicesStyle}>
              {currentNode.choices.map((choice, i) => (
                <button
                  key={choice.id}
                  style={choiceStyle}
                  onClick={() => chooseDialogueOption(choice.id)}
                  onMouseEnter={(e) => {
                    (e.target as HTMLElement).style.background = 'rgba(255,255,255,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLElement).style.background = 'rgba(255,255,255,0.05)';
                  }}
                >
                  <span style={choiceNumberStyle}>{i + 1}.</span>
                  <span style={choiceTextStyle}>{choice.text}</span>
                </button>
              ))}
            </div>
          )}

          {/* Advance hint */}
          {!showChoices && !isTyping && (
            <div style={hintStyle}>
              Press E or Space to continue
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ===== Styles =====
const overlayStyle: React.CSSProperties = {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  display: 'flex',
  justifyContent: 'center',
  padding: '20px',
  zIndex: 100,
  pointerEvents: 'none',
};

const dialogueBoxStyle: React.CSSProperties = {
  display: 'flex',
  maxWidth: '700px',
  width: '90%',
  background: 'linear-gradient(135deg, rgba(20,20,35,0.95), rgba(30,30,50,0.95))',
  border: '2px solid rgba(255,255,255,0.15)',
  borderRadius: '12px',
  padding: '16px',
  gap: '16px',
  boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
  pointerEvents: 'auto',
};

const portraitStyle = (color: string): React.CSSProperties => ({
  flexShrink: 0,
  width: '80px',
  height: '80px',
  borderRadius: '12px',
  background: `linear-gradient(135deg, ${color}, ${color}88)`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '2px solid rgba(255,255,255,0.2)',
});

const portraitInnerStyle: React.CSSProperties = {
  width: '70px',
  height: '70px',
  borderRadius: '50%',
  background: 'rgba(255,255,255,0.15)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const portraitTextStyle: React.CSSProperties = {
  fontSize: '32px',
  fontWeight: 'bold',
  color: '#ffffff',
  textShadow: '0 2px 4px rgba(0,0,0,0.5)',
};

const contentStyle: React.CSSProperties = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
};

const nameStyle = (color: string): React.CSSProperties => ({
  fontSize: '18px',
  fontWeight: 'bold',
  color: color,
  textShadow: '0 1px 3px rgba(0,0,0,0.7)',
});

const textStyle: React.CSSProperties = {
  fontSize: '16px',
  lineHeight: '1.6',
  color: '#e8e8f0',
  minHeight: '48px',
};

const cursorStyle: React.CSSProperties = {
  animation: 'blink 0.8s infinite',
  color: '#ffdd44',
};

const choicesStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  marginTop: '8px',
};

const choiceStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '8px',
  padding: '10px 14px',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.15)',
  borderRadius: '8px',
  cursor: 'pointer',
  transition: 'background 0.15s, border-color 0.15s',
  textAlign: 'left',
  width: '100%',
};

const choiceNumberStyle: React.CSSProperties = {
  color: '#ffdd44',
  fontWeight: 'bold',
  fontSize: '15px',
  flexShrink: 0,
};

const choiceTextStyle: React.CSSProperties = {
  color: '#e8e8f0',
  fontSize: '15px',
  lineHeight: '1.4',
};

const hintStyle: React.CSSProperties = {
  fontSize: '13px',
  color: 'rgba(255,255,255,0.4)',
  marginTop: '4px',
  textAlign: 'right',
};
