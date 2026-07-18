'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import OffCanvasMenu from './OffCanvasMenu';
import styles from './Header.module.css';

export default function Header() {
  const [dateTime, setDateTime] = useState({ time: '', date: '' });
  const [weather, setWeather] = useState({ city: 'Loading...', temp: '--' });
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setDateTime({
        time: now.toLocaleTimeString('el-GR', { hour: '2-digit', minute: '2-digit' }),
        date: now.toLocaleDateString('el-GR', { weekday: 'short', day: 'numeric', month: 'short' })
      });
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);

    const fetchWeather = async () => {
      const API_KEY = "8d1e29796a6e4e00a0091448261605";
      try {
        const res = await fetch(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=auto:ip&lang=el`);
        const data = await res.json();

        if (data && data.location && data.current) {
          setWeather({
            city: data.location.name,
            temp: Math.round(data.current.temp_c).toString()
          });
        }
      } catch (err) {
        console.error("Failed to fetch weather data:", err);
        setWeather({ city: "Thessaloniki", temp: "22" });
      }
    };

    fetchWeather();

    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.headerWrapper}>
      <header className={styles.headerContainer}>
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
          <a href="https://www.buymeacoffee.com/spotx" target="_blank" rel="noopener noreferrer" className={styles.coffeeBtn}>
            BUY ME A CUP OF COFFEE
          </a>

          <button className={styles.hamburgerBtn} onClick={() => setMenuOpen(true)} aria-label="Open menu">
            <span className={styles.hamburgerLine}></span>
            <span className={styles.hamburgerLine}></span>
            <span className={styles.hamburgerLine}></span>
          </button>
        </div>
      </header>

      <OffCanvasMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        dateTime={dateTime}
        weather={weather}
      />
    </div>
  );
}