'use client'
import { useState, useEffect } from 'react';
import { client } from '@/sanity/lib/client';
import styles from './FunFactCard.module.css';

export default function FunFactCard() {
  const [fact, setFact] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchFact = async () => {
    setLoading(true);
    const data = await client.fetch(`*[_type == "funFact"]{ factText, category, "imageUrl": image.asset->url }`);
    setFact(data[Math.floor(Math.random() * data.length)]);
    setLoading(false);
  };

  useEffect(() => { fetchFact(); }, []);

  return (
    <div className={styles.mainBox}>
      {loading ? (
        <p className={styles.loadingText}>Loading next fact...</p>
      ) : (
        <>
          {fact?.imageUrl && (
            <div className={styles.imageContainer}><img src={fact.imageUrl} alt="Fact" /></div>
          )}
          <div className={styles.contentArea}>
            <span className={styles.categoryTag}>{fact?.category || 'TRIVIA'}</span>
            <p className={styles.factText}>{fact?.factText}</p>
          </div>
          <button onClick={fetchFact} className={styles.nextButton}>NEXT FACT PLEASE →</button>
        </>
      )}
    </div>
  );
}