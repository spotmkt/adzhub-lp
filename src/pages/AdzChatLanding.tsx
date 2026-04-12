import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  MessageSquare,
  Star,
  Sparkles,
  Layers,
  ArrowRight,
  Brain,
  Target,
  BarChart3,
  FileText,
  Zap,
  Users,
  Shield,
  TrendingUp,
  Megaphone,
  Search,
  Lightbulb,
  Bot,
  CheckCircle2,
} from "lucide-react";
import { StarBorder } from "@/components/ui/star-border";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { LandingNav } from "@/components/LandingNav";
import { Footer } from "@/components/Footer";
import { AdzChatMotionHero } from "@/components/motion-showcase";

const agents = [
  {
    id: "meta-ads",
    name: "Agente de Meta Ads",
    icon: Megaphone,
    color: "#1877F2",
    description:
      "Analisa campanhas no Facebook e Instagram Ads, sugere otimizações de público, criativos e orçamento com base em dados reais da conta.",
    capabilities: [
      "Análise de performance de campanhas ativas",
      "Sugestões de segmentação e públicos lookalike",
      "Recomendações de criativos e formatos",
      "Diagnóstico de problemas de entrega",
    ],
  },
  {
    id: "google-ads",
    name: "Agente de Google Ads",
    icon: Search,
    color: "#4285F4",
    description:
      "Otimiza campanhas de pesquisa, display e YouTube. Analisa palavras-chave, lances e qualidade dos anúncios para maximizar ROI.",
    capabilities: [
      "Auditoria de Quality Score e Ad Rank",
      "Pesquisa e sugestão de palavras-chave",
      "Otimização de lances e orçamento",
      "Análise de termos de pesquisa e negativas",
    ],
  },
  {
    id: "briefing",
    name: "Agente de Briefing",
    icon: FileText,
    color: "#37489d",
    description:
      "Conduz o processo de briefing estratégico com a empresa, extraindo diferenciais, ICP, posicionamento e construindo a base de contexto do Supercérebro.",
    capabilities: [
      "Entrevista guiada por metodologia AdzHub",
      "Extração de diferenciais e proposta de valor",
      "Definição de ICP e personas",
      "Alimentação automática do Supercérebro",
    ],
  },
  {
    id: "estrategia",
    name: "Agente de Estratégia",
    icon: Target,
    color: "#10B981",
    description:
      "Analisa o cenário competitivo, identifica oportunidades e propõe planos de ação baseados na metodologia e nos dados contextuais da empresa.",
    capabilities: [
      "Análise SWOT automatizada",
      "Mapeamento de concorrentes",
      "Plano de ações priorizadas",
      "Alinhamento com objetivos de negócio",
    ],
  },
  {
    id: "analytics",
    name: "Agente de Analytics",
    icon: BarChart3,
    color: "#F59E0B",
    description:
      "Interpreta dados de múltiplas fontes, gera relatórios visuais e traduz números em insights acionáveis para decisões de marketing.",
    capabilities: [
      "Consolidação de dados multi-plataforma",
      "Relatórios automatizados com IA",
      "Identificação de tendências e anomalias",
      "Recomendações baseadas em dados",
    ],
  },
  {
    id: "conteudo",
    name: "Agente de Conteúdo",
    icon: Lightbulb,
    color: "#8B5CF6",
    description:
      "Gera ideias de conteúdo, cria pautas editoriais e produz textos otimizados com base no contexto da marca e nas tendências do mercado.",
    capabilities: [
      "Geração de pautas com IA contextual",
      "Produção de textos para blog e redes",
      "Otimização SEO integrada",
      "Calendário editorial inteligente",
    ],
  },
];

