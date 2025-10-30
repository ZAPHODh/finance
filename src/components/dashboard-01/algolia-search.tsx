'use client';

import Search from '@/components/search';

interface AlgoliaSearchProps {
  userId: string;
}

export function AlgoliaSearch({ userId }: AlgoliaSearchProps) {
  const applicationId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || '';
  const apiKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY || '';
  const indexName = `financial_${userId}`;

  if (!applicationId || !apiKey) {
    return null;
  }

  return (
    <Search
      applicationId={applicationId}
      apiKey={apiKey}
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
