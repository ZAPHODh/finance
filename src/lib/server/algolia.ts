'use server';

import { algoliasearch } from 'algoliasearch';
import { getCurrentSession } from '@/lib/server/auth/session';
import type { SearchRecord } from '@/lib/server/algolia-helpers';

const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.ALGOLIA_WRITE_KEY!
);

// Check if auto-indexing is enabled (defaults to true if not set)
const isAutoIndexingEnabled = () => {
  const enabled = process.env.ENABLE_AUTO_INDEXING;
  return enabled === undefined || enabled === 'true';
};

/**
 * Add a single record to the user's search index
 */
export async function addRecordToIndex(record: SearchRecord): Promise<void> {
  if (!isAutoIndexingEnabled()) return;

  try {
    const { user } = await getCurrentSession();
    if (!user) return;

    const indexName = `financial_${user.id}`;

    await client.saveObjects({
      indexName,
      objects: [record as unknown as Record<string, unknown>],
    });
  } catch (error) {
    // Fail silently - don't block the main operation
    console.error('Error adding record to search index:', error);
  }
}

/**
 * Update a single record in the user's search index
 */
export async function updateRecordInIndex(record: SearchRecord): Promise<void> {
  if (!isAutoIndexingEnabled()) return;

  try {
    const { user } = await getCurrentSession();
    if (!user) return;

    const indexName = `financial_${user.id}`;

    await client.partialUpdateObjects({
      indexName,
      objects: [record as unknown as Record<string, unknown>],
      createIfNotExists: true,
    });
  } catch (error) {
    console.error('Error updating record in search index:', error);
  }
}

/**
 * Remove a single record from the user's search index
 */
export async function removeRecordFromIndex(objectID: string): Promise<void> {
  if (!isAutoIndexingEnabled()) return;

  try {
    const { user } = await getCurrentSession();
    if (!user) return;

    const indexName = `financial_${user.id}`;

    await client.deleteObject({
      indexName,
      objectID,
    });
  } catch (error) {
    console.error('Error removing record from search index:', error);
  }
}
