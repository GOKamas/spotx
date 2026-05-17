'use client';
import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { client } from '@/sanity/lib/client';
import { createImageUrlBuilder } from '@sanity/image-url';
import { PortableText } from '@portabletext/react';
import Header from '@/components/Header/Header'; // Import του Header
import styles from './ArticlePage.module.css';

const builder = createImageUrlBuilder({
  projectId: client.config().projectId || '',
  dataset: client.config().dataset || ''
});
function urlFor(source: any) {
  return builder.image(source);
}

const components = {
  types: {
    image: ({ value }: any) => (
      <div className={styles.inlineImageWrapper}>
        <Image src={urlFor(value).width(800).url()} alt={value.alt || 'Article Image'} width={800} height={500} className={styles.inlineImage} />
      </div>
    ),
    embedUrl: ({ value }: any) => {
      const { url, platform } = value;
      if (!url) return null;
      if (platform === 'youtube') {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        const videoId = (match && match[2].length === 11) ? match[2] : null;
        if (videoId) {
          return (
            <div className={styles.embedContainer}>
              <iframe src={`https://www.youtube.com/embed/${videoId}`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen title="YouTube Embed" />
            </div>
          );
        }
      }
      return <a href={url} target="_blank" rel="noopener noreferrer" className={styles.fallbackLink}>Δες το post εδώ →</a>;
    }
  }
};

export default function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const query = `*[_type == "blog" && slug.current == $slug][0] {
      title,
      featuredImage,
      content,
      _createdAt
    }`;
    
    client.fetch(query, { slug: resolvedParams.slug }).then((data) => {
      setArticle(data);
      setLoading(false);
    });
  }, [resolvedParams.slug]);

  if (loading) return <div className={styles.loading}>Loading Article...</div>;
  if (!article) return <div className={styles.notFound}>Article Not Found!</div>;

  return (
    <main className="min-h-screen bg-white">
      {/* Το Header μέσα στη σελίδα του άρθρου */}
      <Header />

      <article className={styles.articleWrapper}>
        <div className={styles.container}>
          <Link href="/blog" className={styles.backToBlog}>← RETURN TO BLOGX</Link>
          
          <header className={styles.header}>
           
                       <h1 className={styles.title}>{article.title}</h1>
          </header>

          {article.featuredImage && (
            <div className={styles.featuredImageWrapper}>
              <Image src={urlFor(article.featuredImage).width(1200).height(600).url()} alt={article.title} width={1200} height={600} className={styles.featuredImage} priority />
            </div>
          )}

          <div className={styles.bodyContent}>
            <PortableText value={article.content} components={components} />
          </div>
        </div>
      </article>
    </main>
  );
}