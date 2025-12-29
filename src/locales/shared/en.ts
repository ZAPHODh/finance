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
        chart: {
            title: 'Revenue vs Expenses',
            descriptionLong: 'Comparison of the last',
            descriptionShort: 'Last',
            threeMonths: '3 months',
            thirtyDays: '30 days',
            sevenDays: '7 days',
            lastThreeMonths: 'Last 3 months',
            lastThirtyDays: 'Last 30 days',
            lastSevenDays: 'Last 7 days',
            selectPeriod: 'Select a period',
            revenue: 'Revenue',
            expenses: 'Expenses',
            values: 'Values',
        },
    },
    cookieConsent: {
        title: 'We value your privacy',
        description: 'We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.',
        learnMore: 'Learn more',
        required: 'Required',
        weUse: 'We use cookies',
        essential: {
            title: 'Essential Cookies',
            description: 'These cookies are necessary for the website to function and cannot be switched off.',
            required: 'Always Active',
        },
        performance: {
            title: 'Performance Cookies',
            description: 'These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.',
        },
        functional: {
            title: 'Functional Cookies',
            description: 'These cookies enable enhanced functionality and personalization, such as language preferences and saved settings.',
        },
        marketing: {
            title: 'Marketing Cookies',
            description: 'These cookies are used to track visitors across websites to display relevant advertisements.',
        },
        acceptAll: 'Accept All',
        rejectAll: 'Reject All',
        customize: 'Customize',
        savePreferences: 'Save Preferences',
        back: 'Back',
        cancel: 'Cancel',
        settings: {
            title: 'Cookie Settings',
            description: 'Manage your cookie preferences',
        },
        compliance: {
            gdpr: 'GDPR Compliant',
            ccpa: 'CCPA Compliant',
            lgpd: 'LGPD Compliant',
        },
        privacyPolicy: 'Privacy Policy',
        cookiePolicy: 'Cookie Policy',
        toast: {
            success: 'Cookie preferences saved successfully',
            failed: 'Failed to save cookie preferences',
        },
    },
    validation: {
        onboarding: {
            platforms: {
                required: 'You need to save at least one platform',
            },
            drivers: {
                nameRequired: 'Driver name is required',
                required: 'You need to save at least one driver',
            },
            vehicles: {
                nameRequired: 'Vehicle name is required',
                required: 'You need to save at least one vehicle',
            },
        },
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