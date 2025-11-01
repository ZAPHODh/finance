'use client';

import Search from '@/components/search';
import { useCurrentLocale } from '@/locales/client';

interface AlgoliaSearchProps {
  applicationId?: string;
  apiKey?: string;
}

export function AlgoliaSearch({ applicationId, apiKey }: AlgoliaSearchProps) {
  const locale = useCurrentLocale();
  const appId = applicationId || process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || '';
  const searchKey = apiKey || process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY || '';
  const indexName = 'financial_routes';

  if (!appId || !searchKey) {
    return null;
  }

  const titleAttr = locale === 'pt' ? 'title_pt' : 'title_en';
  const descriptionAttr = locale === 'pt' ? 'description_pt' : 'description_en';
  const categoryAttr = locale === 'pt' ? 'category_pt' : 'category_en';

  return (
    <Search
      applicationId={appId}
      apiKey={searchKey}
      indexName={indexName}
      placeholder={locale === 'pt' ? 'O que você está procurando?' : 'What are you looking for?'}
      hitsPerPage={10}
      keyboardShortcut="cmd+k"
      attributes={{
        primaryText: titleAttr,
        secondaryText: descriptionAttr,
        tertiaryText: categoryAttr,
        url: 'url',
      }}
    />
  );
}
