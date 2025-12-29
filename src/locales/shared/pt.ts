export default {
    goBack: 'Voltar',
    locales: {
        portuguese: 'Português',
        english: 'Inglês',
    },
    changeLocale: 'Mudar Localização',
    logout: 'Sair',
    toggleTheme: 'Alternar Tema',
    light: 'Claro',
    dark: 'Escuro',
    notFound: {
        title: 'Página Não Encontrada',
        description: 'A página que você está procurando não existe ou foi movida.',
        backHome: 'Voltar para Início',
        backDashboard: 'Ir para Dashboard',
    },
    dashboard: {
        kpis: {
            revenue: {
                title: 'Receita Total',
                trendingUp: 'Crescendo este período',
                trendingDown: 'Em queda este período',
                description: 'Total de receitas do período',
            },
            expenses: {
                title: 'Despesas Totais',
                trendingUp: 'Aumento nas despesas',
                trendingDown: 'Redução nas despesas',
                description: 'Total de despesas do período',
            },
            profit: {
                title: 'Lucro Líquido',
                trendingUp: 'Performance positiva',
                trendingDown: 'Performance negativa',
                description: 'Receitas menos despesas',
            },
            kilometers: {
                title: 'Quilometragem Total',
                footer: 'Distância percorrida',
                description: 'Total de km rodados',
            },
            hours: {
                title: 'Horas Trabalhadas',
                footer: 'Tempo de trabalho',
                description: 'Total de horas no período',
            },
        },
        chart: {
            title: 'Receitas vs Despesas',
            descriptionLong: 'Comparativo dos últimos',
            descriptionShort: 'Últimos',
            threeMonths: '3 meses',
            thirtyDays: '30 dias',
            sevenDays: '7 dias',
            lastThreeMonths: 'Últimos 3 meses',
            lastThirtyDays: 'Últimos 30 dias',
            lastSevenDays: 'Últimos 7 dias',
            selectPeriod: 'Selecione um período',
            revenue: 'Receitas',
            expenses: 'Despesas',
            values: 'Valores',
        },
    },
    cookieConsent: {
        title: 'Valorizamos sua privacidade',
        description: 'Usamos cookies para melhorar sua experiência de navegação, servir conteúdo personalizado e analisar nosso tráfego. Ao clicar em "Aceitar Todos", você consente com o uso de cookies.',
        learnMore: 'Saiba mais',
        required: 'Obrigatório',
        weUse: 'Usamos cookies',
        essential: {
            title: 'Cookies Essenciais',
            description: 'Estes cookies são necessários para o funcionamento do site e não podem ser desativados.',
            required: 'Sempre Ativo',
        },
        performance: {
            title: 'Cookies de Desempenho',
            description: 'Estes cookies nos ajudam a entender como os visitantes interagem com nosso site coletando e relatando informações anonimamente.',
        },
        functional: {
            title: 'Cookies Funcionais',
            description: 'Estes cookies permitem funcionalidades aprimoradas e personalização, como preferências de idioma e configurações salvas.',
        },
        marketing: {
            title: 'Cookies de Marketing',
            description: 'Estes cookies são usados para rastrear visitantes em sites para exibir anúncios relevantes.',
        },
        acceptAll: 'Aceitar Todos',
        rejectAll: 'Rejeitar Todos',
        customize: 'Personalizar',
        savePreferences: 'Salvar Preferências',
        back: 'Voltar',
        cancel: 'Cancelar',
        settings: {
            title: 'Configurações de Cookies',
            description: 'Gerencie suas preferências de cookies',
        },
        compliance: {
            gdpr: 'Conforme GDPR',
            ccpa: 'Conforme CCPA',
            lgpd: 'Conforme LGPD',
        },
        privacyPolicy: 'Política de Privacidade',
        cookiePolicy: 'Política de Cookies',
        toast: {
            success: 'Preferências de cookies salvas com sucesso',
            failed: 'Falha ao salvar preferências de cookies',
        },
    },
    validation: {
        onboarding: {
            platforms: {
                required: 'Você precisa salvar pelo menos uma plataforma',
            },
            drivers: {
                nameRequired: 'Nome do motorista é obrigatório',
                required: 'Você precisa salvar pelo menos um motorista',
            },
            vehicles: {
                nameRequired: 'Nome do veículo é obrigatório',
                required: 'Você precisa salvar pelo menos um veículo',
            },
        },
        brazilian: {
            plate: {
                invalid: 'Formato de placa inválido. Use ABC-1234 ou ABC1D23',
                required: 'Placa é obrigatória',
            },
            cpf: {
                invalid: 'CPF inválido',
                required: 'CPF é obrigatório',
            },
            cnpj: {
                invalid: 'CNPJ inválido',
                required: 'CNPJ é obrigatório',
            },
            cpfOrCnpj: {
                invalid: 'CPF ou CNPJ inválido',
                required: 'CPF ou CNPJ é obrigatório',
            },
            cep: {
                invalid: 'CEP inválido',
                required: 'CEP é obrigatório',
            },
            phone: {
                invalid: 'Telefone inválido. Use (00) 00000-0000',
                required: 'Telefone é obrigatório',
            },
            cnh: {
                invalid: 'CNH inválida. Deve ter 11 dígitos',
                required: 'CNH é obrigatória',
            },
        },
        common: {
            name: {
                tooShort: 'Nome deve ter pelo menos 2 caracteres',
                tooLong: 'Nome deve ter no máximo 100 caracteres',
                invalidCharacters: 'Nome pode conter apenas letras, espaços, hífens e apóstrofos',
                required: 'Nome é obrigatório',
            },
            vehicleYear: {
                tooOld: 'Ano deve ser pelo menos 1900',
                tooNew: 'Ano não pode ser no futuro',
                required: 'Ano é obrigatório',
            },
            amount: {
                tooSmall: 'Valor deve ser maior que zero',
                tooLarge: 'Valor excede o máximo permitido',
                required: 'Valor é obrigatório',
            },
            date: {
                tooFarInFuture: 'Data não pode ser mais de 1 ano no futuro',
                required: 'Data é obrigatória',
            },
            kmDriven: {
                negative: 'Quilômetros rodados não podem ser negativos',
                tooLarge: 'Quilômetros rodados não podem exceder 5000 por dia',
            },
            hoursWorked: {
                negative: 'Horas trabalhadas não podem ser negativas',
                tooLarge: 'Horas trabalhadas não podem exceder 24 por dia',
            },
            percentage: {
                tooSmall: 'Porcentagem deve ser pelo menos 0',
                tooLarge: 'Porcentagem não pode exceder 100',
            },
            period: {
                invalid: 'Período deve estar no formato AAAA-MM',
                required: 'Período é obrigatório',
            },
        },
    },
} as const
