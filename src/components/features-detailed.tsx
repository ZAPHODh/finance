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
  Calendar,
  Bell,
  Download,
  Cloud,
  Zap,
  Shield,
  Clock,
  Activity,
} from 'lucide-react'

export function FeaturesDetailed() {
  const features = [
    {
      icon: Wallet,
      title: "Complete Expense Tracking",
      description: "Track all vehicle expenses including fuel, maintenance, tolls, insurance, and more with detailed categorization.",
      benefits: [
        "Custom expense categories",
        "Receipt attachment support",
        "Automatic calculations",
        "Expense trends analysis"
      ],
      badge: "Core Feature"
    },
    {
      icon: TrendingUp,
      title: "Revenue Analytics",
      description: "Monitor earnings across multiple platforms (Uber, 99, Cabify) with real-time insights into profitability.",
      benefits: [
        "Multi-platform tracking",
        "Daily/weekly/monthly summaries",
        "Profit margin calculations",
        "Revenue forecasting"
      ],
      badge: "Core Feature"
    },
    {
      icon: BarChart3,
      title: "Advanced Dashboard",
      description: "Get a comprehensive view of your financial performance with interactive charts and key metrics.",
      benefits: [
        "Customizable KPI widgets",
        "Interactive charts",
        "Performance comparisons",
        "Real-time data sync"
      ]
    },
    {
      icon: FileText,
      title: "Smart Reporting",
      description: "Generate detailed reports on driver performance, vehicle efficiency, and financial summaries.",
      benefits: [
        "PDF and Excel exports",
        "Automated report scheduling",
        "Custom report builder",
        "Tax-ready summaries"
      ]
    },
    {
      icon: Car,
      title: "Vehicle Management",
      description: "Manage multiple vehicles with individual tracking for expenses, revenues, and performance metrics.",
      benefits: [
        "Unlimited vehicles (PRO)",
        "Maintenance scheduling",
        "Fuel efficiency tracking",
        "Vehicle ROI analysis"
      ]
    },
    {
      icon: Users,
      title: "Driver Management",
      description: "Track performance across multiple drivers with individual dashboards and comparison tools.",
      benefits: [
        "Driver performance metrics",
        "Individual profit tracking",
        "Commission calculations",
        "Driver leaderboards"
      ]
    },
    {
      icon: Building2,
      title: "Multi-Company Support",
      description: "Track earnings from multiple ride-sharing platforms and delivery services in one place.",
      benefits: [
        "Uber, 99, Cabify integration",
        "Platform comparison",
        "Consolidated reporting",
        "Revenue breakdown by company"
      ]
    },
    {
      icon: Target,
      title: "Goals & Budgets",
      description: "Set financial goals and budgets to track progress and stay on target with your earnings.",
      benefits: [
        "Daily/weekly/monthly goals",
        "Budget alerts",
        "Progress tracking",
        "Achievement notifications"
      ]
    },
    {
      icon: Calendar,
      title: "Work Logs",
      description: "Record work hours, kilometers driven, and trips completed for accurate tracking.",
      benefits: [
        "Shift tracking",
        "KM/miles logging",
        "Trip counters",
        "Hourly rate calculations"
      ]
    },
    {
      icon: Bell,
      title: "Smart Reminders",
      description: "Never miss important deadlines with automated reminders for payments, maintenance, and renewals.",
      benefits: [
        "Payment reminders",
        "Maintenance alerts",
        "Insurance renewal notices",
        "Custom reminder setup"
      ]
    },
    {
      icon: Download,
      title: "Data Export",
      description: "Export your data in multiple formats for accounting, tax filing, or personal analysis.",
      benefits: [
        "PDF reports",
        "Excel spreadsheets",
        "CSV data export",
        "Accounting software integration"
      ]
    },
    {
      icon: Cloud,
      title: "Cloud Storage",
      description: "Store receipts, invoices, and documents securely in the cloud with OCR scanning.",
      benefits: [
        "Up to 5GB storage (PRO)",
        "OCR text recognition",
        "Automatic backup",
        "Secure encryption"
      ]
    },
    {
      icon: Zap,
      title: "AI-Powered Insights",
      description: "Get intelligent recommendations to optimize costs and increase profitability.",
      benefits: [
        "Cost optimization tips",
        "Anomaly detection",
        "Predictive analytics",
        "Smart suggestions"
      ],
      badge: "PRO Only"
    },
    {
      icon: Shield,
      title: "Team Access & Permissions",
      description: "Collaborate with your team with role-based access control and permissions.",
      benefits: [
        "Multi-user accounts",
        "Role management",
        "Access controls",
        "Activity logs"
      ],
      badge: "PRO Only"
    },
    {
      icon: Clock,
      title: "Real-Time Sync",
      description: "Access your data from any device with automatic synchronization across all platforms.",
      benefits: [
        "Cross-device sync",
        "Mobile & web apps",
        "Offline mode",
        "Instant updates"
      ]
    },
    {
      icon: Activity,
      title: "API Access",
      description: "Integrate with third-party tools and build custom workflows with our developer API.",
      benefits: [
        "RESTful API",
        "Webhooks support",
        "Custom integrations",
        "Developer documentation"
      ],
      badge: "PRO Only"
    },
  ]

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <Badge variant="secondary" className="mb-2">Full Feature Set</Badge>
        <h1 className="text-4xl md:text-5xl font-bold">Everything You Need to Manage Your Fleet</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Comprehensive tools designed specifically for ride-sharing drivers and fleet managers
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, idx) => (
          <Card key={idx} className="relative overflow-hidden hover:shadow-lg transition-shadow">
            {feature.badge && (
              <div className="absolute top-4 right-4">
                <Badge variant="outline" className="text-xs">{feature.badge}</Badge>
              </div>
            )}
            <CardHeader>
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="mt-2">{feature.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {feature.benefits.map((benefit, benefitIdx) => (
                  <li key={benefitIdx} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Categories Summary */}
      <div className="grid gap-6 md:grid-cols-3 pt-12">
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>For Solo Drivers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Track your personal expenses, revenues, and performance to maximize your earnings
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>For Small Fleets</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Manage multiple drivers and vehicles with consolidated reporting and analytics
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>For Fleet Managers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Enterprise-grade tools with team access, API integration, and advanced analytics
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
