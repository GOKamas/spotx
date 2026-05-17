'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { client } from '@/sanity/lib/client';
import { createImageUrlBuilder } from '@sanity/image-url';
import { motion, Variants } from 'framer-motion';
import styles from './HomeBlogSection.module.css';

const builder = createImageUrlBuilder({
  projectId: client.config().projectId || '',
  dataset: client.config().dataset || ''
});
function urlFor(source: any) {
  return builder.image(source);
}

export default function HomeBlogSection() {
  const [randomPosts, setRandomPosts] = useState<any[]>([]);

  useEffect(() => {
    const query = `*[_type == "blog"] {
      title,
      slug,
      featuredImage,
      excerpt
    }`;
    client.fetch(query).then((posts: any[]) => {
      if (posts && posts.length > 0) {
        const shuffled = [...posts].sort(() => 0.5 - Math.random());
        setRandomPosts(shuffled.slice(0, 4));
      }
    });
  }, []);

  const bgVariants: Variants = {
    hidden: { x: '-120%', opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  const brush1Variants: Variants = {
    hidden: { scale: 1.3, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { delay: 0.4, duration: 0.25, ease: 'easeOut' } }
  };

  const brush2Variants: Variants = {
    hidden: { scale: 1.3, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { delay: 0.6, duration: 0.25, ease: 'easeOut' } }
  };

  const blogTextVariants: Variants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { delay: 0.9, duration: 0.5, ease: 'easeOut' } }
  };

  // TYPE-IN ANIMATION ΓΙΑ ΤΟ TAGLINE
  const tagline = "ΓΙΑ ΟΛΑ ΟΣΑ ΔΕΝ ΗΞΕΡΕΣ ΟΤΙ ΣΕ ΕΝΔΙΑΦΕΡΟΥΝ...";
  
  const sentenceVariants: Variants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: { delayChildren: 1.4, staggerChildren: 0.03 } // Ξεκινάει μόλις τελειώσει το logo
    }
  };

  const letterVariants: Variants = {
    hidden: { opacity: 0, display: "none" },
    visible: { opacity: 1, display: "inline" }
  };

  if (randomPosts.length === 0) return null;

  return (
    <section className={styles.sectionContainer}>
      <div className={styles.wrapper}>
        
        {/* LOGO WRAPPER */}
        <div className={styles.logoAndTaglineArea}>
          <Link href="/blog" className={styles.logoLink}>
            <motion.div className={styles.logoContainer} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }}>
              <motion.div variants={bgVariants} className={styles.layer}><img src="/blogx1.webp" alt="" className={styles.responsiveImg} /></motion.div>
              <motion.div variants={brush1Variants} className={styles.layer}><img src="/blogx3.webp" alt="" className={styles.responsiveImg} /></motion.div>
              <motion.div variants={brush2Variants} className={styles.layer}><img src="/blogx4.webp" alt="X" className={styles.responsiveImg} /></motion.div>
              <motion.div variants={blogTextVariants} className={styles.layer}><img src="/blogx2.webp" alt="BLOG" className={styles.responsiveImg} /></motion.div>
            </motion.div>
          </Link>

          {/* ΤΥΠΩΝΟΜΕΝΟ TAGLINE */}
          <motion.p className={styles.tagline} variants={sentenceVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {tagline.split("").map((char, index) => (
              <motion.span key={index} variants={letterVariants}>
                {char}
              </motion.span>
            ))}
            <span className={styles.cursor}>|</span>
          </motion.p>
        </div>

        {/* ARTICLES GRID */}
        <div className={styles.grid}>
          {randomPosts.map((post, i) => (
            <Link href={`/blog/${post.slug.current}`} key={i} className={styles.flatCard}>
              <div className={styles.imageWrapper}>
                {post.featuredImage && (
                  <Image src={urlFor(post.featuredImage).width(500).height(350).url()} alt={post.title} fill className={styles.image} />
                )}
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{post.title}</h3>
                <p className={styles.cardExcerpt}>{post.excerpt}</p>
                <span className={styles.actionText}>READ ARTICLE →</span>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}