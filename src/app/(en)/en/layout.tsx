// The root layout of the English pages (/en, /en/data, /en/privacy): <html lang="en">
import type { ReactNode } from 'react';
import { RootLayout, siteMetadata, siteViewport } from '../../../site/RootLayout';

export const metadata = siteMetadata;
export const viewport = siteViewport;

export default function EnLayout({ children }: { children: ReactNode }) {
  return <RootLayout lang="en">{children}</RootLayout>;
}
