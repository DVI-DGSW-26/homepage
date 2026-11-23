import { SitePage } from '../../../site/routes';
import { pageMetadata } from '../../../site/seo';

export const metadata = pageMetadata('/privacy', 'ko');

export default function Page() {
  return <SitePage page="/privacy" lang="ko" />;
}
