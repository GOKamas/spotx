'use client';
import Image from 'next/image';
import styles from './Footer.module.css';

interface FooterProps {
  onTriggerModal: (type: 'terms' | 'privacy' | null) => void;
}

export default function Footer({ onTriggerModal }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footerWrapper}>
      <div className={styles.footerContainer}>
        
        {/* 1η ΣΕΙΡΑ (ΑΡΙΣΤΕΡΑ): LOGO & INFO */}
        <div className={styles.brandSection}>
          <Image 
            src="/logo.webp" 
            alt="SPOTX Logo" 
            width={180} 
            height={72} 
            className={styles.footerLogo}
          />
          <p className={styles.tagline}>UNDERGROUND COMMUNITY RADIO</p>
          <p className={styles.location}>THESSALONIKI</p>
          <p className={styles.copyright}>&copy; {currentYear} SPOTX.</p>
        </div>

        {/* 2η ΣΕΙΡΑ (ΚΕΝΤΡΟ): LEGAL MODALS */}
        <div className={styles.legalSection}>
          <h3 className={styles.sectionTitle}>LEGAL & COMPLIANCE</h3>
          <div className={styles.legalLinks}>
            <button onClick={() => onTriggerModal('terms')} className={styles.modalTrigger}>
              TERMS OF USE
            </button>
            <button onClick={() => onTriggerModal('privacy')} className={styles.modalTrigger}>
              PRIVACY POLICY
            </button>
          </div>
        </div>

        {/* 3η ΣΕΙΡΑ (ΔΕΞΙΑ): CONTACT & SOCIALS ΜΕ ΕΙΚΟΝΙΔΙΑ */}
        <div className={styles.contactSection}>
          <h3 className={styles.sectionTitle}>CONTACT & FOLLOW</h3>
          
          {/* EMAIL */}
          <a href="mailto:spotx.web@gmail.com" className={styles.emailLink}>
            <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
            spotx.web@gmail.com
          </a>

          {/* SOCIALS */}
          <div className={styles.socialGrid}>
            <a 
              href="https://www.facebook.com/SpotX.web" 
              target="_blank" 
              rel="noopener noreferrer" 
              className={styles.socialLink}
            >
              <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
              FACEBOOK
            </a>
            <a 
              href="https://www.instagram.com/spotx.web/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className={styles.socialLink}
            >
              <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
              INSTAGRAM
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}