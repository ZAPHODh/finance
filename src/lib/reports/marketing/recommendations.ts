import type { PartnerCategory, PlanType } from '@prisma/client';
import type { ReportData, PartnerRecommendation } from '../types';
import { getRandomPartnerByCategory } from './partners';

/**
 * Calcula economia potencial baseado nos dados do relatório
 * @param reportData Dados do relatório
 * @param category Categoria do parceiro
 * @param discountRate Taxa de desconto do parceiro (em porcentagem)
 * @returns Valor de economia em R$
 */
function calculatePotentialSavings(
  reportData: ReportData,
  category: PartnerCategory,
  discountRate: number
): number {
  let relevantExpenses = 0;

  // Calcular despesas relevantes baseado na categoria
  if (reportData.expenses) {
    switch (category) {
      case 'FUEL':
        // Assumir que despesas com combustível representam ~40-50% das despesas
        relevantExpenses = reportData.expenses
          .filter(e => e.expenseType.name.toLowerCase().includes('combustível') ||
                       e.expenseType.name.toLowerCase().includes('gasolina') ||
                       e.expenseType.name.toLowerCase().includes('diesel'))
          .reduce((sum, e) => sum + e.amount, 0);
        break;

      case 'MAINTENANCE':
        relevantExpenses = reportData.expenses
          .filter(e => e.expenseType.name.toLowerCase().includes('manutenção') ||
                       e.expenseType.name.toLowerCase().includes('oficina') ||
                       e.expenseType.name.toLowerCase().includes('reparo'))
          .reduce((sum, e) => sum + e.amount, 0);
        break;

      case 'PARKING':
        relevantExpenses = reportData.expenses
          .filter(e => e.expenseType.name.toLowerCase().includes('estacionamento'))
          .reduce((sum, e) => sum + e.amount, 0);
        break;

      case 'TOLLS':
        relevantExpenses = reportData.expenses
          .filter(e => e.expenseType.name.toLowerCase().includes('pedágio'))
          .reduce((sum, e) => sum + e.amount, 0);
        break;

      case 'CAR_WASH':
        relevantExpenses = reportData.expenses
          .filter(e => e.expenseType.name.toLowerCase().includes('lavagem') ||
                       e.expenseType.name.toLowerCase().includes('lava'))
          .reduce((sum, e) => sum + e.amount, 0);
        break;

      case 'TIRES':
        relevantExpenses = reportData.expenses
          .filter(e => e.expenseType.name.toLowerCase().includes('pneu'))
          .reduce((sum, e) => sum + e.amount, 0);
        break;

      default:
        relevantExpenses = 0;
    }
  }

  // Calcular economia
  const savings = relevantExpenses * (discountRate / 100);
  return Math.round(savings * 100) / 100; // Arredondar para 2 casas decimais
}

/**
 * Gera recomendação de parceiro para um relatório
 * @param reportData Dados do relatório
 * @param partnerCategory Categoria de parceiro relevante para o relatório
 * @param userPlanType Tipo de plano do usuário
 * @returns Recomendação do parceiro ou null
 */
export function getPartnerRecommendation(
  reportData: ReportData,
  partnerCategory: PartnerCategory | null,
  userPlanType: PlanType = 'FREE'
): PartnerRecommendation | null {
  // Não mostrar marketing para planos pagos (a menos que sejam PRO)
  if (userPlanType !== 'FREE') {
    return null;
  }

  // Se não há categoria de parceiro definida para este relatório
  if (!partnerCategory) {
    return null;
  }

  // Buscar um parceiro aleatório da categoria
  const partner = getRandomPartnerByCategory(partnerCategory, userPlanType);
  if (!partner) {
    return null;
  }

  // Calcular economia potencial
  const potentialSavings = calculatePotentialSavings(
    reportData,
    partnerCategory,
    partner.discountRate || 0
  );

  // Se a economia for muito baixa, não mostrar
  if (potentialSavings < 10) {
    return null;
  }

  // Gerar mensagem personalizada
  const message = generateMarketingMessage(
    partner.name,
    partner.tagline,
    potentialSavings
  );

  return {
    partner: {
      ...partner,
      id: 'mock-id',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    potentialSavings,
    message,
    placement: 'callout', // Padrão: callout destacado
  };
}

/**
 * Gera mensagem de marketing personalizada
 * @param partnerName Nome do parceiro
 * @param tagline Slogan do parceiro
 * @param savings Economia em R$
 * @returns Mensagem formatada
 */
function generateMarketingMessage(
  partnerName: string,
  tagline: string,
  savings: number
): string {
  const savingsFormatted = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(savings);

  return `💡 Com ${partnerName} você economizaria ${savingsFormatted}/mês! ${tagline}`;
}

/**
 * Gera múltiplas recomendações para diferentes categorias
 * @param reportData Dados do relatório
 * @param userPlanType Tipo de plano do usuário
 * @returns Array de recomendações
 */
export function getMultipleRecommendations(
  reportData: ReportData,
  userPlanType: PlanType = 'FREE'
): PartnerRecommendation[] {
  if (userPlanType !== 'FREE') {
    return [];
  }

  const categories: PartnerCategory[] = ['FUEL', 'MAINTENANCE', 'PARKING', 'TOLLS'];
  const recommendations: PartnerRecommendation[] = [];

  for (const category of categories) {
    const recommendation = getPartnerRecommendation(reportData, category, userPlanType);
    if (recommendation && recommendation.potentialSavings >= 10) {
      recommendations.push(recommendation);
    }
  }

  // Retornar as top 2-3 recomendações
  return recommendations
    .sort((a, b) => b.potentialSavings - a.potentialSavings)
    .slice(0, 3);
}
