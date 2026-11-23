import { SitePage } from '../../../../site/routes';
import { pageMetadata } from '../../../../site/seo';

export const metadata = pageMetadata('/data', 'en');

export default function Page() {
  return <SitePage page="/data" lang="en" />;
}
