import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { LandingNav } from "@/components/LandingNav";
import { Footer } from "@/components/Footer";
import {
  OPERATOR_ADDRESS,
  OPERATOR_CNPJ,
  OPERATOR_CONTACT_EMAIL,
  OPERATOR_LEGAL_NAME,
  PRODUCT_BRAND,
  SITE_ORIGIN,
} from "@/legal/operatorInfo";

export default function Terms() {
  const canonical = `${SITE_ORIGIN}/termos`;

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Termos de Uso - AdzHub</title>
        <meta
          name="description"
          content="Termos de Uso da plataforma AdzHub. Condições de cadastro, login social, integrações e uso dos serviços."
        />
        <link rel="canonical" href={canonical} />
      </Helmet>

      <LandingNav />

      <main className="pt-[83px] py-16">
        <div className="max-w-3xl mx-auto px-6 pt-8">
          <article className="prose prose-lg max-w-none prose-headings:text-[#08080C] prose-headings:font-bold prose-p:text-[#6B7280] prose-li:text-[#6B7280] prose-strong:text-[#08080C] prose-a:text-[#37489d]">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#08080C] mb-2">
              Termos de Uso
            </h1>
            <p className="text-sm text-[#6B7280] mb-6">Última atualização: abril de 2026</p>

            <p className="text-sm border border-[#37489d]/20 bg-[#37489d]/5 rounded-xl p-4 text-[#08080C] not-prose mb-10">
              <strong className="text-[#08080C]">Marca e operação:</strong> a plataforma <strong>{PRODUCT_BRAND}</strong>{" "}
              é desenvolvida e operada por <strong>{OPERATOR_LEGAL_NAME}</strong>, CNPJ {OPERATOR_CNPJ}, sede em{" "}
              {OPERATOR_ADDRESS}. O CNPJ e a razão social acima são os dados da responsável legal pelos serviços e
              aparecem também na <Link to="/privacidade">Política de Privacidade</Link>.
            </p>

            <h2>1. Aceitação e documentos relacionados</h2>
            <p>
              Estes Termos de Uso regulam o acesso e o uso do site, da área logada e dos serviços oferecidos sob a marca
              {PRODUCT_BRAND} (“Plataforma”, “Serviços”). Ao criar conta, clicar em botões de cadastro ou login (incluindo{" "}
              <strong>Entrar com Google</strong>, <strong>Facebook</strong> ou <strong>Instagram</strong>, quando
              disponíveis), ou utilizar os Serviços de qualquer forma, você declara ter lido e concordado com estes Termos
              e com a nossa{" "}
              <Link to="/privacidade">Política de Privacidade</Link>, formando um conjunto de regras vinculante.
            </p>
            <p>
              Você declara ter <strong>18 anos ou mais</strong>. Se atuar em nome de uma empresa, declara ter poderes para
              vinculá-la. Se não concordar, não utilize a Plataforma.
            </p>
            <p>
              O uso de recursos Google pode implicar aceitação dos{" "}
              <a href="https://policies.google.com/terms?hl=pt-BR" target="_blank" rel="noopener noreferrer">
                Termos de Serviço do Google
              </a>{" "}
              e da{" "}
              <a href="https://policies.google.com/privacy?hl=pt-BR" target="_blank" rel="noopener noreferrer">
                Política de Privacidade do Google
              </a>
              . Quando houver incorporação ou uso de funcionalidades do YouTube, aplicam-se também os{" "}
              <a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener noreferrer">
                Termos de Serviço do YouTube
              </a>
              .
            </p>
            <p>
              O uso e a transferência de informações recebidas das APIs do Google para qualquer outro aplicativo seguirão a{" "}
              <a
                href="https://developers.google.com/terms/api-services-user-data-policy"
                target="_blank"
                rel="noopener noreferrer"
              >
                Política de Dados do Usuário dos Serviços de API do Google
              </a>
              , incluindo os requisitos de <strong>uso limitado</strong>, quando aplicável.
            </p>

            <h2>2. Definições</h2>
            <p>
              <strong>{PRODUCT_BRAND} / nós:</strong> {OPERATOR_LEGAL_NAME} na qualidade de operadora da marca {PRODUCT_BRAND}.
            </p>
            <p>
              <strong>Plataforma:</strong> propriedade digital que inclui o site público (por exemplo, {SITE_ORIGIN}),
              ambiente em <a href="https://app.adzhub.com.br">app.adzhub.com.br</a> e recursos associados.
            </p>
            <p>
              <strong>Usuário / você:</strong> pessoa que acessa ou utiliza os Serviços.
            </p>
            <p>
              <strong>Conta:</strong> credenciais e perfil que permitem acesso autenticado.
            </p>
            <p>
              <strong>Terceiros:</strong> provedores independentes (Google, Meta, redes sociais, gateways de pagamento etc.)
              com termos e políticas próprios.
            </p>

            <h2>3. Descrição dos Serviços</h2>
            <p>
              A {PRODUCT_BRAND} é uma plataforma de marketing digital com IA integrada. Conforme o plano, podem estar
              disponíveis recursos como agentes (AdzChat), conteúdo, automações e{" "}
              <strong>conexão com contas Google e Meta</strong> para leitura de dados de Google Ads, Meta Ads, YouTube
              Analytics, Google Tag Manager, Google Analytics (GA4), Google Search Console e Google Perfil da Empresa,
              com foco em relatórios e dashboards. Módulos e escopos exatos seguem o que estiver contratado e habilitado no
              aplicativo e na tela de consentimento de cada provedor.
            </p>

            <h2>4. Cadastro, conta e login social</h2>
            <p>
              Para usar partes dos Serviços é necessário criar Conta com dados verídicos e mantê-los atualizados. Você é
              responsável pela confidencialidade das credenciais e por toda atividade na Conta.
            </p>
            <p>
              Se optar por login com <strong>Google</strong> ou <strong>Meta</strong>, autoriza o compartilhamento dos dados
              permitidos na tela de consentimento desses provedores, conforme descrito na{" "}
              <Link to="/privacidade">Política de Privacidade</Link>. Podemos vincular sua Conta {PRODUCT_BRAND} ao
              identificador fornecido pelo provedor.
            </p>

            <h2>5. Integrações Google e Meta — sua autorização e responsabilidade</h2>
            <p>
              Ao conectar contas Google ou Meta, você declara que é titular ou possui autorização legal e contratual
              suficiente para permitir que a {PRODUCT_BRAND} <strong>leia, armazene em cache e processe</strong> os dados
              permitidos nas telas de consentimento — em geral para relatórios e dashboards —, estritamente para prestação
              dos Serviços. Se, no futuro, forem oferecidas ações de criação ou edição nas plataformas de terceiros, isso
              dependerá de novos escopos e de consentimento explícito. Você é responsável pelo cumprimento das políticas de
              anúncios, de dados e de marca de cada plataforma.
            </p>
            <p>
              A plataforma {PRODUCT_BRAND} integra-se com serviços de terceiros (Google, Meta etc.).{" "}
              <strong>Não temos controle sobre a disponibilidade dessas APIs</strong> e não nos responsabilizamos por
              mudanças de políticas ou interrupções nos serviços prestados por essas empresas. Se um terceiro alterar APIs
              ou termos de forma a impactar integrações, poderemos ajustar ou descontinuar recursos afetados.
            </p>
            <p>
              O uso e a transferência de informações recebidas das APIs do Google para qualquer outro aplicativo seguirão a{" "}
              <a
                href="https://developers.google.com/terms/api-services-user-data-policy"
                target="_blank"
                rel="noopener noreferrer"
              >
                Política de Dados do Usuário dos Serviços de API do Google
              </a>
              , incluindo os requisitos de <strong>uso limitado</strong>, conforme detalhado na{" "}
              <Link to="/privacidade">Política de Privacidade</Link>.
            </p>

            <h2>6. Uso aceitável</h2>
            <p>Você concorda em não:</p>
            <ul>
              <li>Utilizar os Serviços para fins ilegais, fraudulentos ou não autorizados;</li>
              <li>Tentar obter acesso não autorizado a sistemas, dados de outros usuários ou áreas restritas;</li>
              <li>Reproduzir, copiar ou revender a Plataforma sem autorização;</li>
              <li>
                Utilizar IA ou conteúdos gerados para disseminar desinformação, violar direitos de terceiros ou praticar
                spam;
              </li>
              <li>Interferir na segurança ou no desempenho da Plataforma (incluindo testes de carga não autorizados).</li>
            </ul>

            <h2>7. Propriedade intelectual</h2>
            <p>
              Software, design, marcas, documentação e demais materiais da Plataforma são de titularidade da operadora ou
              de licenciadores. Conteúdos que você insere permanecem seus, na medida em que você detenha direitos sobre
              eles, com licença à {PRODUCT_BRAND} apenas para hospedar, processar e exibir esse conteúdo na prestação dos
              Serviços. O {PRODUCT_BRAND} <strong>não reivindica propriedade</strong> sobre textos, peças ou estratégias
              gerados pela IA para você; cabe a você revisar e validar a precisão de qualquer conteúdo antes de publicar
              ou usar em campanhas.
            </p>

            <h2>8. Planos e pagamento</h2>
            <p>
              Podem existir planos gratuitos e pagos. Preços e condições estão descritos na página de preços ou no fluxo de
              contratação. Alterações de preço para novas contratações ou renovações podem ser comunicadas com antecedência
              razoável, conforme aplicável.
            </p>

            <h2>9. Cancelamento e suspensão</h2>
            <p>
              Você pode solicitar cancelamento conforme as opções na Plataforma ou pelos canais de suporte. Quando você
              encerra a assinatura ou a conta, <strong>não há novas cobranças</strong> após o processamento do pedido;
              o que já estiver pago no ciclo vigente segue as regras do plano (acesso até o fim do período contratado,
              quando for o caso). Podemos suspender ou encerrar a Conta em caso de violação destes Termos, fraude ou
              exigência legal.
            </p>
            <p>
              Retenção e exclusão de dados seguem a <Link to="/privacidade">Política de Privacidade</Link> e a legislação.
              Os <strong>90 (noventa) dias</strong> após o fim do uso são, em regra, um prazo de carência para você exportar
              dados, reativar o serviço ou concluir pendências — não uma retenção “punitiva”. Findo esse prazo, promovemos
              eliminação ou anonimização, salvo base legal para conservação. Se você pedir exclusão de dados com fundamento
              na LGPD, aplicamos o prazo previsto na Política (em geral imediato após validação do pedido, ressalvadas
              obrigações legais de guarda).
            </p>
            <p>
              <strong>
                Para excluir seus dados e sua conta definitivamente, acesse as configurações do seu perfil na plataforma ou
                envie um e-mail para{" "}
              </strong>
              <a href={`mailto:${OPERATOR_CONTACT_EMAIL}`}>
                <strong>{OPERATOR_CONTACT_EMAIL}</strong>
              </a>
              .
            </p>

            <h2>10. Limitação de responsabilidade</h2>
            <p>
              Os Serviços e sugestões de IA são ferramentas de apoio. Você permanece responsável por decisões de negócio,
              campanhas publicitárias e conformidade com leis aplicáveis (incluindo proteção de dados de terceiros que
              tratar na Plataforma). Conforme permitido pela legislação brasileira, não nos responsabilizamos por lucros
              cessantes, danos indiretos ou resultados decorrentes do uso de integrações de terceiros ou da
              indisponibilidade destes.
            </p>

            <h2>11. Disponibilidade</h2>
            <p>
              Empregamos esforços razoáveis para manter a Plataforma disponível, sem garantia de operação ininterrupta.
              Manutenções programadas poderão ser comunicadas com antecedência quando viável.
            </p>

            <h2>12. Alterações dos Termos</h2>
            <p>
              Podemos alterar estes Termos; a data no topo será atualizada. Alterações materiais podem ser comunicadas por
              e-mail ou aviso na Plataforma. O uso continuado após a vigência pode constituir aceitação. Se discordar,
              encerre a Conta e interrompa o uso.
            </p>

            <h2>13. Lei e foro</h2>
            <p>
              Estes Termos são regidos pelas leis da República Federativa do Brasil. Fica eleito o foro da comarca do
              domicílio da operadora, salvo disposição legal imperativa em contrário em favor do consumidor.
            </p>

            <h2>14. Contato</h2>
            <p>
              Dúvidas sobre estes Termos:{" "}
              <a href={`mailto:${OPERATOR_CONTACT_EMAIL}`}>{OPERATOR_CONTACT_EMAIL}</a>
            </p>
            <p>
              Privacidade e dados pessoais:{" "}
              <a href={`mailto:${OPERATOR_CONTACT_EMAIL}`}>{OPERATOR_CONTACT_EMAIL}</a>
            </p>
            <p>Endereço: {OPERATOR_ADDRESS}</p>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