export default function AdzChatLanding() {
  const [titleNumber, setTitleNumber] = useState(0);

  const titles = useMemo(
    () => ["+Estratégico", "+Inteligente", "+Contextual", "+Autônomo", "+Eficiente"],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>AdzChat - IA dentro da agência AdzHub</title>
        <meta
          name="description"
          content="Agentes de IA para tráfego, briefing, estratégia e conteúdo — integrados à operação de marketing da plataforma AdzHub, não como ferramenta solta."
        />
        <meta name="robots" content="noindex, nofollow" />
        <meta name="googlebot" content="noindex, nofollow" />
      </Helmet>

      <LandingNav activeSection="adzchat" />

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden bg-gradient-to-br from-[#0f1117]/5 via-[#37489d]/5 to-[#8B5CF6]/5 rounded-[32px] mx-5 mt-[83px]">
        <div className="relative max-w-5xl mx-auto px-8 z-10">
          <div className="flex flex-col items-center text-center gap-6 max-w-[781px] mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 backdrop-blur-sm border border-[#37489d]/10 text-sm font-medium text-[#37489d]">
              <MessageSquare className="w-4 h-4" />
              Camada de IA da sua agência na plataforma
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-[90px] font-bold leading-[100%] tracking-tight text-[#08080C]">
              <span className="block mb-2">AdzChat</span>
              <span className="relative inline-block min-w-[280px] md:min-w-[420px] lg:min-w-[600px] text-center h-[1.2em]">
                <span
                  key={titleNumber}
                  className="absolute left-0 right-0 font-bold text-[#37489d] animate-fade-in"
                >
                  {titles[titleNumber]}
                </span>
              </span>
            </h1>
            <p className="text-lg text-[#08080C] opacity-80 max-w-[600px]">
              O AdzChat não substitui a agência: acelera diagnósticos, sugestões e rotinas que uma operação de marketing
              madura faria — com o contexto do seu negócio preservado no Supercérebro e alinhado aos serviços que você
              contrata na AdzHub.
            </p>
          </div>

          <div className="flex items-center justify-center gap-4 mb-5 flex-wrap">
            <a href="https://app.adzhub.com.br">
              <StarBorder color="hsl(224, 47%, 42%)" speed="8s">
                Experimentar Grátis
              </StarBorder>
            </a>
            <a
              href="#agentes"
              className="flex items-center gap-2 text-[#37489d] hover:text-[#37489d]/80 transition-colors"
            >
              <Sparkles className="w-5 h-5" />
              Conhecer os Agentes
            </a>
          </div>

          <div className="flex items-center justify-center gap-5 flex-wrap mb-14">
            <div className="flex items-center gap-2 min-h-[28px]">
              <span className="text-sm font-medium text-[#08080C]/70">
                6 agentes especializados
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-[hsl(41,100%,58%)] text-[hsl(41,100%,58%)]"
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-[#08080C]/70">
                Contexto persistente
              </span>
            </div>
          </div>
        </div>

        {/* Showcase animado — interface AdzChat */}
        <div className="relative max-w-6xl mx-auto px-4 sm:px-8">
          <AdzChatMotionHero />
        </div>
      </section>

      {/* Spacer */}
      <div className="h-16" />

      {/* Como Funciona */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col lg:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-[649px]">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#37489d]/5 border border-[#37489d]/10 text-sm font-medium text-[#37489d] mb-6">
                Como funciona
              </div>
              <h2 className="text-4xl md:text-6xl lg:text-[72px] font-medium leading-[100%] tracking-tight text-[#08080C] mb-6">
                Marketing guiado por conversas
              </h2>
              <p className="text-lg font-medium text-[#6B7280] leading-[170%]">
                Cada agente é especialista em uma área do marketing. Você conversa, ele
                executa — com o contexto completo do seu negócio alimentando cada resposta.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <a href="https://app.adzhub.com.br">
                <StarBorder color="hsl(224, 47%, 42%)" speed="8s">
                  Começar Agora
                </StarBorder>
              </a>
              <p className="text-base font-medium text-[#6B7280]">sem cartão de crédito</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="rounded-3xl bg-[#F6F6F6] p-8 md:p-10">
              <div className="bg-white rounded-3xl p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#37489d] flex items-center justify-center text-white font-bold text-lg">
                    1
                  </div>
                  <p className="text-lg font-semibold text-[#08080C]">Escolha o agente</p>
                </div>
                <p className="text-sm text-[#6B7280]">
                  Selecione o agente especialista para sua necessidade: Meta Ads, Google Ads,
                  Briefing, Estratégia ou Analytics.
                </p>
              </div>
              <div className="bg-white rounded-3xl p-4">
                <div className="flex items-center gap-3">
                  <Bot className="w-5 h-5 text-[#37489d]" />
                  <div>
                    <p className="text-sm font-medium text-[#08080C]">6 agentes disponíveis</p>
                    <p className="text-xs text-[#6B7280]">Cada um com expertise específica</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-[#F6F6F6] p-8 md:p-10">
              <div className="bg-white rounded-3xl p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-[hsl(41,100%,58%)] flex items-center justify-center text-white font-bold text-lg">
                    2
                  </div>
                  <p className="text-lg font-semibold text-[#08080C]">Converse</p>
                </div>
                <p className="text-sm text-[#6B7280]">
                  Descreva sua necessidade em linguagem natural. O agente entende seu contexto,
                  faz perguntas e propõe soluções.
                </p>
              </div>
              <div className="bg-white rounded-3xl p-4">
                <div className="flex items-center gap-3">
                  <Brain className="w-5 h-5 text-[hsl(41,100%,58%)]" />
                  <div>
                    <p className="text-sm font-medium text-[#08080C]">Supercérebro ativo</p>
                    <p className="text-xs text-[#6B7280]">Contexto completo do negócio</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-[#F6F6F6] p-8 md:p-10">
              <div className="bg-white rounded-3xl p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-lg">
                    3
                  </div>
                  <p className="text-lg font-semibold text-[#08080C]">Execute e aprenda</p>
                </div>
                <p className="text-sm text-[#6B7280]">
                  Receba análises, recomendações e ações prontas. O sistema aprende e melhora
                  a cada interação com seus dados.
                </p>
              </div>
              <div className="bg-white rounded-3xl p-4">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-emerald-500" />
                  <div>
                    <p className="text-sm font-medium text-[#08080C]">Resultados mensuráveis</p>
                    <p className="text-xs text-[#6B7280]">Dados que evoluem com o tempo</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Agentes Section */}
      <section id="agentes" className="py-24 bg-[#F8F8F8] rounded-3xl mx-5">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#37489d]/10 text-sm font-medium text-[#37489d] mb-6">
              Agentes Especializados
            </div>
            <h2 className="text-4xl md:text-6xl lg:text-[72px] font-medium leading-[100%] tracking-tight text-[#08080C] mb-6">
              Seu time de marketing com IA
            </h2>
            <p className="text-lg font-medium text-[#6B7280] leading-[170%] max-w-[650px] mx-auto">
              Cada agente é treinado em uma disciplina específica do marketing e tem acesso
              ao contexto completo da sua empresa via Supercérebro.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent) => {
              const Icon = agent.icon;
              return (
                <div
                  key={agent.id}
                  className="bg-white rounded-3xl p-8 relative overflow-hidden group hover:shadow-lg transition-shadow"
                >
                  <div
                    className="absolute top-0 left-0 w-full h-1 transition-all group-hover:h-1.5"
                    style={{
                      background: `linear-gradient(to right, ${agent.color}, ${agent.color}80)`,
                    }}
                  />
                  <div className="flex items-center gap-3 mb-5">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${agent.color}15` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: agent.color }} />
                    </div>
                    <h3 className="text-lg font-bold text-[#08080C]">{agent.name}</h3>
                  </div>
                  <p className="text-sm text-[#6B7280] leading-relaxed mb-5">
                    {agent.description}
                  </p>
                  <div className="space-y-2">
                    {agent.capabilities.map((cap) => (
                      <div key={cap} className="flex items-start gap-2">
                        <CheckCircle2
                          className="w-3.5 h-3.5 mt-0.5 flex-shrink-0"
                          style={{ color: agent.color }}
                        />
                        <span className="text-xs text-[#6B7280]">{cap}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Diferenciais */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl lg:text-[72px] font-medium leading-[100%] tracking-tight text-[#08080C] mb-6">
              Por que o AdzChat é diferente
            </h2>
            <p className="text-lg font-medium text-[#6B7280] leading-[170%] max-w-[600px] mx-auto">
              Não é apenas um chatbot. É um sistema de agentes com contexto, memória e
              metodologia integrados.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <SpotlightCard
              className="flex flex-col gap-4 rounded-3xl !bg-white !border-primary/10 shadow-2xl"
              spotlightColor="#37489d30"
            >
              <div className="text-2xl font-bold flex items-center gap-2">
                <Brain className="text-[#37489d] w-8 h-8" />
                <span className="text-[#08080C]">Contexto Persistente</span>
              </div>
              <div className="text-[#6B7280]">
                O Supercérebro guarda tudo sobre sua empresa: diferenciais, ICP, histórico de
                campanhas, dados de performance. Cada conversa começa onde a última parou.
              </div>
            </SpotlightCard>

            <SpotlightCard
              className="flex flex-col gap-4 rounded-3xl !bg-white !border-primary/10 shadow-2xl"
              spotlightColor="#10B98130"
            >
              <div className="text-2xl font-bold flex items-center gap-2">
                <Shield className="text-emerald-500 w-8 h-8" />
                <span className="text-[#08080C]">Metodologia Aplicada</span>
              </div>
              <div className="text-[#6B7280]">
                Cada agente segue processos validados com +200 empresas ao longo de 9 anos.
                Não são respostas genéricas — são recomendações estratégicas.
              </div>
            </SpotlightCard>

            <SpotlightCard
              className="flex flex-col gap-4 rounded-3xl !bg-white !border-primary/10 shadow-2xl"
              spotlightColor="#8B5CF630"
            >
              <div className="text-2xl font-bold flex items-center gap-2">
                <Layers className="text-violet-500 w-8 h-8" />
                <span className="text-[#08080C]">Agentes Colaborativos</span>
              </div>
              <div className="text-[#6B7280]">
                Os agentes conversam entre si. O de Briefing alimenta o de Estratégia, que
                orienta o de Meta Ads. Um ecossistema inteligente e integrado.
              </div>
            </SpotlightCard>
          </div>
        </div>
      </section>

      {/* Números */}
      <section className="py-24 bg-[#F8F8F8] rounded-3xl mx-5">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-16 gap-8">
            <h2 className="text-4xl md:text-6xl lg:text-[72px] font-medium leading-[100%] tracking-tight text-[#08080C] max-w-[600px]">
              Resultados que importam
            </h2>
            <p className="text-lg font-medium text-[#6B7280] leading-[150%] max-w-[363px]">
              Números da nossa operação que validam a eficiência dos agentes de IA
              combinados com metodologia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl p-6">
              <div className="inline-flex items-center gap-2 px-2 py-1 rounded bg-[#37489d]/10 mb-4">
                <div className="w-6 h-6 rounded-full bg-[#37489d]" />
                <span className="text-base font-medium text-[#37489d]">Produtividade</span>
              </div>
              <div className="flex items-start mb-8">
                <span className="text-6xl md:text-[100px] font-normal leading-[120%] tracking-tight text-[#1F2937]">
                  3x
                </span>
              </div>
              <p className="text-lg font-normal text-[#6B7280] leading-[150%]">
                Mais empresas gerenciadas com o mesmo time usando agentes de IA no fluxo de
                trabalho
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6">
              <div className="inline-flex items-center gap-2 px-2 py-1 rounded bg-[hsl(41,100%,58%)]/10 mb-4">
                <div className="w-6 h-6 rounded-full bg-[hsl(41,100%,58%)]" />
                <span className="text-base font-medium text-[hsl(41,100%,58%)]">Economia</span>
              </div>
              <div className="flex items-start mb-8">
                <span className="text-6xl md:text-[100px] font-normal leading-[120%] tracking-tight text-[#1F2937]">
                  74
                </span>
                <span className="text-3xl md:text-[40px] font-medium leading-[120%] tracking-tight text-[#1F2937]">
                  %
                </span>
              </div>
              <p className="text-lg font-normal text-[#6B7280] leading-[150%]">
                Aumento de receita após implementação de agentes na operação da agência
                validadora
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6">
              <div className="inline-flex items-center gap-2 px-2 py-1 rounded bg-emerald-500/10 mb-4">
                <div className="w-6 h-6 rounded-full bg-emerald-500" />
                <span className="text-base font-medium text-emerald-600">Retenção</span>
              </div>
              <div className="flex items-start mb-8">
                <span className="text-6xl md:text-[100px] font-normal leading-[120%] tracking-tight text-[#1F2937]">
                  -38
                </span>
                <span className="text-3xl md:text-[40px] font-medium leading-[120%] tracking-tight text-[#1F2937]">
                  %
                </span>
              </div>
              <p className="text-lg font-normal text-[#6B7280] leading-[150%]">
                Redução de churn com contexto persistente e execução estratégica via agentes
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Parte do Ecossistema */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#37489d]/5 border border-[#37489d]/10 text-sm font-medium text-[#37489d] mb-6">
              Ecossistema AdzHub
            </div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-medium leading-[100%] tracking-tight text-[#08080C] mb-6">
              AdzChat se integra a todo o ecossistema
            </h2>
            <p className="text-lg font-medium text-[#6B7280] leading-[170%] max-w-[650px] mx-auto">
              Os agentes não trabalham isolados. Eles se conectam ao Supercérebro, aos
              módulos de conteúdo, automações e à metodologia AdzHub.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            <div className="bg-[#F6F6F6] rounded-2xl p-6 border-2 border-[#37489d]/20 relative">
              <div className="absolute -top-3 left-4 px-3 py-0.5 bg-[#37489d] text-white text-xs font-medium rounded-full">
                Atual
              </div>
              <MessageSquare className="w-8 h-8 text-[#37489d] mb-3" />
              <h3 className="text-base font-bold text-[#08080C] mb-1">AdzChat</h3>
              <p className="text-xs text-[#6B7280]">Agentes de IA especializados</p>
            </div>
            <div className="bg-[#F6F6F6] rounded-2xl p-6 border-2 border-[#37489d]/20 relative">
              <div className="absolute -top-3 left-4 px-3 py-0.5 bg-[#37489d] text-white text-xs font-medium rounded-full">
                Atual
              </div>
              <Sparkles className="w-8 h-8 text-[#37489d] mb-3" />
              <h3 className="text-base font-bold text-[#08080C] mb-1">Blog</h3>
              <p className="text-xs text-[#6B7280]">Blog, SEO e conteúdo com IA</p>
            </div>
            <div className="bg-[#F6F6F6] rounded-2xl p-6 border border-[#08080C]/10 opacity-60">
              <Zap className="w-8 h-8 text-[#6B7280] mb-3" />
              <h3 className="text-base font-bold text-[#08080C] mb-1">Automações</h3>
              <p className="text-xs text-[#6B7280]">Fluxos inteligentes multi-app</p>
              <span className="text-[10px] text-[#37489d] font-medium">Em breve</span>
            </div>
          </div>

          <div className="text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-[#37489d] font-medium hover:text-[#37489d]/80 transition-colors"
            >
              Conheça a plataforma completa
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
