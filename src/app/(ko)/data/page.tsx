import { SitePage } from '../../../site/routes';
import { pageMetadata } from '../../../site/seo';

export const metadata = pageMetadata('/data', 'ko');

export default function Page() {
  return <SitePage page="/data" lang="ko" />;
}
