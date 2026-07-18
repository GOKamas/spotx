import { Metadata } from 'next';
import Image from 'next/image';
import Header from '@/components/Header/Header';
import WordleGame from '@/components/WordleGame/WordleGame';
import styles from './WordlePage.module.css';

export const metadata: Metadata = {
  title: 'Wordle | SPOTX Games',
  description: 'Παίξε το ελληνικό Wordle του SpotX - μάντεψε τη λέξη σε 6 προσπάθειες.',
};

export default function WordlePage() {
  return (
    <main className="min-h-screen" style={{ background: '#f9cd01' }}>
      <Header />
      <div className={styles.pageWrapper}>

        {/* CUSTOM COVER IMAGE */}
        <div className={styles.coverWrapper}>
          <Image
            src="/games/wordle-cover.webp"
            alt="SPOTX Wordle"
            width={800}
            height={300}
            className={styles.coverImage}
            priority
          />
        </div>

        <h1 className={styles.title}>WORDLE</h1>
        <p className={styles.subtitle}>ΒΡΕΣ ΤΗ ΛΕΞΗ ΣΕ 6 ΠΡΟΣΠΑΘΕΙΕΣ</p>

        {/* ΕΞΗΓΗΣΗ ΧΡΩΜΑΤΩΝ */}
        <div className={styles.legend}>
          <p className={styles.legendIntro}>
            Μετά από κάθε προσπάθεια, τα γράμματα αλλάζουν χρώμα ώστε να σε καθοδηγήσουν προς τη σωστή λέξη:
          </p>
          <div className={styles.legendRow}>
            <span className={`${styles.legendSwatch} ${styles.swatchCorrect}`}>Α</span>
            <span className={styles.legendText}>Σωστό γράμμα, σωστή θέση</span>
          </div>
          <div className={styles.legendRow}>
            <span className={`${styles.legendSwatch} ${styles.swatchPresent}`}>Β</span>
            <span className={styles.legendText}>Υπάρχει στη λέξη, λάθος θέση</span>
          </div>
          <div className={styles.legendRow}>
            <span className={`${styles.legendSwatch} ${styles.swatchAbsent}`}>Γ</span>
            <span className={styles.legendText}>Δεν υπάρχει καθόλου στη λέξη</span>
          </div>
        </div>

        <WordleGame />
      </div>
    </main>
  );
}