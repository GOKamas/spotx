'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import QuizPlayer from '@/components/QuizCard/QuizPlayer';
import styles from '@/components/QuizCard/QuizCard.module.css';

export default function QuizDetailClient({ quiz }: { quiz: any }) {
  const router = useRouter();

  return (
    <>
      <Link href="/quizzes" className={styles.backLink}>
        ← ΕΠΙΣΤΡΟΦΗ ΣΤΑ QUIZ
      </Link>

      <h1 style={{ color: '#fff', fontSize: '24px', margin: '20px 0' }}>{quiz.title}</h1>

      <div className={styles.mainBox}>
        <QuizPlayer quiz={quiz} onExit={() => router.push('/quizzes')} />
      </div>
    </>
  );
}