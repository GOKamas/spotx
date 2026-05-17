'use client';
import { useState } from 'react';
import { Montserrat, Inter } from 'next/font/google';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import CookieBanner from '@/components/CookieBanner/CookieBanner';
import LegalModal from '@/components/LegalModal/LegalModal';
import "./globals.css";

const montserrat = Montserrat({ 
  subsets: ['latin'], 
  weight: ['400', '700', '900'],
  variable: '--font-montserrat',
});

const inter = Inter({
  subsets: ['latin', 'greek'], 
  weight: ['400', '700'],            
  display: 'swap',
  variable: '--font-inter',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Κρατάμε το state για το ποιο νομικό κείμενο είναι ανοιχτό σε modal
  const [activeModal, setActiveModal] = useState<'terms' | 'privacy' | null>(null);

  return (
    <html lang="el" className={`${montserrat.variable} ${inter.variable}`}>
      <body className={montserrat.className} style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', margin: 0, backgroundColor: '#0d0d0d' }}>
        
        <Header />
        
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {children}
        </main>
        
        {/* Περνάμε το trigger στο Footer */}
        <Footer onTriggerModal={setActiveModal} />
        
        {/* Περνάμε το trigger και στο Cookie Banner */}
        <CookieBanner onTriggerPrivacy={() => setActiveModal('privacy')} />

        {/* --- ΚΕΝΤΡΙΚΟ TERMS MODAL --- */}
        <LegalModal 
          title="TERMS OF USE" 
          isOpen={activeModal === 'terms'} 
          onClose={() => setActiveModal(null)}
        >
          <h4>1. COMMUNITY STANDARDS</h4>
          <p>Το SpotX είναι ένας χώρος ελεύθερης έκφρασης. Ωστόσο, απαγορεύεται αυστηρά η ρητορική μίσους, ο ρατσισμός και η παρενόχληση στο Chat. Οι παραβάτες αποκλείονται μόνιμα μέσω IP ban.</p>
          <h4>2. ΠΝΕΥΜΑΤΙΚΗ ΙΔΙΟΚΤΗΣΙΑ</h4>
          <p>Η μουσική και το περιεχόμενο που μεταδίδεται προορίζεται για προσωπική χρήση της κοινότητας.</p>
        </LegalModal>

        {/* --- ΚΕΝΤΡΙΚΟ PRIVACY MODAL --- */}
        <LegalModal 
          title="PRIVACY POLICY" 
          isOpen={activeModal === 'privacy'} 
          onClose={() => setActiveModal(null)}
        >
          <h4>ΔΕΔΟΜΕΝΑ ΠΟΥ ΣΥΛΛΕΓΟΥΜΕ</h4>
          <p>Συλλέγουμε μόνο τα απαραίτητα: το nickname σας για το chat, την IP σας για την ασφάλεια της πλατφόρμας και την τοποθεσία σας (μέσω IP) για την εμφάνιση του τοπικού καιρού.</p>
          <h4>COOKIES</h4>
          <p>Χρησιμοποιούμε cookies για τη διατήρηση της σύνδεσής σας στο chat και την επεξεργασία των δωρεών μέσω Stripe/Buy Me a Coffee.</p>
        </LegalModal>

      </body>
    </html>
  );
}
