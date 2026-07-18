'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { client } from '@/sanity/lib/client';
import imageUrlBuilder from '@sanity/image-url';
import QuizPlayer from './QuizPlayer';
import styles from './QuizCard.module.css';

const builder = imageUrlBuilder(client);
function urlFor(source: any) {
  return builder.image(source);
}

export default function QuizCard() {
  const [featuredQuiz, setFeaturedQuiz] = useState<any>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    // Φέρνουμε ΜΟΝΟ ένα quiz (το πιο πρόσφατο) - μένει σταθερό στο homepage
    const query = `*[_type == "quiz"] | order(_createdAt desc)[0]{ 
      title, 
      featuredImage,
      questions[]{ 
        questionText, 
        questionImage,
        answers[]{ text, isCorrect } 
      },
      results[]{
        minScore,
        maxScore,
        title,
        text
      }
    }`;
    client.fetch(query).then(setFeaturedQuiz);
  }, []);

  // Παίζεται το quiz μέσα στο ίδιο box
  if (playing && featuredQuiz) {
    return (
      <div className={styles.mainBox}>
        <QuizPlayer quiz={featuredQuiz} onExit={() => setPlaying(false)} />
      </div>
    );
  }

  return (
    <div className={styles.mainBox}>
      <div className={styles.contentArea}>
        <div className={styles.headerRow}>
          <span className={styles.categoryTag}>QUIZ OF THE WEEK</span>
          <Link href="/quizzes" className={styles.seeAllLink}>
            ΟΛΑ ΤΑ QUIZ →
          </Link>
        </div>

        {featuredQuiz ? (
          <button className={styles.quizRow} onClick={() => setPlaying(true)}>
            <div className={styles.thumbnailWrapper}>
              {featuredQuiz.featuredImage ? (
                <Image
                  src={urlFor(featuredQuiz.featuredImage).width(100).height(100).url()}
                  alt={featuredQuiz.title || 'Quiz Thumbnail'}
                  width={45}
                  height={45}
                  className={styles.thumbnail}
                />
              ) : (
                <div className={styles.fallbackIcon}>❓</div>
              )}
            </div>
            <span className={styles.quizTitle}>{featuredQuiz.title || 'Untitled Quiz'}</span>
            <span className={styles.quizArrow}>→</span>
          </button>
        ) : (
          <p style={{ opacity: 0.6, fontStyle: 'italic' }}>Φόρτωση quiz...</p>
        )}
      </div>
    </div>
  );
}