import { MetadataRoute } from 'next';
import { client } from '@/sanity/lib/client';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Quiz slugs
  const quizzes = await client.fetch(
    `*[_type == "quiz" && defined(slug.current)]{ "slug": slug.current, _updatedAt }`
  );

  const quizUrls: MetadataRoute.Sitemap = quizzes.map((q: any) => ({
    url: `https://spotx.me/quizzes/${q.slug}`,
    lastModified: new Date(q._updatedAt),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  // Blog post slugs
  const posts = await client.fetch(
    `*[_type == "blog" && defined(slug.current)]{ "slug": slug.current, _updatedAt }`
  );

  const blogUrls: MetadataRoute.Sitemap = posts.map((p: any) => ({
    url: `https://spotx.me/blog/${p.slug}`,
    lastModified: new Date(p._updatedAt),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  // Στατικές σελίδες
  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: 'https://spotx.me',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: 'https://spotx.me/quizzes',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: 'https://spotx.me/blog',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  return [...staticUrls, ...quizUrls, ...blogUrls];
}