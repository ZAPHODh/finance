import { getCurrentSession } from '@/lib/server/auth/session';
import { AlgoliaSearch } from './algolia-search';

export async function AlgoliaSearchWrapper() {
  const { user } = await getCurrentSession();

  if (!user) return null;

  const applicationId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || '';
  const apiKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY || '';

  if (!applicationId || !apiKey) return null;

  return (
    <AlgoliaSearch
      userId={user.id}
      applicationId={applicationId}
      apiKey={apiKey}
    />
  );
}
