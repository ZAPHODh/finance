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
    cookieConsent: {
        title: 'Cookie Preferences',
        description: 'We use cookies to enhance your experience. You can choose which types of cookies to accept.',
        essential: 'Essential',
        essentialDescription: 'Required for the website to function properly',
        analytics: 'Analytics',
        analyticsDescription: 'Help us understand how you use our website',
        marketing: 'Marketing',
        marketingDescription: 'Used to show you relevant ads and offers',
        acceptAll: 'Accept All',
        acceptSelected: 'Accept Selected',
        rejectAll: 'Essential Only',
        privacyPolicy: 'Privacy Policy',
        cookiePolicy: 'Cookie Policy',
    },
    validation: {
        brazilian: {
            plate: {
                invalid: 'Invalid license plate format. Use ABC-1234 or ABC1D23',
                required: 'License plate is required',
            },
            cpf: {
                invalid: 'Invalid CPF',
                required: 'CPF is required',
            },
            cnpj: {
                invalid: 'Invalid CNPJ',
                required: 'CNPJ is required',
            },
            cpfOrCnpj: {
                invalid: 'Invalid CPF or CNPJ',
                required: 'CPF or CNPJ is required',
            },
            cep: {
                invalid: 'Invalid postal code (CEP)',
                required: 'Postal code is required',
            },
            phone: {
                invalid: 'Invalid phone number. Use (00) 00000-0000',
                required: 'Phone number is required',
            },
            cnh: {
                invalid: "Invalid driver's license (CNH). Must be 11 digits",
                required: "Driver's license is required",
            },
        },
        common: {
            name: {
                tooShort: 'Name must be at least 2 characters',
                tooLong: 'Name must be at most 100 characters',
                invalidCharacters: 'Name can only contain letters, spaces, hyphens, and apostrophes',
                required: 'Name is required',
            },
            vehicleYear: {
                tooOld: 'Year must be at least 1900',
                tooNew: 'Year cannot be in the future',
                required: 'Year is required',
            },
            amount: {
                tooSmall: 'Amount must be greater than zero',
                tooLarge: 'Amount exceeds the maximum allowed value',
                required: 'Amount is required',
            },
            date: {
                tooFarInFuture: 'Date cannot be more than 1 year in the future',
                required: 'Date is required',
            },
            kmDriven: {
                negative: 'Kilometers driven cannot be negative',
                tooLarge: 'Kilometers driven cannot exceed 5000 per day',
            },
            hoursWorked: {
                negative: 'Hours worked cannot be negative',
                tooLarge: 'Hours worked cannot exceed 24 per day',
            },
            percentage: {
                tooSmall: 'Percentage must be at least 0',
                tooLarge: 'Percentage cannot exceed 100',
            },
            period: {
                invalid: 'Period must be in YYYY-MM format',
                required: 'Period is required',
            },
        },
    },
} as const