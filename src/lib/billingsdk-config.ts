export interface Plan {
    id: string
    title: string
    description: string
    highlight?: boolean
    type?: 'monthly' | 'yearly'
    currency?: string
    monthlyPrice: string
    yearlyPrice: string
    buttonText: string
    badge?: string
    features: {
        name: string
        icon: string
        iconColor?: string
    }[]
}

export interface CurrentPlan {
    plan: Plan
    type: 'monthly' | 'yearly' | 'custom'
    price?: string
    nextBillingDate: string
    paymentMethod: string
    status: 'active' | 'inactive' | 'past_due' | 'cancelled'
}

export const plans: Plan[] = [
    {
        id: 'free',
        title: 'Free',
        description: 'Basic features for personal use',
        currency: 'R$',
        monthlyPrice: '0',
        yearlyPrice: '0',
        buttonText: 'Start Free',
        features: [
            { name: '1 driver', icon: "check" },
            { name: '1 vehicle', icon: "check" },
            { name: '2 companies (Uber, 99)', icon: "check" },
            { name: '100 entries/month', icon: "check" },
            { name: '3 months history', icon: "check" },
            { name: 'Basic dashboard', icon: "check" },
            { name: 'Email support (48h)', icon: "check" },
        ],
    },
    {
        id: 'simple',
        title: 'Simple',
        description: 'Essential features for getting started',
        currency: 'R$',
        monthlyPrice: '29',
        yearlyPrice: '290',
        buttonText: 'Upgrade to Simple',
        badge: 'Popular',
        highlight: true,
        features: [
            { name: '3 drivers', icon: "check" },
            { name: '3 vehicles', icon: "check" },
            { name: 'Unlimited companies', icon: "check" },
            { name: 'Unlimited entries', icon: "check" },
            { name: 'Unlimited history', icon: "check" },
            { name: 'Advanced analytics', icon: "check" },
            { name: '10 exports/month (PDF/Excel)', icon: "check" },
            { name: '500MB storage', icon: "check" },
            { name: 'Priority support (24h)', icon: "check" },
        ],
    },
    {
        id: 'pro',
        title: 'PRO',
        description: 'Advanced features for professionals',
        currency: 'R$',
        monthlyPrice: '79',
        yearlyPrice: '790',
        buttonText: 'Upgrade to PRO',
        badge: 'Best Value',
        features: [
            { name: 'Unlimited drivers', icon: "check" },
            { name: 'Unlimited vehicles', icon: "check" },
            { name: 'Unlimited entries', icon: "check" },
            { name: 'All analytics & insights', icon: "check" },
            { name: 'AI-powered insights', icon: "check" },
            { name: 'Unlimited exports', icon: "check" },
            { name: '5GB storage + OCR', icon: "check" },
            { name: 'Multi-user access', icon: "check" },
            { name: 'API access', icon: "check" },
            { name: 'Live chat + WhatsApp', icon: "check" },
        ],
    }
];
