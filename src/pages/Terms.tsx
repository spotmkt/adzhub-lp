import { Helmet } from "react-helmet-async";
import { LandingNav } from "@/components/LandingNav";
import { Footer } from "@/components/Footer";

export default function Terms() {
  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Termos de Uso - AdzHub</title>
        <meta name="description" content="Termos de Uso da plataforma AdzHub. Condições gerais de uso dos nossos serviços." />
      </Helmet>

      <LandingNav />

      <main className="pt-[83px] py-16">
        <div className="max-w-3xl mx-auto px-6 pt-8">
          <article className="prose prose-lg max-w-none prose-headings:text-[#08080C] prose-p:text-[#6B7280] prose-li:text-[#6B7280] prose-strong:text-[#08080C]">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#08080C] mb-2">
              Termos de Uso
            </h1>
            <p className="text-sm text-[#6B7280] mb-10">Última atualização: Abril de 2026</p>

            <h2>1. Aceitação dos Termos</h2>
            <p>
              Ao acessar ou utilizar a plataforma AdzHub ("Plataforma"), você concorda com estes
              Termos de Uso. Se você não concordar com qualquer parte destes termos, não utilize
              nossos serviços.
            </p>

            <h2>2. Descrição do Serviço</h2>
            <p>
              A AdzHub é uma Plataforma de Inteligência em Marketing que oferece ferramentas de
              automação, inteligência artificial e metodologias aplicadas ao marketing digital para
              profissionais e empresas (PMEs). Os serviços incluem, mas não se limitam a:
            </p>
            <ul>
              <li>AdzChat — agentes de IA especializados em marketing</li>
              <li>Blog — criação e publicação de conteúdo com IA</li>
              <li>Módulos de automação e análise de dados</li>
              <li>Metodologia de marketing integrada (Supercérebro)</li>
            </ul>

            <h2>3. Cadastro e Conta</h2>
            <p>
              Para utilizar a Plataforma, você deve criar uma conta fornecendo informações
              verdadeiras, completas e atualizadas. Você é responsável por manter a
              confidencialidade de suas credenciais de acesso e por todas as atividades realizadas
              em sua conta.
            </p>

            <h2>4. Uso Aceitável</h2>
            <p>Ao utilizar a Plataforma, você concorda em:</p>
            <ul>
              <li>Não utilizar o serviço para fins ilegais ou não autorizados</li>
              <li>Não tentar acessar áreas restritas da Plataforma sem autorização</li>
              <li>Não reproduzir, duplicar, copiar ou revender qualquer parte do serviço</li>
              <li>
                Não utilizar os conteúdos gerados pela IA para disseminar desinformação ou conteúdo
                prejudicial
              </li>
              <li>Respeitar os direitos de propriedade intelectual de terceiros</li>
            </ul>

            <h2>5. Propriedade Intelectual</h2>
            <p>
              Todo o conteúdo, design, código, metodologias e tecnologias da Plataforma são de
              propriedade exclusiva da AdzHub ou de seus licenciadores. O conteúdo gerado pela IA
              a partir dos dados do usuário é de propriedade do usuário, sujeito às limitações da
              licença dos modelos de IA utilizados.
            </p>

            <h2>6. Planos e Pagamento</h2>
            <p>
              A AdzHub oferece planos gratuitos e pagos. Os valores, condições e funcionalidades de
              cada plano estão descritos na página de preços. A AdzHub reserva-se o direito de
              alterar os preços mediante aviso prévio de 30 dias.
            </p>

            <h2>7. Cancelamento</h2>
            <p>
              Você pode cancelar sua assinatura a qualquer momento. Após o cancelamento, o acesso
              às funcionalidades premium será mantido até o final do período já pago. Os dados
              gerados dentro da plataforma serão mantidos por 90 dias após o cancelamento, período
              durante o qual poderão ser exportados.
            </p>

            <h2>8. Limitação de Responsabilidade</h2>
            <p>
              A AdzHub não se responsabiliza por decisões de negócio tomadas com base nas
              recomendações da IA ou dos agentes especializados. Os conteúdos gerados pela IA são
              sugestões e devem ser revisados pelo usuário antes da publicação ou aplicação.
            </p>

            <h2>9. Disponibilidade do Serviço</h2>
            <p>
              A AdzHub se esforça para manter a Plataforma disponível 24 horas por dia, 7 dias por
              semana, mas não garante disponibilidade ininterrupta. Manutenções programadas serão
              comunicadas com antecedência.
            </p>

            <h2>10. Alterações nos Termos</h2>
            <p>
              A AdzHub pode atualizar estes Termos de Uso periodicamente. Alterações significativas
              serão comunicadas por e-mail ou através da Plataforma. O uso continuado após as
              alterações constitui aceitação dos novos termos.
            </p>

            <h2>11. Contato</h2>
            <p>
              Para dúvidas sobre estes Termos de Uso, entre em contato pelo e-mail{" "}
              <a href="mailto:contato@adzhub.com.br" className="text-[#37489d]">
                contato@adzhub.com.br
              </a>.
            </p>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
