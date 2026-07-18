'use client';
import Link from 'next/link';
import Image from 'next/image';
import { client } from '@/sanity/lib/client';
import { createImageUrlBuilder } from '@sanity/image-url';
import Header from '@/components/Header/Header';
import { motion, Variants } from 'framer-motion';
import styles from './BlogPage.module.css';

const builder = createImageUrlBuilder({
  projectId: client.config().projectId || '',
  dataset: client.config().dataset || ''
});
function urlFor(source: any) {
  return builder.image(source);
}

export default function BlogPageClient({ posts }: { posts: any[] }) {
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

  return (
    <main className="min-h-screen bg-[#f9cd01]">
      <Header />

      <div className={styles.pageWrapper}>
        <div className={styles.container}>

          <div className={styles.logoWrapper}>
            <motion.div className={styles.logoContainer} initial="hidden" animate="visible">
              <motion.div variants={bgVariants} className={styles.layer}>
                <img src="/blogx1.webp" alt="" className={styles.responsiveImg} />
              </motion.div>
              <motion.div variants={brush1Variants} className={styles.layer}>
                <img src="/blogx3.webp" alt="" className={styles.responsiveImg} />
              </motion.div>
              <motion.div variants={brush2Variants} className={styles.layer}>
                <img src="/blogx4.webp" alt="X" className={styles.responsiveImg} />
              </motion.div>
              <motion.div variants={blogTextVariants} className={styles.layer}>
                <img src="/blogx2.webp" alt="BLOG" className={styles.responsiveImg} />
              </motion.div>
            </motion.div>
          </div>

          <div className={styles.listContainer}>
            {posts.map((post, i) => (
              <Link href={`/blog/${post.slug.current}`} key={i} className={styles.rowCard}>
                <div className={styles.imageWrapper}>
                  {post.featuredImage && (
                    <Image
                      src={urlFor(post.featuredImage).width(500).height(350).url()}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 35vw"
                      className={styles.image}
                    />
                  )}
                </div>
                <div className={styles.cardContent}>
                  <h2 className={styles.cardTitle}>{post.title}</h2>
                  <p className={styles.cardExcerpt}>{post.excerpt}</p>
                  <span className={styles.readMoreBtn}>ΜΑΘΕ ΠΕΡΙΣΣΟΤΕΡΑ →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}