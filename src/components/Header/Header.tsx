'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import styles from './Header.module.css';

export default function Header() {
  const [dateTime, setDateTime] = useState({ time: '', date: '' });
  const [weather, setWeather] = useState({ city: 'Loading...', temp: '--' });

  useEffect(() => {
    // 1. Ρολόι & Ημερομηνία
    const updateClock = () => {
      const now = new Date();
      setDateTime({
        time: now.toLocaleTimeString('el-GR', { hour: '2-digit', minute: '2-digit' }),
        date: now.toLocaleDateString('el-GR', { weekday: 'short', day: 'numeric', month: 'short' })
      });
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);

    // 2. Fetch Καιρού & Τοποθεσίας βάσει IP (Αυτόματο)
    const fetchWeather = async () => {
      const API_KEY = "8d1e29796a6e4e00a0091448261605"; 
      try {
        // Το weatherapi.com βρίσκει την τοποθεσία αυτόματα αν του περάσεις "auto:ip"
        const res = await fetch(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=auto:ip&lang=el`);
        const data = await res.json();
        
        if (data && data.location && data.current) {
          setWeather({
            city: data.location.name, // Πόρτα-πόρτα η πόλη του επισκέπτη
            temp: Math.round(data.current.temp_c).toString() // Θερμοκρασία στρογγυλοποιημένη
          });
        }
      } catch (err) {
        console.error("Failed to fetch weather data:", err);
        setWeather({ city: "Thessaloniki", temp: "22" }); // Fallback σε περίπτωση σφάλματος
      }
    };

    fetchWeather();

    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.headerWrapper}>
      <header className={styles.headerContainer}>
        {/* LOGO LINK */}
        <div className={styles.logoWrapper}>
          <Link href="/" className={styles.logoLink}>
            <Image 
              src="/logo.webp" 
              alt="SPOTX Logo" 
              width={250} 
              height={100} 
              className={styles.megaLogo} 
              priority 
            />
          </Link>
        </div>

        <div className={styles.rightSection}>
          {/* BUY ME A COFFEE LINK */}
          <a 
            href="https://www.buymeacoffee.com/spotx" 
            target="_blank" 
            rel="noopener noreferrer" 
            className={styles.coffeeBtn}
          >
             BUY ME A CUP OF COFFEE
          </a>

          {/* TODAY INFO */}
          <div className={styles.infoWrapper}>
            <button className={styles.infoBtn}>TODAY</button>
            <div className={styles.infoDrawer}>
              <div className={styles.drawerItem}>
                <span className={styles.label}>Local Time</span>
                <span className={`${styles.value} ${styles.timeLarge}`}>{dateTime.time}</span>
                <span className={styles.value}>{dateTime.date}</span>
              </div>
              <div className={styles.drawerItem}>
                <span className={styles.label}>Location & Weather</span>
                <span className={styles.value}>{weather.city} {weather.temp}°C</span>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}