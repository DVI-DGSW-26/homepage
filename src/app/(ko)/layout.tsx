// The root layout of the Korean pages (/, /data, /privacy): <html lang="ko">
import type { ReactNode } from 'react';
import { RootLayout, siteMetadata, siteViewport } from '../../site/RootLayout';

export const metadata = siteMetadata;
export const viewport = siteViewport;

export default function KoLayout({ children }: { children: ReactNode }) {
  return <RootLayout lang="ko">{children}</RootLayout>;
}
