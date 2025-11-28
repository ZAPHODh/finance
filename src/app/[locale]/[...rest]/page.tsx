import { FileQuestionIcon, HomeIcon, LayoutDashboardIcon } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { getI18n } from '@/locales/server';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getI18n();

  return {
    title: `404 - ${t('shared.notFound.title')}`,
  };
}

export default async function NotFoundPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getI18n();

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <Empty className="from-muted/50 to-background bg-gradient-to-b from-30%">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FileQuestionIcon />
          </EmptyMedia>
          <EmptyTitle>{t('shared.notFound.title')}</EmptyTitle>
          <EmptyDescription>
            {t('shared.notFound.description')}
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex gap-2">
            <Button asChild>
              <Link href={`/${locale}`}>
                <HomeIcon />
                {t('shared.notFound.backHome')}
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/${locale}/dashboard`}>
                <LayoutDashboardIcon />
                {t('shared.notFound.backDashboard')}
              </Link>
            </Button>
          </div>
        </EmptyContent>
      </Empty>
    </div>
  );
}
