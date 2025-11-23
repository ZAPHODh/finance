# Dive into Drive

A comprehensive financial management platform for transportation and fleet operations. Track expenses, revenues, and performance metrics for drivers and vehicles in one powerful SaaS application.

## Features

- **Financial Tracking**: Complete expense and revenue management with detailed categorization
- **Multi-Driver Support**: Manage unlimited drivers and vehicles with the Pro plan
- **Analytics Dashboard**: Real-time KPIs, performance metrics, and financial insights
- **Smart Reports**: Generate detailed reports in PDF, Excel, and CSV formats
- **Platform Integration**: Track earnings across multiple ride-sharing and delivery platforms
- **Budget Management**: Set spending limits and receive alerts when approaching thresholds
- **Goal Tracking**: Define financial targets and monitor progress
- **Algolia Search**: Real-time search across all financial records with user data isolation
- **Internationalization**: Full support for English and Portuguese (pt-BR)
- **Dark Mode**: Complete dark mode support with system preference detection

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Lucia Auth (OAuth + Magic Link)
- **Payments**: Stripe
- **Search**: Algolia
- **Monitoring**: Sentry + Posthog
- **Styling**: Tailwind CSS + Shadcn UI
- **Forms**: TanStack Form
- **i18n**: next-international

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- PostgreSQL database
- Required API keys (see `.env.example`)

### Installation

1. Clone the repository
```bash
git clone https://github.com/ZAPHODh/financial.git
cd financial
```

2. Install dependencies
```bash
pnpm install
```

3. Set up environment variables
```bash
cp .env.example .env
```

Fill in all required environment variables in `.env` file. See [Environment Variables](#environment-variables) section below.

4. Set up the database
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Environment Variables

The application requires several environment variables to function properly. See `.env.example` for a complete list with descriptions.

### Required Variables

- **Database**: PostgreSQL connection URLs
- **Authentication**: Google/GitHub OAuth credentials, Resend API key
- **Payments**: Stripe API keys and plan IDs
- **Search**: Algolia credentials

### Optional Variables

- **Monitoring**: Sentry DSN, Posthog key
- **Support**: Crisp chat widget ID
- **Feature Flags**: Enable/disable specific features

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── [locale]/          # Internationalized routes
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # Shadcn UI components
│   ├── dashboard-01/     # Dashboard components
│   └── legal/            # Legal components (cookies, etc)
├── lib/                   # Utilities and configurations
│   ├── server/           # Server-only code
│   └── client/           # Client-only code
├── locales/              # i18n translations
└── config/               # Application configuration
```

## Development

### Database Schema Changes

When modifying the Prisma schema:

```bash
npx prisma db push          # Push changes to database
npx prisma generate         # Regenerate Prisma client
```

### Running Tests

```bash
pnpm test
```

See `docs/TESTING_CHECKLIST.md` for comprehensive manual testing guide.

### Code Quality

The project follows strict TypeScript and coding standards defined in `CLAUDE.md`:

- Functional programming patterns
- Server Components by default
- Client Components only when necessary
- All text must be internationalized
- No hard-coded strings in UI

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Manual Deployment

1. Build the application
```bash
pnpm build
```

2. Start production server
```bash
pnpm start
```

## Monitoring & Error Tracking

- **Sentry**: Error tracking and performance monitoring
- **Posthog**: Analytics and user behavior tracking
- **Health Check**: `/api/health` endpoint for uptime monitoring

## Legal & Compliance

- Terms of Service: `/terms`
- Privacy Policy: `/privacy` (LGPD compliant)
- Contact: `/contact`
- Cookie Consent: Automatic banner on first visit

## Support

For questions or issues:
- Email: notyet@diveintodrive.com
- Privacy/LGPD: notyet@diveintodrive.com

## License

Proprietary - All rights reserved

## Contributing

This is a private commercial project. Contributing is currently not open to the public.
