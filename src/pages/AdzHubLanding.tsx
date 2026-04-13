import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Star,
  Brain,
  Target,
  Users,
  Sparkles,
  TrendingUp,
  Zap,
  ArrowRight,
  Layers,
  BookOpen,
  Megaphone,
  Search,
  Share2,
  ShieldCheck,
  LayoutGrid,
  LineChart,
} from "lucide-react";
import { StarBorder } from "@/components/ui/star-border";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { LandingNav } from "@/components/LandingNav";
import { Footer } from "@/components/Footer";
import { MotionHeroShowcase } from "@/components/motion-showcase";
import { useWaitlistDialog } from "@/components/WaitlistDialogProvider";

export default function AdzHubLanding() {
  const { openWaitlist } = useWaitlistDialog();
  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>AdzHub - Sua agência de marketing em uma única plataforma</title>
        <meta
          name="description"
          content="Planejamento, execução e evolução contínua do marketing em uma única plataforma. Entre na lista de espera e comece grátis quando liberarmos o acesso."
        />
        <meta property="og:title" content="AdzHub - Sua agência de marketing em uma única plataforma" />
        <meta
          property="og:description"
          content="Centralize seu marketing, ganhe continuidade e acompanhe resultados. Feito para donos de PMEs com operação comercial ativa."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://adzhub.com.br/" />
      </Helmet>

      <LandingNav activeSection="home" />

      {/* Hero — plataforma em uso + conversão */}
      <section className="relative mt-[83px] mx-4 sm:mx-5 rounded-[28px] md:rounded-[32px] overflow-hidden border border-[#08080C]/[0.06] bg-gradient-to-br from-slate-50 via-white to-[#D4EFF4]/40">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: `linear-gradient(rgba(55, 72, 157, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(55, 72, 157, 0.04) 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 pt-14 pb-16 lg:pt-20 lg:pb-24">
          <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] gap-12 lg:gap-14 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-sm border border-[#37489d]/15 text-sm font-medium text-[#37489d] shadow-sm">
                <Sparkles className="w-4 h-4 shrink-0" />
                Gerencie todos os seus serviços de marketing de forma simples
              </div>
              <h1 className="mt-6 text-[1.65rem] sm:text-4xl md:text-5xl lg:text-[2.65rem] font-bold leading-[1.12] tracking-tight text-[#08080C]">
                <span className="block">
                  Sua <span className="text-[#37489d]">agência de marketing</span>
                </span>
                <span className="block">em uma única plataforma</span>
              </h1>
              <p className="mt-5 text-lg sm:text-xl text-[#4B5563] leading-relaxed max-w-xl mx-auto lg:mx-0">
                Centralize seu marketing em uma única plataforma e veja seu negócio crescer.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center lg:items-stretch justify-center lg:justify-start gap-3 sm:gap-4">
                <div className="w-full sm:w-auto flex justify-center lg:justify-start">
                  <StarBorder
                    as="button"
                    type="button"
                    onClick={openWaitlist}
                    color="hsl(224, 47%, 42%)"
                    speed="8s"
                    className="w-full max-w-sm sm:max-w-none sm:w-auto text-center"
                  >
                    Começar grátis
                  </StarBorder>
                </div>
                <a
                  href="#como-funciona"
                  className="inline-flex h-12 w-full sm:w-auto items-center justify-center rounded-2xl border-2 border-[#37489d]/25 bg-white px-8 text-sm font-semibold text-[#37489d] hover:bg-[#37489d]/5 transition-colors"
                >
                  Descubra como funciona
                </a>
              </div>
              <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 text-sm text-[#6B7280]">
                <span className="font-medium text-[#08080C]/80">+200 empresas atendidas</span>
                <span className="hidden sm:inline text-[#08080C]/20" aria-hidden>
                  |
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[hsl(41,100%,58%)] text-[hsl(41,100%,58%)]" />
                    ))}
                  </span>
                  +9 anos com PMEs
                </span>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-[#37489d]/10 via-transparent to-[#F9C7B2]/25 blur-xl" aria-hidden />
              <div className="relative scale-[0.97] sm:scale-100 origin-top lg:origin-center">
                <MotionHeroShowcase />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefícios — primeira dobra estendida */}
      <section className="py-14 sm:py-16 bg-white" aria-labelledby="beneficios-heading">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-12">
            <h2 id="beneficios-heading" className="text-2xl sm:text-3xl font-semibold text-[#08080C] tracking-tight">
              Transforme seu marketing em um sistema de crescimento previsível.
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-5 sm:gap-6">
            {[
              {
                Icon: LayoutGrid,
                title: "Centralização",
                desc: "Organize seu marketing em uma única plataforma.",
              },
              {
                Icon: Zap,
                title: "Execução eficiente",
                desc: "Acesse uma operação de marketing mais madura sem complexidade.",
              },
              {
                Icon: LineChart,
                title: "Evolução contínua",
                desc: "Melhore continuamente com relatórios e acompanhamento.",
              },
            ].map(({ Icon, title, desc }) => (
              <div
                key={title}
                className="rounded-2xl border border-[#08080C]/8 bg-[#FAFAFA] p-6 sm:p-7 text-center sm:text-left hover:border-[#37489d]/20 transition-colors"
              >
                <div className="inline-flex rounded-xl bg-white p-3 shadow-sm border border-[#08080C]/6 mx-auto sm:mx-0 mb-4">
                  <Icon className="w-6 h-6 text-[#37489d]" aria-hidden />
                </div>
                <h3 className="text-lg font-semibold text-[#08080C] mb-2">{title}</h3>
                <p className="text-sm sm:text-base text-[#6B7280] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <StarBorder as="button" type="button" onClick={openWaitlist} color="hsl(224, 47%, 42%)" speed="8s">
              Começar grátis
            </StarBorder>
          </div>
        </div>
      </section>

      {/* Palavras-chave da Tese */}
      <section className="pt-4 pb-8 -mb-12 overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-8">
            <p className="text-[#6B7280] text-base sm:text-lg font-medium max-w-3xl mx-auto leading-relaxed">
              Mais do que uma agência, uma plataforma que centraliza tudo que você precisa para crescer — com método,
              transparência e preço alinhado ao estágio do seu negócio.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6 text-[#08080C] mb-8">
            {[
              { Icon: Layers, label: "Estruturada" },
              { Icon: Brain, label: "Inteligente" },
              { Icon: Zap, label: "Prática" },
              { Icon: Target, label: "Especialista" },
              { Icon: ShieldCheck, label: "Confiável" },
              { Icon: Users, label: "Acessível" },
              { Icon: TrendingUp, label: "Crescimento" },
            ].map(({ Icon, label }) => (
              <div key={label} className="flex items-center justify-center">
                <div className="text-center">
                  <Icon className="w-10 h-10 mx-auto mb-2 text-[#37489d]" />
                  <p className="text-sm font-semibold">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative h-64 w-full overflow-hidden [mask-image:radial-gradient(50%_50%,white,transparent)]">
          <div className="absolute inset-0 before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_bottom_center,hsl(224,47%,42%),transparent_70%)] before:opacity-40" />
          <div className="absolute -left-1/2 top-1/2 aspect-[1/0.7] z-10 w-[200%] rounded-[100%] border-t border-[#08080C]/20 bg-white" />
        </div>
      </section>

      {/* O Problema */}
      <section id="sobre" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col lg:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-[649px]">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 border border-red-200/50 text-sm font-medium text-red-600 mb-6">
                O problema que resolvemos
              </div>
              <h2 className="text-4xl md:text-6xl lg:text-[72px] font-medium leading-[100%] tracking-tight text-[#08080C] mb-6">
                O marketing vira sistema de crescimento — ou vira ruído
              </h2>
              <p className="text-lg font-medium text-[#6B7280] leading-[170%]">
                A maior parte das PMEs não falha por falta de post ou anúncio: falha por{" "}
                <strong className="text-[#08080C] font-semibold">fragmentação</strong> (muitos fornecedores sem integração),{" "}
                <strong className="text-[#08080C] font-semibold">falta de direção</strong> e{" "}
                <strong className="text-[#08080C] font-semibold">ferramentas sem método</strong>. O resultado são ações soltas,
                custo de coordenação alto e dificuldade de provar retorno. A AdzHub existe para substituir esse padrão por
                uma operação centralizada, com continuidade.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <a href="#como-funciona">
                <StarBorder color="hsl(224, 47%, 42%)" speed="8s">
                  Saiba Como Funciona
                </StarBorder>
              </a>
              <p className="text-base font-medium text-[#6B7280]">
                Veja nossa solução
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-3xl bg-[#F6F6F6] p-8 md:p-10">
              <h3 className="text-lg font-semibold text-[#08080C] mb-6">Nas empresas</h3>
              <div className="space-y-4">
                <div className="bg-white rounded-2xl p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <TrendingUp className="w-5 h-5 text-red-500 rotate-180" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#08080C] mb-1">Gastos sem resultado claro</p>
                      <p className="text-xs text-[#6B7280]">Múltiplas ferramentas, relatórios dispersos e pouca consistência de resultados</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Target className="w-5 h-5 text-red-500" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#08080C] mb-1">Ausência de estratégia</p>
                      <p className="text-xs text-[#6B7280]">Sem clareza sobre diferenciais, ICP, ofertas e modelo de negócio</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Zap className="w-5 h-5 text-red-500" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#08080C] mb-1">Tarefas manuais e repetitivas</p>
                      <p className="text-xs text-[#6B7280]">Energia gasta em produções que não movem o ponteiro do negócio</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-[#F6F6F6] p-8 md:p-10">
              <h3 className="text-lg font-semibold text-[#08080C] mb-6">Nos profissionais</h3>
              <div className="space-y-4 mb-6">
                <div className="bg-white rounded-2xl p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Users className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#08080C] mb-1">Escassez de profissionais qualificados</p>
                      <p className="text-xs text-[#6B7280]">O ensino de marketing não acompanha a velocidade das transformações digitais e da IA</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Brain className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#08080C] mb-1">Conhecimento se perde</p>
                      <p className="text-xs text-[#6B7280]">A cada troca de fornecedor ou colaborador, todo contexto estratégico é perdido</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-[#37489d] rounded-2xl p-5 text-white">
                <p className="text-sm font-medium mb-1">A AdzHub é a plataforma da sua agência de marketing</p>
                <p className="text-xs text-white/70">
                  Um único lugar para diagnóstico, plano, execução e evolução — sem depender de dezenas de peças
                  desconectadas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Arquitetura da Plataforma - 3 Componentes */}
      <section id="como-funciona" className="py-24 bg-[#F8F8F8] rounded-3xl mx-5">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-16 gap-8">
            <div className="max-w-[600px]">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#37489d]/10 text-sm font-medium text-[#37489d] mb-6">
                Como funciona
              </div>
              <h2 className="text-4xl md:text-6xl lg:text-[72px] font-medium leading-[100%] tracking-tight text-[#08080C]">
                Da leitura do negócio à operação contínua
              </h2>
            </div>
            <p className="text-lg font-medium text-[#6B7280] leading-[150%] max-w-[400px]">
              Diagnóstico, plano de sucesso, kickoff, campanhas e relatórios — a mesma lógica de uma agência madura,
              executada com método e tecnologia dentro da plataforma.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-3xl p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#37489d] to-[#37489d]/50"></div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#37489d]/10 mb-6">
                <Brain className="w-5 h-5 text-[#37489d]" />
                <span className="text-sm font-semibold text-[#37489d]">Supercérebro</span>
              </div>
              <h3 className="text-xl font-bold text-[#08080C] mb-3">Contexto + Inteligência</h3>
              <p className="text-[#6B7280] leading-[160%] mb-6">
                Sistema de gestão e orquestração de contexto que integra dados do cliente, do profissional e da metodologia AdzHub com IA.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#37489d]"></div>
                  Contexto do cliente
                </div>
                <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#37489d]"></div>
                  Contexto do profissional
                </div>
                <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#37489d]"></div>
                  Metodologia AdzHub
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[hsl(41,100%,58%)] to-[hsl(41,100%,58%)]/50"></div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[hsl(41,100%,58%)]/10 mb-6">
                <Layers className="w-5 h-5 text-[hsl(41,100%,58%)]" />
                <span className="text-sm font-semibold text-[hsl(41,100%,58%)]">Módulos</span>
              </div>
              <h3 className="text-xl font-bold text-[#08080C] mb-3">Integrados e Independentes</h3>
              <p className="text-[#6B7280] leading-[160%] mb-6">
                Aplicações como produção de blogposts, automações e gestão de campanhas que funcionam juntas ou de forma avulsa.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[hsl(41,100%,58%)]"></div>
                  AdzChat (Agentes de IA)
                </div>
                <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[hsl(41,100%,58%)]"></div>
                  Blog (Conteúdo/SEO)
                </div>
                <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[hsl(41,100%,58%)]"></div>
                  Automações inteligentes
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-emerald-500/50"></div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 mb-6">
                <BookOpen className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-semibold text-emerald-600">Metodologia</span>
              </div>
              <h3 className="text-xl font-bold text-[#08080C] mb-3">Processos Validados</h3>
              <p className="text-[#6B7280] leading-[160%] mb-6">
                Fluxos de trabalho desenhados por especialistas e validados com centenas de empresas ao longo de quase uma década.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                  Interface guiada por metodologia
                </div>
                <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                  Economia de tempo e assertividade
                </div>
                <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                  Conhecimento que não se perde
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Serviços de agência (âncoras do menu) */}
      <section id="servicos" className="py-24 bg-white scroll-mt-28">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#37489d]/5 border border-[#37489d]/10 text-sm font-medium text-[#37489d] mb-6">
              Serviços
            </div>
            <h2 className="text-4xl md:text-6xl lg:text-[64px] font-medium leading-[100%] tracking-tight text-[#08080C] mb-6">
              O que uma agência faz — com a escala de uma plataforma
            </h2>
            <p className="text-lg font-medium text-[#6B7280] leading-[170%]">
              Acesso a uma plataforma de marketing digital que integra inteligência, organização e execução. Você contrata
              uma estrutura completa — não peças avulsas — com metodologia e acompanhamento na AdzHub.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              id="trafego-pago"
              className="rounded-3xl border border-[#08080C]/10 bg-[#F6F6F6] p-8 md:p-10 scroll-mt-28"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#37489d] flex items-center justify-center">
                  <Megaphone className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#08080C]">Gestão de tráfego pago</h3>
              </div>
              <p className="text-[#6B7280] leading-relaxed">
                Planejamento, estrutura de campanhas, criativos, orçamentos e otimização contínua em Google Ads, Meta
                Ads e demais canais pagos — com relatórios e decisões alinhadas ao plano de sucesso do seu negócio.
              </p>
            </div>

            <div id="seo-geo" className="rounded-3xl border border-[#08080C]/10 bg-white p-8 md:p-10 scroll-mt-28">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#37489d]/15 flex items-center justify-center">
                  <Search className="w-6 h-6 text-[#37489d]" />
                </div>
                <h3 className="text-xl font-bold text-[#08080C]">SEO e GEO</h3>
              </div>
              <p className="text-[#6B7280] leading-relaxed">
                Presença orgânica e busca local: conteúdo orientado a intenção, otimização técnica, performance no Search
                Console e presença em mapas e buscas locais — integrados à narrativa e às metas da empresa.
              </p>
            </div>

            <div id="social-midia" className="rounded-3xl border border-[#08080C]/10 bg-white p-8 md:p-10 scroll-mt-28">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[hsl(41,100%,58%)]/20 flex items-center justify-center">
                  <Share2 className="w-6 h-6 text-[hsl(41,100%,48%)]" />
                </div>
                <h3 className="text-xl font-bold text-[#08080C]">Social mídia</h3>
              </div>
              <p className="text-[#6B7280] leading-relaxed">
                Calendário, produção, publicação e acompanhamento de redes no mesmo fluxo da operação — sem perder o
                fio da estratégia entre agência, cliente e ferramentas soltas.
              </p>
            </div>

            <div
              id="dashboard-crm"
              className="rounded-3xl border border-[#08080C]/10 bg-[#F6F6F6] p-8 md:p-10 scroll-mt-28"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-slate-600/15 flex items-center justify-center">
                  <LayoutGrid className="w-6 h-6 text-slate-700" />
                </div>
                <h3 className="text-xl font-bold text-[#08080C]">Dashboard e CRM</h3>
              </div>
              <p className="text-[#6B7280] leading-relaxed">
                Painéis executivos, indicadores da operação e gestão de leads e contatos no mesmo fluxo — com histórico e
                contexto alinhados ao plano de sucesso, sem planilhas soltas nem ferramentas desconectadas.
              </p>
            </div>
          </div>

          <div className="mt-10 text-center">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <StarBorder as="button" type="button" onClick={openWaitlist} color="hsl(224, 47%, 42%)" speed="8s">
                Começar grátis
              </StarBorder>
              <a
                href="https://app.adzhub.com.br"
                className="inline-flex h-11 items-center justify-center rounded-xl border-2 border-[#37489d]/25 bg-white px-8 py-2 text-sm font-semibold text-[#37489d] hover:bg-[#37489d]/5 transition-colors"
              >
                Acessar a plataforma
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Ferramentas na plataforma */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#37489d]/5 border border-[#37489d]/10 text-sm font-medium text-[#37489d] mb-6">
              Na plataforma
            </div>
            <h2 className="text-4xl md:text-6xl lg:text-[72px] font-medium leading-[100%] tracking-tight text-[#08080C] mb-6">
              Ferramentas que sustentam a operação
            </h2>
            <p className="text-lg font-medium text-[#6B7280] leading-[170%] max-w-[650px] mx-auto">
              IA, conteúdo e automações não são o “produto” isolado — são camadas que permitem executar os serviços com
              consistência, velocidade e histórico preservado no Supercérebro.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* AdzChat Card */}
            <div className="bg-gradient-to-br from-[#0f1117]/5 to-[#37489d]/5 rounded-3xl p-8 md:p-10 border border-[#37489d]/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#37489d] flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#08080C]">AdzChat</h3>
                  <p className="text-sm text-[#6B7280]">IA aplicada à rotina da agência na plataforma</p>
                </div>
              </div>
              <p className="text-[#6B7280] leading-relaxed mb-6">
                Converse com agentes especializados em Meta Ads, Google Ads, briefing estratégico, analytics e conteúdo. Cada um com acesso ao contexto completo do seu negócio.
              </p>
              <div className="grid grid-cols-2 gap-2 mb-6">
                <div className="bg-white/80 rounded-xl px-3 py-2 text-xs text-[#6B7280]">
                  <span className="font-medium text-[#08080C]">Meta Ads</span> — Otimização de campanhas
                </div>
                <div className="bg-white/80 rounded-xl px-3 py-2 text-xs text-[#6B7280]">
                  <span className="font-medium text-[#08080C]">Google Ads</span> — Pesquisa e display
                </div>
                <div className="bg-white/80 rounded-xl px-3 py-2 text-xs text-[#6B7280]">
                  <span className="font-medium text-[#08080C]">Briefing</span> — Mapeamento estratégico
                </div>
                <div className="bg-white/80 rounded-xl px-3 py-2 text-xs text-[#6B7280]">
                  <span className="font-medium text-[#08080C]">Analytics</span> — Insights de dados
                </div>
              </div>
              <span
                className="inline-flex items-center rounded-full border border-[#37489d]/20 bg-[#37489d]/8 px-3 py-1.5 text-sm font-semibold text-[#37489d]"
                role="status"
              >
                Em breve
              </span>
            </div>

            {/* Blog Card */}
            <div className="bg-gradient-to-br from-[#D4EFF4]/20 to-[#F9C7B2]/10 rounded-3xl p-8 md:p-10 border border-[hsl(41,100%,58%)]/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[hsl(41,100%,58%)] flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#08080C]">Central de conteúdo</h3>
                  <p className="text-sm text-[#6B7280]">Blog, SEO e editorial com IA</p>
                </div>
              </div>
              <p className="text-[#6B7280] leading-relaxed mb-6">
                Crie e publique conteúdo profissional com inteligência artificial. Blog posts otimizados para SEO, posts para redes sociais e calendário editorial inteligente.
              </p>
              <div className="grid grid-cols-2 gap-2 mb-6">
                <div className="bg-white/80 rounded-xl px-3 py-2 text-xs text-[#6B7280]">
                  <span className="font-medium text-[#08080C]">Criação com IA</span> — Artigos em minutos
                </div>
                <div className="bg-white/80 rounded-xl px-3 py-2 text-xs text-[#6B7280]">
                  <span className="font-medium text-[#08080C]">SEO</span> — Otimização automática
                </div>
                <div className="bg-white/80 rounded-xl px-3 py-2 text-xs text-[#6B7280]">
                  <span className="font-medium text-[#08080C]">Calendário</span> — Planejamento editorial
                </div>
                <div className="bg-white/80 rounded-xl px-3 py-2 text-xs text-[#6B7280]">
                  <span className="font-medium text-[#08080C]">Métricas</span> — Performance em tempo real
                </div>
              </div>
              <Link to="/seo" className="inline-flex items-center gap-2 text-[#37489d] font-medium hover:text-[#37489d]/80 transition-colors">
                Conhecer central de conteúdo
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* Modelo de Plataforma - Dois lados */}
      <section className="py-24 bg-[#F8F8F8] rounded-3xl mx-5">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#37489d]/10 text-sm font-medium text-[#37489d] mb-6">
              Modelo Plataforma
            </div>
            <h2 className="text-4xl md:text-6xl lg:text-[72px] font-medium leading-[100%] tracking-tight text-[#08080C] mb-6">
              Uma plataforma, foco na sua empresa
            </h2>
            <p className="text-lg font-medium text-[#6B7280] leading-[170%] max-w-[700px] mx-auto">
              você ganha uma operação de marketing mais madura sem montar equipe completa internamente. Tudo conectado na
              mesma lógica de crescimento.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 md:p-12 border border-[#08080C]/10 max-w-4xl mx-auto text-center">
            <blockquote className="text-xl md:text-2xl font-medium text-[#08080C] italic mb-4">
              "Acreditamos que podemos acelerar o desenvolvimento empresarial do país através do marketing"
            </blockquote>
            <p className="text-sm text-[#6B7280]">
              Olhamos para as PMEs como agentes de transformação econômica e social. São elas que geram empregos, 
              movimentam cadeias locais e dão forma à economia real.
            </p>
          </div>
        </div>
      </section>

      {/* Tração e contexto — linguagem para empresas, não investidores */}
      <section id="empresas" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#37489d]/5 border border-[#37489d]/10 text-sm font-medium text-[#37489d] mb-6">
              Por que a AdzHub existe
            </div>
            <h2 className="text-4xl md:text-6xl lg:text-[72px] font-medium leading-[100%] tracking-tight text-[#08080C] mb-6">
              Veja como ajudamos empresas como a sua a alcançar resultados extraordinários.
            </h2>
            <p className="text-lg font-medium text-[#6B7280] leading-[170%] max-w-[700px] mx-auto">
              Donos de PME com operação comercial ativa costumam reconhecer a necessidade de um marketing mais estruturado —
              mas sofrem com fragmentação, falta de continuidade e dificuldade de provar ROI. A AdzHub organiza estratégia,
              execução e dados em um só lugar.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-12">
            <div className="bg-[#37489d] rounded-3xl p-8 text-white">
              <p className="text-sm font-medium text-white/60 mb-2">O cenário</p>
              <div className="text-2xl md:text-3xl font-bold mb-3 leading-tight">Marketing é grande — e fragmentado</div>
              <p className="text-sm text-white/80 leading-relaxed">
                Muita verba circula em mídia e agências, mas o gestor da PME segue sem clareza: o que fazer primeiro, como medir
                e como não depender só de terceiros opacos.
              </p>
            </div>
            <div className="bg-[#F6F6F6] rounded-3xl p-8">
              <p className="text-sm font-medium text-[#37489d] mb-2">Com quem falamos</p>
              <div className="text-2xl md:text-3xl font-bold text-[#08080C] mb-3 leading-tight">PMEs que precisam de método</div>
              <p className="text-sm text-[#6B7280] leading-relaxed">
                Serviços, comércio e indústria leve — times enxutos que querem processo, transparência e execução sem montar um
                departamento de marketing do zero.
              </p>
            </div>
            <div className="bg-[#F6F6F6] rounded-3xl p-8">
              <p className="text-sm font-medium text-[#37489d] mb-2">O que entregamos</p>
              <div className="text-2xl md:text-3xl font-bold text-[#08080C] mb-3 leading-tight">Metodologia + plataforma</div>
              <p className="text-sm text-[#6B7280] leading-relaxed">
                Anos de operação com PMEs viraram fluxo, rituais e ferramentas em um só lugar — para você avançar com
                consistência, não no improviso.
              </p>
            </div>
          </div>

          <div className="text-center mt-14 rounded-3xl border border-[#37489d]/15 bg-gradient-to-b from-[#37489d]/[0.06] to-white px-6 py-12 sm:py-14 max-w-3xl mx-auto">
            <p className="text-sm font-medium uppercase tracking-wider text-[#37489d] mb-3">Próximo passo</p>
            <h3 className="text-2xl sm:text-3xl font-semibold text-[#08080C] mb-6 leading-tight">
              Vamos começar?
            </h3>
            <p className="text-[#6B7280] mb-8 max-w-lg mx-auto">
              Entre na lista de espera e solicite um convite. Liberamos o acesso em ondas conforme a capacidade da equipe.
            </p>
            <StarBorder as="button" type="button" onClick={openWaitlist} color="hsl(224, 47%, 42%)" speed="8s">
              Começar grátis
            </StarBorder>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
