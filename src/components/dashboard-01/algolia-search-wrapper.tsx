import { AlgoliaSearch } from './algolia-search';

export async function AlgoliaSearchWrapper() {
  try {
    const applicationId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID;
    const apiKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY;

    if (!applicationId || !apiKey) {
      console.warn('Algolia credentials not configured. Search will be disabled.');
      return null;
    }

    return (
      <AlgoliaSearch
        applicationId={applicationId}
        apiKey={apiKey}
      />
    );
  } catch (error) {
    console.error('Error initializing Algolia search:', error);
    return null;
  }
}
