import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { LandingNav } from "@/components/LandingNav";
import { Footer } from "@/components/Footer";
import {
  OPERATOR_ADDRESS,
  OPERATOR_CNPJ,
  OPERATOR_CONTACT_EMAIL,
  OPERATOR_DPO_EMAIL,
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
          <article className="prose prose-lg max-w-none prose-headings:text-[#08080C] prose-p:text-[#6B7280] prose-li:text-[#6B7280] prose-strong:text-[#08080C] prose-a:text-[#37489d]">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#08080C] mb-2">
              Termos de Uso
            </h1>
            <p className="text-sm text-[#6B7280] mb-6">Última atualização: abril de 2026</p>

            <p className="text-sm border border-[#37489d]/20 bg-[#37489d]/5 rounded-xl p-4 text-[#08080C] not-prose mb-10">
              <strong className="text-[#08080C]">Marca e operação:</strong> a plataforma <strong>{PRODUCT_BRAND}</strong>{" "}
              é operada por <strong>{OPERATOR_LEGAL_NAME}</strong>, CNPJ {OPERATOR_CNPJ}, sede em {OPERATOR_ADDRESS}. A
              marca {PRODUCT_BRAND} pode ser comercializada antes de existir pessoa jurídica com o mesmo nome; o que importa
              para transparência e revisão de apps é que o <strong>CNPJ e a razão social da operadora responsável</strong>{" "}
              coincidam com o cadastro do desenvolvedor e apareçam claramente aqui e na Política de Privacidade.
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
              A {PRODUCT_BRAND} oferece plataforma de agência de marketing digital com inteligência integrada, incluindo,
              conforme o plano ou produto contratado, recursos como agentes de IA (AdzChat), blog/conteúdo, automações,
              metodologias e{" "}
              <strong>integrações com contas Google e Meta</strong>, tais como: Google Ads, YouTube, Google Tag Manager,
              Google Analytics, Google Search Console, Perfil da Empresa no Google (Google Meu Negócio / Business Profile)
              e, na Meta, APIs Graph / Marketing para leitura e edição de campanhas e ativos de mídia que você autorizar. A
              disponibilidade exata de módulos e escopos pode variar; descrições comerciais no site ou no aplicativo
              prevalecem para fins ilustrativos até a contratação.
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
              suficiente para permitir que a {PRODUCT_BRAND} acesse, armazene em cache, processe e, quando aplicável,{" "}
              <strong>crie ou altere</strong> campanhas, tags, propriedades de analytics, dados do Search Console, fichas de
              negócio, canais do YouTube e demais recursos disponibilizados pelas APIs, estritamente para prestação dos
              Serviços. Você é responsável pelo cumprimento das políticas de anúncios, de dados e de marca de cada
              plataforma.
            </p>
            <p>
              A {PRODUCT_BRAND} <strong>não é afiliada</strong> ao Google, Meta, Facebook, Instagram, YouTube ou outras
              plataformas cujas APIs ou logins possam ser integrados. Funcionalidades que dependam de terceiros estão
              sujeitas às políticas, disponibilidade e alterações desses terceiros. Se um terceiro alterar APIs, preços ou
              termos de modo a impactar integrações, poderemos ajustar ou descontinuar recursos afetados para preservar a
              operação da Plataforma.
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
              licenciadores. Conteúdos que você insere permanece seu, na medida em que você detenha direitos sobre eles,
              concedendo à {PRODUCT_BRAND} licença necessária para hospedar, processar e exibir esse conteúdo para prestação dos
              Serviços. Saídas de modelos de IA podem estar sujeitas a termos de provedores de modelo; você deve revisar
              material gerado antes de uso público.
            </p>

            <h2>8. Planos e pagamento</h2>
            <p>
              Podem existir planos gratuitos e pagos. Preços e condições estão descritos na página de preços ou no fluxo de
              contratação. Alterações de preço para novas contratações ou renovações podem ser comunicadas com antecedência
              razoável, conforme aplicável.
            </p>

            <h2>9. Cancelamento e suspensão</h2>
            <p>
              Você pode solicitar cancelamento conforme opções disponíveis na Plataforma ou pelos canais de suporte. Após o
              cancelamento, funcionalidades pagas podem permanecer ativas até o fim do período já pago. Podemos suspender
              ou encerrar Conta em caso de violação destes Termos, fraude ou exigência legal.
            </p>
            <p>
              Retenção e exclusão de dados pessoais seguem a <Link to="/privacidade">Política de Privacidade</Link> e a
              legislação. Em regra, após o encerramento da conta, dados são mantidos por até <strong>90 (noventa) dias</strong>{" "}
              para exportação, resolução de pendências e cumprimento legal; findo esse prazo, promovemos eliminação ou
              anonimização, salvo base legal para conservação.
            </p>

            <h2>10. Limitação de responsabilidade</h2>
            <p>
              Os Serviços e sugestões de IA são ferramentas de apoio. Você permanece responsável por decisões de negócio,
              campanhas publicitárias e conformidade com leis aplicáveis (incluindo proteção de dados de terceiros que
              tratar na Plataforma). Na extensão máxima permitida pela lei, não nos responsabilizamos por lucros cessantes,
              danos indiretos ou resultados decorrentes do uso de integrações de terceiros ou indisponibilidade destes.
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
              Privacidade e dados pessoais: <a href={`mailto:${OPERATOR_DPO_EMAIL}`}>{OPERATOR_DPO_EMAIL}</a>
            </p>
            <p>Endereço: {OPERATOR_ADDRESS}</p>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
