import { SitePage } from '../../site/routes';
import { pageMetadata } from '../../site/seo';

export const metadata = pageMetadata('/qac-flow', 'ko');

export default function Page() {
  return <SitePage page="/qac-flow" lang="ko" />;
}
