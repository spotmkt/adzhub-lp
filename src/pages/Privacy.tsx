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
          <article className="prose prose-lg max-w-none prose-headings:text-[#08080C] prose-headings:font-bold prose-p:text-[#6B7280] prose-li:text-[#6B7280] prose-strong:text-[#08080C] prose-a:text-[#37489d]">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#08080C] mb-2">
              Política de Privacidade
            </h1>
            <p className="text-sm text-[#6B7280] mb-6">Última atualização: abril de 2026</p>

            <p className="text-sm border border-[#37489d]/20 bg-[#37489d]/5 rounded-xl p-4 text-[#08080C] not-prose mb-10">
              <strong className="text-[#08080C]">Marca e operação:</strong> a plataforma <strong>{PRODUCT_BRAND}</strong>{" "}
              é desenvolvida e operada por <strong>{OPERATOR_LEGAL_NAME}</strong>, inscrita no CNPJ {OPERATOR_CNPJ}, com
              sede em {OPERATOR_ADDRESS}. Esta sociedade é a responsável pelo tratamento de dados descrito nesta Política.
            </p>

            <h2>1. O que você precisa saber antes de ler</h2>
            <p>
              A {PRODUCT_BRAND}, operada por {OPERATOR_LEGAL_NAME}, está comprometida com a privacidade e com o tratamento
              ético e legal de dados pessoais, em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 —
              LGPD).
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
            <p>Na utilização da {PRODUCT_BRAND}, podemos tratar:</p>
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
              Ao autorizar a conexão na tela de consentimento, a Plataforma acessará — conforme os escopos de{" "}
              <strong>leitura</strong> exibidos — os dados de suas propriedades vinculadas para consolidar{" "}
              <strong>relatórios e dashboards</strong>. Isso inclui:
            </p>
            <ul>
              <li>
                <strong>Google Ads e Meta Ads:</strong> dados de performance (impressões, cliques, CTR, ROAS), orçamentos
                e estrutura de campanhas para análise de ROI.
              </li>
              <li>
                <strong>Google Analytics (GA4):</strong> métricas de tráfego, eventos e conversões para monitoramento de
                funil.
              </li>
              <li>
                <strong>YouTube Analytics:</strong> estatísticas de visualização e engajamento de vídeos e canais.
              </li>
              <li>
                <strong>Google Search Console:</strong> dados de impressões orgânicas e termos de pesquisa para análise de
                SEO.
              </li>
              <li>
                <strong>Google Perfil da Empresa:</strong> métricas de interação local (chamadas, rotas e avaliações).
              </li>
              <li>
                <strong>Google Tag Manager:</strong> leitura de contêineres e configurações de tags para auditoria de
                medição.
              </li>
            </ul>
            <p>
              <strong>Nota sobre permissões:</strong> a {PRODUCT_BRAND} prioriza o acesso de somente leitura. Caso
              funcionalidades futuras exijam criação ou edição (como ajuste de lances ou publicação de conteúdo), uma nova
              tela de consentimento será apresentada para sua aprovação explícita.
            </p>
            <p>
              Os escopos OAuth solicitados em cada momento são sempre os indicados na tela de permissão do Google ou da
              Meta ao conectar. Você pode revogar o acesso nas configurações da sua conta Google ou Meta; isso interrompe
              novas coletas via essa integração.
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
              terceiros fora do necessário à prestação dos Serviços descritos nesta Política (relatórios, dashboards e
              funcionalidades que você autorizou).
            </p>

            <h3>4.2. Dados da Meta</h3>
            <p>
              Dados obtidos via Meta são tratados para as mesmas finalidades da seção 4 (consolidação em relatórios e
              dashboards e operação da Plataforma), em conformidade com esta Política, com os{" "}
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
              <li>Por integrações que você conectar (por exemplo, contas de anúncios).</li>
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
              A {OPERATOR_LEGAL_NAME} é, em geral, a <strong>controladora</strong> dos dados dos usuários da {PRODUCT_BRAND}.
              Quando você armazena dados de terceiros (por exemplo, lista de contatos) para sua operação, você pode ser o
              controlador desses dados e nós atuamos como operador, conforme combinado e exigido pela LGPD.
            </p>

            <h2>9. Com quem compartilhamos</h2>
            <p>Não vendemos dados pessoais. Compartilhamos apenas o necessário com:</p>
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
              Mantemos dados pelo tempo necessário para as finalidades desta Política e para cumprir prazos legais. Se
              você apenas <strong>cancela a assinatura</strong> ou encerra o uso sem pedir exclusão imediata, podemos
              manter cópias por até <strong>90 (noventa) dias</strong> (alinhado aos{" "}
              <Link to="/termos">Termos de Uso</Link>) para você exportar informações, retomar o serviço ou concluir
              pendências — prazo findo, eliminamos ou anonimizamos, salvo quando a lei exigir guarda por mais tempo.
            </p>
            <p>
              Se você solicitar <strong>exclusão de conta e dados</strong> com base na LGPD, tratamos o pedido com remoção
              definitiva o mais rápido possível, em geral de forma imediata após confirmarmos sua identidade, ressalvadas
              apenas as informações que a lei obrigue a manter (por exemplo, registros fiscais ou defesa em processos).
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
              <a href={`mailto:${OPERATOR_CONTACT_EMAIL}`}>{OPERATOR_CONTACT_EMAIL}</a> com assunto “LGPD — [seu pedido]”
              e informações que nos permitam confirmar sua identidade com segurança.
            </p>
            <p>
              <strong>Exclusão de dados e conta:</strong> você pode pedir o encerramento da conta e a eliminação de dados
              pessoais, observadas as exceções legais de retenção.{" "}
              <strong>
                Para excluir seus dados e sua conta definitivamente, acesse as configurações do seu perfil na plataforma
                ou envie um e-mail para{" "}
              </strong>
              <a href={`mailto:${OPERATOR_CONTACT_EMAIL}`}>
                <strong>{OPERATOR_CONTACT_EMAIL}</strong>
              </a>
              .
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
              Utilizamos serviços de inteligência artificial de parceiros para processar os dados que você insere. Seus
              dados são processados de forma isolada e{" "}
              <strong>não são utilizados por esses parceiros para treinar modelos públicos de IA</strong>.
            </p>

            <h2>15. Menores de idade</h2>
            <p>
              A Plataforma não se destina a menores de 18 anos. Não coletamos intencionalmente dados de menores. Se você
              tomar conhecimento de cadastro indevido, contate{" "}
              <a href={`mailto:${OPERATOR_CONTACT_EMAIL}`}>{OPERATOR_CONTACT_EMAIL}</a>.
            </p>

            <h2>16. Alterações</h2>
            <p>
              Podemos atualizar esta Política para refletir mudanças legais ou nos serviços. Publicaremos a nova versão com
              data de atualização. Alterações relevantes podem ser comunicadas por e-mail ou aviso na Plataforma. O uso
              continuado após a vigência das alterações pode implicar aceitação, conforme aplicável.
            </p>

            <h2>17. Encarregado (DPO) e contato</h2>
            <p>
              Dúvidas sobre privacidade, exercício de direitos da LGPD e contato geral:{" "}
              <a href={`mailto:${OPERATOR_CONTACT_EMAIL}`}>{OPERATOR_CONTACT_EMAIL}</a>
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
