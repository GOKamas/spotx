'use client';
import Link from 'next/link';
import { useEffect } from 'react';
import styles from './Header.module.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  dateTime: { time: string; date: string };
  weather: { city: string; temp: string };
}

export default function OffCanvasMenu({ isOpen, onClose, dateTime, weather }: Props) {
  // Κλείδωμα scroll στο body όσο είναι ανοιχτό το menu
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Κλείσιμο με Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <>
      <div
        className={`${styles.overlay} ${isOpen ? styles.overlayVisible : ''}`}
        onClick={onClose}
      />
      <nav className={`${styles.offCanvasPanel} ${isOpen ? styles.offCanvasOpen : ''}`}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close menu">
          ✕
        </button>

        <ul className={styles.navList}>
          <li>
            <Link href="/quizzes" className={styles.navLink} onClick={onClose}>
              QUIZ
            </Link>
          </li>
          <li>
            <Link href="/games" className={styles.navLink} onClick={onClose}>
              GAMES
            </Link>
          </li>
          <li>
            <Link href="/blog" className={styles.navLink} onClick={onClose}>
              BLOG
            </Link>
          </li>
        </ul>

        <div className={styles.panelDivider} />

        <div className={styles.panelDrawerItem}>
          <span className={styles.label}>Local Time</span>
          <span className={`${styles.value} ${styles.timeLarge}`}>{dateTime.time}</span>
          <span className={styles.value}>{dateTime.date}</span>
        </div>
        <div className={styles.panelDrawerItem}>
          <span className={styles.label}>Location & Weather</span>
          <span className={styles.value}>{weather.city} {weather.temp}°C</span>
        </div>
      </nav>
    </>
  );
}