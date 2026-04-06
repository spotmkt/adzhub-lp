import { useEffect, useMemo, useState, lazy, Suspense } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Play, Star, TrendingUp, Shield, Zap, Rocket, Target, BarChart3, PenTool, Search, Sparkles, ArrowRight, Brain, Layers } from "lucide-react";
import { StarBorder } from "@/components/ui/star-border";
import { testimonials, tiltedScrollItems, timelineData } from "@/data/finestraData";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { LandingNav } from "@/components/LandingNav";
import { Footer } from "@/components/Footer";
import { DashboardMockup } from "@/components/DashboardMockup";

const DisplayCards = lazy(() => import("@/components/ui/display-cards"));
const TestimonialsColumn = lazy(() => import("@/components/ui/testimonials-columns-1").then(m => ({ default: m.TestimonialsColumn })));
const TiltedScroll = lazy(() => import("@/components/ui/tilted-scroll").then(m => ({ default: m.TiltedScroll })));
const Features = lazy(() => import("@/components/ui/features-6").then(m => ({ default: m.Features })));
const RadialOrbitalTimeline = lazy(() => import("@/components/ui/radial-orbital-timeline"));

const LoadingFallback = () => <div className="w-full h-32 bg-muted/30 rounded-lg" />;

export default function FinestraLanding() {
  const [titleNumber, setTitleNumber] = useState(0);
  
  const titles = useMemo(
    () => ["+Inteligente", "+Estratégico", "+Criativo", "+Otimizado", "+Profissional"],
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

  const firstColumn = useMemo(() => testimonials.slice(0, 3), []);
  const secondColumn = useMemo(() => testimonials.slice(3, 6), []);
  const thirdColumn = useMemo(() => testimonials.slice(6, 9), []);

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Blog - AdzHub | Conteúdo com IA</title>
        <meta name="description" content="Crie, gerencie e publique conteúdo profissional com inteligência artificial. Blog, redes sociais e SEO integrados em uma única plataforma." />
      </Helmet>

      <LandingNav activeSection="conteudo" />

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden bg-gradient-to-br from-[#D4EFF4]/30 via-[#F9C7B2]/20 to-[#F9B2D4]/20 rounded-[32px] mx-5 mt-[83px]">
        <div className="relative max-w-5xl mx-auto px-8 z-10">
          <div className="flex flex-col items-center text-center gap-6 max-w-[781px] mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 backdrop-blur-sm border border-[#37489d]/10 text-sm font-medium text-[#37489d]">
              <Layers className="w-4 h-4" />
              Módulo do Ecossistema AdzHub — Powered by IA
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-[90px] font-bold leading-[100%] tracking-tight text-[#08080C]">
              <span className="block mb-2">Blog</span>
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
              O primeiro módulo da Plataforma de Inteligência em Marketing. Crie, gerencie e publique conteúdo profissional com IA — blog, redes sociais e SEO integrados ao Supercérebro AdzHub.
            </p>
          </div>

          <div className="flex items-center justify-center gap-4 mb-5 flex-wrap">
            <a href="https://app.adzhub.com.br">
              <StarBorder color="hsl(224, 47%, 42%)" speed="8s">
                Começar Grátis
              </StarBorder>
            </a>
            <button className="flex items-center gap-2 text-[#37489d] hover:text-[#37489d]/80 transition-colors">
              <Play className="w-5 h-5" />
              Ver Demonstração
            </button>
          </div>

          <div className="flex items-center justify-center gap-5 flex-wrap mb-14">
            <div className="flex items-center gap-2 min-h-[28px]">
              <span className="text-sm font-medium text-[#08080C]/70">
                Conteúdo gerado por IA e especialistas
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-[hsl(41,100%,58%)] text-[hsl(41,100%,58%)]" />)}
              </div>
              <span className="text-sm font-medium text-[#08080C]/70">+100 empresas</span>
            </div>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="relative max-w-6xl mx-auto px-8">
          <DashboardMockup />
        </div>
      </section>

      {/* Spacer */}
      <div className="h-16" />

      {/* Features Section */}
      <Suspense fallback={<LoadingFallback />}>
        <Features />
      </Suspense>

      {/* Como Funciona Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col lg:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-[649px]">
              <h2 className="text-4xl md:text-6xl lg:text-[72px] font-medium leading-[100%] tracking-tight text-[#08080C] mb-6">
                Simples de usar, poderoso nos resultados
              </h2>
              <p className="text-lg font-medium text-[#6B7280] leading-[170%]">
                Em apenas 3 passos você cria e publica conteúdo profissional para blog e redes sociais com ajuda da IA
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <a href="https://app.adzhub.com.br">
                <StarBorder color="hsl(224, 47%, 42%)" speed="8s">
                  Começar Grátis
                </StarBorder>
              </a>
              <p className="text-base font-medium text-[#6B7280] capitalize">
                sem cartão de crédito
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="rounded-3xl bg-[#F6F6F6] p-8 md:p-10">
              <div className="bg-white rounded-3xl p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#37489d] flex items-center justify-center text-white font-bold text-lg">1</div>
                  <p className="text-lg font-semibold text-[#08080C]">Escolha o tema</p>
                </div>
                <p className="text-sm text-[#6B7280]">
                  Defina o assunto, palavras-chave e o tom de voz. A IA pesquisa referências e sugere estruturas otimizadas.
                </p>
              </div>
              <div className="bg-white rounded-3xl p-4">
                <div className="flex items-center gap-3">
                  <Search className="w-5 h-5 text-[#37489d]" />
                  <div>
                    <p className="text-sm font-medium text-[#08080C]">Pesquisa inteligente</p>
                    <p className="text-xs text-[#6B7280]">5 referências encontradas • SEO analisado</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-[#F6F6F6] p-8 md:p-10">
              <div className="bg-white rounded-3xl p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-[hsl(41,100%,58%)] flex items-center justify-center text-white font-bold text-lg">2</div>
                  <p className="text-lg font-semibold text-[#08080C]">Gere o conteúdo</p>
                </div>
                <p className="text-sm text-[#6B7280]">
                  A IA cria artigos, posts e legendas personalizados. Edite, ajuste o tom e adicione sua identidade visual.
                </p>
              </div>
              <div className="bg-white rounded-3xl p-4">
                <div className="flex items-center gap-3">
                  <PenTool className="w-5 h-5 text-[hsl(41,100%,58%)]" />
                  <div>
                    <p className="text-sm font-medium text-[#08080C]">Artigo gerado</p>
                    <p className="text-xs text-[#6B7280]">1.200 palavras • SEO otimizado</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-[#F6F6F6] p-8 md:p-10">
              <div className="bg-white rounded-3xl p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-lg">3</div>
                  <p className="text-lg font-semibold text-[#08080C]">Publique e acompanhe</p>
                </div>
                <p className="text-sm text-[#6B7280]">
                  Publique direto no blog ou agende para redes sociais. Acompanhe métricas de engajamento e tráfego.
                </p>
              </div>
              <div className="bg-white rounded-3xl p-4">
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-5 h-5 text-emerald-500" />
                  <div>
                    <p className="text-sm font-medium text-[#08080C]">Post publicado</p>
                    <p className="text-xs text-[#6B7280]">340 visualizações • 12% engajamento</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Números Section */}
      <section className="py-24 bg-[#F8F8F8] rounded-3xl mx-5">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-16 gap-8">
            <h2 className="text-4xl md:text-6xl lg:text-[72px] font-medium leading-[100%] tracking-tight text-[#08080C] max-w-[600px]">
              Por que escolher a AdzHub
            </h2>
            <p className="text-lg font-medium text-[#6B7280] leading-[150%] max-w-[363px]">
              Números que comprovam a eficiência da nossa plataforma de criação de conteúdo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl p-6">
              <div className="inline-flex items-center gap-2 px-2 py-1 rounded bg-[hsl(224,47%,42%)]/10 mb-4">
                <div className="w-6 h-6 rounded-full bg-[hsl(224,47%,42%)]"></div>
                <span className="text-base font-medium text-[hsl(224,47%,42%)]">Conteúdos</span>
              </div>
              <div className="flex items-start mb-8">
                <span className="text-6xl md:text-[100px] font-normal leading-[120%] tracking-tight text-[#1F2937]">10K</span>
                <span className="text-3xl md:text-[50px] font-medium leading-[120%] tracking-tight text-[#1F2937]">+</span>
              </div>
              <p className="text-lg font-normal text-[#6B7280] leading-[150%]">
                Artigos e posts criados por mês com ajuda da IA e publicados diretamente na plataforma
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6">
              <div className="inline-flex items-center gap-2 px-2 py-1 rounded bg-[hsl(41,100%,58%)]/10 mb-4">
                <div className="w-6 h-6 rounded-full bg-[hsl(41,100%,58%)]"></div>
                <span className="text-base font-medium text-[hsl(41,100%,58%)]">Economia</span>
              </div>
              <div className="flex items-start mb-8">
                <span className="text-6xl md:text-[100px] font-normal leading-[120%] tracking-tight text-[#1F2937]">80</span>
                <span className="text-3xl md:text-[40px] font-medium leading-[120%] tracking-tight text-[#1F2937]">%</span>
              </div>
              <p className="text-lg font-normal text-[#6B7280] leading-[150%]">
                Redução no tempo de criação de conteúdo comparado ao processo manual tradicional
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6">
              <div className="inline-flex items-center gap-2 px-2 py-1 rounded bg-[hsl(224,47%,42%)]/10 mb-4">
                <div className="w-6 h-6 rounded-full bg-[hsl(224,47%,42%)]"></div>
                <span className="text-base font-medium text-[hsl(224,47%,42%)]">Satisfação</span>
              </div>
              <div className="flex items-start mb-8">
                <span className="text-6xl md:text-[100px] font-normal leading-[120%] tracking-tight text-[#1F2937]">4.9</span>
                <span className="text-3xl md:text-[40px] font-medium leading-[120%] tracking-tight text-[#1F2937]">★</span>
              </div>
              <p className="text-lg font-normal text-[#6B7280] leading-[150%]">
                Avaliação média dos nossos clientes que utilizam a plataforma diariamente
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Funcionalidades Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl lg:text-[72px] font-medium leading-[100%] tracking-tight text-[#08080C] mb-6">
              Conheça as Funcionalidades
            </h2>
            <p className="text-lg font-medium text-[#6B7280] leading-[170%] max-w-[600px] mx-auto">
              Tudo que você precisa para criar, gerenciar e publicar conteúdo de alta qualidade
            </p>
          </div>
          
          <div className="flex justify-center items-center min-h-[400px] mb-16">
            <Suspense fallback={<LoadingFallback />}>
              <DisplayCards
                cards={[
                  {
                    icon: <TrendingUp className="size-4 text-emerald-300" />,
                    title: "Crescimento",
                    description: "Mais tráfego orgânico",
                    date: "Ativo",
                    iconClassName: "text-emerald-500",
                    titleClassName: "text-emerald-500",
                    className:
                      "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
                  },
                  {
                    icon: <Shield className="size-4 text-blue-300" />,
                    title: "Qualidade",
                    description: "Conteúdo profissional",
                    date: "IA + Humano",
                    iconClassName: "text-blue-500",
                    titleClassName: "text-blue-500",
                    className:
                      "[grid-area:stack] translate-x-16 translate-y-10 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
                  },
                  {
                    icon: <Zap className="size-4 text-amber-300" />,
                    title: "Velocidade",
                    description: "Publicação instantânea",
                    date: "Tempo real",
                    iconClassName: "text-amber-500",
                    titleClassName: "text-amber-500",
                    className:
                      "[grid-area:stack] translate-x-32 translate-y-20 hover:translate-y-10",
                  },
                ]}
              />
            </Suspense>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <SpotlightCard
              className="flex flex-col gap-4 rounded-3xl !bg-white !border-primary/10 shadow-2xl"
              spotlightColor="#6300ff30"
            >
              <div className="text-2xl font-bold flex items-center gap-2">
                <Rocket className="text-yellow-500 w-8 h-8" />
                <span className="text-[#08080C]">Criação com IA</span>
              </div>
              <div className="text-[#6B7280]">
                Gere artigos, posts para redes sociais e legendas em minutos com inteligência artificial treinada para marketing.
              </div>
            </SpotlightCard>

            <SpotlightCard
              className="flex flex-col gap-4 rounded-3xl !bg-white !border-primary/10 shadow-2xl"
              spotlightColor="#ff006630"
            >
              <div className="text-2xl font-bold flex items-center gap-2">
                <Sparkles className="text-yellow-500 w-8 h-8" />
                <span className="text-[#08080C]">SEO Automático</span>
              </div>
              <div className="text-[#6B7280]">
                Otimização automática para mecanismos de busca. Palavras-chave, meta tags e estrutura gerados pela IA.
              </div>
            </SpotlightCard>

            <SpotlightCard
              className="flex flex-col gap-4 rounded-3xl !bg-white !border-primary/10 shadow-2xl"
              spotlightColor="#6300ff30"
            >
              <div className="text-2xl font-bold flex items-center gap-2">
                <Target className="text-yellow-500 w-8 h-8" />
                <span className="text-[#08080C]">Resultados Mensuráveis</span>
              </div>
              <div className="text-[#6B7280]">
                Acompanhe tráfego, engajamento e conversões em tempo real com dashboards detalhados.
              </div>
            </SpotlightCard>
          </div>
        </div>
      </section>

      {/* Atributos da Plataforma */}
      <section className="py-24 bg-[#F8F8F8] rounded-3xl mx-5">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl lg:text-[72px] font-medium leading-[100%] tracking-tight text-[#08080C] mb-6">
              Recursos da Plataforma
            </h2>
            <p className="text-lg font-medium text-[#6B7280] leading-[170%] max-w-[600px] mx-auto">
              Tudo que você precisa para gerenciar sua estratégia de conteúdo com eficiência
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <Suspense fallback={<LoadingFallback />}>
                <TiltedScroll
                  items={tiltedScrollItems}
                  className="mt-8"
                />
              </Suspense>
            </div>
            
            <div>
              <Suspense fallback={<LoadingFallback />}>
                <RadialOrbitalTimeline timelineData={timelineData} />
              </Suspense>
            </div>
          </div>
        </div>
      </section>

      {/* Depoimentos Section */}
      <section className="py-24 bg-white relative">
        <div className="container z-10 mx-auto">
          <div className="flex flex-col items-center justify-center max-w-[600px] mx-auto mb-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#37489d]/5 border border-[#37489d]/10 text-sm font-medium text-[#37489d] mb-6">
              Depoimentos
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-center text-[#08080C] mb-4">
              O que nossos clientes dizem
            </h2>
            <p className="text-center text-[#6B7280] text-lg">
              Empresas de todos os tamanhos confiam na AdzHub para transformar sua estratégia de conteúdo em resultados reais.
            </p>
          </div>

          <Suspense fallback={<LoadingFallback />}>
            <div className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden">
              <TestimonialsColumn testimonials={firstColumn} duration={15} />
              <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
              <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
            </div>
          </Suspense>
        </div>
      </section>

      {/* Parte do Ecossistema AdzHub */}
      <section className="py-24 bg-[#F8F8F8] rounded-3xl mx-5">
        <div className="max-w-5xl mx-auto px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#37489d]/10 text-sm font-medium text-[#37489d] mb-6">
              Ecossistema AdzHub
            </div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-medium leading-[100%] tracking-tight text-[#08080C] mb-6">
              O Blog é apenas o começo
            </h2>
            <p className="text-lg font-medium text-[#6B7280] leading-[170%] max-w-[650px] mx-auto">
              Este módulo faz parte de uma plataforma maior: a AdzHub, que combina Supercérebro (IA contextual), 
              módulos integrados e metodologia aplicada para transformar o marketing de PMEs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            <div className="bg-white rounded-2xl p-6 border-2 border-[#37489d]/20 relative">
              <div className="absolute -top-3 left-4 px-3 py-0.5 bg-[#37489d] text-white text-xs font-medium rounded-full">Atual</div>
              <Sparkles className="w-8 h-8 text-[#37489d] mb-3" />
              <h3 className="text-base font-bold text-[#08080C] mb-1">Blog</h3>
              <p className="text-xs text-[#6B7280]">Blog, SEO e conteúdo com IA</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-[#08080C]/10 opacity-60">
              <Zap className="w-8 h-8 text-[#6B7280] mb-3" />
              <h3 className="text-base font-bold text-[#08080C] mb-1">Automações</h3>
              <p className="text-xs text-[#6B7280]">Fluxos inteligentes multi-app</p>
              <span className="text-[10px] text-[#37489d] font-medium">Em breve</span>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-[#08080C]/10 opacity-60">
              <Brain className="w-8 h-8 text-[#6B7280] mb-3" />
              <h3 className="text-base font-bold text-[#08080C] mb-1">Treinamento</h3>
              <p className="text-xs text-[#6B7280]">Trilhas personalizadas com IA</p>
              <span className="text-[10px] text-[#37489d] font-medium">Em breve</span>
            </div>
          </div>

          <div className="text-center">
            <Link to="/" className="inline-flex items-center gap-2 text-[#37489d] font-medium hover:text-[#37489d]/80 transition-colors">
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
