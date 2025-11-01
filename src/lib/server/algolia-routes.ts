'use server';

import { algoliasearch } from 'algoliasearch';

const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.ALGOLIA_WRITE_KEY!
);

const INDEX_NAME = 'financial_routes';

interface RouteRecord {
  objectID: string;
  title_en: string;
  title_pt: string;
  description_en: string;
  description_pt: string;
  url: string;
  category_en: string;
  category_pt: string;
  _tags: string[];
}

const routes: RouteRecord[] = [
  {
    objectID: 'route-dashboard',
    title_en: 'Dashboard',
    title_pt: 'Painel',
    description_en: 'Overview of your finances',
    description_pt: 'Visão geral das finanças',
    url: '/dashboard',
    category_en: 'Main',
    category_pt: 'Principal',
    _tags: ['dashboard', 'painel', 'home', 'main', 'principal'],
  },
  {
    objectID: 'route-expenses',
    title_en: 'Expenses',
    title_pt: 'Despesas',
    description_en: 'Manage your expenses',
    description_pt: 'Gerenciar despesas',
    url: '/dashboard/expenses',
    category_en: 'Financial',
    category_pt: 'Financeiro',
    _tags: ['expenses', 'despesas', 'financial', 'financeiro'],
  },
  {
    objectID: 'route-revenues',
    title_en: 'Revenues',
    title_pt: 'Receitas',
    description_en: 'Manage your revenues',
    description_pt: 'Gerenciar receitas',
    url: '/dashboard/revenues',
    category_en: 'Financial',
    category_pt: 'Financeiro',
    _tags: ['revenues', 'receitas', 'financial', 'financeiro'],
  },
  {
    objectID: 'route-drivers',
    title_en: 'Drivers',
    title_pt: 'Motoristas',
    description_en: 'Manage drivers',
    description_pt: 'Gerenciar motoristas',
    url: '/dashboard/drivers',
    category_en: 'Configuration',
    category_pt: 'Configuração',
    _tags: ['drivers', 'motoristas', 'configuration', 'configuração'],
  },
  {
    objectID: 'route-vehicles',
    title_en: 'Vehicles',
    title_pt: 'Veículos',
    description_en: 'Manage vehicles',
    description_pt: 'Gerenciar veículos',
    url: '/dashboard/vehicles',
    category_en: 'Configuration',
    category_pt: 'Configuração',
    _tags: ['vehicles', 'veículos', 'configuration', 'configuração'],
  },
  {
    objectID: 'route-platforms',
    title_en: 'Platforms',
    title_pt: 'Plataformas',
    description_en: 'Manage platforms',
    description_pt: 'Gerenciar plataformas',
    url: '/dashboard/platforms',
    category_en: 'Configuration',
    category_pt: 'Configuração',
    _tags: ['platforms', 'plataformas', 'configuration', 'configuração', 'companies'],
  },
  {
    objectID: 'route-expense-types',
    title_en: 'Expense Types',
    title_pt: 'Tipos de Despesas',
    description_en: 'Manage expense types',
    description_pt: 'Gerenciar tipos de despesas',
    url: '/dashboard/expense-types',
    category_en: 'Configuration',
    category_pt: 'Configuração',
    _tags: ['expense-types', 'tipos de despesas', 'configuration', 'configuração'],
  },
  {
    objectID: 'route-payment-methods',
    title_en: 'Payment Methods',
    title_pt: 'Formas de Pagamento',
    description_en: 'Manage payment methods',
    description_pt: 'Gerenciar formas de pagamento',
    url: '/dashboard/payment-methods',
    category_en: 'Configuration',
    category_pt: 'Configuração',
    _tags: ['payment-methods', 'formas de pagamento', 'configuration', 'configuração'],
  },
  {
    objectID: 'route-goals',
    title_en: 'Goals',
    title_pt: 'Metas',
    description_en: 'Manage financial goals',
    description_pt: 'Gerenciar metas financeiras',
    url: '/goals',
    category_en: 'Planning',
    category_pt: 'Planejamento',
    _tags: ['goals', 'metas', 'planning', 'planejamento'],
  },
  {
    objectID: 'route-budgets',
    title_en: 'Budgets',
    title_pt: 'Orçamentos',
    description_en: 'Manage budgets',
    description_pt: 'Gerenciar orçamentos',
    url: '/budgets',
    category_en: 'Planning',
    category_pt: 'Planejamento',
    _tags: ['budgets', 'orçamentos', 'planning', 'planejamento'],
  },
  {
    objectID: 'route-account',
    title_en: 'Account',
    title_pt: 'Conta',
    description_en: 'Manage your account',
    description_pt: 'Gerenciar conta',
    url: '/dashboard/account',
    category_en: 'Settings',
    category_pt: 'Configurações',
    _tags: ['account', 'conta', 'settings', 'configurações', 'profile', 'perfil'],
  },
  {
    objectID: 'route-preferences',
    title_en: 'Preferences',
    title_pt: 'Preferências',
    description_en: 'Manage preferences',
    description_pt: 'Gerenciar preferências',
    url: '/dashboard/preferences',
    category_en: 'Settings',
    category_pt: 'Configurações',
    _tags: ['preferences', 'preferências', 'settings', 'configurações'],
  },
  {
    objectID: 'route-settings',
    title_en: 'Settings',
    title_pt: 'Configurações',
    description_en: 'Manage settings',
    description_pt: 'Gerenciar configurações',
    url: '/dashboard/settings',
    category_en: 'Settings',
    category_pt: 'Configurações',
    _tags: ['settings', 'configurações'],
  },
  {
    objectID: 'route-billing',
    title_en: 'Billing',
    title_pt: 'Cobrança',
    description_en: 'Manage billing and subscription',
    description_pt: 'Gerenciar cobrança e assinatura',
    url: '/dashboard/billing',
    category_en: 'Settings',
    category_pt: 'Configurações',
    _tags: ['billing', 'cobrança', 'subscription', 'assinatura', 'settings', 'configurações'],
  },
  {
    objectID: 'route-help',
    title_en: 'Help',
    title_pt: 'Ajuda',
    description_en: 'Get help and support',
    description_pt: 'Obter ajuda e suporte',
    url: '/dashboard/help',
    category_en: 'Support',
    category_pt: 'Suporte',
    _tags: ['help', 'ajuda', 'support', 'suporte'],
  },
  {
    objectID: 'route-reports',
    title_en: 'Reports',
    title_pt: 'Relatórios',
    description_en: 'View and generate reports',
    description_pt: 'Ver e gerar relatórios',
    url: '/dashboard/reports',
    category_en: 'Documents',
    category_pt: 'Documentos',
    _tags: ['reports', 'relatórios', 'documents', 'documentos'],
  },
];

export async function indexRoutes() {
  await client.saveObjects({
    indexName: INDEX_NAME,
    objects: routes as unknown as Record<string, unknown>[],
  });

  await client.setSettings({
    indexName: INDEX_NAME,
    indexSettings: {
      searchableAttributes: [
        'title_en',
        'title_pt',
        'description_en',
        'description_pt',
        '_tags',
      ],
      attributesForFaceting: ['category_en', 'category_pt'],
      ranking: ['typo', 'geo', 'words', 'filters', 'proximity', 'attribute', 'exact'],
    },
  });

  return { success: true, routesCount: routes.length };
}

export async function deleteRoutesIndex() {
  await client.deleteIndex({ indexName: INDEX_NAME });
  return { success: true };
}
