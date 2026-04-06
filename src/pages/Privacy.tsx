import { Helmet } from "react-helmet-async";
import { LandingNav } from "@/components/LandingNav";
import { Footer } from "@/components/Footer";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Política de Privacidade - AdzHub</title>
        <meta name="description" content="Política de Privacidade da AdzHub. Saiba como coletamos, usamos e protegemos seus dados." />
      </Helmet>

      <LandingNav />

      <main className="pt-[83px] py-16">
        <div className="max-w-3xl mx-auto px-6 pt-8">
          <article className="prose prose-lg max-w-none prose-headings:text-[#08080C] prose-p:text-[#6B7280] prose-li:text-[#6B7280] prose-strong:text-[#08080C]">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#08080C] mb-2">
              Política de Privacidade
            </h1>
            <p className="text-sm text-[#6B7280] mb-10">Última atualização: Abril de 2026</p>

            <h2>1. Introdução</h2>
            <p>
              A AdzHub ("nós", "nosso") está comprometida em proteger a privacidade dos nossos
              usuários. Esta Política de Privacidade explica como coletamos, usamos, armazenamos e
              protegemos suas informações pessoais em conformidade com a Lei Geral de Proteção de
              Dados (LGPD — Lei nº 13.709/2018).
            </p>

            <h2>2. Dados que Coletamos</h2>
            <p>Coletamos os seguintes tipos de dados:</p>
            <ul>
              <li>
                <strong>Dados de cadastro:</strong> nome, e-mail, telefone e informações da empresa
              </li>
              <li>
                <strong>Dados de uso:</strong> interações com a Plataforma, funcionalidades utilizadas, logs de acesso
              </li>
              <li>
                <strong>Dados de conteúdo:</strong> textos, briefings, estratégias e informações de negócio fornecidos aos agentes de IA (Supercérebro)
              </li>
              <li>
                <strong>Dados de pagamento:</strong> processados por parceiros de pagamento certificados (não armazenamos dados de cartão)
              </li>
              <li>
                <strong>Dados técnicos:</strong> endereço IP, tipo de navegador, sistema operacional, cookies
              </li>
            </ul>

            <h2>3. Como Usamos seus Dados</h2>
            <p>Utilizamos seus dados para:</p>
            <ul>
              <li>Fornecer e melhorar os serviços da Plataforma</li>
              <li>
                Personalizar a experiência com IA contextual (Supercérebro) — seus dados de negócio alimentam os agentes para oferecer recomendações mais relevantes
              </li>
              <li>Comunicações sobre atualizações, novos recursos e suporte</li>
              <li>Análises internas para aprimoramento da metodologia e dos algoritmos</li>
              <li>Cumprimento de obrigações legais</li>
            </ul>

            <h2>4. Compartilhamento de Dados</h2>
            <p>Não vendemos seus dados pessoais. Podemos compartilhar dados com:</p>
            <ul>
              <li>
                <strong>Provedores de IA:</strong> dados de contexto são enviados a provedores de modelos de linguagem para processamento, de forma anonimizada quando possível
              </li>
              <li>
                <strong>Provedores de infraestrutura:</strong> serviços de hospedagem e banco de dados (Supabase, Vercel)
              </li>
              <li>
                <strong>Processadores de pagamento:</strong> para viabilizar cobranças
              </li>
              <li>
                <strong>Autoridades legais:</strong> quando exigido por lei ou ordem judicial
              </li>
            </ul>

            <h2>5. Armazenamento e Segurança</h2>
            <p>
              Seus dados são armazenados em servidores seguros com criptografia em trânsito
              (TLS/SSL) e em repouso. Implementamos medidas técnicas e organizacionais para
              proteger contra acesso não autorizado, alteração, divulgação ou destruição de dados.
            </p>

            <h2>6. Seus Direitos (LGPD)</h2>
            <p>Conforme a LGPD, você tem direito a:</p>
            <ul>
              <li>Acessar seus dados pessoais</li>
              <li>Corrigir dados incompletos ou desatualizados</li>
              <li>Solicitar a exclusão de dados pessoais</li>
              <li>Revogar o consentimento para tratamento de dados</li>
              <li>Solicitar a portabilidade dos dados</li>
              <li>Ser informado sobre o compartilhamento de dados</li>
            </ul>
            <p>
              Para exercer seus direitos, envie um e-mail para{" "}
              <a href="mailto:privacidade@adzhub.com.br" className="text-[#37489d]">
                privacidade@adzhub.com.br
              </a>.
            </p>

            <h2>7. Cookies</h2>
            <p>
              Utilizamos cookies essenciais para o funcionamento da Plataforma e cookies analíticos
              para entender o uso do serviço. Você pode gerenciar as preferências de cookies
              através do seu navegador.
            </p>

            <h2>8. Retenção de Dados</h2>
            <p>
              Seus dados são mantidos enquanto sua conta estiver ativa ou conforme necessário para
              prestação dos serviços. Após o cancelamento, os dados são retidos por 90 dias e
              depois permanentemente excluídos, salvo obrigação legal de retenção.
            </p>

            <h2>9. Menores de Idade</h2>
            <p>
              A Plataforma não é destinada a menores de 18 anos. Não coletamos intencionalmente
              dados de menores de idade.
            </p>

            <h2>10. Alterações nesta Política</h2>
            <p>
              Esta Política de Privacidade pode ser atualizada periodicamente. Alterações
              significativas serão comunicadas por e-mail ou através da Plataforma.
            </p>

            <h2>11. Contato do Encarregado (DPO)</h2>
            <p>
              Para questões relacionadas à proteção de dados, entre em contato com nosso
              Encarregado de Proteção de Dados pelo e-mail{" "}
              <a href="mailto:privacidade@adzhub.com.br" className="text-[#37489d]">
                privacidade@adzhub.com.br
              </a>.
            </p>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
