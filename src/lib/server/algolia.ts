'use server';

import { algoliasearch } from 'algoliasearch';
import { getCurrentSession } from '@/lib/server/auth/session';
import type { SearchRecord } from '@/lib/server/algolia-helpers';

const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.ALGOLIA_WRITE_KEY!
);

const isAutoIndexingEnabled = () => {
  const enabled = process.env.ENABLE_AUTO_INDEXING;
  return enabled === undefined || enabled === 'true';
};

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
    console.error('Error adding record to search index:', error);
  }
}

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
