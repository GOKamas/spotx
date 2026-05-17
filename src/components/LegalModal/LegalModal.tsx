'use client';
import styles from './LegalModal.module.css';

interface LegalModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function LegalModal({ title, isOpen, onClose, children }: LegalModalProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>{title}</h3>
          <button className={styles.closeIcon} onClick={onClose}>✕</button>
        </div>
        <div className={styles.modalBody}>
          {children}
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.confirmBtn} onClick={onClose}>CLOSE</button>
        </div>
      </div>
    </div>
  );
}