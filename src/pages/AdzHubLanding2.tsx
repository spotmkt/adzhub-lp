import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Star,
  Brain,
  Target,
  Users,
  TrendingDown,
  Zap,
  ArrowRight,
  Layers,
  BookOpen,
  Megaphone,
  Search,
  Share2,
  LayoutGrid,
  LineChart,
  Eye,
  X,
  Check,
} from "lucide-react";
import { StarBorder } from "@/components/ui/star-border";
import { LandingNav } from "@/components/LandingNav";
import { Footer } from "@/components/Footer";
import { HomeInteractiveMotion } from "@/components/platform-motion";
import { useWaitlistDialog } from "@/components/WaitlistDialogProvider";

/** Home 2 — variante de copy: equipe de marketing como entregável (sem montar departamento). */
export default function AdzHubLanding2() {
  const { openWaitlist } = useWaitlistDialog();

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>AdzHub — Sua equipe de marketing sem montar departamento (preview Home 2)</title>
        <meta
          name="description"
          content="Tenha equipe de marketing estruturada na AdzHub: plataforma para acompanhar plano e resultados, operação executando tráfego, conteúdo e redes. Para PMEs que não querem montar departamento do zero."
        />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Banner de preview */}
      <div className="fixed top-0 left-0 right-0 z-[60] bg-[#08080C] text-white text-center py-2 px-4 text-xs sm:text-sm">
        <span className="font-medium">Home 2 — equipe de marketing como entregável</span>
        <span className="hidden sm:inline text-white/50 mx-2">|</span>
        <Link to="/" className="underline underline-offset-2 hover:text-white/90">
          Ver home atual
        </Link>
      </div>

      <div className="pt-8">
        <LandingNav activeSection="home" />
      </div>

      {/* Hero */}
      <section className="relative mt-[83px] mx-4 sm:mx-5 rounded-[28px] md:rounded-[32px] overflow-hidden border border-[#08080C]/[0.06] bg-gradient-to-br from-slate-50 via-white to-[#D4EFF4]/40">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: `linear-gradient(rgba(55, 72, 157, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(55, 72, 157, 0.04) 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
          }}
        />
        <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8 pt-14 pb-8 lg:pt-20 lg:pb-10">
          <div className="flex flex-col items-center text-center gap-6 max-w-[781px] mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-sm border border-[#37489d]/15 text-sm font-medium text-[#37489d] shadow-sm">
              <Users className="w-4 h-4 shrink-0" />
              Plataforma para acompanhar. Equipe para executar.
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-[3.25rem] xl:text-[3.75rem] font-bold leading-[1.08] tracking-tight text-[#08080C] max-w-4xl mx-auto">
              Tenha sua própria{" "}
              <span className="text-[#37489d]">equipe de marketing</span> sem montar departamento do zero
            </h1>
            <p className="text-lg text-[#08080C]/80 max-w-[640px] leading-relaxed">
              Na AdzHub você acompanha diagnóstico, plano, campanhas e resultados na plataforma — enquanto uma operação
              estruturada executa tráfego, conteúdo e redes com método e continuidade. Marketing de agência, sem folha de
              RH nem virar gestor de fornecedores.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full">
              <StarBorder
                as="button"
                type="button"
                onClick={openWaitlist}
                color="hsl(224, 47%, 42%)"
                speed="8s"
                className="w-full max-w-sm sm:w-auto text-center"
              >
                Começar grátis
              </StarBorder>
              <a
                href="#como-funciona"
                className="inline-flex h-12 w-full sm:w-auto items-center justify-center rounded-2xl border-2 border-[#37489d]/25 bg-white px-8 text-sm font-semibold text-[#37489d] hover:bg-[#37489d]/5 transition-colors"
              >
                Ver como funciona na prática
              </a>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-[#6B7280]">
              <span className="font-medium text-[#08080C]/80">+200 empresas atendidas</span>
              <span className="hidden sm:inline text-[#08080C]/20" aria-hidden>|</span>
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
        </div>

        <HomeInteractiveMotion id="como-funciona" embedded />
      </section>

      <div className="h-8" aria-hidden />

      {/* Comparativo: 3 caminhos */}
      <section className="py-16 sm:py-20 bg-white" aria-labelledby="alternativas-heading">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-12">
            <p className="text-sm font-semibold text-[#37489d] uppercase tracking-wider mb-3">Para quem é</p>
            <h2 id="alternativas-heading" className="text-2xl sm:text-3xl font-semibold text-[#08080C] tracking-tight">
              O entregável que você quer: equipe de marketing — sem o custo de montar uma
            </h2>
            <p className="mt-4 text-[#6B7280] leading-relaxed">
              Donos de PME costumam comparar três caminhos. A AdzHub entrega o quarto: sua operação de marketing, com
              equipe e método por trás e tudo visível na plataforma.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 sm:gap-5">
            {[
              {
                title: "Agência tradicional",
                pain: "Relatório bonito, pouca clareza do que priorizar amanhã. Você gerencia a agência.",
                items: ["Reuniões e retrabalho", "Contexto some ao trocar fornecedor", "Custo alto e opaco"],
                muted: true,
              },
              {
                title: "Equipe interna + ferramentas",
                pain: "Folha, turnover e você virando gestor de marketing entre cinco logins.",
                items: ["RH e coordenação diária", "Planilhas e integrações manuais", "Conhecimento que se perde"],
                muted: true,
              },
              {
                title: "AdzHub — sua equipe",
                pain: "Equipe de marketing estruturada: você acompanha na plataforma; a operação executa com método e continuidade.",
                items: [
                  "Diagnóstico, plano e campanhas no mesmo fluxo",
                  "Tráfego, conteúdo e redes sem montar departamento",
                  "Transparência: o que roda, por quê e com qual resultado",
                ],
                highlight: true,
              },
            ].map((col) => (
              <div
                key={col.title}
                className={`rounded-2xl p-6 sm:p-7 border ${
                  col.highlight
                    ? "border-[#37489d]/30 bg-gradient-to-b from-[#37489d]/[0.08] to-white shadow-sm"
                    : "border-[#08080C]/8 bg-[#FAFAFA]"
                }`}
              >
                <h3 className={`text-lg font-semibold mb-2 ${col.highlight ? "text-[#37489d]" : "text-[#08080C]"}`}>
                  {col.title}
                </h3>
                <p className="text-sm text-[#6B7280] leading-relaxed mb-4">{col.pain}</p>
                <ul className="space-y-2">
                  {col.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-[#6B7280]">
                      {col.highlight ? (
                        <Check className="w-4 h-4 text-[#37489d] shrink-0 mt-0.5" />
                      ) : (
                        <X className="w-4 h-4 text-red-400/80 shrink-0 mt-0.5" />
                      )}
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Transformação — 4 pilares */}
      <section className="py-14 sm:py-16 bg-[#F8F8F8] rounded-3xl mx-4 sm:mx-5" aria-labelledby="transformacao-heading">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-12">
            <h2 id="transformacao-heading" className="text-2xl sm:text-3xl font-semibold text-[#08080C] tracking-tight">
              O que você recebe quando a equipe já vem pronta — e você só governa
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {[
              {
                Icon: Users,
                title: "Equipe sem contratar do zero",
                offer: "Operação de marketing já estruturada na AdzHub",
                transform: "Tráfego, conteúdo e redes rodando — sem montar departamento nem virar gestor de RH",
              },
              {
                Icon: Eye,
                title: "Plataforma para acompanhar",
                offer: "Painel, plano, campanhas e histórico no mesmo lugar",
                transform: "Você vê o que a equipe executa e por quê — sem reunião só para pedir status",
              },
              {
                Icon: Zap,
                title: "Execução com método",
                offer: "Metodologia + IA na rotina da operação",
                transform: "Continuidade de quem entrega, não tarefa solta a cada fornecedor novo",
              },
              {
                Icon: LineChart,
                title: "Resultado que você entende",
                offer: "Relatórios ligados ao plano de sucesso",
                transform: "Sabe o que escalar, o que cortar — e prova retorno sem planilha paralela",
              },
            ].map(({ Icon, title, offer, transform }) => (
              <div
                key={title}
                className="rounded-2xl border border-[#08080C]/8 bg-white p-6 sm:p-7 hover:border-[#37489d]/20 transition-colors"
              >
                <div className="inline-flex rounded-xl bg-[#37489d]/10 p-3 mb-4">
                  <Icon className="w-6 h-6 text-[#37489d]" aria-hidden />
                </div>
                <h3 className="text-lg font-semibold text-[#08080C] mb-2">{title}</h3>
                <p className="text-xs font-medium text-[#37489d] mb-2">{offer}</p>
                <p className="text-sm text-[#6B7280] leading-relaxed">{transform}</p>
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

      {/* Problema */}
      <section id="sobre" className="py-24 bg-white scroll-mt-28">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col lg:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-[649px]">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 border border-red-200/50 text-sm font-medium text-red-600 mb-6">
                O padrão que cansou
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-[56px] font-medium leading-[110%] tracking-tight text-[#08080C] mb-6">
                Marketing vira ruído quando ninguém consegue provar o que funcionou
              </h2>
              <p className="text-lg font-medium text-[#6B7280] leading-[170%]">
                A maioria das PMEs não falha por falta de post ou anúncio. Falha por{" "}
                <strong className="text-[#08080C] font-semibold">fragmentação</strong>,{" "}
                <strong className="text-[#08080C] font-semibold">gestão invisível</strong> e{" "}
                <strong className="text-[#08080C] font-semibold">entregáveis soltos</strong>. Você paga — mas não sabe o
                que manter, cortar ou priorizar na segunda-feira.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <a href="#metodologia">
                <StarBorder color="hsl(224, 47%, 42%)" speed="8s">
                  Ver a operação na plataforma
                </StarBorder>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-3xl bg-[#F6F6F6] p-8 md:p-10">
              <h3 className="text-lg font-semibold text-[#08080C] mb-6">No negócio</h3>
              <div className="space-y-4">
                {[
                  {
                    title: "Gasto sem saber o que puxou venda",
                    desc: "Ferramentas e fornecedores sem fio — você paga, mas não sabe o que manter amanhã.",
                    Icon: TrendingDown,
                  },
                  {
                    title: "Direção que muda a cada reunião",
                    desc: "Sem prioridade clara sobre ICP, oferta e canal — tudo vira urgência.",
                    Icon: Target,
                  },
                  {
                    title: "Energia em produção, não em resultado",
                    desc: "Horas em post, planilha e briefing que não movem o ponteiro do faturamento.",
                    Icon: Zap,
                  },
                ].map(({ title, desc, Icon }) => (
                  <div key={title} className="bg-white rounded-2xl p-5">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0 mt-0.5">
                        <Icon className="w-5 h-5 text-red-500" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#08080C] mb-1">{title}</p>
                        <p className="text-xs text-[#6B7280]">{desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-[#F6F6F6] p-8 md:p-10">
              <h3 className="text-lg font-semibold text-[#08080C] mb-6">Equipe de marketing</h3>
              <div className="space-y-4 mb-6">
                {[
                  {
                    title: "Contratar virou gerir",
                    desc: "Você coordena pessoas, ferramentas e fornecedores — e ainda responde pelo resultado.",
                    Icon: Users,
                  },
                  {
                    title: "Contexto some na troca",
                    desc: "Cada saída de colaborador ou agência reinicia estratégia do zero.",
                    Icon: Brain,
                  },
                ].map(({ title, desc, Icon }) => (
                  <div key={title} className="bg-white rounded-2xl p-5">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center shrink-0 mt-0.5">
                        <Icon className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#08080C] mb-1">{title}</p>
                        <p className="text-xs text-[#6B7280]">{desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-[#37489d] rounded-2xl p-5 text-white">
                <p className="text-sm font-medium mb-1">O entregável AdzHub</p>
                <p className="text-xs text-white/70">
                  Sua equipe de marketing: diagnóstico, plano e execução com método. Você acompanha tudo na plataforma —
                  sem montar departamento do zero nem depender de agência opaca.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metodologia */}
      <section id="metodologia" className="py-24 bg-[#F8F8F8] rounded-3xl mx-5 scroll-mt-28">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-16 gap-8">
            <div className="max-w-[600px]">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#37489d]/10 text-sm font-medium text-[#37489d] mb-6">
                Como funciona
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-[56px] font-medium leading-[110%] tracking-tight text-[#08080C]">
                Equipe que executa. Plataforma onde você acompanha.
              </h2>
            </div>
            <p className="text-lg font-medium text-[#6B7280] leading-[150%] max-w-[400px]">
              Diagnóstico, plano, campanhas e relatórios com a lógica de uma agência madura — operação por trás,
              transparência na plataforma. Você não monta o processo; entra no ritmo da sua equipe AdzHub.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Brain,
                label: "Supercérebro",
                color: "#37489d",
                title: "Contexto que não se perde",
                body: "Integra dados do seu negócio, do plano e da metodologia — a IA responde com base no que importa para você.",
                stop: "Parar de repetir briefing em toda ferramenta",
                gain: "Decisões com histórico e continuidade",
              },
              {
                icon: Layers,
                label: "Módulos",
                color: "hsl(41,100%,48%)",
                title: "Execução no mesmo fluxo",
                body: "Tráfego, conteúdo, automações e chat especializado conversam entre si — sem exportar para planilha.",
                stop: "Deixar de colar resultado entre cinco logins",
                gain: "Operação que escala sem mais headcount",
              },
              {
                icon: BookOpen,
                label: "Metodologia",
                color: "#10b981",
                title: "Ritmo validado com PMEs",
                body: "Fluxos desenhados em quase uma década de operação com empresas reais — não improviso de consultoria.",
                stop: "Não reinventar marketing a cada trimestre",
                gain: "Avançar com prioridade clara, passo a passo",
              },
            ].map((card) => (
              <div key={card.label} className="bg-white rounded-3xl p-8 relative overflow-hidden">
                <div
                  className="absolute top-0 left-0 w-full h-1"
                  style={{ background: `linear-gradient(to right, ${card.color}, transparent)` }}
                />
                <card.icon className="w-5 h-5 mb-4" style={{ color: card.color }} />
                <span className="text-sm font-semibold block mb-4" style={{ color: card.color }}>
                  {card.label}
                </span>
                <h3 className="text-xl font-bold text-[#08080C] mb-3">{card.title}</h3>
                <p className="text-[#6B7280] leading-[160%] mb-6 text-sm">{card.body}</p>
                <div className="space-y-3 pt-4 border-t border-[#08080C]/6">
                  <p className="text-xs text-[#6B7280]">
                    <span className="font-semibold text-[#08080C]">Você deixa de:</span> {card.stop}
                  </p>
                  <p className="text-xs text-[#6B7280]">
                    <span className="font-semibold text-[#37489d]">Você passa a:</span> {card.gain}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Serviços */}
      <section id="servicos" className="py-24 bg-white scroll-mt-28">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#37489d]/5 border border-[#37489d]/10 text-sm font-medium text-[#37489d] mb-6">
              Serviços
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium leading-[110%] tracking-tight text-[#08080C] mb-6">
              O que sua equipe executa — e o que você vê na plataforma
            </h2>
            <p className="text-lg font-medium text-[#6B7280] leading-[170%]">
              Tráfego, SEO, redes e indicadores no mesmo fluxo. A operação entrega; você acompanha, aprova o que importa
              e evolui com dados — sem coordenar fornecedor por fornecedor.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                id: "trafego-pago",
                Icon: Megaphone,
                title: "Gestão de tráfego pago",
                result: "Campanhas alinhadas ao plano, com orçamento e criativo sob controle",
                without: "reuniões semanais só para saber se o anúncio subiu",
                bg: "bg-[#F6F6F6]",
              },
              {
                id: "seo-geo",
                Icon: Search,
                title: "SEO e GEO",
                result: "Presença orgânica e local ligada às metas do negócio",
                without: "artigo solto que você cola no site sem métrica",
                bg: "bg-white",
              },
              {
                id: "social-midia",
                Icon: Share2,
                title: "Social mídia",
                result: "Calendário e publicação no mesmo fio da estratégia",
                without: "perder o contexto entre agência, freelancer e planilha",
                bg: "bg-white",
              },
              {
                id: "dashboard-crm",
                Icon: LayoutGrid,
                title: "Dashboard e CRM",
                result: "Indicadores e leads no mesmo histórico do plano",
                without: "planilhas que ninguém atualiza",
                bg: "bg-[#F6F6F6]",
              },
            ].map(({ id, Icon, title, result, without, bg }) => (
              <div key={id} id={id} className={`rounded-3xl border border-[#08080C]/10 ${bg} p-8 md:p-10 scroll-mt-28`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#37489d] flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-[#08080C]">{title}</h3>
                </div>
                <p className="text-[#08080C] font-medium mb-2">{result}</p>
                <p className="text-sm text-[#6B7280] leading-relaxed">
                  <span className="text-[#6B7280]/80">Sem </span>
                  {without}.
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <StarBorder as="button" type="button" onClick={openWaitlist} color="hsl(224, 47%, 42%)" speed="8s">
              Começar grátis
            </StarBorder>
          </div>
        </div>
      </section>

      {/* Comparativo ferramenta solta */}
      <section className="py-24 bg-[#F8F8F8] rounded-3xl mx-5">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-medium text-[#08080C] mb-6">
              Ferramenta solta não é equipe. A AdzHub é.
            </h2>
            <p className="text-[#6B7280] leading-relaxed">
              Chat, planilha ou agência opaca entregam pedaços. Você quer equipe de marketing com método — e visibilidade
              do que está sendo feito. Plataforma + operação no mesmo lugar.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="rounded-2xl bg-white border border-[#08080C]/10 p-8">
              <p className="text-sm font-semibold text-[#6B7280] mb-4">Ferramentas soltas / chat genérico</p>
              <ul className="space-y-3 text-sm text-[#6B7280]">
                {["Texto sem publicar no seu site", "Você vira integrador entre sistemas", "Sem plano nem prioridade clara", "ROI difícil de explicar"].map(
                  (t) => (
                    <li key={t} className="flex gap-2">
                      <X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      {t}
                    </li>
                  )
                )}
              </ul>
            </div>
            <div className="rounded-2xl bg-[#37489d] text-white p-8">
              <p className="text-sm font-semibold text-white/70 mb-4">AdzHub</p>
              <ul className="space-y-3 text-sm">
                {[
                  "Equipe de marketing estruturada — sem montar departamento",
                  "Plataforma para ver plano, execução e métricas",
                  "Método + IA com contexto do seu negócio",
                  "Transparência do que roda e por quê",
                ].map((t) => (
                  <li key={t} className="flex gap-2">
                    <Check className="w-4 h-4 shrink-0 mt-0.5" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-8 text-center">
            <Link
              to="/seo"
              className="inline-flex items-center gap-2 text-[#37489d] font-medium hover:text-[#37489d]/80"
            >
              Ver central de conteúdo (exemplo de módulo)
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-8 text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-[#37489d] mb-3">Próximo passo</p>
          <h2 className="text-3xl sm:text-4xl font-semibold text-[#08080C] mb-4 leading-tight">
            Comece com sua equipe de marketing na AdzHub
          </h2>
          <p className="text-[#6B7280] mb-8 leading-relaxed">
            Entre na lista de espera — plataforma para acompanhar, operação para executar, sem montar departamento do
            zero. Compare com a{" "}
            <Link to="/" className="text-[#37489d] underline">
              home atual
            </Link>
            .
          </p>
          <StarBorder as="button" type="button" onClick={openWaitlist} color="hsl(224, 47%, 42%)" speed="8s">
            Começar grátis
          </StarBorder>
        </div>
      </section>

      <Footer />
    </div>
  );
}
