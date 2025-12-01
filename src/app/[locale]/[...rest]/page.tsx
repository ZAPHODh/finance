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
import { getScopedI18n } from '@/locales/server';

export async function generateMetadata({
}): Promise<Metadata> {
  const t = await getScopedI18n('shared.notFound');

  return {
    title: `404 - ${t('title')}`,
  };
}

export default async function NotFoundPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getScopedI18n('shared.notFound');

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <Empty className="from-muted/50 to-background bg-gradient-to-b from-30%">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FileQuestionIcon />
          </EmptyMedia>
          <EmptyTitle>{t('title')}</EmptyTitle>
          <EmptyDescription>
            {t('description')}
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex gap-2">
            <Button asChild>
              <Link href={`/${locale}`}>
                <HomeIcon />
                {t('backHome')}
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/${locale}/dashboard`}>
                <LayoutDashboardIcon />
                {t('backDashboard')}
              </Link>
            </Button>
          </div>
        </EmptyContent>
      </Empty>
    </div>
  );
}
