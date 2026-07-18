'use client';
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import styles from './MemoryGame.module.css';

interface Card {
  uid: string;
  pairId: number;
  imageUrl: string;
}

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildShuffledDeck(imageUrls: string[]): Card[] {
  const pairs: Card[] = [];
  imageUrls.forEach((url, pairId) => {
    pairs.push({ uid: `${pairId}-a`, pairId, imageUrl: url });
    pairs.push({ uid: `${pairId}-b`, pairId, imageUrl: url });
  });
  return shuffle(pairs);
}

export default function MemoryGame({ imageUrls }: { imageUrls: string[] }) {
  const [deck, setDeck] = useState<Card[]>([]);
  const [flipped, setFlipped] = useState<string[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);

  const startNewGame = useCallback(() => {
    setDeck(buildShuffledDeck(imageUrls));
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setLocked(false);
  }, [imageUrls]);

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  const handleCardClick = (card: Card) => {
    if (locked) return;
    if (flipped.includes(card.uid)) return;
    if (matched.includes(card.pairId)) return;
    if (flipped.length === 2) return;

    const nextFlipped = [...flipped, card.uid];
    setFlipped(nextFlipped);

    if (nextFlipped.length === 2) {
      setLocked(true);
      setMoves(prev => prev + 1);

      const [firstUid, secondUid] = nextFlipped;
      const firstCard = deck.find(c => c.uid === firstUid);
      const secondCard = deck.find(c => c.uid === secondUid);

      if (firstCard && secondCard && firstCard.pairId === secondCard.pairId) {
        setTimeout(() => {
          setMatched(prev => [...prev, firstCard.pairId]);
          setFlipped([]);
          setLocked(false);
        }, 500);
      } else {
        setTimeout(() => {
          setFlipped([]);
          setLocked(false);
        }, 900);
      }
    }
  };

  const totalPairs = imageUrls.length;
  const isWon = matched.length === totalPairs && totalPairs > 0;

  return (
    <div className={styles.gameWrapper}>
      <div className={styles.statsBar}>
        <span className={styles.movesText}>ΚΙΝΗΣΕΙΣ: {moves}</span>
        <span className={styles.movesText}>ΖΕΥΓΑΡΙΑ: {matched.length} / {totalPairs}</span>
      </div>

      <div className={styles.grid}>
        {deck.map(card => {
          const isFlipped = flipped.includes(card.uid) || matched.includes(card.pairId);
          return (
            <button
              key={card.uid}
              className={styles.cardSlot}
              onClick={() => handleCardClick(card)}
              disabled={isFlipped}
              aria-label="Memory card"
            >
              <div className={`${styles.cardInner} ${isFlipped ? styles.cardFlipped : ''}`}>
                <div className={styles.cardBack}>
                  <span className={styles.cardBackLogo}>?</span>
                </div>
                <div className={styles.cardFront}>
                  <Image
                    src={card.imageUrl}
                    alt="Memory card"
                    fill
                    sizes="(max-width: 600px) 22vw, 120px"
                    className={styles.cardImage}
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {isWon && (
        <div className={styles.endScreen}>
          <p className={styles.endTitle}>🎉 ΤΑ ΚΑΤΑΦΕΡΕΣ ΣΕ {moves} ΚΙΝΗΣΕΙΣ!</p>
          <button className={styles.playAgainBtn} onClick={startNewGame}>ΠΑΙΞΕ ΞΑΝΑ</button>
        </div>
      )}
    </div>
  );
}