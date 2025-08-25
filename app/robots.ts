import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `https://madhavxchaturvedi.vercel.app/sitemap.xml`,
    host: `https://madhavxchaturvedi.vercel.app/`,
  };
}
