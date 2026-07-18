'use client';
import { useState } from 'react';
import Image from 'next/image';
import { client } from '@/sanity/lib/client';
import imageUrlBuilder from '@sanity/image-url';
import styles from './QuizCard.module.css';

const builder = imageUrlBuilder(client);
function urlFor(source: any) {
  return builder.image(source);
}

export default function QuizPlayer({ quiz, onExit }: { quiz: any; onExit?: () => void }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const handleRestart = () => {
    setCurrentQuestion(0);
    setScore(0);
    setQuizFinished(false);
  };

  const handleAnswerClick = (isCorrect: boolean) => {
    let nextScore = score;
    if (isCorrect) {
      nextScore = score + 1;
      setScore(nextScore);
    }
    const totalQuestions = quiz?.questions?.length || 0;
    if (currentQuestion + 1 < totalQuestions) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  // Οθόνη Αποτελεσμάτων
  if (quizFinished) {
    const feedback = quiz.results?.find(
      (res: any) => score >= res.minScore && score <= res.maxScore
    ) || { title: "Quiz Completed!", text: "Ελπίζουμε να διασκέδασες!" };

    const totalQuestions = quiz?.questions?.length || 0;

    return (
      <div className={styles.contentArea} style={{ textAlign: 'center' }}>
        <span className={styles.categoryTag}>RESULTS</span>
        <h2 className={styles.scoreTitle}>YOUR SCORE: {score} / {totalQuestions}</h2>
        <h3 className={styles.feedbackTitle}>{feedback.title}</h3>
        <p className={styles.feedbackText}>{feedback.text}</p>
        <button className={styles.actionBtn} onClick={handleRestart}>
          PLAY AGAIN
        </button>
      </div>
    );
  }

  const totalQuestions = quiz?.questions?.length || 0;
  const question = quiz?.questions?.[currentQuestion];

  if (!question) {
    return (
      <div className={styles.contentArea}>
        <p className={styles.questionText}>Σφάλμα: Η ερώτηση δεν βρέθηκε.</p>
        {onExit && <button className={styles.backBtn} onClick={onExit}>ΕΠΙΣΤΡΟΦΗ</button>}
      </div>
    );
  }

  return (
    <div className={styles.contentArea}>
      <div className={styles.gameHeader}>
        <span className={styles.categoryTag}>
          QUESTION {currentQuestion + 1} OF {totalQuestions}
        </span>
        {onExit && <button className={styles.backBtn} onClick={onExit}>EXIT</button>}
      </div>

      {question.questionImage && (
        <div className={styles.questionImageWrapper} style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <Image
            src={urlFor(question.questionImage).width(600).url()}
            alt="Question Visual"
            width={300}
            height={180}
            className={styles.questionImage}
            style={{
              width: '100%',
              maxHeight: '160px',
              objectFit: 'contain',
              borderRadius: '8px',
              backgroundColor: '#f7f7f7'
            }}
          />
        </div>
      )}

      <p className={styles.questionText}>{question.questionText || 'Χωρίς κείμενο ερώτησης'}</p>

      <div className={styles.answersGrid}>
        {question?.answers?.map((ans: any, i: number) => (
          <button
            key={i}
            className={styles.answerBtn}
            onClick={() => handleAnswerClick(ans.isCorrect)}
          >
            {ans.text}
          </button>
        ))}
        {(!question?.answers || question.answers.length === 0) && (
          <p style={{ opacity: 0.6, fontStyle: 'italic', gridColumn: '1 / -1', textAlign: 'center', marginTop: '10px' }}>
            Δεν έχουν προστεθεί επιλογές απαντήσεων για αυτή την ερώτηση στο Sanity Studio.
          </p>
        )}
      </div>
    </div>
  );
}