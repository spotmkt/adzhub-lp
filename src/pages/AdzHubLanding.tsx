import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Play, Star, Brain, Target, Users, Sparkles, TrendingUp, Zap, Mail, ArrowRight, Layers, BookOpen } from "lucide-react";
import { StarBorder } from "@/components/ui/star-border";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { LandingNav } from "@/components/LandingNav";
import { Footer } from "@/components/Footer";
import { DashboardMockup } from "@/components/DashboardMockup";

export default function AdzHubLanding() {
  const [titleNumber, setTitleNumber] = useState(0);
  
  const titles = useMemo(
    () => ["+Inteligente", "+Estratégico", "+Simples", "+Acessível", "+Eficiente"],
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
        <title>AdzHub - Plataforma de Inteligência em Marketing | AI-First para PMEs</title>
        <meta name="description" content="A infraestrutura AI-First que conecta profissionais de marketing e PMEs com metodologias, automações e inteligência artificial integrada — tornando serviços de marketing acessíveis e escaláveis." />
        <meta property="og:title" content="AdzHub - Plataforma de Inteligência em Marketing AI-First" />
        <meta property="og:description" content="Conectamos profissionais e PMEs com metodologia, automação e IA para acelerar o desenvolvimento empresarial." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://adzhub.com.br/" />
      </Helmet>

      <LandingNav activeSection="home" />

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden bg-gradient-to-br from-[#D4EFF4]/30 via-[#F9C7B2]/20 to-[#F9B2D4]/20 rounded-[32px] mx-5 mt-[83px]">
        <div className="relative max-w-5xl mx-auto px-8 z-10">
          <div className="flex flex-col items-center text-center gap-6 max-w-[781px] mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 backdrop-blur-sm border border-[#37489d]/10 text-sm font-medium text-[#37489d]">
              <Sparkles className="w-4 h-4" />
              A IA de marketing que substitui todas as outras
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-[90px] font-bold leading-[100%] tracking-tight text-[#08080C]">
              <span className="block mb-2">Marketing</span>
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
              A infraestrutura AI-First que conecta profissionais de marketing e PMEs com metodologias, 
              automações e inteligência artificial integrada — tornando serviços de marketing acessíveis e escaláveis.
            </p>
          </div>

          <div className="flex items-center justify-center gap-4 mb-5 flex-wrap">
            <a href="#sobre">
              <StarBorder color="hsl(224, 47%, 42%)" speed="8s">
                Conheça a Plataforma
              </StarBorder>
            </a>
            <Link to="/conteudo">
              <button className="flex items-center gap-2 text-[#37489d] hover:text-[#37489d]/80 transition-colors">
                <Play className="w-5 h-5" />
                Ver Vídeo
              </button>
            </Link>
          </div>

          <div className="flex items-center justify-center gap-5 flex-wrap">
            <div className="flex items-center gap-2 min-h-[28px]">
              <span className="text-sm font-medium text-[#08080C]/70">
                +200 empresas atendidas
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[hsl(41,100%,58%)] text-[hsl(41,100%,58%)]" />
                ))}
              </div>
              <span className="text-sm font-medium text-[#08080C]/70">+9 anos de experiência</span>
            </div>
          </div>
        </div>
      </section>

      {/* Palavras-chave da Tese */}
      <section className="pt-8 -mb-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-8">
            <span className="text-[#6B7280] text-lg font-medium">
              Construída sobre quase uma década de experiência real.
            </span>
            <br />
            <span className="text-[#08080C] text-lg font-medium">
              Validada com +200 PMEs brasileiras.
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-[#08080C] mb-8">
            <div className="flex items-center justify-center">
              <div className="text-center">
                <Brain className="w-10 h-10 mx-auto mb-2 text-[#37489d]" />
                <p className="text-sm font-semibold">AI-First</p>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="text-center">
                <Target className="w-10 h-10 mx-auto mb-2 text-[#37489d]" />
                <p className="text-sm font-semibold">Metodologia</p>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="text-center">
                <Layers className="w-10 h-10 mx-auto mb-2 text-[#37489d]" />
                <p className="text-sm font-semibold">Plataforma</p>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="text-center">
                <Zap className="w-10 h-10 mx-auto mb-2 text-[#37489d]" />
                <p className="text-sm font-semibold">SaaS Vertical</p>
              </div>
            </div>
            <div className="flex items-center justify-center col-span-2 md:col-span-1">
              <div className="text-center">
                <TrendingUp className="w-10 h-10 mx-auto mb-2 text-[#37489d]" />
                <p className="text-sm font-semibold">Sócio-Econômico</p>
              </div>
            </div>
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
                75% das PMEs não atingem suas metas de marketing
              </h2>
              <p className="text-lg font-medium text-[#6B7280] leading-[170%]">
                As empresas não fracassam por uma segmentação errada ou copy ruim. Fracassam porque não têm 
                clareza sobre seus diferenciais, competidores, perfil de cliente ideal e como realmente geram valor. 
                O marketing deveria ser o motor estratégico da empresa — não apenas compra de mídia.
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
                <p className="text-sm font-medium mb-1">A AdzHub nasce para corrigir esse gargalo</p>
                <p className="text-xs text-white/70">Padronizando e multiplicando o conhecimento aplicado em um sistema inteligente e escalável</p>
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
                Arquitetura da Plataforma
              </div>
              <h2 className="text-4xl md:text-6xl lg:text-[72px] font-medium leading-[100%] tracking-tight text-[#08080C]">
                O sistema operacional do marketing
              </h2>
            </div>
            <p className="text-lg font-medium text-[#6B7280] leading-[150%] max-w-[400px]">
              Substituímos planilhas, múltiplos softwares e dependência de terceiros por um sistema que pensa, executa e aprende junto com o negócio.
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

          <div className="mt-10 bg-white rounded-2xl p-6 border border-[#37489d]/10 max-w-3xl mx-auto">
            <p className="text-center text-[#6B7280] text-sm leading-relaxed">
              <span className="font-semibold text-[#37489d]">Na prática:</span> quando o módulo de Treinamento for implementado, o Supercérebro identifica lacunas de aprendizado e sugere trilhas personalizadas. Cada módulo amplia a inteligência de todo o ecossistema.
            </p>
          </div>
        </div>
      </section>

      {/* Nossos Produtos */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#37489d]/5 border border-[#37489d]/10 text-sm font-medium text-[#37489d] mb-6">
              Módulos da Plataforma
            </div>
            <h2 className="text-4xl md:text-6xl lg:text-[72px] font-medium leading-[100%] tracking-tight text-[#08080C] mb-6">
              Nossos Produtos
            </h2>
            <p className="text-lg font-medium text-[#6B7280] leading-[170%] max-w-[650px] mx-auto">
              Cada módulo funciona de forma integrada ao Supercérebro e pode ser utilizado de forma independente ou junto ao ecossistema completo.
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
                  <p className="text-sm text-[#6B7280]">Agentes de IA especializados</p>
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
              <Link to="/chat" className="inline-flex items-center gap-2 text-[#37489d] font-medium hover:text-[#37489d]/80 transition-colors">
                Conhecer o AdzChat
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Blog Card */}
            <div className="bg-gradient-to-br from-[#D4EFF4]/20 to-[#F9C7B2]/10 rounded-3xl p-8 md:p-10 border border-[hsl(41,100%,58%)]/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[hsl(41,100%,58%)] flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#08080C]">Blog</h3>
                  <p className="text-sm text-[#6B7280]">Blog, SEO e conteúdo com IA</p>
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
              <Link to="/conteudo" className="inline-flex items-center gap-2 text-[#37489d] font-medium hover:text-[#37489d]/80 transition-colors">
                Conhecer Blog
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Dashboard Mockup */}
          <div className="mt-8">
            <DashboardMockup />
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
              Um ecossistema, dois beneficiados
            </h2>
            <p className="text-lg font-medium text-[#6B7280] leading-[170%] max-w-[700px] mx-auto">
              Conectamos profissionais de marketing e PMEs em um ambiente unificado. O resultado: 
              serviços de marketing acessíveis, escaláveis e orientados a resultados.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
            <div className="bg-white rounded-3xl p-8 md:p-10 border border-[#37489d]/10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-[#37489d] flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#08080C]">Para Profissionais</h3>
                  <p className="text-sm text-[#6B7280]">A melhor infraestrutura de IA para marketing</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-[#37489d]/5 rounded-xl">
                  <ArrowRight className="w-4 h-4 text-[#37489d] flex-shrink-0" />
                  <span className="text-sm text-[#08080C]">Alta remuneração prestando serviços de forma autônoma</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-[#37489d]/5 rounded-xl">
                  <ArrowRight className="w-4 h-4 text-[#37489d] flex-shrink-0" />
                  <span className="text-sm text-[#08080C]">Automações de IA que eliminam tarefas operacionais</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-[#37489d]/5 rounded-xl">
                  <ArrowRight className="w-4 h-4 text-[#37489d] flex-shrink-0" />
                  <span className="text-sm text-[#08080C]">Metodologia guiada para executar com consistência</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 md:p-10 border border-[hsl(41,100%,58%)]/30">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-[hsl(41,100%,58%)] flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#08080C]">Para Empresas</h3>
                  <p className="text-sm text-[#6B7280]">Marketing estratégico acessível e escalável</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-[hsl(41,100%,58%)]/5 rounded-xl">
                  <ArrowRight className="w-4 h-4 text-[hsl(41,100%,58%)] flex-shrink-0" />
                  <span className="text-sm text-[#08080C]">Acesso a serviços especializados com baixo custo</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-[hsl(41,100%,58%)]/5 rounded-xl">
                  <ArrowRight className="w-4 h-4 text-[hsl(41,100%,58%)] flex-shrink-0" />
                  <span className="text-sm text-[#08080C]">Motor de execução estratégica para o negócio</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-[hsl(41,100%,58%)]/5 rounded-xl">
                  <ArrowRight className="w-4 h-4 text-[hsl(41,100%,58%)] flex-shrink-0" />
                  <span className="text-sm text-[#08080C]">Dados e contexto que nunca se perdem</span>
                </div>
              </div>
            </div>
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

      {/* Números e Mercado */}
      <section id="empresas" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#37489d]/5 border border-[#37489d]/10 text-sm font-medium text-[#37489d] mb-6">
              Mercado e Oportunidade
            </div>
            <h2 className="text-4xl md:text-6xl lg:text-[72px] font-medium leading-[100%] tracking-tight text-[#08080C] mb-6">
              Um mercado de R$ 63 bilhões
            </h2>
            <p className="text-lg font-medium text-[#6B7280] leading-[170%] max-w-[700px] mx-auto">
              90% das empresas ativas no Brasil são PMEs sem acesso a marketing estratégico. 
              48% já investem em marketing digital — mas não conseguem extrair valor real.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div className="bg-[#F6F6F6] rounded-2xl p-6 text-center">
              <div className="text-3xl md:text-4xl font-bold text-[#37489d] mb-2">11M+</div>
              <div className="text-sm text-[#6B7280]">CNPJs ativos no Brasil (excluindo MEIs)</div>
            </div>
            <div className="bg-[#F6F6F6] rounded-2xl p-6 text-center">
              <div className="text-3xl md:text-4xl font-bold text-[#37489d] mb-2">+200</div>
              <div className="text-sm text-[#6B7280]">Empresas atendidas pela nossa metodologia</div>
            </div>
            <div className="bg-[#F6F6F6] rounded-2xl p-6 text-center">
              <div className="text-3xl md:text-4xl font-bold text-[#37489d] mb-2">+9</div>
              <div className="text-sm text-[#6B7280]">Anos de experiência em marketing para PMEs</div>
            </div>
            <div className="bg-[#F6F6F6] rounded-2xl p-6 text-center">
              <div className="text-3xl md:text-4xl font-bold text-[#37489d] mb-2">R$ 30M+</div>
              <div className="text-sm text-[#6B7280]">Investidos em marketing digital ao longo da operação</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-12">
            <div className="bg-[#37489d] rounded-3xl p-8 text-white">
              <p className="text-sm font-medium text-white/60 mb-2">TAM — Total Available Market</p>
              <div className="text-3xl font-bold mb-3">R$ 63 bi/ano</div>
              <p className="text-sm text-white/80 leading-relaxed">
                Todas as PMEs que investem em marketing pago no Brasil e poderiam migrar para um modelo recorrente e escalável.
              </p>
            </div>
            <div className="bg-[#F6F6F6] rounded-3xl p-8">
              <p className="text-sm font-medium text-[#37489d] mb-2">SAM — Serviceable Market</p>
              <div className="text-3xl font-bold text-[#08080C] mb-3">R$ 16 bi/ano</div>
              <p className="text-sm text-[#6B7280] leading-relaxed">
                PMEs de serviços, comércio e indústria leve sem marketing interno estruturado, com ticket até R$ 3-5k/mês.
              </p>
            </div>
            <div className="bg-[#F6F6F6] rounded-3xl p-8">
              <p className="text-sm font-medium text-[#37489d] mb-2">SOM — Obtainable Market</p>
              <div className="text-3xl font-bold text-[#08080C] mb-3">R$ 120M ARR</div>
              <p className="text-sm text-[#6B7280] leading-relaxed">
                Meta de 10.000 clientes recorrentes em 4 anos. O maior player atual opera 5.000 clientes via franquias.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#F6F6F6] rounded-3xl p-8">
              <h3 className="text-xl font-bold text-[#08080C] mb-4">Premissas do Modelo</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#37489d] mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-[#6B7280]"><span className="font-semibold text-[#08080C]">Escala:</span> Modelo Plataforma (produtor/consumidor) + IA, dissociação entre ativo de tempo e valor gerado</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#37489d] mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-[#6B7280]"><span className="font-semibold text-[#08080C]">Fosso:</span> Camada de Metodologia integrada — única e não replicável</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#37489d] mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-[#6B7280]"><span className="font-semibold text-[#08080C]">Retenção:</span> Dados de estratégia e contexto gerados dentro da plataforma como mecanismo orgânico</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#37489d] mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-[#6B7280]"><span className="font-semibold text-[#08080C]">Flywheel:</span> Módulos geram sinergia, aumentando aquisição, upsell e valor gerado</p>
                </div>
              </div>
            </div>

            <div className="bg-[#F6F6F6] rounded-3xl p-8">
              <h3 className="text-xl font-bold text-[#08080C] mb-4">Caso de Validação: SPOT MKT</h3>
              <p className="text-sm text-[#6B7280] mb-4">
                Resultados após implementação da metodologia AdzHub na operação da agência SPOT MKT (2024-2025):
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-emerald-600">+74%</div>
                  <div className="text-xs text-[#6B7280]">Receita</div>
                </div>
                <div className="bg-white rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-emerald-600">+20%</div>
                  <div className="text-xs text-[#6B7280]">Novos clientes</div>
                </div>
                <div className="bg-white rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-emerald-600">-38%</div>
                  <div className="text-xs text-[#6B7280]">Redução de churn</div>
                </div>
                <div className="bg-white rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-[#37489d]">-50%</div>
                  <div className="text-xs text-[#6B7280]">Equipe (mais generalista)</div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link to="/contact">
              <button className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#37489d] text-white hover:bg-[#37489d]/90 transition-colors font-medium">
                <Mail className="w-5 h-5" />
                Solicite nossa apresentação
              </button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
