import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header/Header';
import styles from '@/components/GamesPage/GamesPage.module.css';

export const metadata: Metadata = {
  title: 'Games | SPOTX',
  description: 'Παίξε online παιχνίδια στο SpotX - Wordle, Memory και σύντομα κι άλλα.',
};

const games = [
  {
    slug: 'wordle',
    title: 'WORDLE',
    description: 'Μάντεψε τη μυστική 5γράμματη λέξη σε 6 προσπάθειες.',
    image: '/games/wordle-cover.webp',
  },
  {
    slug: 'memory',
    title: 'MEMORY',
    description: 'Βρες τα 8 ζευγάρια καρτών στο 4x4 ταμπλό.',
    image: '/games/memory-cover.webp',
  },
];

export default function GamesPage() {
  return (
    <main className="min-h-screen" style={{ background: '#f9cd01' }}>
      <Header />

      <div className={styles.pageWrapper}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>GAMES</h1>
            <p className={styles.subtitle}>ΔΙΑΛΕΞΕ ΚΑΙ ΠΑΙΞΕ</p>
          </div>

          <div className={styles.listContainer}>
            {games.map((game) => (
              <Link href={`/games/${game.slug}`} key={game.slug} className={styles.rowCard}>
                <div className={styles.iconWrapper}>
                  <Image
                    src={game.image}
                    alt={game.title}
                    width={400}
                    height={280}
                    className={styles.gameImage}
                  />
                </div>
                <div className={styles.cardContent}>
                  <h2 className={styles.cardTitle}>{game.title}</h2>
                  <p className={styles.cardMeta}>{game.description}</p>
                  <span className={styles.readMoreBtn}>ΠΑΙΞΕ ΤΩΡΑ →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}