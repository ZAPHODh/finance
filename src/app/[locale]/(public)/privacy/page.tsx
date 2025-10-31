'use client';

import Nav from "@/components/shared/nav";
import FooterSection from "@/components/footer";

export default function PrivacyPage() {
  return (
    <>
      <Nav />
      <main className="container mx-auto max-w-4xl px-4 md:px-6 py-16">
        <h1 className="text-4xl font-bold mb-8">Política de Privacidade</h1>

        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p className="text-muted-foreground mb-8">
            Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Introdução</h2>
            <p>
              Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos seus dados pessoais
              em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei 13.709/2018).
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Dados Coletados</h2>

            <h3 className="text-xl font-semibold mb-2 mt-4">2.1 Dados de Cadastro</h3>
            <ul className="list-disc pl-6 mt-2">
              <li>Nome completo</li>
              <li>Endereço de email</li>
              <li>Foto de perfil (se fornecida via OAuth)</li>
              <li>ID de autenticação de terceiros (Google, GitHub)</li>
            </ul>

            <h3 className="text-xl font-semibold mb-2 mt-4">2.2 Dados Financeiros</h3>
            <ul className="list-disc pl-6 mt-2">
              <li>Despesas e receitas registradas</li>
              <li>Informações de veículos e motoristas</li>
              <li>Plataformas de trabalho (Uber, 99, etc)</li>
              <li>Anexos e documentos fiscais (opcional)</li>
              <li>Metas e orçamentos definidos</li>
            </ul>

            <h3 className="text-xl font-semibold mb-2 mt-4">2.3 Dados de Pagamento</h3>
            <ul className="list-disc pl-6 mt-2">
              <li>Informações de pagamento processadas pelo Stripe (não armazenamos dados de cartão)</li>
              <li>Histórico de assinaturas e transações</li>
            </ul>

            <h3 className="text-xl font-semibold mb-2 mt-4">2.4 Dados de Uso</h3>
            <ul className="list-disc pl-6 mt-2">
              <li>Endereço IP</li>
              <li>Tipo de navegador e dispositivo</li>
              <li>Páginas visitadas e ações realizadas</li>
              <li>Data e hora de acesso</li>
              <li>Cookies e tecnologias similares</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Como Usamos Seus Dados</h2>
            <p>Usamos seus dados para:</p>
            <ul className="list-disc pl-6 mt-2">
              <li>Fornecer e manter o serviço</li>
              <li>Processar transações e gerenciar assinaturas</li>
              <li>Enviar notificações importantes sobre o serviço</li>
              <li>Melhorar e personalizar sua experiência</li>
              <li>Prevenir fraudes e garantir segurança</li>
              <li>Cumprir obrigações legais</li>
              <li>Analisar uso e performance do serviço (analytics)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Base Legal (LGPD)</h2>
            <p>Processamos seus dados com base em:</p>
            <ul className="list-disc pl-6 mt-2">
              <li><strong>Consentimento:</strong> Você concorda ao aceitar nossa política</li>
              <li><strong>Execução de contrato:</strong> Necessário para fornecer o serviço</li>
              <li><strong>Obrigação legal:</strong> Cumprimento de leis fiscais e tributárias</li>
              <li><strong>Legítimo interesse:</strong> Melhoria do serviço e prevenção de fraudes</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Compartilhamento de Dados</h2>
            <p>Compartilhamos dados apenas com:</p>
            <ul className="list-disc pl-6 mt-2">
              <li><strong>Stripe:</strong> Processamento de pagamentos</li>
              <li><strong>Vercel:</strong> Hospedagem e infraestrutura</li>
              <li><strong>Algolia:</strong> Funcionalidade de busca</li>
              <li><strong>Resend:</strong> Envio de emails transacionais</li>
              <li><strong>Provedores de Analytics:</strong> Análise anônima de uso</li>
            </ul>
            <p className="mt-2">
              Nunca vendemos seus dados a terceiros. Todos os parceiros são obrigados contratualmente a proteger seus dados.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Segurança dos Dados</h2>
            <p>Implementamos medidas de segurança incluindo:</p>
            <ul className="list-disc pl-6 mt-2">
              <li>Criptografia de dados em trânsito (HTTPS/TLS)</li>
              <li>Criptografia de dados em repouso (banco de dados)</li>
              <li>Autenticação segura com sessions criptografadas</li>
              <li>Controles de acesso rigorosos</li>
              <li>Monitoramento de segurança e logs de auditoria</li>
              <li>Backups regulares</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Seus Direitos (LGPD)</h2>
            <p>Você tem direito a:</p>
            <ul className="list-disc pl-6 mt-2">
              <li><strong>Acesso:</strong> Solicitar cópia de todos seus dados</li>
              <li><strong>Correção:</strong> Corrigir dados incompletos ou incorretos</li>
              <li><strong>Exclusão:</strong> Solicitar exclusão de seus dados</li>
              <li><strong>Portabilidade:</strong> Receber seus dados em formato estruturado</li>
              <li><strong>Revogação de consentimento:</strong> Retirar consentimento a qualquer momento</li>
              <li><strong>Oposição:</strong> Opor-se ao processamento de dados</li>
              <li><strong>Informação:</strong> Saber quem tem acesso aos seus dados</li>
            </ul>
            <p className="mt-4">
              Para exercer seus direitos, entre em contato via email: support@seudominio.com
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Retenção de Dados</h2>
            <p>
              Mantemos seus dados enquanto sua conta estiver ativa. Após cancelamento, retemos dados por até 90 dias
              para possível reativação. Dados financeiros podem ser retidos por até 5 anos para cumprimento de
              obrigações fiscais conforme legislação brasileira.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Cookies</h2>
            <p>Usamos cookies para:</p>
            <ul className="list-disc pl-6 mt-2">
              <li><strong>Essenciais:</strong> Funcionamento básico do serviço (login, sessão)</li>
              <li><strong>Analytics:</strong> Entender como você usa o serviço (anônimo)</li>
              <li><strong>Preferências:</strong> Lembrar suas configurações (tema, idioma)</li>
            </ul>
            <p className="mt-2">
              Você pode gerenciar cookies através das configurações do navegador ou nosso banner de consentimento.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Transferência Internacional</h2>
            <p>
              Alguns de nossos provedores de serviço estão localizados fora do Brasil (EUA, Europa). Garantimos que
              todas as transferências seguem padrões adequados de proteção conforme LGPD e cláusulas contratuais padrão.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. Menores de Idade</h2>
            <p>
              Nosso serviço não é destinado a menores de 18 anos. Não coletamos intencionalmente dados de menores.
              Se tomarmos conhecimento, excluiremos imediatamente.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">12. Alterações nesta Política</h2>
            <p>
              Podemos atualizar esta política periodicamente. Alterações significativas serão notificadas por email.
              A data de atualização sempre estará no topo desta página.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">13. Encarregado de Dados (DPO)</h2>
            <p>
              Para questões sobre privacidade e proteção de dados:
            </p>
            <p className="mt-2">
              Email: privacy@seudominio.com ou support@seudominio.com
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">14. Autoridade Nacional</h2>
            <p>
              Você tem o direito de apresentar reclamação à Autoridade Nacional de Proteção de Dados (ANPD) caso
              acredite que seus direitos não foram respeitados.
            </p>
          </section>
        </div>
      </main>
      <FooterSection />
    </>
  );
}
