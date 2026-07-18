import { Metadata } from 'next';
import { client } from '@/sanity/lib/client';
import { createImageUrlBuilder } from '@sanity/image-url';
import Header from '@/components/Header/Header';
import MemoryGame from '@/components/MemoryGame/MemoryGame';
import styles from './MemoryPage.module.css';

const builder = createImageUrlBuilder({
  projectId: client.config().projectId || '',
  dataset: client.config().dataset || ''
});
function urlFor(source: any) {
  return builder.image(source);
}

export const metadata: Metadata = {
  title: 'Memory Game | SPOTX Games',
  description: 'Βρες τα ζευγάρια σε αυτό το memory card game του SpotX.',
};

export const revalidate = 60;

async function getCardImages(): Promise<string[]> {
  const data = await client.fetch(`*[_type == "memoryGame"][0]{ cards }`);
  if (!data?.cards) return [];
  return data.cards.map((img: any) => urlFor(img).width(240).height(240).url());
}

export default async function MemoryPage() {
  const imageUrls = await getCardImages();

  return (
    <main className="min-h-screen" style={{ background: '#f9cd01' }}>
      <Header />
      <div className={styles.pageWrapper}>
        <h1 className={styles.title}>MEMORY</h1>
        <p className={styles.subtitle}>ΒΡΕΣ ΟΛΑ ΤΑ ΖΕΥΓΑΡΙΑ</p>

        {imageUrls.length === 8 ? (
          <MemoryGame imageUrls={imageUrls} />
        ) : (
          <p className={styles.emptyState}>
            Το παιχνίδι δεν έχει ρυθμιστεί ακόμα — χρειάζονται ακριβώς 8 εικόνες στο Sanity Studio.
          </p>
        )}
      </div>
    </main>
  );
}