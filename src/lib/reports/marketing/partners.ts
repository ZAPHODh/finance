import type { Partner, PartnerCategory, PlanType } from '@prisma/client';

/**
 * Dados mock de parceiros para marketing
 * Em produção, estes dados viriam do banco de dados
 */
export const MOCK_PARTNERS: Omit<Partner, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'Shell Box',
    category: 'FUEL',
    logoUrl: '/partners/shell-box.png',
    discountRate: 15,
    tagline: 'Economize até 15% em cada abastecimento',
    benefit: 'Com o Shell Box, você paga diretamente pelo app e acumula pontos. Economize até 15% em combustível e receba cashback.',
    ctaText: 'Cadastre-se grátis',
    ctaUrl: 'https://shellbox.com.br?ref=financial',
    showForPlans: ['FREE'],
    locales: ['pt'],
    active: true,
    priority: 0,
  },
  {
    name: 'AutoMec - Rede de Oficinas',
    category: 'MAINTENANCE',
    logoUrl: '/partners/automec.png',
    discountRate: 20,
    tagline: 'Até 20% de desconto em manutenções',
    benefit: 'Rede de oficinas credenciadas com descontos especiais para motoristas profissionais. Parcelamento sem juros.',
    ctaText: 'Encontre uma oficina',
    ctaUrl: 'https://automec.com.br?ref=financial',
    showForPlans: ['FREE'],
    locales: ['pt'],
    active: true,
    priority: 0,
  },
  {
    name: 'Porto Seguro Auto',
    category: 'INSURANCE',
    logoUrl: '/partners/porto-seguro.png',
    discountRate: 25,
    tagline: 'Seguro com 25% de desconto',
    benefit: 'Seguro auto com cobertura completa, assistência 24h e condições especiais para motoristas de app.',
    ctaText: 'Fazer cotação',
    ctaUrl: 'https://portoseguro.com.br?ref=financial',
    showForPlans: ['FREE'],
    locales: ['pt'],
    active: true,
    priority: 0,
  },
];

/**
 * Busca parceiros por categoria
 * @param category Categoria do parceiro
 * @param planType Tipo de plano do usuário
 * @returns Lista de parceiros
 */
export function getPartnersByCategory(
  category: PartnerCategory,
  planType: PlanType = 'FREE'
): Omit<Partner, 'id' | 'createdAt' | 'updatedAt'>[] {
  return MOCK_PARTNERS.filter(
    partner =>
      partner.category === category &&
      partner.active &&
      partner.showForPlans.includes(planType)
  );
}

/**
 * Busca um parceiro aleatório de uma categoria
 * @param category Categoria do parceiro
 * @param planType Tipo de plano do usuário
 * @returns Parceiro ou null
 */
export function getRandomPartnerByCategory(
  category: PartnerCategory,
  planType: PlanType = 'FREE'
): Omit<Partner, 'id' | 'createdAt' | 'updatedAt'> | null {
  const partners = getPartnersByCategory(category, planType);
  if (partners.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * partners.length);
  return partners[randomIndex];
}
