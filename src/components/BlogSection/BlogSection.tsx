'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { client } from '@/sanity/lib/client';
import { createImageUrlBuilder } from '@sanity/image-url';
import styles from './BlogSection.module.css';

const builder = createImageUrlBuilder({
  projectId: client.config().projectId || '',
  dataset: client.config().dataset || ''
});
function urlFor(source: any) {
  return builder.image(source);
}

export default function BlogSection() {
  const [latestPosts, setLatestPosts] = useState<any[]>([]);

  useEffect(() => {
    // Φέρνουμε μόνο τα 3 τελευταία άρθρα
    const query = `*[_type == "blog"] | order(_createdAt desc)[0..2] {
      title,
      slug,
      featuredImage,
      excerpt,
      _createdAt
    }`;
    client.fetch(query).then(setLatestPosts);
  }, []);

  if (latestPosts.length === 0) return null;

  return (
    <section className={styles.blogSection}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <span className={styles.subtitle}>SPOTX STORIES</span>
          <h2 className={styles.title}>LATEST NEWS</h2>
        </div>

        <div className={styles.grid}>
          {latestPosts.map((post, i) => (
            <Link href={`/blog/${post.slug.current}`} key={i} className={styles.card}>
              <div className={styles.imageWrapper}>
                {post.featuredImage && (
                  <Image 
                    src={urlFor(post.featuredImage).width(600).height(400).url()}
                    alt={post.title}
                    fill
                    className={styles.image}
                  />
                )}
              </div>
              <div className={styles.cardContent}>
                <span className={styles.date}>
                  {new Date(post._createdAt).toLocaleDateString('el-GR', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
                <h3 className={styles.cardTitle}>{post.title}</h3>
                <p className={styles.cardExcerpt}>{post.excerpt}</p>
                <span className={styles.readMore}>READ MORE →</span>
              </div>
            </Link>
          ))}
        </div>

        <div className={styles.viewAllWrapper}>
          <Link href="/blog" className={styles.viewAllBtn}>
            VIEW ALL ARTICLES
          </Link>
        </div>
      </div>
    </section>
  );
}