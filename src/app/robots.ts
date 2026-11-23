// /robots.txt: crawl everything but the form's mail endpoint, and where the sitemap is
import type { MetadataRoute } from 'next';
import { ORIGIN } from '../lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: '/api/' }],
    sitemap: `${ORIGIN}/sitemap.xml`,
    host: ORIGIN
  };
}
