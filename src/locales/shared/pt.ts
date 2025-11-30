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
    },
} as const
