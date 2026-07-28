import { useMemo, lazy, Suspense } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Star, BarChart3, PenTool, Search, Sparkles, Zap, ArrowRight, Brain, Target, BookOpen, ShieldCheck, ExternalLink } from "lucide-react";
import { StarBorder } from "@/components/ui/star-border";
import { testimonials } from "@/data/finestraData";
import { LandingNav } from "@/components/LandingNav";
import { Footer } from "@/components/Footer";
import { useWaitlistDialog } from "@/components/WaitlistDialogProvider";
import { SeoInteractiveMotion } from "@/components/platform-motion";
import { AiBrandLogos } from "@/components/AiBrandLogos";

const TestimonialsColumn = lazy(() => import("@/components/ui/testimonials-columns-1").then(m => ({ default: m.TestimonialsColumn })));
const Features = lazy(() => import("@/components/ui/features-6").then(m => ({ default: m.Features })));

const LoadingFallback = () => <div className="w-full h-32 bg-muted/30 rounded-lg" />;

export default function FinestraLanding() {
  const { openWaitlist } = useWaitlistDialog();
  const firstColumn = useMemo(() => testimonials.slice(0, 3), []);
  const secondColumn = useMemo(() => testimonials.slice(3, 6), []);
  const thirdColumn = useMemo(() => testimonials.slice(6, 9), []);

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>SEO, GEO e posicionamento no Google e em IAs - AdzHub</title>
        <meta
          name="description"
          content="Posicionamos sua marca no Google e nas recomendações de IAs (ChatGPT, Claude, Gemini). Estratégia, produção e publicação por nossa equipe — você acompanha na plataforma."
        />
      </Helmet>

      <LandingNav activeSection="conteudo" />

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden bg-gradient-to-br from-[#D4EFF4]/30 via-[#F9C7B2]/20 to-[#F9B2D4]/20 rounded-[32px] mx-5 mt-[83px]">
        <div className="relative max-w-5xl mx-auto px-8 z-10">
          <div className="flex flex-col items-center text-center gap-6 max-w-[781px] mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 backdrop-blur-sm border border-[#37489d]/10 text-sm font-medium text-[#37489d]">
              <Search className="w-4 h-4 shrink-0" />
              Operação completa de SEO e GEO
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-[3.25rem] xl:text-[3.75rem] font-bold leading-[1.15] tracking-tight text-[#08080C] max-w-4xl mx-auto text-balance">
              Sua marca no topo do Google e das{" "}
              <span className="text-[#37489d]">recomendações das AI</span>{" "}
              <AiBrandLogos className="relative top-[-0.12em]" />
            </h1>
            <p className="text-lg text-[#08080C] opacity-80 max-w-[640px] leading-relaxed">
              Nós cuidamos da estratégia, da produção e da publicação. Você acompanha o posicionamento no Google e
              nas IAs pela plataforma.
            </p>
          </div>

          <div className="flex items-center justify-center mb-5">
            <StarBorder as="button" type="button" onClick={openWaitlist} color="hsl(224, 47%, 42%)" speed="8s">
              Quero posicionar minha marca
            </StarBorder>
          </div>

          <div className="flex items-center justify-center gap-5 flex-wrap mb-14">
            <div className="flex items-center gap-2 min-h-[28px]">
              <span className="text-sm font-medium text-[#08080C]/70">
                Especialistas + IA na operação
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

        <SeoInteractiveMotion id="demo-plataforma" embedded />
      </section>

      <div className="h-8" />

      {/* Features Section */}
      <Suspense fallback={<LoadingFallback />}>
        <Features />
      </Suspense>

      {/* Como Funciona — operação nossa, acompanhamento seu */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col lg:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-[649px]">
              <h2 className="text-4xl md:text-6xl lg:text-[72px] font-medium leading-[100%] tracking-tight text-[#08080C] mb-6">
                Como nós posicionamos sua marca
              </h2>
              <p className="text-lg font-medium text-[#6B7280] leading-[170%]">
                Três etapas da nossa operação. Você acompanha o andamento e os resultados na plataforma.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <StarBorder as="button" type="button" onClick={openWaitlist} color="hsl(224, 47%, 42%)" speed="8s">
                Quero posicionar minha marca
              </StarBorder>
              <p className="text-base font-medium text-[#6B7280]">
                Sem gerir um departamento inteiro
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="rounded-3xl bg-[#F6F6F6] p-8 md:p-10">
              <div className="bg-white rounded-3xl p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#37489d] flex items-center justify-center text-white font-bold text-lg">1</div>
                  <p className="text-lg font-semibold text-[#08080C]">Diagnóstico e estratégia</p>
                </div>
                <p className="text-sm text-[#6B7280]">
                  Analisamos seu site, palavras-chave e concorrência. Definimos o mapa editorial de SEO e GEO para
                  Google e IAs.
                </p>
              </div>
              <div className="bg-white rounded-3xl p-4">
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5 text-[#37489d]" />
                  <div>
                    <p className="text-sm font-medium text-[#08080C]">Plano de posicionamento</p>
                    <p className="text-xs text-[#6B7280]">Oportunidades + prioridades no GSC</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-[#F6F6F6] p-8 md:p-10">
              <div className="bg-white rounded-3xl p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-[hsl(41,100%,58%)] flex items-center justify-center text-white font-bold text-lg">2</div>
                  <p className="text-lg font-semibold text-[#08080C]">Produção pela nossa equipe</p>
                </div>
                <p className="text-sm text-[#6B7280]">
                  Especialistas e IA produzem artigos, capas e metadados com o contexto da sua marca — prontos para
                  publicar.
                </p>
              </div>
              <div className="bg-white rounded-3xl p-4">
                <div className="flex items-center gap-3">
                  <PenTool className="w-5 h-5 text-[hsl(41,100%,58%)]" />
                  <div>
                    <p className="text-sm font-medium text-[#08080C]">Conteúdo na operação</p>
                    <p className="text-xs text-[#6B7280]">SEO + GEO no mesmo fluxo</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-[#F6F6F6] p-8 md:p-10">
              <div className="bg-white rounded-3xl p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-lg">3</div>
                  <p className="text-lg font-semibold text-[#08080C]">Publicação e acompanhamento</p>
                </div>
                <p className="text-sm text-[#6B7280]">
                  Publicamos no seu site e você acompanha desempenho, cliques e evolução do posicionamento na
                  plataforma.
                </p>
              </div>
              <div className="bg-white rounded-3xl p-4">
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-5 h-5 text-emerald-500" />
                  <div>
                    <p className="text-sm font-medium text-[#08080C]">Resultado na plataforma</p>
                    <p className="text-xs text-[#6B7280]">Métricas + próximo ciclo editorial</p>
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
            <p className="text-lg font-medium text-[#6B7280] leading-[150%] max-w-[420px]">
              Não é ferramenta genérica de geração de blogs com AI. É{" "}
              <strong className="font-semibold text-[#08080C]">operação de posicionamento</strong> com método, time e
              plataforma para você acompanhar. Afinal, gestão de texto genérico qualquer um faz com o ChatGPT e uma
              planilha.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl p-6">
              <div className="inline-flex items-center gap-2 px-2 py-1 rounded bg-[hsl(224,47%,42%)]/10 mb-4">
                <div className="w-6 h-6 rounded-full bg-[hsl(224,47%,42%)]"></div>
                <span className="text-base font-medium text-[hsl(224,47%,42%)]">Nós executamos</span>
              </div>
              <div className="flex items-start mb-8">
                <span className="text-6xl md:text-[100px] font-normal leading-[120%] tracking-tight text-[#1F2937]">1</span>
                <span className="text-3xl md:text-[50px] font-medium leading-[120%] tracking-tight text-[#1F2937] pl-1 pt-4 md:pt-8">
                  operação
                </span>
              </div>
              <p className="text-lg font-normal text-[#6B7280] leading-[150%]">
                Estratégia, produção e publicação ficam com a gente. Você{" "}
                <strong className="font-medium text-[#1F2937]">acompanha e aprova</strong> na plataforma.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6">
              <div className="inline-flex items-center gap-2 px-2 py-1 rounded bg-[hsl(41,100%,58%)]/10 mb-4">
                <div className="w-6 h-6 rounded-full bg-[hsl(41,100%,58%)]"></div>
                <span className="text-base font-medium text-[hsl(41,100%,58%)]">Marca &amp; SEO</span>
              </div>
              <div className="flex items-start mb-8">
                <span className="text-6xl md:text-[100px] font-normal leading-[120%] tracking-tight text-[#1F2937]">0</span>
                <span className="text-3xl md:text-[40px] font-medium leading-[120%] tracking-tight text-[#1F2937] pl-1 pt-4 md:pt-10">
                  genérico
                </span>
              </div>
              <p className="text-lg font-normal text-[#6B7280] leading-[150%]">
                Prompt em ferramenta aberta não guarda seu posicionamento. Aqui a operação trabalha com o{" "}
                <strong className="font-medium text-[#1F2937]">contexto da sua empresa</strong> e regras de SEO e GEO
                para Google e IAs.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6">
              <div className="inline-flex items-center gap-2 px-2 py-1 rounded bg-[hsl(224,47%,42%)]/10 mb-4">
                <div className="w-6 h-6 rounded-full bg-[hsl(224,47%,42%)]"></div>
                <span className="text-base font-medium text-[hsl(224,47%,42%)]">Resultado mensurável</span>
              </div>
              <div className="flex items-start mb-8">
                <span className="text-6xl md:text-[100px] font-normal leading-[120%] tracking-tight text-[#1F2937]">100</span>
                <span className="text-3xl md:text-[40px] font-medium leading-[120%] tracking-tight text-[#1F2937]">%</span>
              </div>
              <p className="text-lg font-normal text-[#6B7280] leading-[150%]">
                Você vê desempenho e evolução{" "}
                <strong className="font-medium text-[#1F2937]">no mesmo lugar</strong> em que a operação acontece.
                Ferramenta + execução, sem waitlist de produto solto.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Guia oficial Google — SEO + IA */}
      <section className="py-20 sm:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#37489d]/5 border border-[#37489d]/10 text-sm font-medium text-[#37489d] mb-6">
              <ShieldCheck className="w-4 h-4" />
              Documentação oficial do Google
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium leading-[110%] tracking-tight text-[#08080C] mb-5">
              Conteúdo criado conforme práticas de IA recomendadas pelo próprio Google
            </h2>
            <p className="text-lg text-[#6B7280] leading-[170%] max-w-2xl mx-auto">
              A AdzHub utiliza uma metodologia proprietária baseada nas orientações oficiais do Google sobre o SEO
              vigente (2026) e otimização para recursos de IA generativa, não com “truques” de AEO/GEO inventados na
              internet.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 mb-10">
            <div className="rounded-2xl border border-[#08080C]/8 bg-[#F8F8F8] p-5">
              <BookOpen className="w-6 h-6 text-[#37489d] mb-3" />
              <h3 className="text-base font-semibold text-[#08080C] mb-2">SEO continua valendo</h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">
                Aparecer nas respostas de IA do Google segue as mesmas regras de um bom site: conteúdo útil, claro e
                feito para pessoas de verdade.
              </p>
            </div>
            <div className="rounded-2xl border border-[#08080C]/8 bg-[#F8F8F8] p-5">
              <Sparkles className="w-6 h-6 text-[#37489d] mb-3" />
              <h3 className="text-base font-semibold text-[#08080C] mb-2">Conteúdo com a cara da marca</h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">
                Nada de texto genérico que qualquer um gera no ChatGPT. Criamos conteúdo com o ponto de vista e a
                experiência da sua empresa.
              </p>
            </div>
            <div className="rounded-2xl border border-[#08080C]/8 bg-[#F8F8F8] p-5">
              <BarChart3 className="w-6 h-6 text-[#37489d] mb-3" />
              <h3 className="text-base font-semibold text-[#08080C] mb-2">Base técnica em ordem</h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">
                Site rápido, páginas encontradas pelo Google e acompanhamento no Search Console — o básico bem feito
                para a marca ser encontrada.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-[#37489d]/15 bg-[#37489d]/[0.04] p-6 sm:p-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-xl">
              <p className="text-sm font-medium text-[#37489d] mb-1">Fonte oficial</p>
              <p className="text-base text-[#08080C] leading-relaxed">
                Não siga modinha: usamos as recomendações oficiais do próprio Google Developers.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 shrink-0">
              <a
                href="https://developers.google.com/search/docs/fundamentals/ai-optimization-guide?hl=pt-br"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#37489d] px-5 py-3 text-sm font-semibold text-white hover:bg-[#2f3d86] transition-colors"
              >
                Ver guia do Google
                <ExternalLink className="w-4 h-4" />
              </a>
              <a
                href="https://open.spotify.com/episode/4HcSiDWhacwoUXihnUUN23?si=eHq2fVDpQ0OlqszBDHo43A"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1DB954] px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#1ed760] transition-colors"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                </svg>
                Ouvir no Spotify
              </a>
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
              Empresas que já operam posicionamento orgânico com a AdzHub — método, conteúdo e acompanhamento.
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
              <p className="text-xs text-[#6B7280]">SEO, GEO e conteúdo com operação</p>
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
