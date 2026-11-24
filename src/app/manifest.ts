// /manifest.webmanifest: the site's name, colours and icons when it is added to a home screen
import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'QAC FLOW',
    short_name: 'QAC FLOW',
    description: '종이 검사표 없는 품질검사 — Paperless quality inspection from a phone',
    start_url: '/',
    display: 'browser',
    background_color: '#2A2D33',
    theme_color: '#2A2D33',
    icons: [
      { src: '/assets/img/favicon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/assets/img/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ]
  };
}
