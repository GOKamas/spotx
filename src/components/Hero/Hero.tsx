'use client';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image'; 
import dynamic from 'next/dynamic'; // ⚡ Εισαγωγή του dynamic για το Lazy Loading
import FunFactCard from '../FunFactCard/FunFactCard';
import QuizCard from '../QuizCard/QuizCard';
import styles from './Hero.module.css';

// ⚡ LAZY LOAD: Το ChatCard θα φορτώσει ΜΟΝΟ όταν ο χρήστης πατήσει το κουμπί του Chat
const ChatCard = dynamic(() => import('../ChatCard/ChatCard'), {
  ssr: false, // Αποφέυγει προβλήματα με το Pusher κατά το build
  loading: () => <div style={{ padding: '20px', textAlign: 'center', opacity: 0.5, fontFamily: 'Roboto, sans-serif' }}>Φορτώνει το Chat...</div>
});

interface SongData {
  title: string;
  artist: string;
  album: string;
  art: string; 
}

export default function Hero() {
  const [activeTab, setActiveTab] = useState<'fact' | 'quiz' | 'chat' | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showMetadata, setShowMetadata] = useState(false);
  const [volume, setVolume] = useState(0.8);
  
  const [currentSong, setCurrentSong] = useState<SongData>({
    title: "Φορτώνει...",
    artist: "SpotX Radio",
    album: "Live",
    art: "/hero1.webp" 
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const STREAM_URL = "https://a7.asurahosting.com:8290/radio.mp3";
  const API_URL = "https://a7.asurahosting.com/api/nowplaying/spotx";

  const fetchNowPlaying = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      if (data && data.now_playing && data.now_playing.song) {
        setCurrentSong({
          title: data.now_playing.song.title || "Unknown Title",
          artist: data.now_playing.song.artist || "Unknown Artist",
          album: data.now_playing.song.album || "Live Stream",
          art: data.now_playing.song.art || "/hero1.webp" 
        });
      }
    } catch (error) {
      console.error("Σφάλμα κατά το τράβηγμα των metadata:", error);
    }
  };

  useEffect(() => {
    fetchNowPlaying();
    const interval = setInterval(fetchNowPlaying, 15000);
    return () => clearInterval(interval);
  }, []);

  const handlePlayToggle = () => {
    if (isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = ""; 
        audioRef.current = null;
      }
      setIsPlaying(false);
    } else {
      const audio = new Audio(STREAM_URL);
      audio.crossOrigin = "anonymous";
      audio.volume = volume;
      audioRef.current = audio;
      
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.error("Αποτυχία stream:", err));
    }
  };

  const handleVolumeChange = (direction: 'up' | 'down') => {
    let newVolume = volume;
    if (direction === 'up') {
      newVolume = Math.min(1, volume + 0.1);
    } else {
      newVolume = Math.max(0, volume - 0.1);
    }
    
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const visualizerBars = Array.from({ length: 16 });

  return (
    <section className={styles.heroSection}>
      <div className={styles.heroContainer}>
        
        {/* ΑΡΙΣΤΕΡΗ ΠΛΕΥΡΑ: INTERACTIVE TABS */}
        <div className={styles.leftColumn}>
          <div className={styles.tabContainer}>
            <div className={styles.tabButtons}>
              <button 
                style={{ width: '150px', minWidth: '150px', maxWidth: '150px' }}
                className={`${styles.wtfBtn} ${activeTab === 'fact' ? styles.active : ''}`}
                onClick={() => setActiveTab(activeTab === 'fact' ? null : 'fact')}
              >
                <Image src="/wtf1.webp" alt="Facts" width={150} height={150} style={{ width: '100%', height: 'auto' }} />
              </button>

              <button 
                style={{ width: '150px', minWidth: '150px', maxWidth: '150px' }}
                className={`${styles.quizBtn} ${activeTab === 'quiz' ? styles.active : ''}`}
                onClick={() => setActiveTab(activeTab === 'quiz' ? null : 'quiz')}
              >
                <Image src="/quiz1.webp" alt="Quiz" width={150} height={150} style={{ width: '100%', height: 'auto' }} />
              </button>

              <button 
                style={{ width: '140px', minWidth: '140px', maxWidth: '140px' }}
                className={`${styles.chatBtn} ${activeTab === 'chat' ? styles.active : ''}`}
                onClick={() => setActiveTab(activeTab === 'chat' ? null : 'chat')}
              >
                <Image src="/chat1.webp" alt="Chat" width={140} height={140} style={{ width: '100%', height: 'auto' }} />
              </button>
            </div>

            <div className={styles.displayArea}>
              {activeTab === 'fact' && <FunFactCard />}
              {activeTab === 'quiz' && <QuizCard />}
              {activeTab === 'chat' && <ChatCard />}
              
              {activeTab === null && (
                <div className={styles.visualizerContainer}>
                  <div className={styles.visualizerWrapper}>
                    {visualizerBars.map((_, index) => (
                      <div 
                        key={index} 
                        className={`${styles.bar} ${isPlaying ? styles.barPlaying : styles.barPaused}`}
                        style={{ animationDelay: `${index * 0.07}s` }}
                      />
                    ))}
                  </div>
                  <p className={styles.visualizerStatus}>
                    {isPlaying ? `LIVE NOW • VOL: ${Math.round(volume * 100)}%` : "STREAM PAUSED - PRESS PLAY"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ΔΕΞΙΑ ΠΛΕΥΡΑ: IPOD */}
        <div 
          className={styles.rightColumn}
          style={{ width: '500px', minWidth: '500px', maxWidth: '500px', flex: '0 0 500px' }}
        >
          <div className={styles.ipodWrapper}>
            <Image 
              src="/hero1.webp" 
              alt="iPod" 
              width={500} 
              height={600} 
              className={styles.ipodImage} 
              priority 
            />
            <div className={`${styles.purpleRing} ${isPlaying ? styles.pulse : ''}`} />
            
            {/* Click Wheel Buttons */}
            <button className={`${styles.wheelBtn} ${styles.btnMenu}`} onClick={() => setShowMetadata(!showMetadata)} />
            <button className={`${styles.wheelBtn} ${styles.btnPlay}`} onClick={handlePlayToggle} />
            <button className={`${styles.wheelBtn} ${styles.btnNext}`} onClick={() => handleVolumeChange('up')} />
            <button className={`${styles.wheelBtn} ${styles.btnPrev}`} onClick={() => handleVolumeChange('down')} />
            <button className={`${styles.wheelBtn} ${styles.btnCenter}`} onClick={handlePlayToggle} />

            {/* ⚡ ΝΕΑ ΘΕΣΗ: ΤΑ METADATA ΕΜΦΑΝΙΖΟΝΤΑΙ ΜΕΣΑ ΣΤΗΝ ΟΘΟΝΗ ΤΟΥ IPOD */}
            {showMetadata && (
              <div className={styles.ipodScreenMetadata}>
                <div className={styles.metaHeader}>NOW PLAYING</div>
                <div className={styles.metaContent}>
                  
                  <div className={styles.metaAlbumArtWrapper} style={{ marginBottom: '8px', display: 'flex', justifyContent: 'center' }}>
                    <Image 
                      src={currentSong.art} 
                      alt="Album Art" 
                      width={75} 
                      height={75}
                      unoptimized={currentSong.art.startsWith('http')} 
                      style={{ borderRadius: '6px', objectFit: 'cover', border: '1px solid #fff' }} 
                    />
                  </div>

                  <p className={styles.metaLabel}>Song</p>
                  <p className={styles.metaValue}>{currentSong.title}</p>
                  <p className={styles.metaLabel}>Artist</p>
                  <p className={styles.metaValue}>{currentSong.artist}</p>
                </div>
              </div>
            )}
          </div>

      
        </div>

      </div>
    </section>
  );
}