import { useMemo, lazy, Suspense } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Star, BarChart3, PenTool, Search, Sparkles, Zap, ArrowRight, Brain, Target } from "lucide-react";
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
          content="Posicionamos sua marca no Google e nas recomendações de IAs (ChatGPT, Claude, Gemini). Estratégia, produção e publicação done-for-you — você acompanha na plataforma."
        />
      </Helmet>

      <LandingNav activeSection="conteudo" />

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden bg-gradient-to-br from-[#D4EFF4]/30 via-[#F9C7B2]/20 to-[#F9B2D4]/20 rounded-[32px] mx-5 mt-[83px]">
        <div className="relative max-w-5xl mx-auto px-8 z-10">
          <div className="flex flex-col items-center text-center gap-6 max-w-[781px] mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 backdrop-blur-sm border border-[#37489d]/10 text-sm font-medium text-[#37489d]">
              <Search className="w-4 h-4 shrink-0" />
              Operação done-for-you de SEO e GEO
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-[3.25rem] xl:text-[3.75rem] font-bold leading-[1.08] tracking-tight text-[#08080C] max-w-4xl mx-auto">
              Sua marca no topo do Google e das{" "}
              <span className="inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-2">
                <span className="text-[#37489d]">recomendações das AI</span>
                <AiBrandLogos />
              </span>
            </h1>
            <p className="text-lg text-[#08080C] opacity-80 max-w-[640px] leading-relaxed">
              Nós cuidamos da estratégia, da produção e da publicação. Você acompanha o posicionamento no Google e
              nas IAs pela plataforma — sem montar time interno nem virar ponte entre ferramentas.
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
                Sem montar departamento interno
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
                  <p className="text-lg font-semibold text-[#08080C]">Produção done-for-you</p>
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
              Não é waitlist de ferramenta solta. É{" "}
              <strong className="font-semibold text-[#08080C]">operação de posicionamento</strong> com método, time e
              plataforma para você acompanhar — sem virar ponte entre ChatGPT, CMS e planilhas.
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
                <strong className="font-medium text-[#1F2937]">acompanha e aprova</strong> na plataforma — não precisa
                montar fluxo interno do zero.
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
