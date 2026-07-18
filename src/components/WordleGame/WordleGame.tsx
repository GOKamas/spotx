'use client';
import { useState, useEffect, useCallback } from 'react';
import styles from './WordleGame.module.css';

const WORD_LENGTH = 5;
const MAX_ATTEMPTS = 6;

type LetterResult = 'correct' | 'present' | 'absent';
type KeyStatus = LetterResult | 'unused';

const KEYBOARD_ROWS = [
  ['Ε', 'Ρ', 'Τ', 'Υ', 'Θ', 'Ι', 'Ο', 'Π'],
  ['Α', 'Σ', 'Δ', 'Φ', 'Γ', 'Η', 'Ξ', 'Κ', 'Λ'],
  ['ENTER', 'Ζ', 'Χ', 'Ψ', 'Ω', 'Β', 'Ν', 'Μ', 'BACK'],
];

export default function WordleGame() {
  const [board, setBoard] = useState<{ letter: string; status: LetterResult }[][]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [attemptIndex, setAttemptIndex] = useState(0);
  const [gameStatus, setGameStatus] = useState<'loading' | 'playing' | 'won' | 'lost'>('loading');
  const [keyStatuses, setKeyStatuses] = useState<Record<string, KeyStatus>>({});
  const [message, setMessage] = useState('');
  const [revealedWord, setRevealedWord] = useState<string | null>(null);

  const startNewGame = useCallback(async () => {
    setGameStatus('loading');
    setBoard([]);
    setCurrentGuess('');
    setAttemptIndex(0);
    setKeyStatuses({});
    setMessage('');
    setRevealedWord(null);

    try {
      const res = await fetch('/api/wordle/start');
      if (!res.ok) {
        setMessage('Δεν υπάρχουν διαθέσιμες λέξεις αυτή τη στιγμή.');
        setGameStatus('lost');
        return;
      }
      setGameStatus('playing');
    } catch {
      setMessage('Κάτι πήγε στραβά. Δοκίμασε ξανά.');
      setGameStatus('lost');
    }
  }, []);

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 1800);
  };

  const submitGuess = useCallback(async () => {
    if (gameStatus !== 'playing') return;
    if (currentGuess.length !== WORD_LENGTH) {
      showMessage(`Η λέξη πρέπει να έχει ${WORD_LENGTH} γράμματα`);
      return;
    }

    try {
      const res = await fetch('/api/wordle/guess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guess: currentGuess }),
      });
      const data = await res.json();

      if (!res.ok) {
        showMessage('Κάτι πήγε στραβά, δοκίμασε ξανά');
        return;
      }

      const newRow = currentGuess.split('').map((letter, i) => ({
        letter,
        status: data.result[i] as LetterResult,
      }));

      setBoard(prev => [...prev, newRow]);

      setKeyStatuses(prev => {
        const updated = { ...prev };
        const priority: Record<KeyStatus, number> = { correct: 3, present: 2, absent: 1, unused: 0 };
        newRow.forEach(({ letter, status }) => {
          const current = updated[letter] || 'unused';
          if (priority[status] > priority[current]) {
            updated[letter] = status;
          }
        });
        return updated;
      });

      if (data.won) {
        setGameStatus('won');
      } else if (attemptIndex + 1 >= MAX_ATTEMPTS) {
        const revealRes = await fetch('/api/wordle/guess', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ giveUp: true }),
        });
        const revealData = await revealRes.json();
        setRevealedWord(revealData.word || null);
        setGameStatus('lost');
      }

      setAttemptIndex(prev => prev + 1);
      setCurrentGuess('');
    } catch {
      showMessage('Κάτι πήγε στραβά, δοκίμασε ξανά');
    }
  }, [currentGuess, gameStatus, attemptIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameStatus !== 'playing') return;
      const key = e.key.toUpperCase();

      if (key === 'ENTER') {
        submitGuess();
        return;
      }
      if (key === 'BACKSPACE') {
        setCurrentGuess(prev => prev.slice(0, -1));
        return;
      }
      if (/^[Α-ΩΆΈΉΊΌΎΏΪΫ]$/.test(key) && currentGuess.length < WORD_LENGTH) {
        setCurrentGuess(prev => prev + key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentGuess, gameStatus, submitGuess]);

  const handleVirtualKey = (key: string) => {
    if (gameStatus !== 'playing') return;
    if (key === 'ENTER') {
      submitGuess();
    } else if (key === 'BACK') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (currentGuess.length < WORD_LENGTH) {
      setCurrentGuess(prev => prev + key);
    }
  };

  const emptyRowsCount = MAX_ATTEMPTS - board.length - (gameStatus === 'playing' ? 1 : 0);

  return (
    <div className={styles.gameWrapper}>
      {gameStatus === 'loading' && <p className={styles.loadingText}>Φόρτωση...</p>}

      {gameStatus !== 'loading' && (
        <>
          <div className={styles.board}>
            {board.map((row, i) => (
              <div className={styles.row} key={`done-${i}`}>
                {row.map((cell, j) => (
                  <div key={j} className={`${styles.cell} ${styles[cell.status]}`}>
                    {cell.letter}
                  </div>
                ))}
              </div>
            ))}

            {gameStatus === 'playing' && (
              <div className={styles.row}>
                {Array.from({ length: WORD_LENGTH }).map((_, j) => (
                  <div key={j} className={`${styles.cell} ${currentGuess[j] ? styles.filled : ''}`}>
                    {currentGuess[j] || ''}
                  </div>
                ))}
              </div>
            )}

            {Array.from({ length: Math.max(0, emptyRowsCount) }).map((_, i) => (
              <div className={styles.row} key={`empty-${i}`}>
                {Array.from({ length: WORD_LENGTH }).map((_, j) => (
                  <div key={j} className={styles.cell}></div>
                ))}
              </div>
            ))}
          </div>

          {message && <div className={styles.toast}>{message}</div>}

          {gameStatus === 'won' && (
            <div className={styles.endScreen}>
              <p className={styles.endTitle}>🎉 ΤΑ ΚΑΤΑΦΕΡΕΣ!</p>
              <button className={styles.playAgainBtn} onClick={startNewGame}>ΠΑΙΞΕ ΞΑΝΑ</button>
            </div>
          )}

          {gameStatus === 'lost' && (
            <div className={styles.endScreen}>
              <p className={styles.endTitle}>
                {revealedWord ? `Η λέξη ήταν: ${revealedWord}` : 'Game Over'}
              </p>
              <button className={styles.playAgainBtn} onClick={startNewGame}>ΠΑΙΞΕ ΞΑΝΑ</button>
            </div>
          )}

          {gameStatus === 'playing' && (
            <div className={styles.keyboard}>
              {KEYBOARD_ROWS.map((row, i) => (
                <div className={styles.keyboardRow} key={i}>
                  {row.map((key) => (
                    <button
                      key={key}
                      onClick={() => handleVirtualKey(key)}
                      className={`${styles.key} ${key === 'ENTER' || key === 'BACK' ? styles.keyWide : ''} ${
                        keyStatuses[key] ? styles[keyStatuses[key]] : ''
                      }`}
                    >
                      {key === 'BACK' ? '⌫' : key}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}