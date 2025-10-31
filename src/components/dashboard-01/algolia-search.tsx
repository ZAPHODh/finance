'use client';

import Search from '@/components/search';

interface AlgoliaSearchProps {
  userId: string;
  applicationId?: string;
  apiKey?: string;
}

export function AlgoliaSearch({ userId, applicationId, apiKey }: AlgoliaSearchProps) {
  const appId = applicationId || process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || '';
  const searchKey = apiKey || process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY || '';
  const indexName = `financial_${userId}`;

  if (!appId || !searchKey) {
    return null;
  }

  return (
    <Search
      applicationId={appId}
      apiKey={searchKey}
      indexName={indexName}
      placeholder="O que você está procurando?"
      hitsPerPage={10}
      keyboardShortcut="cmd+k"
      attributes={{
        primaryText: 'title',
        secondaryText: 'description',
        tertiaryText: 'category',
        url: 'url',
      }}
    />
  );
}
