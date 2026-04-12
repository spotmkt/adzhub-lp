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

export default function Privacy() {
  const canonical = `${SITE_ORIGIN}/privacidade`;

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Política de Privacidade - AdzHub</title>
        <meta
          name="description"
          content="Política de Privacidade da AdzHub. Como coletamos, usamos, compartilhamos e protegemos dados, inclusive em logins Google e Meta."
        />
        <link rel="canonical" href={canonical} />
      </Helmet>

      <LandingNav />

      <main className="pt-[83px] py-16">
        <div className="max-w-3xl mx-auto px-6 pt-8">
          <article className="prose prose-lg max-w-none prose-headings:text-[#08080C] prose-p:text-[#6B7280] prose-li:text-[#6B7280] prose-strong:text-[#08080C] prose-a:text-[#37489d]">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#08080C] mb-2">
              Política de Privacidade
            </h1>
            <p className="text-sm text-[#6B7280] mb-6">Última atualização: abril de 2026</p>

            <p className="text-sm border border-[#37489d]/20 bg-[#37489d]/5 rounded-xl p-4 text-[#08080C] not-prose mb-10">
              <strong className="text-[#08080C]">Marca e operação:</strong> a plataforma de software identificada como{" "}
              <strong>{PRODUCT_BRAND}</strong> é operada pela pessoa jurídica <strong>{OPERATOR_LEGAL_NAME}</strong>,
              inscrita no CNPJ sob o nº {OPERATOR_CNPJ}, com sede em {OPERATOR_ADDRESS}. Até a constituição de pessoa
              jurídica específica para a marca {PRODUCT_BRAND}, a responsabilidade contratual e de proteção de dados
              perante esta Política recai sobre essa operadora (por exemplo, grupo empresarial SPOT MKT).
            </p>

            <h2>1. O que você precisa saber antes de ler</h2>
            <p>
              A {PRODUCT_BRAND}, operada por {OPERATOR_LEGAL_NAME}, está comprometida com a privacidade e com o tratamento
              lawful de dados pessoais, em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 — LGPD).
              Esta Política explica como tratamos dados quando você acessa o site, cria conta, utiliza a plataforma em{" "}
              <a href="https://app.adzhub.com.br" target="_blank" rel="noopener noreferrer">
                app.adzhub.com.br
              </a>{" "}
              ou interage com recursos que dependam de terceiros (por exemplo, login com Google ou Meta).
            </p>
            <p>
              Ao utilizar os serviços, você declara que leu esta Política e os{" "}
              <Link to="/termos">Termos de Uso</Link>. Se não concordar, não utilize a Plataforma.
            </p>
            <p>
              Quando utilizamos ou integrarmos serviços Google sujeitos a termos próprios (por exemplo, login, APIs ou
              incorporação de conteúdo), aplicam-se também os{" "}
              <a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener noreferrer">
                Termos de Serviço do YouTube
              </a>{" "}
              (se aplicável) e a{" "}
              <a href="https://policies.google.com/privacy?hl=pt-BR" target="_blank" rel="noopener noreferrer">
                Política de Privacidade do Google
              </a>
              , na medida em que forem relevantes para o recurso utilizado.
            </p>
            <p>
              O uso de informações recebidas das APIs do Google por este aplicativo seguirá a{" "}
              <a
                href="https://developers.google.com/terms/api-services-user-data-policy"
                target="_blank"
                rel="noopener noreferrer"
              >
                Política de Dados do Usuário dos Serviços de API do Google
              </a>
              , incluindo os requisitos de <strong>uso limitado</strong> (veja a seção 4 abaixo).
            </p>

            <h2>2. Definições</h2>
            <p>
              <strong>Dados pessoais:</strong> informação relacionada a pessoa natural identificada ou identificável.
            </p>
            <p>
              <strong>Titular:</strong> pessoa natural a quem se referem os dados pessoais.
            </p>
            <p>
              <strong>Tratamento:</strong> toda operação com dados pessoais, como coleta, armazenamento, uso,
              compartilhamento e eliminação.
            </p>
            <p>
              <strong>Plataforma:</strong> site, aplicativos e serviços oferecidos sob a marca {PRODUCT_BRAND}, incluindo o
              ambiente logado em app.adzhub.com.br e subdomínios associados.
            </p>
            <p>
              <strong>Provedores / Terceiros:</strong> empresas que nos auxiliam na operação (hospedagem, autenticação,
              pagamento, IA, análise etc.), sempre contratualmente ou conforme base legal aplicável.
            </p>

            <h2>3. Quais dados coletamos</h2>
            <p>Dependendo de como você utiliza a {PRODUCT_BRAND}, podemos tratar:</p>
            <ul>
              <li>
                <strong>Dados de cadastro e conta:</strong> nome, e-mail, telefone, cargo, nome da empresa, senha
                (armazenada de forma segura — normalmente com hash), preferências de conta.
              </li>
              <li>
                <strong>Dados de login social (Google):</strong> quando você escolhe “Entrar com Google”, recebemos
                informações permitidas pelo provedor (por exemplo, identificador da conta Google, nome, e-mail e, se
                disponível, foto de perfil), conforme as permissões exibidas na tela de consentimento do Google.
              </li>
              <li>
                <strong>Dados de login social (Meta — Facebook / Instagram, quando disponível):</strong> quando você
                utiliza login ou conexões oferecidas pela Meta, recebemos os dados autorizados na permissão do
                aplicativo (por exemplo, identificador, nome, e-mail), conforme exibido no fluxo de permissões da Meta.
              </li>
              <li>
                <strong>Dados de uso e técnicos:</strong> logs de acesso, endereço IP, tipo de navegador, dispositivo,
                páginas ou telas acessadas, data/hora, identificadores de sessão e cookies ou tecnologias similares.
              </li>
              <li>
                <strong>Dados de conteúdo e operação:</strong> textos, briefings, estratégias, arquivos e outras
                informações que você insere na Plataforma para uso dos recursos (incluindo funcionalidades com IA).
              </li>
              <li>
                <strong>Dados de pagamento:</strong> dados financeiros necessários à cobrança são tratados em grande parte
                por processadores de pagamento certificados; não armazenamos número completo de cartão em nossos
                servidores.
              </li>
            </ul>

            <h2>4. Integrações Google, YouTube e Meta (contas que você conecta)</h2>
            <p>
              Quando você autoriza na tela de consentimento do Google ou da Meta, a Plataforma pode acessar — conforme os
              escopos exibidos e aceitos por você — dados das contas e propriedades vinculadas, para{" "}
              <strong>leitura e, onde aplicável, criação/edição</strong> de recursos de marketing e mídia, sempre no
              limite necessário à funcionalidade contratada. Isso inclui, de forma exemplificativa:
            </p>
            <ul>
              <li>
                <strong>Google Ads API:</strong> contas, campanhas, grupos de anúncios, anúncios, palavras-chave,
                orçamentos, extensões, públicos, conversões e relatórios de desempenho, para gestão e otimização de mídia
                paga no ecossistema Google.
              </li>
              <li>
                <strong>YouTube (APIs / escopos relacionados ao YouTube):</strong> canais, vídeos, métricas e recursos
                associados que você autorizar, para relatórios, publicação ou gestão conforme disponível na Plataforma.
              </li>
              <li>
                <strong>Google Tag Manager (GTM):</strong> contêineres, tags, acionadores e variáveis, para leitura e
                configuração de medição e disparo de tags conforme sua autorização.
              </li>
              <li>
                <strong>Google Analytics (GA4 / Admin / Reporting):</strong> propriedades, fluxos de dados, definições,
                audiências e relatórios de uso e conversão, para análise de desempenho e suporte à tomada de decisão.
              </li>
              <li>
                <strong>Google Search Console:</strong> propriedades, URLs, desempenho de busca, cobertura e recursos
                correlatos que a API permitir, para SEO e monitoramento orgânico.
              </li>
              <li>
                <strong>Google Meu Negócio / Perfil da Empresa no Google (Business Profile / GMN):</strong> fichas de
                estabelecimento, informações de negócio, avaliações e demais dados disponibilizados pela API, para gestão
                de presença local, conforme escopos concedidos.
              </li>
              <li>
                <strong>Meta (API Graph / Marketing API):</strong> contas de anúncios, campanhas, conjuntos de anúncios,
                anúncios, criativos, orçamentos, públicos e métricas de desempenho, para leitura e edição de campanhas nas
                plataformas Meta que você conectar (por exemplo, Facebook e Instagram Ads), nos limites dos escopos
                aprovados para o aplicativo.
              </li>
            </ul>
            <p>
              Os <strong>escopos OAuth exatos</strong> (strings técnicas) solicitados pelo aplicativo podem variar conforme
              a evolução do produto e as APIs; a lista completa e atualizada é sempre a exibida na tela de permissão do
              Google ou da Meta no momento da conexão. Revogar o acesso nas configurações da sua conta Google/Meta
              interrompe novas coletas via essa integração.
            </p>

            <h3>4.1. Uso limitado dos dados do Google (API Services User Data Policy)</h3>
            <p>
              Quando a {PRODUCT_BRAND} acessa dados de usuários por meio das APIs Google, o tratamento observa a{" "}
              <a
                href="https://developers.google.com/terms/api-services-user-data-policy"
                target="_blank"
                rel="noopener noreferrer"
              >
                Política de Dados do Usuário dos Serviços de API do Google
              </a>
              , em especial o regime de <strong>uso limitado</strong>. Em síntese, utilizamos esses dados somente para:
            </p>
            <ul>
              <li>Fornecer as funcionalidades da Plataforma que você solicitou ou contratou;</li>
              <li>Operar melhorias de segurança, estabilidade e prevenção de abuso do serviço;</li>
              <li>Cumprir obrigações legais ou regulatórias aplicáveis.</li>
            </ul>
            <p>
              <strong>Não vendemos</strong> dados pessoais obtidos via APIs Google.{" "}
              <strong>Não utilizamos</strong> esses dados para treinar modelos de inteligência artificial ou de machine
              learning de propósito geral não relacionado à prestação do serviço {PRODUCT_BRAND}.{" "}
              <strong>Não utilizamos</strong> dados obtidos das APIs Google para veicular anúncios personalizados de
              terceiros fora do escopo da gestão de mídia que <strong>você</strong> instrui na própria conta Google/Meta
              conectada.
            </p>

            <h3>4.2. Dados da Meta</h3>
            <p>
              Dados obtidos via Meta são tratados para as mesmas finalidades descritas acima (gestão de campanhas,
              relatórios e operação da Plataforma), em conformidade com esta Política, com os{" "}
              <Link to="/termos">Termos de Uso</Link> e com as políticas da Meta aplicáveis ao desenvolvedor e ao app.
            </p>

            <h2>5. De quem são os dados</h2>
            <p>
              Em regra, tratamos dados do usuário que se cadastra ou utiliza a Plataforma. Se você utiliza a {PRODUCT_BRAND}{" "}
              em nome de uma empresa, poderemos tratar seus dados profissionais e, eventualmente, dados de terceiros que
              você inserir (por exemplo, contatos de clientes). Nesse caso, você deve garantir que possui base legal para
              compartilhar esses dados conosco.
            </p>

            <h2>6. Como coletamos</h2>
            <ul>
              <li>Diretamente, quando você preenche formulários, cria conta ou fala com o suporte;</li>
              <li>
                Automaticamente, quando você navega ou usa a Plataforma (cookies, logs, ferramentas de segurança e
                desempenho);
              </li>
              <li>
                Por meio de provedores de login (Google, Meta), quando você autoriza explicitamente essa forma de
                autenticação;
              </li>
              <li>
                Por integrações que você conectar voluntariamente (por exemplo, contas de anúncios ou outras APIs), quando
                disponíveis nos serviços.
              </li>
            </ul>

            <h2>7. Base legal (LGPD)</h2>
            <p>Tratamos dados pessoais com base em uma ou mais hipóteses legais, entre as quais:</p>
            <ul>
              <li>
                <strong>Execução de contrato ou procedimentos preliminares:</strong> para criar conta, autenticar,
                disponibilizar funcionalidades contratadas e suporte.
              </li>
              <li>
                <strong>Legítimo interesse:</strong> para melhorar segurança, prevenir fraudes, analisar uso agregado da
                Plataforma e manter a qualidade do serviço, observando seus direitos e expectativas.
              </li>
              <li>
                <strong>Consentimento:</strong> quando exigido para determinadas comunicações de marketing ou cookies não
                essenciais, ou quando o provedor de login exigir consentimento específico.
              </li>
              <li>
                <strong>Obrigação legal ou regulatória:</strong> para cumprir leis, regulamentos ou ordens competentes.
              </li>
            </ul>

            <h2>8. Controladora e operadora</h2>
            <p>
              A {OPERATOR_LEGAL_NAME} atua predominantemente como <strong>controladora</strong> dos dados dos usuários da
              {PRODUCT_BRAND}. Em cenários em que a Plataforma processe dados pessoais <strong>em nome e sob instruções</strong> do
              cliente (por exemplo, dados de terceiros que o cliente armazena para sua operação de marketing), o cliente
              pode ser controlador e nós operadores para esse tratamento específico, conforme contrato e legislação.
            </p>

            <h2>9. Com quem compartilhamos</h2>
            <p>
              Não vendemos dados pessoais. Podemos compartilhar com categorias de destinatários, sempre com base legal e
              contratos adequados quando necessário:
            </p>
            <ul>
              <li>
                <strong>Provedores de infraestrutura e hospedagem</strong> (por exemplo, serviços de nuvem e banco de
                dados);
              </li>
              <li>
                <strong>Provedores de inteligência artificial e processamento de linguagem</strong>, para executar
                funcionalidades que você solicita, com salvaguardas contratuais e minimização de dados quando possível;
              </li>
              <li>
                <strong>Google e Meta</strong>, quando você utiliza login ou integrações desses ecossistemas — cada um
                permanece responsável por seu próprio tratamento conforme suas políticas;
              </li>
              <li>
                <strong>Processadores de pagamento e antifraude</strong>;
              </li>
              <li>
                <strong>Autoridades públicas</strong>, quando houver obrigação legal ou ordem válida.
              </li>
            </ul>
            <p>
              Recomendamos a leitura das políticas de privacidade do{" "}
              <a href="https://policies.google.com/privacy?hl=pt-BR" target="_blank" rel="noopener noreferrer">
                Google
              </a>{" "}
              e da{" "}
              <a href="https://www.facebook.com/privacy/policy" target="_blank" rel="noopener noreferrer">
                Meta
              </a>{" "}
              para entender o tratamento feito por eles no uso das contas de login.
            </p>

            <h2>10. Transferência internacional de dados</h2>
            <p>
              Alguns provedores podem processar dados em servidores fora do Brasil. Nesses casos, adotamos cláusulas
              contratuais e medidas reconhecidas pela LGPD quando aplicável, ou outra base legal cabível, e avaliamos o
              nível de proteção oferecido.
            </p>

            <h2>11. Retenção</h2>
            <p>
              Mantemos dados pelo tempo necessário para cumprir as finalidades descritas, respeitar prazos legais e
              resolver disputas. Após o encerramento da conta, em regra mantemos dados por até{" "}
              <strong>90 (noventa) dias</strong>, alinhado aos <Link to="/termos">Termos de Uso</Link>, para permitir
              exportação, suporte e obrigações legais; em seguida eliminamos ou anonimizamos, salvo quando a lei exigir
              conservação por prazo superior.
            </p>

            <h2>12. Cookies e tecnologias similares</h2>
            <p>
              Utilizamos cookies e tecnologias similares essenciais à sessão, segurança e funcionamento do site/aplicação.
              <strong> Não utilizamos Google Analytics (gtag.js) nem o widget reCAPTCHA do Google apenas para rastrear
              visitantes do site institucional</strong> — quando você vê dados do Google Analytics ou de tags, isso ocorre
              porque <strong>você conectou</strong> a respectiva conta ou propriedade à Plataforma, sujeito aos escopos
              OAuth que aprovou. Você pode gerenciar cookies no navegador. Links úteis:
            </p>
            <ul>
              <li>
                <a href="https://support.google.com/chrome/answer/95647?hl=pt-BR" target="_blank" rel="noopener noreferrer">
                  Google Chrome
                </a>
              </li>
              <li>
                <a
                  href="https://support.mozilla.org/pt-BR/kb/desative-cookies-terceiros-impedir-rastreamento"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Mozilla Firefox
                </a>
              </li>
              <li>
                <a href="https://support.apple.com/pt-br/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer">
                  Safari
                </a>
              </li>
              <li>
                <a
                  href="https://support.microsoft.com/pt-br/microsoft-edge/excluir-cookies-no-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Microsoft Edge
                </a>
              </li>
            </ul>

            <h2>13. Seus direitos e exclusão de dados</h2>
            <p>
              Nos termos da LGPD, você pode solicitar confirmação de tratamento, acesso, correção, anonimização, eliminação
              de dados desnecessários, portabilidade (quando aplicável), informação sobre compartilhamentos e revogação de
              consentimento, quando este for a base legal.
            </p>
            <p>
              <strong>Como solicitar:</strong> envie e-mail para{" "}
              <a href={`mailto:${OPERATOR_DPO_EMAIL}`}>{OPERATOR_DPO_EMAIL}</a> com assunto “LGPD — [seu pedido]” e
              informações que nos permitam confirmar sua identidade com segurança.
            </p>
            <p>
              <strong>Exclusão de dados e conta:</strong> você pode pedir o encerramento da conta e a eliminação de dados
              pessoais, observadas as exceções legais de retenção. Para revisões de aplicativos Meta, mantenha este canal
              funcional e informe prazos razoáveis de resposta na prática operacional da empresa.
            </p>

            <h2>14. Segurança</h2>
            <p>
              Adotamos medidas técnicas e organizacionais compatíveis com o risco, como criptografia em trânsito (HTTPS),
              controles de acesso, registro de logs e boas práticas de desenvolvimento. Nenhum sistema é absolutamente
              seguro; em caso de incidente relevante, trataremos conforme a lei.
            </p>
            <p>
              O tratamento de dados obtidos por meio das APIs Google observa a{" "}
              <a
                href="https://developers.google.com/terms/api-services-user-data-policy"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google API Services User Data Policy
              </a>{" "}
              (incluindo requisitos de <strong>uso limitado</strong> e de manuseio seguro quando forem utilizados escopos
              classificados como sensíveis ou restritos), conforme também descrito nas seções 1 e 4 desta Política.
            </p>
            <p>
              <strong>Memória e contexto empresarial:</strong> informações de contexto do negócio utilizadas pelos recursos
              de inteligência artificial da Plataforma podem ser processadas e armazenadas em{" "}
              <strong>infraestrutura de terceiros</strong> contratada como encarregada de tratamento (subprocessador),
              com segregação lógica, controles de acesso e cláusulas compatíveis com a LGPD. A lista atualizada de
              subprocessadores relevantes poderá ser disponibilizada mediante solicitação ou em canal dedicado à medida
              que a operação comercial evoluir.
            </p>

            <h2>15. Menores de idade</h2>
            <p>
              A Plataforma não se destina a menores de 18 anos. Não coletamos intencionalmente dados de menores. Se você
              tomar conhecimento de cadastro indevido, contate{" "}
              <a href={`mailto:${OPERATOR_DPO_EMAIL}`}>{OPERATOR_DPO_EMAIL}</a>.
            </p>

            <h2>16. Alterações</h2>
            <p>
              Podemos atualizar esta Política para refletir mudanças legais ou nos serviços. Publicaremos a nova versão com
              data de atualização. Alterações relevantes podem ser comunicadas por e-mail ou aviso na Plataforma. O uso
              continuado após a vigência das alterações pode implicar aceitação, conforme aplicável.
            </p>

            <h2>17. Encarregado (DPO) e contato</h2>
            <p>
              Dúvidas sobre privacidade e exercício de direitos:{" "}
              <a href={`mailto:${OPERATOR_DPO_EMAIL}`}>{OPERATOR_DPO_EMAIL}</a>
            </p>
            <p>
              Contato geral: <a href={`mailto:${OPERATOR_CONTACT_EMAIL}`}>{OPERATOR_CONTACT_EMAIL}</a>
            </p>
            <p>
              Endereço para correspondência: {OPERATOR_ADDRESS}
            </p>
            <p>
              Esta Política aplica-se a usuários dos serviços {PRODUCT_BRAND} no Brasil, sem prejuízo de normas estrangeiras
              quando aplicáveis a tratamentos específicos.
            </p>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
