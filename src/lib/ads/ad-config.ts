import type { PartnerCategory } from '@prisma/client';

const expenseTypeToCategoryMap = new Map<RegExp, PartnerCategory>([
  [
    /combustível|gasolina|etanol|diesel|gnv|fuel|gas|carburante|kraftstoff|benzin|essence|combustible/i,
    'FUEL',
  ],
  [
    /manutenção|mecânico|reparo|oficina|maintenance|repair|workshop|mantenimiento|reparación|taller|entretien|réparation|wartung|reparatur|manutenzione|riparazione/i,
    'MAINTENANCE',
  ],
  [
    /estacionamento|parking|aparcamiento|stationnement|parkplatz|parcheggio/i,
    'PARKING',
  ],
  [
    /lavagem|lava.?jato|limpeza|car.?wash|wash|lavado|limpieza|lavage|autowäsche|autolavaggio/i,
    'CAR_WASH',
  ],
  [
    /pedágio|toll|peaje|péage|maut|pedaggio/i,
    'TOLLS',
  ],
  [
    /pneu|tire|tyre|neumático|pneu|reifen|pneumatico/i,
    'TIRES',
  ],
  [
    /seguro|insurance|aseguranza|assurance|versicherung|assicurazione/i,
    'INSURANCE',
  ],
  [
    /pagamento|payment|pago|paiement|zahlung|pagamento/i,
    'PAYMENT',
  ],
]);

export function matchExpenseTypeToCategory(
  expenseTypeName: string
): PartnerCategory | null {
  for (const [pattern, category] of expenseTypeToCategoryMap) {
    if (pattern.test(expenseTypeName)) {
      return category;
    }
  }
  return null;
}

export const adsenseSlots = {
  dashboardBanner: '4721006886',
  inFeed: '6944345540',
} as const;

export const adFrequency = {
  tableInFeed: 10,
  listInFeed: 8,
} as const;
