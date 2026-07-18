import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { client } from '@/sanity/lib/client';
import QuizPlayer from '@/components/QuizCard/QuizPlayer';
import styles from '@/components/QuizCard/QuizCard.module.css';

interface Props {
  params: { slug: string };
}

async function getQuiz(slug: string) {
  const query = `*[_type == "quiz" && slug.current == $slug][0]{ 
    title, 
    featuredImage,
    questions[]{ 
      questionText, 
      questionImage,
      answers[]{ text, isCorrect } 
    },
    results[]{ minScore, maxScore, title, text }
  }`;
  return client.fetch(query, { slug });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const quiz = await getQuiz(params.slug);
  if (!quiz) return {};
  return {
    title: `${quiz.title} | SPOTX Quiz`,
    description: `Δοκίμασε το quiz "${quiz.title}" στο SpotX.`,
  };
}

export const revalidate = 60;

export default async function QuizPage({ params }: Props) {
  const quiz = await getQuiz(params.slug);

  if (!quiz) {
    notFound();
  }

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '150px 20px 60px 20px', width: '100%' }}>
      <h1 style={{ color: '#fff', fontSize: '24px', marginBottom: '20px' }}>{quiz.title}</h1>
      <div className={styles.mainBox}>
        <QuizPlayer quiz={quiz} />
      </div>
    </div>
  );
}