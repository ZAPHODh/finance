export default {
    goBack: 'Go Back',
    locales: {
        portuguese: 'Portuguese',
        english: 'English',
    },
    changeLocale: 'Change Locale',
    logout: 'Log out',
    toggleTheme: 'Toggle Theme',
    light: 'Light',
    dark: 'Dark',
    notFound: {
        title: 'Page Not Found',
        description: 'The page you are looking for does not exist or has been moved.',
        backHome: 'Back to Home',
        backDashboard: 'Go to Dashboard',
    },
    dashboard: {
        kpis: {
            revenue: {
                title: 'Total Revenue',
                trendingUp: 'Growing this period',
                trendingDown: 'Declining this period',
                description: 'Total revenue for the period',
            },
            expenses: {
                title: 'Total Expenses',
                trendingUp: 'Increase in expenses',
                trendingDown: 'Reduction in expenses',
                description: 'Total expenses for the period',
            },
            profit: {
                title: 'Net Profit',
                trendingUp: 'Positive performance',
                trendingDown: 'Negative performance',
                description: 'Revenue minus expenses',
            },
            kilometers: {
                title: 'Total Kilometers',
                footer: 'Distance traveled',
                description: 'Total km driven',
            },
            hours: {
                title: 'Hours Worked',
                footer: 'Work time',
                description: 'Total hours in the period',
            },
        },
    },
} as const