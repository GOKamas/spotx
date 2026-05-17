'use client';
import { useState, useEffect } from 'react';
import styles from './CookieBanner.module.css';

interface CookieBannerProps {
  onTriggerPrivacy: () => void;
}

export default function CookieBanner({ onTriggerPrivacy }: CookieBannerProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('spotx_cookie_consent');
    if (!consent) setIsVisible(true);
  }, []);

  if (!isVisible) return null;

  return (
    <div className={styles.bannerWrapper}>
      <div className={styles.bannerContainer}>
        
        <div className={styles.textSide}>
          <span className={styles.subTitle}>GDPR & COOKIE COMPLIANCE</span>
          <p className={styles.mainText}>
            We use essential cookies to provide a premium experience. By accepting, you agree to our 
            {/* Όταν πατηθεί, ανοίγει το Modal pop-up στην ίδια σελίδα */}
            <span className={styles.inlineModalLink} onClick={onTriggerPrivacy}> Privacy Policy</span>.
          </p>
        </div>

        <div className={styles.buttonSide}>
          <button onClick={() => { localStorage.setItem('spotx_cookie_consent', 'accepted'); setIsVisible(false); }} className={styles.acceptBtn}>
            ACCEPT ALL
          </button>
          <button onClick={() => { localStorage.setItem('spotx_cookie_consent', 'declined'); setIsVisible(false); }} className={styles.declineBtn}>
            DECLINE
          </button>
        </div>

      </div>
    </div>
  );
}