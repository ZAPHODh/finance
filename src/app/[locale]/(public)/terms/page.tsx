'use client';

import Nav from "@/components/shared/nav";
import FooterSection from "@/components/footer";

export default function TermsPage() {
  return (
    <>
      <Nav />
      <main className="container mx-auto max-w-4xl px-4 md:px-6 py-16">
        <h1 className="text-4xl font-bold mb-8">Termos de Serviço</h1>

        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p className="text-muted-foreground mb-8">
            Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Aceitação dos Termos</h2>
            <p>
              Ao acessar e usar este serviço, você aceita e concorda em ficar vinculado aos termos e condições deste acordo.
              Se você não concordar com qualquer parte destes termos, não deverá usar nosso serviço.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Descrição do Serviço</h2>
            <p>
              Fornecemos uma plataforma de gestão financeira para motoristas de aplicativo e profissionais autônomos,
              permitindo controle de despesas, receitas, relatórios e análises financeiras.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Registro e Conta</h2>
            <p>Para usar nosso serviço, você deve:</p>
            <ul className="list-disc pl-6 mt-2">
              <li>Ter pelo menos 18 anos de idade</li>
              <li>Fornecer informações verdadeiras e completas</li>
              <li>Manter suas credenciais de acesso seguras</li>
              <li>Notificar-nos imediatamente sobre qualquer uso não autorizado</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Planos e Pagamentos</h2>
            <p>
              <strong>4.1 Planos:</strong> Oferecemos planos Free, Simple e PRO com diferentes recursos e limitações.
            </p>
            <p className="mt-2">
              <strong>4.2 Pagamentos:</strong> Os pagamentos são processados via Stripe. Ao assinar um plano pago,
              você autoriza cobranças recorrentes até cancelamento.
            </p>
            <p className="mt-2">
              <strong>4.3 Cancelamento:</strong> Você pode cancelar sua assinatura a qualquer momento. O acesso
              continuará até o final do período pago. Não há reembolsos para períodos parciais.
            </p>
            <p className="mt-2">
              <strong>4.4 Alterações de Preço:</strong> Reservamo-nos o direito de alterar preços com 30 dias de
              aviso prévio aos usuários existentes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Uso Aceitável</h2>
            <p>Você concorda em NÃO:</p>
            <ul className="list-disc pl-6 mt-2">
              <li>Usar o serviço para qualquer finalidade ilegal</li>
              <li>Tentar acessar dados de outros usuários</li>
              <li>Sobrecarregar ou interferir com o serviço</li>
              <li>Fazer engenharia reversa ou copiar o software</li>
              <li>Remover avisos de direitos autorais ou propriedade</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Propriedade Intelectual</h2>
            <p>
              Todo o conteúdo, recursos e funcionalidades do serviço são de propriedade exclusiva da empresa e
              protegidos por leis de direitos autorais, marcas registradas e outras leis de propriedade intelectual.
            </p>
            <p className="mt-2">
              Seus dados financeiros pertencem a você. Concedemos a você uma licença limitada para usar o serviço.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Privacidade e Dados</h2>
            <p>
              O uso de dados pessoais é regido pela nossa Política de Privacidade. Garantimos que seus dados
              financeiros são criptografados e tratados com máxima segurança conforme a LGPD.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Limitação de Responsabilidade</h2>
            <p>
              O serviço é fornecido "como está". Não garantimos que será ininterrupto ou livre de erros.
              Não nos responsabilizamos por decisões financeiras tomadas com base nos dados do sistema.
            </p>
            <p className="mt-2">
              É sua responsabilidade manter backups de dados importantes e verificar a precisão das informações.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Modificações dos Termos</h2>
            <p>
              Podemos modificar estes termos a qualquer momento. Alterações significativas serão notificadas por
              email com 30 dias de antecedência. O uso continuado após alterações constitui aceitação.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Rescisão</h2>
            <p>
              Podemos suspender ou encerrar sua conta por violação destes termos ou por qualquer motivo, com ou sem
              aviso. Você pode encerrar sua conta a qualquer momento através das configurações.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. Lei Aplicável</h2>
            <p>
              Estes termos são regidos pelas leis da República Federativa do Brasil. Qualquer disputa será resolvida
              nos tribunais competentes do Brasil.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">12. Contato</h2>
            <p>
              Para questões sobre estes termos, entre em contato:
            </p>
            <p className="mt-2">
              Email: support@seudominio.com
            </p>
          </section>
        </div>
      </main>
      <FooterSection />
    </>
  );
}
