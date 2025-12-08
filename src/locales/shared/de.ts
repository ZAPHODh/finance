export default {
    goBack: 'Zurück',
    locales: {
        portuguese: 'Portugiesisch',
        english: 'Englisch',
        german: 'Deutsch',
    },
    changeLocale: 'Sprache ändern',
    logout: 'Abmelden',
    toggleTheme: 'Design wechseln',
    light: 'Hell',
    dark: 'Dunkel',
    notFound: {
        title: 'Seite nicht gefunden',
        description: 'Die gesuchte Seite existiert nicht oder wurde verschoben.',
        backHome: 'Zurück zur Startseite',
        backDashboard: 'Zum Dashboard',
    },
    dashboard: {
        kpis: {
            revenue: {
                title: 'Gesamtumsatz',
                trendingUp: 'Steigend in dieser Periode',
                trendingDown: 'Fallend in dieser Periode',
                description: 'Gesamtumsatz für die Periode',
            },
            expenses: {
                title: 'Gesamtausgaben',
                trendingUp: 'Anstieg der Ausgaben',
                trendingDown: 'Rückgang der Ausgaben',
                description: 'Gesamtausgaben für die Periode',
            },
            profit: {
                title: 'Nettogewinn',
                trendingUp: 'Positive Entwicklung',
                trendingDown: 'Negative Entwicklung',
                description: 'Umsatz minus Ausgaben',
            },
            kilometers: {
                title: 'Gesamtkilometer',
                footer: 'Zurückgelegte Strecke',
                description: 'Insgesamt gefahrene Kilometer',
            },
            hours: {
                title: 'Arbeitsstunden',
                footer: 'Arbeitszeit',
                description: 'Gesamtstunden in der Periode',
            },
        },
    },
    cookieConsent: {
        title: 'Cookie-Einstellungen',
        description: 'Wir verwenden Cookies, um Ihre Erfahrung zu verbessern. Sie können auswählen, welche Cookie-Typen Sie akzeptieren möchten.',
        essential: 'Erforderlich',
        essentialDescription: 'Notwendig für die Funktion der Website',
        analytics: 'Analyse',
        analyticsDescription: 'Helfen Sie uns zu verstehen, wie Sie unsere Website nutzen',
        marketing: 'Marketing',
        marketingDescription: 'Werden verwendet, um Ihnen relevante Werbung und Angebote zu zeigen',
        acceptAll: 'Alle akzeptieren',
        acceptSelected: 'Ausgewählte akzeptieren',
        rejectAll: 'Nur erforderliche',
        privacyPolicy: 'Datenschutzerklärung',
        cookiePolicy: 'Cookie-Richtlinie',
    },
    validation: {
        brazilian: {
            plate: {
                invalid: 'Ungültiges Kennzeichenformat. Verwenden Sie ABC-1234 oder ABC1D23',
                required: 'Kennzeichen ist erforderlich',
            },
            cpf: {
                invalid: 'Ungültige CPF',
                required: 'CPF ist erforderlich',
            },
            cnpj: {
                invalid: 'Ungültige CNPJ',
                required: 'CNPJ ist erforderlich',
            },
            cpfOrCnpj: {
                invalid: 'Ungültige CPF oder CNPJ',
                required: 'CPF oder CNPJ ist erforderlich',
            },
            cep: {
                invalid: 'Ungültige Postleitzahl (CEP)',
                required: 'Postleitzahl ist erforderlich',
            },
            phone: {
                invalid: 'Ungültige Telefonnummer. Verwenden Sie (00) 00000-0000',
                required: 'Telefonnummer ist erforderlich',
            },
            cnh: {
                invalid: 'Ungültiger Führerschein (CNH). Muss 11 Ziffern haben',
                required: 'Führerschein ist erforderlich',
            },
        },
        common: {
            name: {
                tooShort: 'Name muss mindestens 2 Zeichen lang sein',
                tooLong: 'Name darf maximal 100 Zeichen lang sein',
                invalidCharacters: 'Name darf nur Buchstaben, Leerzeichen, Bindestriche und Apostrophe enthalten',
                required: 'Name ist erforderlich',
            },
            vehicleYear: {
                tooOld: 'Jahr muss mindestens 1900 sein',
                tooNew: 'Jahr darf nicht in der Zukunft liegen',
                required: 'Jahr ist erforderlich',
            },
            amount: {
                tooSmall: 'Betrag muss größer als Null sein',
                tooLarge: 'Betrag überschreitet den maximal zulässigen Wert',
                required: 'Betrag ist erforderlich',
            },
            date: {
                tooFarInFuture: 'Datum darf nicht mehr als 1 Jahr in der Zukunft liegen',
                required: 'Datum ist erforderlich',
            },
            kmDriven: {
                negative: 'Gefahrene Kilometer können nicht negativ sein',
                tooLarge: 'Gefahrene Kilometer dürfen 5000 pro Tag nicht überschreiten',
            },
            hoursWorked: {
                negative: 'Arbeitsstunden können nicht negativ sein',
                tooLarge: 'Arbeitsstunden dürfen 24 pro Tag nicht überschreiten',
            },
            percentage: {
                tooSmall: 'Prozentsatz muss mindestens 0 sein',
                tooLarge: 'Prozentsatz darf 100 nicht überschreiten',
            },
            period: {
                invalid: 'Periode muss im Format YYYY-MM sein',
                required: 'Periode ist erforderlich',
            },
        },
    },
} as const
