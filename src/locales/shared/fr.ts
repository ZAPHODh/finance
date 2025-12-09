export default {
    goBack: 'Retour',
    locales: {
        portuguese: 'Portugais',
        english: 'Anglais',
        french: 'Français',
    },
    changeLocale: 'Changer de langue',
    logout: 'Se déconnecter',
    toggleTheme: 'Changer de thème',
    light: 'Clair',
    dark: 'Sombre',
    notFound: {
        title: 'Page non trouvée',
        description: 'La page que vous recherchez n\'existe pas ou a été déplacée.',
        backHome: 'Retour à l\'accueil',
        backDashboard: 'Aller au Dashboard',
    },
    dashboard: {
        kpis: {
            revenue: {
                title: 'Revenu total',
                trendingUp: 'En croissance cette période',
                trendingDown: 'En baisse cette période',
                description: 'Revenu total pour la période',
            },
            expenses: {
                title: 'Dépenses totales',
                trendingUp: 'Augmentation des dépenses',
                trendingDown: 'Réduction des dépenses',
                description: 'Dépenses totales pour la période',
            },
            profit: {
                title: 'Bénéfice net',
                trendingUp: 'Performance positive',
                trendingDown: 'Performance négative',
                description: 'Revenu moins les dépenses',
            },
            kilometers: {
                title: 'Total kilomètres',
                footer: 'Distance parcourue',
                description: 'Total km parcourus',
            },
            hours: {
                title: 'Heures travaillées',
                footer: 'Temps de travail',
                description: 'Heures totales de la période',
            },
        },
    },
    cookieConsent: {
        title: 'Préférences de cookies',
        description: 'Nous utilisons des cookies pour améliorer votre expérience. Vous pouvez choisir les types de cookies à accepter.',
        essential: 'Essentiels',
        essentialDescription: 'Nécessaires au bon fonctionnement du site',
        analytics: 'Analytiques',
        analyticsDescription: 'Nous aident à comprendre comment vous utilisez notre site',
        marketing: 'Marketing',
        marketingDescription: 'Utilisés pour vous montrer des publicités et offres pertinentes',
        acceptAll: 'Tout accepter',
        acceptSelected: 'Accepter la sélection',
        rejectAll: 'Essentiels uniquement',
        privacyPolicy: 'Politique de confidentialité',
        cookiePolicy: 'Politique de cookies',
    },
    validation: {
        onboarding: {
            platforms: {
                required: 'Vous devez enregistrer au moins une plateforme',
            },
            drivers: {
                nameRequired: 'Le nom du conducteur est requis',
                required: 'Vous devez enregistrer au moins un conducteur',
            },
            vehicles: {
                nameRequired: 'Le nom du véhicule est requis',
                required: 'Vous devez enregistrer au moins un véhicule',
            },
        },
        brazilian: {
            plate: {
                invalid: 'Format de plaque d\'immatriculation invalide. Utilisez ABC-1234 ou ABC1D23',
                required: 'La plaque d\'immatriculation est requise',
            },
            cpf: {
                invalid: 'CPF invalide',
                required: 'Le CPF est requis',
            },
            cnpj: {
                invalid: 'CNPJ invalide',
                required: 'Le CNPJ est requis',
            },
            cpfOrCnpj: {
                invalid: 'CPF ou CNPJ invalide',
                required: 'Le CPF ou CNPJ est requis',
            },
            cep: {
                invalid: 'Code postal invalide (CEP)',
                required: 'Le code postal est requis',
            },
            phone: {
                invalid: 'Numéro de téléphone invalide. Utilisez (00) 00000-0000',
                required: 'Le numéro de téléphone est requis',
            },
            cnh: {
                invalid: 'Permis de conduire invalide (CNH). Doit contenir 11 chiffres',
                required: 'Le permis de conduire est requis',
            },
        },
        common: {
            name: {
                tooShort: 'Le nom doit contenir au moins 2 caractères',
                tooLong: 'Le nom doit contenir au maximum 100 caractères',
                invalidCharacters: 'Le nom ne peut contenir que des lettres, espaces, traits d\'union et apostrophes',
                required: 'Le nom est requis',
            },
            vehicleYear: {
                tooOld: 'L\'année doit être au moins 1900',
                tooNew: 'L\'année ne peut pas être dans le futur',
                required: 'L\'année est requise',
            },
            amount: {
                tooSmall: 'Le montant doit être supérieur à zéro',
                tooLarge: 'Le montant dépasse la valeur maximale autorisée',
                required: 'Le montant est requis',
            },
            date: {
                tooFarInFuture: 'La date ne peut pas dépasser 1 an dans le futur',
                required: 'La date est requise',
            },
            kmDriven: {
                negative: 'Les kilomètres parcourus ne peuvent pas être négatifs',
                tooLarge: 'Les kilomètres parcourus ne peuvent pas dépasser 5000 par jour',
            },
            hoursWorked: {
                negative: 'Les heures travaillées ne peuvent pas être négatives',
                tooLarge: 'Les heures travaillées ne peuvent pas dépasser 24 par jour',
            },
            percentage: {
                tooSmall: 'Le pourcentage doit être au moins 0',
                tooLarge: 'Le pourcentage ne peut pas dépasser 100',
            },
            period: {
                invalid: 'La période doit être au format AAAA-MM',
                required: 'La période est requise',
            },
        },
    },
} as const
