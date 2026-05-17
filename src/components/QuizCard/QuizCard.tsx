'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { client } from '@/sanity/lib/client';
import imageUrlBuilder from '@sanity/image-url';
import styles from './QuizCard.module.css';

// Ρύθμιση του image builder για το Sanity
const builder = imageUrlBuilder(client);
function urlFor(source: any) {
  return builder.image(source);
}

export default function QuizCard() {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<any>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  useEffect(() => {
    // Αναβαθμισμένο query που φέρνει εικόνες και αποτελέσματα σκορ
    const query = `*[_type == "quiz"]{ 
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
    client.fetch(query).then(setQuizzes);
  }, []);

  // Reset του quiz κατά την έξοδο ή επανεκκίνηση
  const handleExit = () => {
    setSelectedQuiz(null);
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

    if (currentQuestion + 1 < selectedQuiz.questions.length) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  // 1. Αρχική Προβολή: Λίστα με Κουίζ (CHOOSE YOUR CHALLENGE)
  if (!selectedQuiz) {
    return (
      <div className={styles.mainBox}>
        <div className={styles.contentArea}>
          <span className={styles.categoryTag}>CHOOSE YOUR CHALLENGE</span>
          
          <div className={styles.quizListContainer}>
            {quizzes.map((quiz, i) => (
              <button 
                key={i} 
                className={styles.quizRow} 
                onClick={() => setSelectedQuiz(quiz)}
              >
                <div className={styles.thumbnailWrapper}>
                  {quiz.featuredImage ? (
                    <Image
                      src={urlFor(quiz.featuredImage).width(100).height(100).url()}
                      alt={quiz.title}
                      width={45}
                      height={45}
                      className={styles.thumbnail}
                    />
                  ) : (
                    <div className={styles.fallbackIcon}>❓</div>
                  )}
                </div>
                <span className={styles.quizTitle}>{quiz.title}</span>
                <span className={styles.quizArrow}>→</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 2. Προβολή Οθόνης Τερματισμού (Σκορ & Λόγια βάσει Sanity)
  if (quizFinished) {
    // Φιλτράρισμα για να βρούμε το σωστό feedback template από το Sanity
    const feedback = selectedQuiz.results?.find(
      (res: any) => score >= res.minScore && score <= res.maxScore
    ) || { title: "Quiz Completed!", text: "Ελπίζουμε να διασκέδασες!" };

    return (
      <div className={styles.mainBox}>
        <div className={styles.contentArea} style={{ textAlign: 'center' }}>
          <span className={styles.categoryTag}>RESULTS</span>
          
          <h2 className={styles.scoreTitle}>
            YOUR SCORE: {score} / {selectedQuiz.questions.length}
          </h2>
          
          <h3 className={styles.feedbackTitle}>{feedback.title}</h3>
          <p className={styles.feedbackText}>{feedback.text}</p>
          
          <button className={styles.actionBtn} onClick={handleExit}>
            PLAY ANOTHER QUIZ
          </button>
        </div>
      </div>
    );
  }

  // 3. Προβολή Παιχνιδιού: Ερωτήσεις (με υποστήριξη Φωτογραφίας)
  const question = selectedQuiz.questions[currentQuestion];

  return (
    <div className={styles.mainBox}>
      <div className={styles.contentArea}>
        <div className={styles.gameHeader}>
          <span className={styles.categoryTag}>
            QUESTION {currentQuestion + 1} OF {selectedQuiz.questions.length}
          </span>
          <button className={styles.backBtn} onClick={handleExit}>EXIT</button>
        </div>
        
        {/* Εικόνα Ερώτησης (Αν υπάρχει στο Sanity) */}
        {question.questionImage && (
          <div className={styles.questionImageWrapper}>
            <Image 
              src={urlFor(question.questionImage).width(600).height(400).url()}
              alt="Question Visual"
              width={300}
              height={180}
              className={styles.questionImage}
            />
          </div>
        )}
        
        <p className={styles.questionText}>{question.questionText}</p>
        
        <div className={styles.answersGrid}>
          {question.answers.map((ans: any, i: number) => (
            <button 
              key={i} 
              className={styles.answerBtn} 
              onClick={() => handleAnswerClick(ans.isCorrect)}
            >
              {ans.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}