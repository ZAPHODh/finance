import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const partners = [
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
    active: true,
  },
  {
    name: 'Ipiranga Km de Vantagens',
    category: 'FUEL',
    logoUrl: '/partners/ipiranga.png',
    discountRate: 10,
    tagline: 'Ganhe até R$ 0,20 por litro de volta',
    benefit: 'Acumule pontos a cada abastecimento e troque por descontos, produtos ou serviços. Economize até R$ 0,20 por litro.',
    ctaText: 'Saiba mais',
    ctaUrl: 'https://kmdevantagens.com.br?ref=financial',
    showForPlans: ['FREE'],
    active: true,
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
    active: true,
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
    active: true,
  },
  {
    name: 'PagSeguro - Maquininha',
    category: 'PAYMENT',
    logoUrl: '/partners/pagseguro.png',
    discountRate: 0,
    tagline: 'Taxas a partir de 1,99%',
    benefit: 'Aceite pagamentos com as menores taxas do mercado. Sem aluguel de máquina e saque grátis.',
    ctaText: 'Pedir minha maquininha',
    ctaUrl: 'https://pagseguro.uol.com.br?ref=financial',
    showForPlans: ['FREE'],
    active: true,
  },
  {
    name: 'Veloe - Pedágio Automático',
    category: 'TOLLS',
    logoUrl: '/partners/veloe.png',
    discountRate: 5,
    tagline: '5% de desconto em pedágios',
    benefit: 'Passe por pedágios sem parar, receba desconto em cada passagem e controle tudo pelo app.',
    ctaText: 'Pedir meu adesivo',
    ctaUrl: 'https://veloe.com.br?ref=financial',
    showForPlans: ['FREE'],
    active: true,
  },
  {
    name: 'EstacionaFácil',
    category: 'PARKING',
    logoUrl: '/partners/estaciona-facil.png',
    discountRate: 15,
    tagline: 'Até 15% off em estacionamentos',
    benefit: 'Encontre e pague estacionamentos pelo app com desconto. Rede com mais de 1.000 parceiros.',
    ctaText: 'Baixar app',
    ctaUrl: 'https://estacionafacil.com.br?ref=financial',
    showForPlans: ['FREE'],
    active: true,
  },
  {
    name: 'WashCar Express',
    category: 'CAR_WASH',
    logoUrl: '/partners/washcar.png',
    discountRate: 20,
    tagline: '20% de desconto em lavagens',
    benefit: 'Lave seu carro com desconto em qualquer unidade da rede. Planos mensais com lavagens ilimitadas.',
    ctaText: 'Ver unidades',
    ctaUrl: 'https://washcar.com.br?ref=financial',
    showForPlans: ['FREE'],
    active: true,
  },
  {
    name: 'Pirelli Pneus',
    category: 'TIRES',
    logoUrl: '/partners/pirelli.png',
    discountRate: 18,
    tagline: 'Até 18% off em pneus novos',
    benefit: 'Pneus de qualidade com garantia estendida e instalação grátis. Parcelamento em até 10x sem juros.',
    ctaText: 'Ver modelos',
    ctaUrl: 'https://pirelli.com.br?ref=financial',
    showForPlans: ['FREE'],
    active: true,
  },
];

async function seedPartners() {
  console.log('🌱 Seeding partners...');

  for (const partner of partners) {
    const existing = await prisma.partner.findFirst({
      where: { name: partner.name },
    });

    if (existing) {
      console.log(`  ✓ Partner "${partner.name}" already exists, skipping...`);
      continue;
    }

    await prisma.partner.create({
      data: partner as any,
    });

    console.log(`  ✓ Created partner: ${partner.name}`);
  }

  console.log('✅ Partners seeded successfully!');
}

seedPartners()
  .catch((error) => {
    console.error('❌ Error seeding partners:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
