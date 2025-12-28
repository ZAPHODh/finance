'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Wallet,
  TrendingUp,
  BarChart3,
  FileText,
  Users,
  Car,
  Building2,
  Target,
  Bell,
  Download,
  Cloud,
  Shield,
  Clock,
  Activity,
} from 'lucide-react'
import { useScopedI18n } from '@/locales/client'

export function FeaturesDetailed() {
  const t = useScopedI18n('marketing.featuresDetailed')

  const features = [
    {
      icon: Wallet,
      key: 'expense',
    },
    {
      icon: TrendingUp,
      key: 'revenue',
    },
    {
      icon: BarChart3,
      key: 'dashboard',
    },
    {
      icon: FileText,
      key: 'reporting',
    },
    {
      icon: Car,
      key: 'vehicle',
    },
    {
      icon: Users,
      key: 'driver',
    },
    {
      icon: Building2,
      key: 'multiCompany',
    },
    {
      icon: Target,
      key: 'goals',
    },
    {
      icon: Bell,
      key: 'reminders',
    },
    {
      icon: Download,
      key: 'export',
    },
    {
      icon: Cloud,
      key: 'storage',
    },
    {
      icon: Shield,
      key: 'team',
    },
    {
      icon: Clock,
      key: 'sync',
    },
    {
      icon: Activity,
      key: 'api',
    },
  ]

  return (
    <div className="space-y-16">
      <div className="text-center space-y-4">
        <Badge variant="secondary" className="mb-2">{t('badge')}</Badge>
        <h1 className="text-4xl md:text-5xl font-bold">{t('title')}</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          {t('subtitle')}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, idx) => {
          const featureKey = `features.${feature.key}` as const

          return (
            <Card key={idx} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    <CardTitle className="text-xl">{t(`${featureKey}.title` as any)}</CardTitle>
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    <CardDescription className="mt-2">{t(`${featureKey}.description` as any)}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {[1, 2, 3, 4].map((benefitIdx) => (
                    <li key={benefitIdx} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      <span>{t(`${featureKey}.benefit${benefitIdx}` as any)}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-3 pt-12">
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>{t('categories.solo.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {t('categories.solo.description')}
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>{t('categories.small.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {t('categories.small.description')}
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>{t('categories.fleet.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {t('categories.fleet.description')}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
