// Helper functions to build search records
// These are NOT server actions, just pure data transformers

export interface SearchRecord {
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

/**
 * Build search records for expenses
 */
export function buildExpenseSearchRecord(expense: {
  id: string;
  amount: number;
  date: Date;
  expenseType: { name: string };
  driver?: { name: string } | null;
  vehicle?: { name: string } | null;
}): SearchRecord {
  return {
    objectID: `expense-${expense.id}`,
    title: `Despesa: ${expense.expenseType.name}`,
    description: `R$ ${expense.amount.toFixed(2)} - ${new Date(expense.date).toLocaleDateString('pt-BR')}`,
    category: 'Despesa',
    url: '/dashboard/expenses',
    type: 'expense',
    amount: Number(expense.amount),
    date: expense.date.toISOString(),
    _tags: [
      'expense',
      expense.expenseType.name,
      expense.driver?.name || '',
      expense.vehicle?.name || '',
    ].filter(Boolean),
  };
}

/**
 * Build search records for revenues
 */
export function buildRevenueSearchRecord(revenue: {
  id: string;
  amount: number;
  date: Date;
  platforms: Array<{ platform: { name: string } }>;
  driver?: { name: string } | null;
  vehicle?: { name: string } | null;
}): SearchRecord {
  const platformNames = revenue.platforms.map((p) => p.platform.name).join(', ');

  return {
    objectID: `revenue-${revenue.id}`,
    title: `Receita: ${platformNames}`,
    description: `R$ ${revenue.amount.toFixed(2)} - ${new Date(revenue.date).toLocaleDateString('pt-BR')}`,
    category: 'Receita',
    url: '/dashboard/revenues',
    type: 'revenue',
    amount: Number(revenue.amount),
    date: revenue.date.toISOString(),
    _tags: [
      'revenue',
      ...revenue.platforms.map((p) => p.platform.name),
      revenue.driver?.name || '',
      revenue.vehicle?.name || '',
    ].filter(Boolean),
  };
}

/**
 * Build search records for drivers
 */
export function buildDriverSearchRecord(driver: {
  id: string;
  name: string;
}): SearchRecord {
  return {
    objectID: `driver-${driver.id}`,
    title: driver.name,
    description: 'Motorista',
    category: 'Motorista',
    url: '/dashboard/drivers',
    type: 'driver',
    _tags: ['driver', driver.name],
  };
}

/**
 * Build search records for vehicles
 */
export function buildVehicleSearchRecord(vehicle: {
  id: string;
  name: string;
  model?: string | null;
  plate?: string | null;
}): SearchRecord {
  return {
    objectID: `vehicle-${vehicle.id}`,
    title: vehicle.name,
    description: `${vehicle.model || ''} ${vehicle.plate || ''}`.trim() || 'Veículo',
    category: 'Veículo',
    url: '/dashboard/vehicles',
    type: 'vehicle',
    _tags: ['vehicle', vehicle.name, vehicle.model || '', vehicle.plate || ''].filter(Boolean),
  };
}

/**
 * Build search records for platforms
 */
export function buildPlatformSearchRecord(platform: {
  id: string;
  name: string;
}): SearchRecord {
  return {
    objectID: `platform-${platform.id}`,
    title: platform.name,
    description: 'Plataforma',
    category: 'Plataforma',
    url: '/dashboard/companies',
    type: 'platform',
    _tags: ['platform', platform.name],
  };
}

/**
 * Build search records for expense types
 */
export function buildExpenseTypeSearchRecord(expenseType: {
  id: string;
  name: string;
}): SearchRecord {
  return {
    objectID: `expense-type-${expenseType.id}`,
    title: expenseType.name,
    description: 'Tipo de Despesa',
    category: 'Tipo de Despesa',
    url: '/dashboard/expense-types',
    type: 'expense-type',
    _tags: ['expense-type', expenseType.name],
  };
}

/**
 * Build search records for payment methods
 */
export function buildPaymentMethodSearchRecord(paymentMethod: {
  id: string;
  name: string;
}): SearchRecord {
  return {
    objectID: `payment-method-${paymentMethod.id}`,
    title: paymentMethod.name,
    description: 'Forma de Pagamento',
    category: 'Forma de Pagamento',
    url: '/dashboard/payment-methods',
    type: 'payment-method',
    _tags: ['payment-method', paymentMethod.name],
  };
}
