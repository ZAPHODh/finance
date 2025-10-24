'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, X } from 'lucide-react'
import Link from 'next/link'
import { freePlanConfig, simplePlanConfig, proPlanConfig } from '@/config/subscription'
import { cn } from '@/lib/utils'

export function PricingDetailed() {
  const plans = [freePlanConfig, simplePlanConfig, proPlanConfig]

  const allFeatures = [
    {
      category: "Core Features", features: [
        { name: "Drivers", free: "1", simple: "3", pro: "Unlimited" },
        { name: "Vehicles", free: "1", simple: "3", pro: "Unlimited" },
        { name: "Companies (Uber, 99)", free: "2", simple: "Unlimited", pro: "Unlimited" },
        { name: "Entries per month", free: "100", simple: "Unlimited", pro: "Unlimited" },
        { name: "History", free: "3 months", simple: "Unlimited", pro: "Unlimited" },
      ]
    },
    {
      category: "Analytics & Reports", features: [
        { name: "Basic Dashboard", free: true, simple: true, pro: true },
        { name: "Advanced Analytics", free: false, simple: true, pro: true },
        { name: "Advanced Insights & Alerts", free: false, simple: true, pro: true },
        { name: "AI-powered Insights", free: false, simple: false, pro: true },
        { name: "All Reports", free: false, simple: true, pro: true },
        { name: "Report Scheduling", free: false, simple: false, pro: true },
      ]
    },
    {
      category: "Data Management", features: [
        { name: "Expense Types", free: "5", simple: "Unlimited", pro: "Unlimited" },
        { name: "Revenue Types", free: "2", simple: "Unlimited", pro: "Unlimited" },
        { name: "Payment Methods", free: "3", simple: "Unlimited", pro: "Unlimited" },
        { name: "Exports (PDF/Excel)", free: false, simple: "10/month", pro: "Unlimited" },
        { name: "Attachments Storage", free: false, simple: "500MB", pro: "5GB + OCR" },
      ]
    },
    {
      category: "Goals & Budgets", features: [
        { name: "Goals Tracking", free: "1", simple: "5", pro: "Unlimited" },
        { name: "Budgets", free: false, simple: "10/month", pro: "Unlimited" },
        { name: "Reminders", free: false, simple: true, pro: true },
      ]
    },
    {
      category: "Team & Support", features: [
        { name: "Multi-user Access", free: false, simple: false, pro: true },
        { name: "API Access", free: false, simple: false, pro: true },
        { name: "Support", free: "Email (48h)", simple: "Priority (24h)", pro: "Live Chat + WhatsApp" },
      ]
    },
  ]

  return (
    <div className="space-y-16">
      {/* Pricing Cards */}
      <div className="grid gap-8 lg:grid-cols-3">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={cn(
              "relative flex flex-col",
              plan.highlight && "border-primary shadow-lg scale-105"
            )}
          >
            {plan.badge && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <Badge className="px-3 py-1">{plan.badge}</Badge>
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-2xl">{plan.title}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-6">
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{plan.currency}{plan.monthlyPrice}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  or {plan.currency}{plan.yearlyPrice}/year (save {Math.round((1 - parseInt(plan.yearlyPrice) / (parseInt(plan.monthlyPrice) * 12)) * 100)}%)
                </div>
              </div>

              <ul className="space-y-3">
                {plan.features.slice(0, 6).map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm">{feature.name}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full" variant={plan.highlight ? "default" : "outline"}>
                <Link href="/login">{plan.buttonText}</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Comparison Table */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Detailed Comparison</h2>
          <p className="text-muted-foreground mt-2">See exactly what's included in each plan</p>
        </div>

        <div className="rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-4 font-semibold min-w-[200px]">Feature</th>
                  <th className="text-center p-4 font-semibold min-w-[150px]">Free</th>
                  <th className="text-center p-4 font-semibold min-w-[150px]">Simple</th>
                  <th className="text-center p-4 font-semibold min-w-[150px]">PRO</th>
                </tr>
              </thead>
              <tbody>
                {allFeatures.map((category, catIdx) => (
                  <>
                    <tr key={`cat-${catIdx}`} className="border-b bg-muted/30">
                      <td colSpan={4} className="p-4 font-semibold text-sm">
                        {category.category}
                      </td>
                    </tr>
                    {category.features.map((feature, featIdx) => (
                      <tr key={`feat-${catIdx}-${featIdx}`} className="border-b hover:bg-muted/50">
                        <td className="p-4 text-sm">{feature.name}</td>
                        <td className="p-4 text-center">
                          {typeof feature.free === 'boolean' ? (
                            feature.free ? (
                              <Check className="h-5 w-5 text-primary mx-auto" />
                            ) : (
                              <X className="h-5 w-5 text-muted-foreground mx-auto" />
                            )
                          ) : (
                            <span className="text-sm">{feature.free}</span>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          {typeof feature.simple === 'boolean' ? (
                            feature.simple ? (
                              <Check className="h-5 w-5 text-primary mx-auto" />
                            ) : (
                              <X className="h-5 w-5 text-muted-foreground mx-auto" />
                            )
                          ) : (
                            <span className="text-sm">{feature.simple}</span>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          {typeof feature.pro === 'boolean' ? (
                            feature.pro ? (
                              <Check className="h-5 w-5 text-primary mx-auto" />
                            ) : (
                              <X className="h-5 w-5 text-muted-foreground mx-auto" />
                            )
                          ) : (
                            <span className="text-sm">{feature.pro}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* FAQ or CTA */}
      <div className="text-center space-y-4 py-12">
        <h3 className="text-2xl font-bold">Still have questions?</h3>
        <p className="text-muted-foreground">Contact our team for personalized assistance</p>
        <Button asChild size="lg">
          <Link href="/login">Start Free Trial</Link>
        </Button>
      </div>
    </div>
  )
}
