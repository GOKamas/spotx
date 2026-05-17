import { Metadata } from 'next';
import Hero from '@/components/Hero/Hero';
import HomeBlogSection from '@/components/HomeBlogSection/HomeBlogSection';

// Τα Metadata για Google, ChatGPT και Social Media
export const metadata: Metadata = {
  title: 'SPOTX | Underground Community Radio Thessaloniki',
  description: 'Live underground community radio based in Thessaloniki, Greece. Tune in for electronic, techno, house, and independent DJ sets. Join our live community chat.',
  keywords: [
    'radio', 'underground radio', 'Thessaloniki radio', 'electronic music', 
    'techno live', 'independent radio Greece', 'SpotX', 'SpotX web', 'radio Thessaloniki'
  ],
  openGraph: {
    title: 'SPOTX | Underground Community Radio Thessaloniki',
    description: 'Tune in to SpotX, the independent underground radio of Thessaloniki. Live stream, community chat, and fresh underground beats 24/7.',
    url: 'https://spotx.web.id', // Βάλε το δικό σου domain
    siteName: 'SPOTX',
    images: [
      {
        url: '/logo.webp', // Χρησιμοποιεί το logo σου για preview στα links
        width: 500,
        height: 200,
        alt: 'SPOTX Radio',
      },
    ],
    locale: 'el_GR',
    type: 'website',
  },
};

export default function Home() {
  return (
    /* Αφαιρέσαμε το bg-[#f9cd01] γιατί το background πλέον ελέγχεται 
       από το body στο layout (#0d0d0d) για το dark/stealth look που θέλουμε */
    <main style={{ width: '100%' }}>
      {/* ⚠️ ΑΦΑΙΡΕΘΗΚΕ ΤΟ <Header /> ΑΠΟ ΕΔΩ ΓΙΑΤΙ ΥΠΑΡΧΕΙ ΗΔΗ ΣΤΟ LAYOUT.TSX */}

      {/* Το Hero Section που περιέχει την κάρτα και το iPod */}
      <Hero />
      
      {/* Το νέο animated section με τα τυχαία άρθρα */}
      <HomeBlogSection />
    </main>
  );
}
