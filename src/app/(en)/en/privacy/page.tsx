import { SitePage } from '../../../../site/routes';
import { pageMetadata } from '../../../../site/seo';

export const metadata = pageMetadata('/privacy', 'en');

export default function Page() {
  return <SitePage page="/privacy" lang="en" />;
}
