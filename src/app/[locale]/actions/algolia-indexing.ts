'use server';

import { algoliasearch } from 'algoliasearch';
import { getCurrentSession } from '@/lib/server/auth/session';
import { prisma } from '@/lib/server/db';

const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.ALGOLIA_WRITE_KEY!
);

interface SearchRecord {
  objectID: string;
  title: string;
  description: string;
  category: string;
  url: string;
  type: 'page' | 'expense' | 'revenue' | 'driver' | 'vehicle' | 'platform' | 'expense-type' | 'payment-method';
  amount?: number;
  date?: string;
  _tags: string[];
}

export async function indexUserData() {
  const { user } = await getCurrentSession();
  if (!user) throw new Error('Unauthorized');

  const indexName = `financial_${user.id}`;

  const records: SearchRecord[] = [];

  // Index static pages
  const pages: SearchRecord[] = [
    {
      objectID: 'page-dashboard',
      title: 'Dashboard',
      description: 'Visão geral das finanças',
      category: 'Página',
      url: '/dashboard',
      type: 'page',
      _tags: ['page', 'dashboard', 'home'],
    },
    {
      objectID: 'page-expenses',
      title: 'Despesas',
      description: 'Gerenciar despesas',
      category: 'Página',
      url: '/dashboard/expenses',
      type: 'page',
      _tags: ['page', 'expenses', 'financial'],
    },
    {
      objectID: 'page-revenues',
      title: 'Receitas',
      description: 'Gerenciar receitas',
      category: 'Página',
      url: '/dashboard/revenues',
      type: 'page',
      _tags: ['page', 'revenues', 'financial'],
    },
    {
      objectID: 'page-drivers',
      title: 'Motoristas',
      description: 'Gerenciar motoristas',
      category: 'Página',
      url: '/dashboard/drivers',
      type: 'page',
      _tags: ['page', 'drivers', 'configuration'],
    },
    {
      objectID: 'page-vehicles',
      title: 'Veículos',
      description: 'Gerenciar veículos',
      category: 'Página',
      url: '/dashboard/vehicles',
      type: 'page',
      _tags: ['page', 'vehicles', 'configuration'],
    },
    {
      objectID: 'page-platforms',
      title: 'Plataformas',
      description: 'Gerenciar plataformas',
      category: 'Página',
      url: '/dashboard/companies',
      type: 'page',
      _tags: ['page', 'platforms', 'configuration'],
    },
    {
      objectID: 'page-goals',
      title: 'Metas',
      description: 'Gerenciar metas financeiras',
      category: 'Página',
      url: '/goals',
      type: 'page',
      _tags: ['page', 'goals', 'planning'],
    },
    {
      objectID: 'page-budgets',
      title: 'Orçamentos',
      description: 'Gerenciar orçamentos',
      category: 'Página',
      url: '/budgets',
      type: 'page',
      _tags: ['page', 'budgets', 'planning'],
    },
    {
      objectID: 'page-settings',
      title: 'Configurações',
      description: 'Configurações da conta',
      category: 'Página',
      url: '/settings',
      type: 'page',
      _tags: ['page', 'settings'],
    },
    {
      objectID: 'page-account',
      title: 'Conta',
      description: 'Gerenciar conta',
      category: 'Página',
      url: '/account',
      type: 'page',
      _tags: ['page', 'account'],
    },
  ];

  records.push(...pages);

  // Index expenses
  const expenses = await prisma.expense.findMany({
    where: {
      expenseType: {
        userId: user.id,
      },
    },
    orderBy: { date: 'desc' },
    include: {
      expenseType: { select: { name: true } },
      driver: { select: { name: true } },
      vehicle: { select: { name: true } },
    },
  });

  expenses.forEach((expense) => {
    records.push({
      objectID: `expense-${expense.id}`,
      title: `Despesa: ${expense.expenseType.name}`,
      description: `R$ ${expense.amount.toFixed(2)} - ${new Date(expense.date).toLocaleDateString('pt-BR')}`,
      category: 'Despesa',
      url: `/dashboard/expenses`,
      type: 'expense',
      amount: Number(expense.amount),
      date: expense.date.toISOString(),
      _tags: [
        'expense',
        expense.expenseType.name,
        expense.driver?.name || '',
        expense.vehicle?.name || '',
      ].filter(Boolean),
    });
  });

  // Index revenues
  const revenues = await prisma.revenue.findMany({
    where: {
      OR: [
        { platforms: { some: { platform: { userId: user.id } } } },
        { driver: { userId: user.id } },
      ],
    },
    orderBy: { date: 'desc' },
    include: {
      platforms: {
        include: {
          platform: { select: { name: true } },
        },
      },
      driver: { select: { name: true } },
      vehicle: { select: { name: true } },
    },
  });

  revenues.forEach((revenue) => {
    const platformNames = revenue.platforms.map((p) => p.platform.name).join(', ');
    records.push({
      objectID: `revenue-${revenue.id}`,
      title: `Receita: ${platformNames}`,
      description: `R$ ${revenue.amount.toFixed(2)} - ${new Date(revenue.date).toLocaleDateString('pt-BR')}`,
      category: 'Receita',
      url: `/dashboard/revenues`,
      type: 'revenue',
      amount: Number(revenue.amount),
      date: revenue.date.toISOString(),
      _tags: [
        'revenue',
        ...revenue.platforms.map((p) => p.platform.name),
        revenue.driver?.name || '',
        revenue.vehicle?.name || '',
      ].filter(Boolean),
    });
  });

  // Index drivers
  const drivers = await prisma.driver.findMany({
    where: { userId: user.id },
  });

  drivers.forEach((driver) => {
    records.push({
      objectID: `driver-${driver.id}`,
      title: driver.name,
      description: 'Motorista',
      category: 'Motorista',
      url: `/dashboard/drivers`,
      type: 'driver',
      _tags: ['driver', driver.name],
    });
  });

  // Index vehicles
  const vehicles = await prisma.vehicle.findMany({
    where: { userId: user.id },
  });

  vehicles.forEach((vehicle) => {
    records.push({
      objectID: `vehicle-${vehicle.id}`,
      title: vehicle.name,
      description: `${vehicle.model || ''} ${vehicle.plate || ''}`.trim() || 'Veículo',
      category: 'Veículo',
      url: `/dashboard/vehicles`,
      type: 'vehicle',
      _tags: ['vehicle', vehicle.name, vehicle.model || '', vehicle.plate || ''].filter(Boolean),
    });
  });

  // Index platforms
  const platforms = await prisma.platform.findMany({
    where: { userId: user.id },
  });

  platforms.forEach((platform) => {
    records.push({
      objectID: `platform-${platform.id}`,
      title: platform.name,
      description: 'Plataforma',
      category: 'Plataforma',
      url: `/dashboard/companies`,
      type: 'platform',
      _tags: ['platform', platform.name],
    });
  });

  // Index expense types
  const expenseTypes = await prisma.expenseType.findMany({
    where: { userId: user.id },
  });

  expenseTypes.forEach((expenseType) => {
    records.push({
      objectID: `expense-type-${expenseType.id}`,
      title: expenseType.name,
      description: 'Tipo de Despesa',
      category: 'Tipo de Despesa',
      url: `/dashboard/expense-types`,
      type: 'expense-type',
      _tags: ['expense-type', expenseType.name],
    });
  });

  // Index payment methods
  const paymentMethods = await prisma.paymentMethod.findMany({
    where: { userId: user.id },
  });

  paymentMethods.forEach((paymentMethod) => {
    records.push({
      objectID: `payment-method-${paymentMethod.id}`,
      title: paymentMethod.name,
      description: 'Forma de Pagamento',
      category: 'Forma de Pagamento',
      url: `/dashboard/payment-methods`,
      type: 'payment-method',
      _tags: ['payment-method', paymentMethod.name],
    });
  });

  // Save all records to Algolia using v5 API
  await client.saveObjects({
    indexName,
    objects: records as unknown as Record<string, unknown>[],
  });

  // Configure index settings using v5 API
  await client.setSettings({
    indexName,
    indexSettings: {
      searchableAttributes: [
        'title',
        'description',
        'category',
        '_tags',
      ],
      attributesForFaceting: ['type', 'category'],
      customRanking: ['desc(date)', 'desc(amount)'],
    },
  });

  return { success: true, recordsCount: records.length };
}

export async function deleteUserIndex() {
  const { user } = await getCurrentSession();
  if (!user) throw new Error('Unauthorized');

  const indexName = `financial_${user.id}`;

  await client.deleteIndex({ indexName });

  return { success: true };
}
