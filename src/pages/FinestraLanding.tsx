import { useMemo, lazy, Suspense } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Star, BarChart3, PenTool, Search, Sparkles, Zap, ArrowRight, Brain, BookOpen, ShieldCheck, ExternalLink } from "lucide-react";
import { StarBorder } from "@/components/ui/star-border";
import { testimonials } from "@/data/finestraData";
import { LandingNav } from "@/components/LandingNav";
import { Footer } from "@/components/Footer";
import { useWaitlistDialog } from "@/components/WaitlistDialogProvider";
import { SeoInteractiveMotion } from "@/components/platform-motion";
import { AiBrandLogos } from "@/components/AiBrandLogos";
import { ArticleSeoAnalyzer } from "@/components/seo/ArticleSeoAnalyzer";
import { ColorOrb } from "@/components/ui/ColorOrb";

const TestimonialsColumn = lazy(() => import("@/components/ui/testimonials-columns-1").then(m => ({ default: m.TestimonialsColumn })));
const Features = lazy(() => import("@/components/ui/features-6").then(m => ({ default: m.Features })));

const LoadingFallback = () => <div className="w-full h-32 bg-muted/30 rounded-lg" />;

const ADZ_ORB_TONES = {
  base: "oklch(95% 0.05 330)",
  accent1: "oklch(70% 0.18 50)",
  accent2: "oklch(62% 0.24 280)",
  accent3: "oklch(40% 0.15 265)",
};

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
      <section className="relative mx-3 mt-[75px] overflow-hidden rounded-[24px] bg-gradient-to-br from-[#D4EFF4]/30 via-[#F9C7B2]/20 to-[#F9B2D4]/20 pb-10 pt-12 sm:mx-5 sm:mt-[83px] sm:rounded-[32px] sm:pb-16 sm:pt-20">
        <div className="relative z-10 mx-auto max-w-5xl px-5 sm:px-8">
          <div className="mx-auto mb-8 flex max-w-[781px] flex-col items-center gap-4 text-center sm:mb-10 sm:gap-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 backdrop-blur-sm border border-[#37489d]/10 text-sm font-medium text-[#37489d]">
              <Search className="w-4 h-4 shrink-0" />
              Operação completa de SEO e GEO
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-[3.25rem] xl:text-[3.75rem] font-bold leading-[1.15] tracking-tight text-[#08080C] max-w-4xl mx-auto text-balance">
              Sua marca no topo do Google e das{" "}
              <span className="text-[#37489d]">recomendações das AI</span>{" "}
              <AiBrandLogos className="relative top-[-0.12em]" />
            </h1>
            <p className="max-w-[640px] text-base leading-relaxed text-[#08080C]/80 sm:text-lg">
              <span className="sm:hidden">
                Estratégia, produção e publicação para posicionar sua marca no Google e nas IAs.
              </span>
              <span className="hidden sm:inline">
              Nós cuidamos da estratégia, da produção e da publicação. Você acompanha o posicionamento no Google e
              nas IAs pela plataforma.
              </span>
            </p>
          </div>

          <div className="flex items-center justify-center mb-5">
            <StarBorder as="button" type="button" onClick={openWaitlist} color="hsl(224, 47%, 42%)" speed="8s">
              Solicitar Demonstração
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

      {/* Números Section */}
      <section className="mx-3 rounded-3xl bg-[#F8F8F8] py-10 sm:mx-5 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <div className="mb-7 max-w-2xl sm:mb-12">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#37489d] sm:text-sm">
              Diferenciais
            </p>
            <h2 className="text-3xl font-semibold leading-tight tracking-tight text-[#08080C] sm:text-5xl">
              Por que escolher a AdzHub
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[#6B7280] sm:mt-4 sm:text-lg">
              Time, contexto e dados trabalhando no mesmo fluxo.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-5">
            <article className="group relative overflow-hidden rounded-2xl border border-[#37489d]/10 bg-white p-4 sm:rounded-3xl sm:p-6">
              <span className="absolute right-4 top-3 text-4xl font-bold text-[#37489d]/[0.06] sm:right-6 sm:top-4 sm:text-6xl">
                01
              </span>
              <div className="relative flex items-start gap-3 md:block">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#37489d] sm:h-12 sm:w-12 md:mb-6">
                  <PenTool className="h-5 w-5 text-white sm:h-6 sm:w-6" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-[#08080C] sm:text-xl">Execução ponta a ponta</h3>
                  <p className="mt-1 text-sm leading-relaxed text-[#6B7280] sm:mt-2 sm:text-base">
                    Planejamos, produzimos e publicamos. Você acompanha e aprova.
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-[11px] font-medium text-[#37489d] sm:mt-7 sm:text-xs">
                {["Estratégia", "Produção", "Publicação"].map((step, index) => (
                  <div key={step} className="contents">
                    {index > 0 && <ArrowRight className="h-3 w-3 shrink-0 opacity-45" />}
                    <span className="rounded-full bg-[#37489d]/8 px-2 py-1">{step}</span>
                  </div>
                ))}
              </div>
            </article>

            <article className="group relative overflow-hidden rounded-2xl border border-amber-200/60 bg-white p-4 sm:rounded-3xl sm:p-6">
              <span className="absolute right-4 top-3 text-4xl font-bold text-amber-500/[0.08] sm:right-6 sm:top-4 sm:text-6xl">
                02
              </span>
              <div className="relative flex items-start gap-3 md:block">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500 sm:h-12 sm:w-12 md:mb-6">
                  <ShieldCheck className="h-5 w-5 text-white sm:h-6 sm:w-6" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-[#08080C] sm:text-xl">Conteúdo com contexto</h3>
                  <p className="mt-1 text-sm leading-relaxed text-[#6B7280] sm:mt-2 sm:text-base">
                    Sua marca, experiência e posicionamento orientam cada conteúdo.
                  </p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5 text-[11px] font-medium text-amber-800 sm:mt-7 sm:text-xs">
                <span className="rounded-full bg-amber-100 px-2.5 py-1">Marca</span>
                <span className="rounded-full bg-amber-100 px-2.5 py-1">SEO</span>
                <span className="rounded-full bg-amber-100 px-2.5 py-1">GEO</span>
              </div>
            </article>

            <article className="group relative overflow-hidden rounded-2xl border border-emerald-200/70 bg-white p-4 sm:rounded-3xl sm:p-6">
              <span className="absolute right-4 top-3 text-4xl font-bold text-emerald-500/[0.08] sm:right-6 sm:top-4 sm:text-6xl">
                03
              </span>
              <div className="relative flex items-start gap-3 md:block">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500 sm:h-12 sm:w-12 md:mb-6">
                  <BarChart3 className="h-5 w-5 text-white sm:h-6 sm:w-6" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-[#08080C] sm:text-xl">Evolução visível</h3>
                  <p className="mt-1 text-sm leading-relaxed text-[#6B7280] sm:mt-2 sm:text-base">
                    Cliques, impressões e posicionamento em um único painel.
                  </p>
                </div>
              </div>
              <div className="mt-4 flex h-7 items-end gap-1 rounded-xl bg-emerald-50 px-3 pb-2 pt-1 sm:mt-7 sm:h-9">
                {[28, 42, 38, 58, 72, 88].map((height, index) => (
                  <span
                    key={index}
                    className="flex-1 rounded-sm bg-emerald-500/70"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Guia oficial Google — SEO + IA */}
      <section className="bg-white py-14 md:py-24">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <div className="mb-8 text-center sm:mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#37489d]/5 border border-[#37489d]/10 text-sm font-medium text-[#37489d] mb-6">
              <ShieldCheck className="w-4 h-4" />
              Documentação oficial do Google
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium leading-[110%] tracking-tight text-[#08080C] mb-5">
              Seguimos as práticas de IA recomendadas pelo próprio Google
            </h2>
            <p className="mx-auto hidden max-w-2xl text-base leading-relaxed text-[#6B7280] md:block md:text-lg md:leading-[170%]">
              A AdzHub utiliza uma metodologia proprietária baseada nas orientações oficiais do Google sobre o SEO
              vigente (2026) e otimização para recursos de IA generativa, não com “truques” de AEO/GEO inventados na
              internet.
            </p>
          </div>

          <div className="mb-10 hidden grid-cols-3 gap-4 md:grid">
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
              <h3 className="text-base font-semibold text-[#08080C] mb-2">AdzSEO Analytics</h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">
                Site rápido, páginas encontradas pelo Google e acompanhamento no Search Console — o básico bem feito
                para a marca ser encontrada.
              </p>
            </div>
          </div>

          <div className="hidden rounded-2xl border border-[#37489d]/15 bg-[#37489d]/[0.04] p-6 md:flex md:flex-row md:items-center md:justify-between md:gap-5 md:p-8">
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

      {/* Avaliar artigo — AdzSEO Analytics (fluxo real) */}
      <section id="avaliar-artigo" className="scroll-mt-28 bg-[#F8F8F8] py-14 sm:py-24">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#37489d]/10 text-sm font-medium text-[#37489d] mb-6">
              <BarChart3 className="w-4 h-4" />
              AdzSEO Analytics
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium leading-[110%] tracking-tight text-[#08080C] mb-4">
              Avalie um artigo agora mesmo
            </h2>
            <p className="text-lg text-[#6B7280] leading-[170%] max-w-2xl mx-auto">
              Envie a URL ou o texto. E receba a auditoria da AdzHub.
            </p>
          </div>
          <ArticleSeoAnalyzer />
        </div>
      </section>

      {/* Depoimentos Section */}
      <section className="relative bg-white py-14 sm:py-20">
        <div className="container z-10 mx-auto px-5 sm:px-8">
          <div className="mx-auto mb-2 flex max-w-[600px] flex-col items-center justify-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#37489d]/10 bg-[#37489d]/5 px-4 py-1.5 text-sm font-medium text-[#37489d] sm:mb-6">
              Depoimentos
            </div>
            <h2 className="mb-2 text-center text-3xl font-bold tracking-tight text-[#08080C] sm:mb-4 md:text-5xl">
              O que nossos clientes dizem
            </h2>
            <p className="hidden text-center text-lg text-[#6B7280] sm:block">
              Empresas que já operam posicionamento orgânico com a AdzHub — método, conteúdo e acompanhamento.
            </p>
          </div>

          <Suspense fallback={<LoadingFallback />}>
            <div className="mt-5 flex max-h-[360px] justify-center gap-6 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_18%,black_82%,transparent)] sm:mt-8 sm:max-h-[480px] lg:max-h-[520px]">
              <TestimonialsColumn testimonials={firstColumn} duration={15} />
              <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
              <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
            </div>
          </Suspense>
        </div>
      </section>

      {/* Parte do Ecossistema AdzHub */}
      <section className="mx-5 hidden rounded-3xl bg-[#F8F8F8] py-24 md:block">
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

      <Footer ctaLabel="Solicitar Demonstração" />

      <div className="pointer-events-none fixed inset-x-0 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-50 flex justify-center px-4 md:hidden">
        <button
          type="button"
          onClick={openWaitlist}
          className="pointer-events-auto inline-flex h-14 items-center justify-center gap-3 rounded-full bg-[#37489d] pl-4 pr-7 text-base font-semibold text-white shadow-[0_10px_30px_-8px_rgba(55,72,157,0.55)] transition-colors active:bg-[#2f3d86]"
        >
          <ColorOrb dimension="28px" tones={ADZ_ORB_TONES} />
          Solicitar Demonstração
        </button>
      </div>
    </div>
  );
}
