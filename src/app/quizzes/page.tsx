import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { client } from '@/sanity/lib/client';
import { createImageUrlBuilder } from '@sanity/image-url';
import Header from '@/components/Header/Header';
import styles from '@/components/QuizzesPage/QuizzesPage.module.css';

const builder = createImageUrlBuilder({
  projectId: client.config().projectId || '',
  dataset: client.config().dataset || ''
});
function urlFor(source: any) {
  return builder.image(source);
}

export const metadata: Metadata = {
  title: 'Όλα τα Quiz | SPOTX',
  description: 'Δες όλα τα διαθέσιμα quiz του SpotX και δοκίμασε τις γνώσεις σου.',
};

export const revalidate = 60;

async function getQuizzes() {
  const query = `*[_type == "quiz" && defined(slug.current)] | order(_createdAt desc) {
    title,
    slug,
    featuredImage,
    "questionCount": count(questions)
  }`;
  return client.fetch(query);
}

export default async function QuizzesPage() {
  const quizzes = await getQuizzes();

  return (
    <main className="min-h-screen" style={{ background: '#f9cd01' }}>
      <Header />

      <div className={styles.pageWrapper}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>QUIZ</h1>
            <p className={styles.subtitle}>ΔΟΚΙΜΑΣΕ ΤΙΣ ΓΝΩΣΕΙΣ ΣΟΥ</p>
          </div>

          <div className={styles.listContainer}>
            {quizzes?.map((quiz: any, i: number) => (
              <Link href={`/quizzes/${quiz.slug.current}`} key={i} className={styles.rowCard}>
                <div className={styles.imageWrapper}>
                  {quiz.featuredImage ? (
                    <Image
                      src={urlFor(quiz.featuredImage).width(500).height(350).url()}
                      alt={quiz.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 35vw"
                      className={styles.image}
                    />
                  ) : (
                    <div className={styles.fallbackIcon}>❓</div>
                  )}
                </div>
                <div className={styles.cardContent}>
                  <h2 className={styles.cardTitle}>{quiz.title}</h2>
                  <p className={styles.cardMeta}>{quiz.questionCount} ερωτήσεις</p>
                  <span className={styles.readMoreBtn}>ΠΑΙΞΕ ΤΩΡΑ →</span>
                </div>
              </Link>
            ))}

            {(!quizzes || quizzes.length === 0) && (
              <p className={styles.emptyState}>Δεν υπάρχουν ακόμα quiz.</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}