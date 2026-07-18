import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { client } from '@/sanity/lib/client';
import { createImageUrlBuilder } from '@sanity/image-url';
import { PortableText } from '@portabletext/react';
import Header from '@/components/Header/Header';
import styles from './ArticlePage.module.css';

const builder = createImageUrlBuilder({
  projectId: client.config().projectId || '',
  dataset: client.config().dataset || ''
});
function urlFor(source: any) {
  return builder.image(source);
}

interface Props {
  params: Promise<{ slug: string }>;
}

async function getArticle(slug: string) {
  const query = `*[_type == "blog" && slug.current == $slug][0] {
    title,
    featuredImage,
    excerpt,
    content,
    _createdAt,
    _updatedAt
  }`;
  return client.fetch(query, { slug });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) return {};

  const imageUrl = article.featuredImage
    ? urlFor(article.featuredImage).width(1200).height(630).url()
    : undefined;

  return {
    title: `${article.title} | SPOTX Blog`,
    description: article.excerpt || `Διάβασε το άρθρο "${article.title}" στο SpotX.`,
    openGraph: {
      title: article.title,
      description: article.excerpt || undefined,
      type: 'article',
      publishedTime: article._createdAt,
      modifiedTime: article._updatedAt,
      images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630, alt: article.title }] : undefined,
    },
  };
}

export const revalidate = 60;

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

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white">
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