'use client';

import Nav from "@/components/shared/nav";
import FooterSection from "@/components/footer";
import { Mail, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
  return (
    <>
      <Nav />
      <main className="container mx-auto max-w-4xl px-4 md:px-6 py-16">
        <h1 className="text-4xl font-bold mb-8">Contato</h1>

        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p className="text-muted-foreground mb-8">
            Entre em contato conosco. Estamos aqui para ajudar.
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Informações de Contato</h2>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 mt-1 text-primary" />
                <div>
                  <h3 className="font-semibold">Email de Suporte</h3>
                  <p className="text-muted-foreground">support@drivefinance.com</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Respondemos em até 24 horas úteis
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 mt-1 text-primary" />
                <div>
                  <h3 className="font-semibold">Privacidade e Dados (DPO)</h3>
                  <p className="text-muted-foreground">privacy@drivefinance.com</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Para questões relacionadas à LGPD e proteção de dados
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 mt-1 text-primary" />
                <div>
                  <h3 className="font-semibold">Endereço</h3>
                  <p className="text-muted-foreground">
                    São Paulo, SP<br />
                    Brasil
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Horário de Atendimento</h2>
            <p className="text-muted-foreground">
              Segunda a Sexta: 9h às 18h (horário de Brasília)<br />
              Sábado, Domingo e Feriados: Fechado
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Emails recebidos fora do horário comercial serão respondidos no próximo dia útil.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Perguntas Frequentes</h2>
            <p className="text-muted-foreground">
              Antes de entrar em contato, confira nossa{" "}
              <a href="/#faq" className="text-primary hover:underline">
                página de Perguntas Frequentes
              </a>
              . Muitas dúvidas comuns já estão respondidas lá.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Reportar Bug ou Problema</h2>
            <p className="text-muted-foreground">
              Encontrou um bug ou problema técnico? Envie um email para{" "}
              <a href="mailto:support@drivefinance.com" className="text-primary hover:underline">
                support@drivefinance.com
              </a>{" "}
              com uma descrição detalhada do problema, incluindo:
            </p>
            <ul className="list-disc pl-6 mt-2 text-muted-foreground">
              <li>Navegador e versão que você está usando</li>
              <li>Passos para reproduzir o problema</li>
              <li>Screenshots, se possível</li>
              <li>Mensagens de erro exibidas</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Feedback e Sugestões</h2>
            <p className="text-muted-foreground">
              Sua opinião é muito importante para nós! Se você tem sugestões de melhorias ou novos
              recursos, envie para{" "}
              <a href="mailto:support@drivefinance.com" className="text-primary hover:underline">
                support@drivefinance.com
              </a>
              .
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Empresarial</h2>
            <p className="text-muted-foreground">
              <strong>Razão Social:</strong> DriveFinance Tecnologia Ltda<br />
              <strong>CNPJ:</strong> [A ser definido]
            </p>
          </section>
        </div>
      </main>
      <FooterSection />
    </>
  );
}
