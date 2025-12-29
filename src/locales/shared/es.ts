export default {
    goBack: 'Volver',
    locales: {
        portuguese: 'Portugués',
        english: 'Inglés',
        spanish: 'Español',
        french: 'Francés',
        german: 'Alemán',
    },
    changeLocale: 'Cambiar idioma',
    logout: 'Cerrar sesión',
    toggleTheme: 'Cambiar tema',
    light: 'Claro',
    dark: 'Oscuro',
    notFound: {
        title: 'Página no encontrada',
        description: 'La página que buscas no existe o ha sido movida.',
        backHome: 'Volver al inicio',
        backDashboard: 'Ir al panel',
    },
    dashboard: {
        kpis: {
            revenue: {
                title: 'Ingresos totales',
                trendingUp: 'Creciendo este período',
                trendingDown: 'Disminuyendo este período',
                description: 'Ingresos totales del período',
            },
            expenses: {
                title: 'Gastos totales',
                trendingUp: 'Aumento en gastos',
                trendingDown: 'Reducción en gastos',
                description: 'Gastos totales del período',
            },
            profit: {
                title: 'Ganancia neta',
                trendingUp: 'Rendimiento positivo',
                trendingDown: 'Rendimiento negativo',
                description: 'Ingresos menos gastos',
            },
            kilometers: {
                title: 'Kilómetros totales',
                footer: 'Distancia recorrida',
                description: 'Total de km conducidos',
            },
            hours: {
                title: 'Horas trabajadas',
                footer: 'Tiempo de trabajo',
                description: 'Total de horas del período',
            },
        },
    },
    cookieConsent: {
        title: 'Valoramos tu privacidad',
        description: 'Usamos cookies para mejorar tu experiencia de navegación, servir contenido personalizado y analizar nuestro tráfico. Al hacer clic en "Aceptar todas", consientes el uso de cookies.',
        learnMore: 'Más información',
        required: 'Obligatorio',
        weUse: 'Usamos cookies',
        essential: {
            title: 'Cookies esenciales',
            description: 'Estas cookies son necesarias para el funcionamiento del sitio y no se pueden desactivar.',
            required: 'Siempre activas',
        },
        performance: {
            title: 'Cookies de rendimiento',
            description: 'Estas cookies nos ayudan a comprender cómo los visitantes interactúan con nuestro sitio web recopilando información de forma anónima.',
        },
        functional: {
            title: 'Cookies funcionales',
            description: 'Estas cookies permiten funcionalidades mejoradas y personalización, como preferencias de idioma y configuraciones guardadas.',
        },
        marketing: {
            title: 'Cookies de marketing',
            description: 'Estas cookies se utilizan para rastrear visitantes en sitios web para mostrar anuncios relevantes.',
        },
        acceptAll: 'Aceptar todas',
        rejectAll: 'Rechazar todas',
        customize: 'Personalizar',
        savePreferences: 'Guardar preferencias',
        back: 'Volver',
        cancel: 'Cancelar',
        settings: {
            title: 'Configuración de cookies',
            description: 'Gestiona tus preferencias de cookies',
        },
        compliance: {
            gdpr: 'Conforme GDPR',
            ccpa: 'Conforme CCPA',
            lgpd: 'Conforme LGPD',
        },
        privacyPolicy: 'Política de privacidad',
        cookiePolicy: 'Política de cookies',
        toast: {
            success: 'Preferencias de cookies guardadas correctamente',
            failed: 'Error al guardar preferencias de cookies',
        },
    },
    validation: {
        onboarding: {
            platforms: {
                required: 'Necesitas guardar al menos una plataforma',
            },
            drivers: {
                nameRequired: 'El nombre del conductor es obligatorio',
                required: 'Necesitas guardar al menos un conductor',
            },
            vehicles: {
                nameRequired: 'El nombre del vehículo es obligatorio',
                required: 'Necesitas guardar al menos un vehículo',
            },
        },
        brazilian: {
            plate: {
                invalid: 'Formato de placa inválido. Use ABC-1234 o ABC1D23',
                required: 'La placa es obligatoria',
            },
            cpf: {
                invalid: 'CPF inválido',
                required: 'CPF es obligatorio',
            },
            cnpj: {
                invalid: 'CNPJ inválido',
                required: 'CNPJ es obligatorio',
            },
            cpfOrCnpj: {
                invalid: 'CPF o CNPJ inválido',
                required: 'CPF o CNPJ es obligatorio',
            },
            cep: {
                invalid: 'Código postal inválido (CEP)',
                required: 'Código postal es obligatorio',
            },
            phone: {
                invalid: 'Número de teléfono inválido. Use (00) 00000-0000',
                required: 'Número de teléfono es obligatorio',
            },
            cnh: {
                invalid: 'Licencia de conducir inválida (CNH). Debe tener 11 dígitos',
                required: 'Licencia de conducir es obligatoria',
            },
        },
        common: {
            name: {
                tooShort: 'El nombre debe tener al menos 2 caracteres',
                tooLong: 'El nombre debe tener como máximo 100 caracteres',
                invalidCharacters: 'El nombre solo puede contener letras, espacios, guiones y apóstrofes',
                required: 'El nombre es obligatorio',
            },
            vehicleYear: {
                tooOld: 'El año debe ser al menos 1900',
                tooNew: 'El año no puede estar en el futuro',
                required: 'El año es obligatorio',
            },
            amount: {
                tooSmall: 'El monto debe ser mayor que cero',
                tooLarge: 'El monto excede el valor máximo permitido',
                required: 'El monto es obligatorio',
            },
            date: {
                tooFarInFuture: 'La fecha no puede ser más de 1 año en el futuro',
                required: 'La fecha es obligatoria',
            },
            kmDriven: {
                negative: 'Los kilómetros conducidos no pueden ser negativos',
                tooLarge: 'Los kilómetros conducidos no pueden exceder 5000 por día',
            },
            hoursWorked: {
                negative: 'Las horas trabajadas no pueden ser negativas',
                tooLarge: 'Las horas trabajadas no pueden exceder 24 por día',
            },
            percentage: {
                tooSmall: 'El porcentaje debe ser al menos 0',
                tooLarge: 'El porcentaje no puede exceder 100',
            },
            period: {
                invalid: 'El período debe estar en formato YYYY-MM',
                required: 'El período es obligatorio',
            },
        },
    },
} as const
