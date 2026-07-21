import { useEffect, useState, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { AnimatePresence, motion } from "framer-motion";
import {
  MapPin,
  Layers,
  TrendingUp,
  Zap,
  ChevronDown,
  Check,
  FileText,
  Github,
  Linkedin,
  Phone,
  User,
  Building2,
  MessageSquare,
  Upload,
  Puzzle,
  Bot,
  Database,
  Cpu,
  Target,
  ShieldCheck,
  LineChart,
  Rocket,
  Handshake,
  Sparkles,
  X,
} from "lucide-react";
import { StarBorder } from "@/components/ui/star-border";
import { ColorOrb } from "@/components/ui/ColorOrb";
import { Footer } from "@/components/Footer";
import adzhubLogo from "@/assets/adzhub-logo-new.svg";
import { VagasTerminalMotion } from "@/components/vagas/VagasTerminalMotion";
import { OfficeCarousel } from "@/components/vagas/OfficeCarousel";
import { FadeIn, Stagger, StaggerItem } from "@/components/vagas/MotionReveal";
import { VagasPlatformMotion } from "@/components/vagas/VagasPlatformMotion";
import { GrowthFlywheel } from "@/components/vagas/GrowthFlywheel";
import { VagasSpotlightCard } from "@/components/vagas/VagasSpotlightCard";
import { BorderBeamCard } from "@/components/vagas/BorderBeamCard";

const inputCls =
  "w-full rounded-xl border border-[#08080C]/12 bg-[#FAFAFA] px-4 py-3 text-sm text-[#08080C] placeholder:text-[#6B7280]/70 focus:outline-none focus:border-[#37489d]/40 focus:ring-2 focus:ring-[#37489d]/10 transition-colors";

const selectCls =
  "w-full rounded-xl border border-[#08080C]/12 bg-[#FAFAFA] px-4 py-3 text-sm text-[#08080C] focus:outline-none focus:border-[#37489d]/40 focus:ring-2 focus:ring-[#37489d]/10 transition-colors appearance-none cursor-pointer";

const labelCls = "block text-sm font-medium text-[#08080C] mb-1.5";

const ADZ_ORB_TONES = {
  base: "oklch(95% 0.05 330)",
  accent1: "oklch(70% 0.18 50)",
  accent2: "oklch(62% 0.24 280)",
  accent3: "oklch(40% 0.15 265)",
};

const spotStats = [
  {
    value: "R$45MM",
    label: "investidos em marketing",
    underline: "investidos",
  },
  {
    value: "80",
    label: "nichos diferentes",
    underline: "nichos diferentes",
  },
  {
    value: "9",
    label: "anos no mercado",
    underline: "anos no mercado",
  },
] as const;

const dailyTasks = [
  {
    Icon: Puzzle,
    text: "Desenvolver e evoluir extensões para navegadores utilizando Manifest V3.",
  },
  {
    Icon: Bot,
    text: "Criar automações para interagir com páginas e interfaces web.",
  },
  {
    Icon: Layers,
    text: "Mapear elementos do DOM e tornar as interações mais confiáveis.",
  },
  {
    Icon: Zap,
    text: "Integrar ferramentas com APIs da Meta, Google e outras plataformas.",
  },
  {
    Icon: Database,
    text: "Conectar a aplicação a serviços como Supabase, Node.js, n8n e Make.",
  },
  {
    Icon: Cpu,
    text: "Usar IA, Cursor e vibecoding para acelerar o desenvolvimento com critério.",
  },
  {
    Icon: Target,
    text: "Investigar erros, testar hipóteses e melhorar continuamente o produto.",
  },
  {
    Icon: ShieldCheck,
    text: "Implementar autenticação, tratamento de erros, controle de acesso e proteção de credenciais.",
  },
  {
    Icon: LineChart,
    text: "Desenvolver automações resilientes, com filas, tentativas, intervalos, monitoramento e respeito aos limites das plataformas.",
  },
];

const requirements = [
  "Histórico intraempreendedor ou empreendedor validado: já construiu algo de verdade.",
  "Domínio prático de programação / vibecoding (JS, HTML, CSS e autonomia com ferramentas modernas).",
  "Experiência profissional em marketing digital ou em produto ligado a marketing.",
  "Capacidade de ler, ajustar e evoluir código de extensões, automações e integrações.",
  "Familiaridade com Manifest V3, DOM, APIs e fluxos com espera/timeout.",
  "Uso avançado de IA (Cursor, Composer ou similares) no dia a dia de construção.",
  "Ambiente presencial em Belo Horizonte, sede da SPOT MKT no P7 Criativo.",
  "Ambição clara de construir algo grande, com ownership e velocidade.",
];

const differentials = [
  "Já lançou produto, SaaS, extensão ou automação com usuários reais.",
  "Experiência com funis, leads, métricas e campanhas (Meta / Google).",
  "Node.js, Supabase, n8n, Make ou backends similares em produção.",
  "Portfólio forte em GitHub / projetos pessoais com evidência de execução.",
  "Noções de segurança, autenticação e proteção de dados.",
  "Perfil de partnership: pensa em equity, escala e impacto, não só em salário.",
];

const whyCards = [
  {
    Icon: Rocket,
    title: "Núcleo Fundacional",
    body: "A AdzHub já está em desenvolvimento avançado e em processo de lançamento com clientes internos. Você faz parte do núcleo que define o produto, não de uma fila de tarefas.",
  },
  {
    Icon: Handshake,
    title: "Partnership real na mesa",
    body: "Não é só uma vaga de execução. Há possibilidade concreta de partnership para quem entrega, assume ownership e cresce junto com a plataforma.",
  },
  {
    Icon: TrendingUp,
    title: "Problemas reais, clientes reais",
    body: "Nasceu na operação da SPOT MKT: feedback diário de PMEs, campanhas e dados, o tipo de proximidade que startups de pitch deck não têm.",
  },
  {
    Icon: Sparkles,
    title: "Visão de categoria",
    body: "Queremos fazer pelo marketing o que Nubank, XP e Uber fizeram em seus mercados: infraestrutura que escala o pequeno empreendedor brasileiro.",
  },
];

const profileChecks = [
  "Já foi intraempreendedor ou empreendedor e tem histórico para mostrar.",
  "Programa e vibecode com autonomia; marketing não é teoria, é prática.",
  "Usa IA para acelerar construção, não para terceirizar o pensamento.",
  "Quer equity de impacto: construir algo grande, não só cumprir horário.",
  "Não trava diante de ambiguidade: transforma caos em sistema.",
  "Se importa com PMEs e com o cenário hostil do empreendedorismo no Brasil.",
  "Gosta de ambientes com autonomia, velocidade e cobrança por resultado.",
];

const workDetails = [
  { label: "Local", value: "P7 Criativo, Belo Horizonte, MG" },
  { label: "Modelo", value: "Presencial" },
  { label: "Remuneração", value: "A combinar, conforme senioridade" },
  { label: "Contratação", value: "A combinar" },
  { label: "Horário", value: "A combinar" },
];

type FormFields = {
  nome: string;
  whatsapp: string;
  cidade: string;
  linkedin: string;
  github: string;
  nivel: string;
  pretensao: string;
  disponibilidade: string;
  ia: string;
  lgpd: boolean;
};

const emptyForm: FormFields = {
  nome: "",
  whatsapp: "",
  cidade: "",
  linkedin: "",
  github: "",
  nivel: "",
  pretensao: "",
  disponibilidade: "",
  ia: "",
  lgpd: false,
};

export default function Vagas() {
  const [form, setForm] = useState<FormFields>(emptyForm);
  const [fileName, setFileName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [applicationOpen, setApplicationOpen] = useState(false);
  const [applicationReady, setApplicationReady] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!applicationOpen) {
      setApplicationReady(false);
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const introTimer = window.setTimeout(() => setApplicationReady(true), 750);
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setApplicationOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(introTimer);
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [applicationOpen]);

  function openApplication() {
    setApplicationReady(false);
    setApplicationOpen(true);
  }

  function update(field: keyof FormFields, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-white pb-24 md:pb-0">
      <Helmet>
        <title>Vaga · Núcleo Fundacional · AdzHub</title>
        <meta
          name="description"
          content="Ajude a construir a AdzHub: infraestrutura AI-First do marketing empresarial, com metodologias da SPOT MKT. Faça parte do Núcleo Fundacional. Presencial no P7 Criativo, BH."
        />
        <meta property="og:title" content="Vaga · Núcleo Fundacional · AdzHub" />
        <meta
          property="og:description"
          content="A infraestrutura AI-First do marketing empresarial. Queremos ser o que o Nubank foi para os bancos, para as agências de marketing."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://adzhub.com.br/vagas" />
      </Helmet>

      <header className="fixed top-0 left-0 right-0 z-50">
        <div
          className="absolute inset-x-0 top-0 pointer-events-none"
          style={{
            height: "calc(100% + 48px)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            background:
              "linear-gradient(to bottom, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0) 100%)",
            maskImage: "linear-gradient(to bottom, black 40%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 40%, transparent 100%)",
          }}
        />
        <div className="relative flex items-center justify-between px-5 sm:px-6 py-3">
          <a href="#top" className="flex shrink-0" aria-label="AdzHub">
            <img
              src={adzhubLogo}
              alt="AdzHub"
              className="h-8 w-auto"
              width={120}
              height={32}
              loading="eager"
            />
          </a>
          <button
            type="button"
            onClick={openApplication}
            className="hidden md:inline-flex h-10 items-center justify-center rounded-full bg-[#37489d] px-5 text-sm font-semibold text-white hover:bg-[#2f3d86] transition-colors"
          >
            Quero me candidatar
          </button>
        </div>
      </header>

      {/* HERO */}
      <section
        id="top"
        className="relative mt-[72px] sm:mt-[76px] mx-4 sm:mx-5 rounded-[28px] md:rounded-[32px] overflow-hidden border border-[#08080C]/[0.06] bg-gradient-to-br from-slate-50 via-white to-[#D4EFF4]/40"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: `linear-gradient(rgba(55,72,157,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(55,72,157,0.04) 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 pt-12 pb-12 lg:pt-16 lg:pb-16">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 xl:gap-16 items-center">
            <motion.div
              className="flex flex-col items-center text-center lg:items-start lg:text-left gap-5 sm:gap-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-sm border border-[#37489d]/15 text-sm font-medium text-[#37489d] shadow-sm">
                <MapPin className="w-4 h-4 shrink-0" />
                Vaga presencial em Belo Horizonte · na sede da SPOT MKT
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-[2.55rem] lg:text-[2.75rem] xl:text-[3.05rem] font-bold leading-[1.08] tracking-tight text-[#08080C]">
                <span className="text-[#37489d]">Ajude a construir a startup</span> que pode transformar o
                marketing em todo o Brasil
              </h1>

              <p className="text-base sm:text-lg text-[#08080C]/80 max-w-[540px] leading-relaxed mx-auto lg:mx-0">
                A SPOT está formando o time de desenvolvimento da AdzHub uma plataforma AI-First para o
                marketing empresarial criada a partir das metodologias da SPOT MKT.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                <StarBorder type="button" onClick={openApplication} color="hsl(224, 47%, 42%)" speed="8s" className="w-full sm:w-auto text-center">
                  Quero me candidatar
                </StarBorder>
                <a
                  href="#habilidades"
                  className="inline-flex h-12 w-full sm:w-auto items-center justify-center rounded-2xl border-2 border-[#37489d]/25 bg-white px-8 text-sm font-semibold text-[#37489d] hover:bg-[#37489d]/5 transition-colors"
                >
                  Habilidades necessárias
                </a>
              </div>

              <div className="flex flex-col items-center lg:items-start gap-2 text-sm text-[#6B7280] pt-1">
                <span className="flex items-center justify-center lg:justify-start gap-1.5">
                  <Rocket className="w-4 h-4 text-[#37489d]/60 shrink-0" />
                  Faça parte do Núcleo Fundacional
                </span>
                <span className="flex items-center justify-center lg:justify-start gap-1.5">
                  <Handshake className="w-4 h-4 text-[#37489d]/60 shrink-0" />
                  Possibilidade de partnership
                </span>
                <span className="flex items-center justify-center lg:justify-start gap-1.5">
                  <Building2 className="w-4 h-4 text-[#37489d]/60 shrink-0" />
                  Presencial no P7 Criativo
                </span>
              </div>
            </motion.div>

            <div className="w-full max-w-lg mx-auto lg:max-w-none lg:mx-0">
              <VagasTerminalMotion />
            </div>
          </div>
        </div>
      </section>

      <div className="h-8" aria-hidden />

      {/* VISÃO */}
      <section className="py-20 sm:py-24 bg-white overflow-x-clip">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 min-w-0">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start min-w-0">
            <FadeIn className="lg:col-span-7 max-w-2xl min-w-0">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#37489d]/5 border border-[#37489d]/10 text-sm font-medium text-[#37489d] mb-6">
                A visão
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-[48px] font-medium leading-[110%] tracking-tight text-[#08080C] mb-6">
                Fazer pelo marketing o que o Nubank fez pelos serviços bancários
              </h2>
              <p className="text-lg text-[#6B7280] leading-[170%] mb-6">
                A AdzHub é uma{" "}
                <strong className="text-[#08080C] font-semibold">plataforma de serviços e infraestrutura AI-First do marketing empresarial</strong>, construída a partir das metodologias da SPOT MKT.
              </p>
              <p className="text-lg text-[#6B7280] leading-[170%] mb-8">
                Nosso propósito é acelerar o desenvolvimento empresarial do país através do marketing. Estamos
                selecionando a dedo quem tem a mesma cultura empreendedora, sangue nos olhos e muito potencial de
                crescimento, se esse cara é você, chega mais!
              </p>
            </FadeIn>

            <FadeIn className="lg:col-span-5 flex items-center justify-center min-w-0 w-full max-w-full overflow-hidden" delay={0.12}>
              <GrowthFlywheel />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* NÚMEROS SPOT */}
      <section className="py-16 sm:py-20 mx-4 sm:mx-5 rounded-3xl bg-[#F8F8F8] overflow-hidden border border-[#08080C]/[0.04]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <FadeIn className="text-center mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#37489d]/10 text-sm font-medium text-[#37489d] mb-5">
              A SPOT
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium leading-tight tracking-tight text-[#08080C] max-w-2xl mx-auto">
              Números de quem já opera marketing de verdade
            </h2>
            <p className="mt-3 text-base sm:text-lg text-[#6B7280] max-w-xl mx-auto leading-relaxed">
              A AdzHub nasce da operação da SPOT MKT: método validado, escala e tempo de mercado.
            </p>
          </FadeIn>

          <Stagger className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-8 lg:gap-12">
            {spotStats.map(({ value, label, underline }) => {
              const parts = label.split(underline);
              return (
                <StaggerItem key={value} className="text-center">
                  <p className="text-4xl sm:text-5xl md:text-[56px] font-bold tracking-tight text-[#08080C] leading-none mb-3">
                    <span className="text-[#37489d]">+</span> {value}
                  </p>
                  <p className="text-base sm:text-lg text-[#6B7280]">
                    {parts[0]}
                    <span className="relative inline-block text-[#08080C]">
                      {underline}
                      <span
                        className="absolute left-0 right-0 -bottom-0.5 h-[3px] rounded-full bg-[#37489d]/45"
                        aria-hidden
                      />
                    </span>
                    {parts[1]}
                  </p>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </section>

      <div className="h-8" aria-hidden />

      {/* OPORTUNIDADE */}
      <section className="py-20 sm:py-24 bg-[#F8F8F8] rounded-3xl mx-4 sm:mx-5">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <FadeIn>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#37489d]/10 text-sm font-medium text-[#37489d] mb-6">
                A oportunidade
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-[44px] font-medium leading-[110%] tracking-tight text-[#08080C] mb-6">
                Mais do que ocupar uma vaga. Construir algo desde o começo.
              </h2>
              <p className="text-lg text-[#6B7280] leading-[170%] mb-5">
                A AdzHub nasceu dentro da SPOT a partir de desafios que encontramos todos os dias nas operações
                de marketing. Em vez de criar uma ferramenta baseada apenas em hipóteses, estamos desenvolvendo
                um produto conectado a problemas reais, usuários reais e oportunidades reais de mercado.
              </p>
              <p className="text-lg text-[#6B7280] leading-[170%] mb-8">
                Quem entrar para esse projeto terá espaço para testar ideias, propor soluções e acompanhar de
                perto a evolução do produto. Você não estará apenas recebendo demandas. Estará ajudando a
                definir como o sistema deve funcionar e o que ele pode se tornar.
              </p>
              <blockquote className="rounded-2xl bg-white border border-[#08080C]/8 border-l-4 border-l-[#37489d] px-6 py-5 shadow-sm">
                <p className="text-lg text-[#08080C] italic">
                  "É uma oportunidade para olhar para o futuro e dizer: eu ajudei a construir isso."
                </p>
              </blockquote>
            </FadeIn>
            <FadeIn delay={0.1}>
              <OfficeCarousel />
            </FadeIn>
          </div>
        </div>
      </section>

      <div className="h-8" aria-hidden />

      {/* DIA A DIA */}
      <section id="desafio" className="py-20 sm:py-24 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <FadeIn className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#37489d]/5 border border-[#37489d]/10 text-sm font-medium text-[#37489d] mb-6">
              No dia a dia
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-[48px] font-medium leading-[110%] tracking-tight text-[#08080C] mb-4">
              Seu código no mundo real
            </h2>
            <p className="text-lg text-[#6B7280] leading-[170%]">
              Extensões, APIs, automações e vibecoding aplicados a marketing de verdade: a
              camada que faz a AdzHub executar com continuidade para PMEs.
            </p>
          </FadeIn>

          <Stagger className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
            {dailyTasks.map(({ Icon, text }) => (
              <StaggerItem key={text}>
                <VagasSpotlightCard className="h-full p-4 sm:p-6 hover:border-[#37489d]/25 transition-colors">
                  <div className="inline-flex rounded-xl bg-[#37489d]/10 p-2 sm:p-2.5 mb-3 sm:mb-4">
                    <Icon className="w-5 h-5 text-[#37489d]" aria-hidden />
                  </div>
                  <p className="text-xs sm:text-sm text-[#08080C]/80 leading-relaxed">{text}</p>
                </VagasSpotlightCard>
              </StaggerItem>
            ))}
          </Stagger>

          <FadeIn delay={0.15}>
            <p className="text-sm text-[#6B7280] italic text-center mt-10 max-w-2xl mx-auto">
              Procuramos quem já chega com capacidade de execução. O desafio é construção de produto e ownership, não formação do zero.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* PLATAFORMA — AdzChat motion */}
      <section className="py-20 sm:py-24 bg-[#F8F8F8] rounded-3xl mx-4 sm:mx-5 overflow-x-clip">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 overflow-x-clip">
          <FadeIn className="max-w-3xl mx-auto text-center mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#37489d]/10 text-sm font-medium text-[#37489d] mb-6">
              O produto que você acelera
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-[44px] font-medium leading-[110%] tracking-tight text-[#08080C] mb-4">
              Da jornada do cliente à operação no AdzChat
            </h2>
          </FadeIn>

          <FadeIn delay={0.08} className="relative">
            <VagasPlatformMotion />
          </FadeIn>
        </div>
      </section>

      <div className="h-8" aria-hidden />

      {/* REQUISITOS — currículo / perfil ideal */}
      <section id="habilidades" className="py-20 sm:py-24 bg-[#F8F8F8] rounded-3xl mx-4 sm:mx-5 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <FadeIn className="max-w-3xl mx-auto text-center mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#37489d]/10 text-sm font-medium text-[#37489d] mb-6">
              O perfil que buscamos
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-[44px] font-medium leading-[110%] tracking-tight text-[#08080C]">
              O &ldquo;Currículo&rdquo; do candidato ideal
            </h2>
          </FadeIn>

          <FadeIn delay={0.08} className="max-w-3xl mx-auto">
            <div className="rounded-2xl border border-[#08080C]/8 bg-white shadow-[0_20px_50px_-28px_rgba(8,8,12,0.35)] overflow-hidden">
              {/* Cabeçalho estilo CV */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 px-5 sm:px-7 py-5 sm:py-6 border-b border-[#08080C]/8 bg-gradient-to-br from-[#37489d]/[0.06] to-white">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#37489d] flex items-center justify-center shrink-0 shadow-md">
                  <User className="w-7 h-7 text-white" aria-hidden />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#37489d] mb-0.5">
                    Vaga · Núcleo Fundacional
                  </p>
                  <h3 className="text-xl sm:text-2xl font-semibold text-[#08080C] leading-tight">
                    Perfil de quem já constrói
                  </h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {["Vibecoding", "Marketing", "Presencial BH", "Partnership"].map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-white border border-[#08080C]/8 text-[11px] font-medium text-[#6B7280]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="hidden sm:flex flex-col items-end gap-1 text-right shrink-0">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Aberto
                  </span>
                  <span className="text-[11px] text-[#9CA3AF]">P7 Criativo · SPOT MKT</span>
                </div>
              </div>

              {/* Corpo do CV */}
              <div className="grid md:grid-cols-5">
                {/* Requisitos */}
                <div className="md:col-span-3 p-5 sm:p-7 border-b md:border-b-0 md:border-r border-[#08080C]/8">
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#37489d]">
                      Experiência exigida
                    </p>
                    <span className="text-[10px] font-medium text-[#9CA3AF] tabular-nums">
                      {requirements.length} itens
                    </span>
                  </div>
                  <ul className="space-y-0 divide-y divide-[#08080C]/6">
                    {requirements.map((item, i) => (
                      <li key={item} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                        <span className="mt-0.5 w-5 h-5 rounded-md bg-[#37489d]/10 flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 text-[#37489d]" aria-hidden />
                        </span>
                        <div className="min-w-0">
                          <p className="text-[10px] font-semibold uppercase tracking-wide text-[#9CA3AF] mb-0.5">
                            Req. {String(i + 1).padStart(2, "0")}
                          </p>
                          <p className="text-sm text-[#374151] leading-relaxed">{item}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Diferenciais */}
                <div className="md:col-span-2 p-5 sm:p-7 bg-[#FAFAFA]">
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#37489d]">
                      Diferenciais
                    </p>
                    <span className="text-[10px] font-medium text-[#9CA3AF]">+ pontos</span>
                  </div>
                  <ul className="space-y-2.5">
                    {differentials.map((item) => (
                      <li
                        key={item}
                        className="rounded-xl border border-[#08080C]/8 bg-white px-3 py-2.5 shadow-sm"
                      >
                        <p className="text-[12px] sm:text-[13px] text-[#374151] leading-snug">{item}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Rodapé do CV */}
              <div className="px-5 sm:px-7 py-4 border-t border-[#08080C]/8 bg-white flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                <p className="flex-1 text-sm text-[#6B7280] leading-relaxed">
                  Se o checklist acima te descreve e você tem histórico para provar, queremos conversar, mesmo
                  que falte um diferencial.
                </p>
                <button
                  type="button"
                  onClick={openApplication}
                  className="inline-flex h-10 shrink-0 items-center justify-center rounded-xl bg-[#37489d] px-4 text-sm font-semibold text-white hover:bg-[#2f3d86] transition-colors"
                >
                  Enviar currículo
                </button>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <div className="h-8" aria-hidden />

      {/* POR QUE */}
      <section className="py-20 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <FadeIn className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#37489d]/5 border border-[#37489d]/10 text-sm font-medium text-[#37489d] mb-6">
              Por que fazer parte
            </div>
            <h2 className="text-3xl sm:text-4xl font-medium text-[#08080C] tracking-tight leading-tight">
              O que torna essa oportunidade diferente?
            </h2>
          </FadeIn>
          <Stagger className="grid sm:grid-cols-2 gap-5 sm:gap-6 max-w-4xl mx-auto">
            {whyCards.map(({ Icon, title, body }) => (
              <StaggerItem key={title}>
                <VagasSpotlightCard className="h-full p-6 sm:p-7 hover:border-[#37489d]/20 transition-colors">
                  <div className="inline-flex rounded-xl bg-white p-3 shadow-sm border border-[#08080C]/6 mb-4">
                    <Icon className="w-6 h-6 text-[#37489d]" aria-hidden />
                  </div>
                  <h3 className="text-lg font-semibold text-[#08080C] mb-2">{title}</h3>
                  <p className="text-sm text-[#6B7280] leading-relaxed">{body}</p>
                </VagasSpotlightCard>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* MODELO */}
      <section className="py-20 sm:py-24 bg-[#F8F8F8] rounded-3xl mx-4 sm:mx-5">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <FadeIn>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#37489d]/10 text-sm font-medium text-[#37489d] mb-6">
                Modelo de trabalho
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-[44px] font-medium leading-[110%] tracking-tight text-[#08080C] mb-4">
                Presencial, perto das pessoas e das decisões.
              </h2>
              <p className="text-lg text-[#6B7280] leading-[170%] mb-4">
                Esta é uma oportunidade presencial em Belo Horizonte. Nosso escritório fica no P7 Criativo, uma
                das principais referências em inovação e economia criativa de Minas Gerais.
              </p>
              <p className="text-lg text-[#6B7280] leading-[170%] mb-8">
                Estar presencialmente próximo do time permite acelerar decisões, trocar conhecimento, testar
                ideias e participar com mais intensidade da construção do produto.
              </p>
              <div className="rounded-2xl bg-white border border-[#08080C]/8 overflow-hidden shadow-sm">
                {workDetails.map(({ label, value }, i) => (
                  <div
                    key={label}
                    className={`flex items-baseline justify-between gap-4 px-5 py-3.5 ${
                      i > 0 ? "border-t border-[#08080C]/8" : ""
                    }`}
                  >
                    <span className="text-sm text-[#6B7280] shrink-0">{label}</span>
                    <span className="text-sm sm:text-base font-medium text-[#08080C] text-right">{value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <p className="text-xs uppercase tracking-wider text-[#6B7280] mb-4 text-center lg:text-left">
                  Um ecossistema apoiado por
                </p>
                <div className="flex items-center justify-center lg:justify-start gap-6 sm:gap-8 flex-wrap">
                  <img
                    src="/vagas/logos/p7-criativo.png"
                    alt="P7 Criativo"
                    className="h-16 w-auto object-contain"
                    loading="lazy"
                  />
                  <img
                    src="/vagas/logos/fiemg.png"
                    alt="FIEMG"
                    className="h-8 w-auto object-contain"
                    loading="lazy"
                  />
                  <img
                    src="/vagas/logos/bndes.png"
                    alt="BNDES"
                    className="h-7 w-auto object-contain"
                    loading="lazy"
                  />
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.1} className="order-first lg:order-none relative rounded-2xl overflow-hidden aspect-[3/4] sm:aspect-[4/5] lg:aspect-auto lg:min-h-[520px] border border-[#08080C]/8 shadow-md">
              <img
                src="/vagas/fachada.avif"
                alt="Fachada do P7 Criativo em Belo Horizonte"
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent pt-12 pb-4 px-5">
                <p className="text-white text-sm font-medium">Sede SPOT MKT · P7 Criativo · Belo Horizonte</p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <div className="h-8" aria-hidden />

      {/* PERFIL */}
      <section className="py-20 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <FadeIn className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#37489d]/5 border border-[#37489d]/10 text-sm font-medium text-[#37489d] mb-6">
              Perfil ideal
            </div>
            <h2 className="text-3xl sm:text-4xl font-medium text-[#08080C] mb-8 leading-tight">
              Essa oportunidade combina com você se…
            </h2>
            <Stagger className="grid sm:grid-cols-2 gap-3">
              {profileChecks.map((item) => (
                <StaggerItem key={item}>
                  <div className="flex items-start gap-3 text-[#6B7280] leading-relaxed rounded-xl border border-[#08080C]/6 bg-[#FAFAFA] px-4 py-3">
                    <Check className="w-5 h-5 text-[#37489d] shrink-0 mt-0.5" />
                    <span className="text-sm sm:text-base">{item}</span>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </FadeIn>
        </div>
      </section>

      {/* FORM */}
      <section
        id="candidatura"
        role={applicationOpen ? "dialog" : undefined}
        aria-modal={applicationOpen ? true : undefined}
        aria-label={applicationOpen ? "Formulário de candidatura" : undefined}
        onMouseDown={(event) => {
          if (applicationOpen && event.target === event.currentTarget) setApplicationOpen(false);
        }}
        className={
          applicationOpen
            ? "fixed inset-0 z-[100] m-0 flex items-center justify-center overflow-hidden bg-[#08080C]/60 p-3 backdrop-blur-sm sm:p-6"
            : "py-20 sm:py-24 bg-[#F8F8F8] rounded-3xl mx-4 sm:mx-5 scroll-mt-24"
        }
      >
        <motion.div
          layout
          className={
            applicationOpen
              ? "relative max-h-full w-full max-w-3xl overflow-y-auto overscroll-contain rounded-3xl bg-[#F8F8F8] px-5 py-8 shadow-2xl sm:px-8 sm:py-10"
              : "max-w-7xl mx-auto px-5 sm:px-8"
          }
          initial={applicationOpen ? { opacity: 0, y: 24, scale: 0.97 } : false}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          onMouseDown={(event) => event.stopPropagation()}
        >
          {applicationOpen && (
            <button
              type="button"
              onClick={() => setApplicationOpen(false)}
              className="sticky top-0 z-20 ml-auto -mb-10 flex h-10 w-10 items-center justify-center rounded-full border border-[#08080C]/10 bg-white/90 text-[#6B7280] shadow-sm backdrop-blur transition-colors hover:text-[#08080C]"
              aria-label="Fechar formulário"
            >
              <X className="h-5 w-5" />
            </button>
          )}

          <AnimatePresence mode="wait">
            {applicationOpen && !applicationReady ? (
              <motion.div
                key="adz-intro"
                className="flex min-h-[420px] flex-col items-center justify-center text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25 }}
              >
                <motion.div
                  initial={{ scale: 0.45, rotate: -35 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 180, damping: 14 }}
                  className="relative mb-7"
                >
                  <motion.div
                    className="absolute inset-[-18px] rounded-full border border-[#37489d]/20"
                    animate={{ scale: [0.85, 1.15, 0.85], opacity: [0.25, 0.65, 0.25] }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <ColorOrb dimension="88px" tones={ADZ_ORB_TONES} spinDuration={5} />
                </motion.div>
                <motion.p
                  className="text-sm font-semibold uppercase tracking-[0.18em] text-[#37489d]"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18 }}
                >
                  Pergunte ao Adz
                </motion.p>
                <motion.h2
                  className="mt-2 text-2xl font-semibold text-[#08080C]"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.28 }}
                >
                  Vamos conhecer você
                </motion.h2>
                <div className="mt-6 flex gap-1.5" aria-hidden>
                  {[0, 1, 2].map((dot) => (
                    <motion.span
                      key={dot}
                      className="h-2 w-2 rounded-full bg-[#37489d]"
                      animate={{ y: [0, -6, 0], opacity: [0.35, 1, 0.35] }}
                      transition={{ duration: 0.7, repeat: Infinity, delay: dot * 0.12 }}
                    />
                  ))}
                </div>
              </motion.div>
            ) : (
              <FadeIn key="application-form" className="max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#37489d]/10 text-sm font-medium text-[#37489d] mb-6">
              Candidatura
            </div>
            <h2 className="text-3xl sm:text-4xl font-medium text-[#08080C] mb-3 leading-tight">
              Quer entrar no núcleo da AdzHub?
            </h2>
            <p className="text-[#6B7280] mb-10 leading-relaxed">
              Conte quem você é e o que já construiu. Buscamos histórico intraempreendedor ou empreendedor validado, vibecoding + marketing e ambição de partnership, não só um currículo bonito.
            </p>

            {submitted ? (
              <div className="rounded-2xl bg-white border border-[#37489d]/20 shadow-sm px-8 py-10 text-center">
                <div className="inline-flex h-14 w-14 rounded-full bg-[#37489d]/10 items-center justify-center mx-auto mb-4">
                  <Check className="w-7 h-7 text-[#37489d]" />
                </div>
                <h3 className="text-xl font-semibold text-[#08080C] mb-2">Recebemos seu interesse!</h3>
                <p className="text-[#6B7280] mb-1">
                  Em breve o envio estará totalmente ativo, ou fale diretamente com a gente:
                </p>
                <a href="mailto:team@adzhub.com.br" className="text-[#37489d] font-medium hover:underline">
                  team@adzhub.com.br
                </a>
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setForm(emptyForm);
                      setFileName("");
                    }}
                    className="text-sm text-[#6B7280] underline underline-offset-2 hover:text-[#08080C]"
                  >
                    Enviar nova candidatura
                  </button>
                </div>
              </div>
            ) : (
              <BorderBeamCard>
                <form onSubmit={handleSubmit} className="space-y-5 px-6 sm:px-8 py-8">
                <div>
                  <label htmlFor="nome" className={labelCls}>
                    <span className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" /> Nome completo *
                    </span>
                  </label>
                  <input id="nome" type="text" required placeholder="Seu nome" value={form.nome} onChange={(e) => update("nome", e.target.value)} className={inputCls} />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="whatsapp" className={labelCls}>
                      <span className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5" /> WhatsApp *
                      </span>
                    </label>
                    <input id="whatsapp" type="tel" required placeholder="(31) 99999-9999" value={form.whatsapp} onChange={(e) => update("whatsapp", e.target.value)} className={inputCls} />
                  </div>
                  <div>
                    <label htmlFor="cidade" className={labelCls}>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" /> Cidade onde mora *
                      </span>
                    </label>
                    <input id="cidade" type="text" required placeholder="Belo Horizonte, MG" value={form.cidade} onChange={(e) => update("cidade", e.target.value)} className={inputCls} />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="linkedin" className={labelCls}>
                      <span className="flex items-center gap-1.5">
                        <Linkedin className="w-3.5 h-3.5" /> LinkedIn <span className="text-[#9CA3AF] font-normal">(opcional)</span>
                      </span>
                    </label>
                    <input id="linkedin" type="url" placeholder="linkedin.com/in/seuperfil" value={form.linkedin} onChange={(e) => update("linkedin", e.target.value)} className={inputCls} />
                  </div>
                  <div>
                    <label htmlFor="github" className={labelCls}>
                      <span className="flex items-center gap-1.5">
                        <Github className="w-3.5 h-3.5" /> GitHub ou portfólio <span className="text-[#9CA3AF] font-normal">(opcional)</span>
                      </span>
                    </label>
                    <input id="github" type="text" placeholder="github.com/seuperfil" value={form.github} onChange={(e) => update("github", e.target.value)} className={inputCls} />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="nivel" className={labelCls}>Nível de experiência *</label>
                    <div className="relative">
                      <select id="nivel" required value={form.nivel} onChange={(e) => update("nivel", e.target.value)} className={selectCls}>
                        <option value="" disabled>Selecione</option>
                        <option>Estou começando</option>
                        <option>Júnior</option>
                        <option>Pleno</option>
                        <option>Sênior</option>
                        <option>Prefiro explicar durante o processo</option>
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="pretensao" className={labelCls}>
                      Pretensão de remuneração <span className="text-[#9CA3AF] font-normal">(opcional)</span>
                    </label>
                    <input id="pretensao" type="text" placeholder="Ex.: R$ 3.000 a R$ 5.000" value={form.pretensao} onChange={(e) => update("pretensao", e.target.value)} className={inputCls} />
                  </div>
                </div>

                <div>
                  <label htmlFor="disponibilidade" className={labelCls}>
                    Disponibilidade para trabalhar presencialmente em Belo Horizonte *
                  </label>
                  <div className="relative">
                    <select id="disponibilidade" required value={form.disponibilidade} onChange={(e) => update("disponibilidade", e.target.value)} className={selectCls}>
                      <option value="" disabled>Selecione</option>
                      <option>Sim</option>
                      <option>Não</option>
                      <option>Posso me mudar para Belo Horizonte</option>
                      <option>Gostaria de conversar sobre isso</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                  </div>
                </div>

                <div>
                  <label htmlFor="ia" className={labelCls}>
                    <span className="flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5" /> Como você utiliza inteligência artificial no desenvolvimento? *
                    </span>
                  </label>
                  <textarea
                    id="ia"
                    required
                    rows={4}
                    placeholder="Ferramentas, fluxos e como a IA acelera sua construção…"
                    value={form.ia}
                    onChange={(e) => update("ia", e.target.value)}
                    className={`${inputCls} resize-none`}
                  />
                </div>

                <div>
                  <label htmlFor="curriculo" className={labelCls}>
                    <span className="flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5" /> Currículo <span className="text-[#9CA3AF] font-normal">(PDF, até 5 MB)</span>
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex items-center gap-3 rounded-xl border border-dashed border-[#08080C]/15 bg-[#FAFAFA] px-4 py-3 text-sm text-[#6B7280] hover:border-[#37489d]/30 hover:bg-[#37489d]/3 transition-colors"
                  >
                    <Upload className="w-4 h-4 text-[#37489d]/70" />
                    <span className="flex-1 text-left">{fileName || "Selecionar arquivo PDF"}</span>
                    {fileName && <Check className="w-4 h-4 text-emerald-500" />}
                  </button>
                  <input
                    ref={fileInputRef}
                    id="curriculo"
                    type="file"
                    accept=".pdf,application/pdf"
                    className="sr-only"
                    onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
                  />
                </div>

                <div className="flex items-start gap-3 pt-1">
                  <input
                    id="lgpd"
                    type="checkbox"
                    required
                    checked={form.lgpd}
                    onChange={(e) => update("lgpd", e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-[#08080C]/20 text-[#37489d] accent-[#37489d] cursor-pointer shrink-0"
                  />
                  <label htmlFor="lgpd" className="text-sm text-[#6B7280] leading-relaxed cursor-pointer">
                    Autorizo a <strong className="text-[#08080C]">SPOT Marketing Digital Ltda / AdzHub</strong> a utilizar meus dados exclusivamente para este processo seletivo, conforme a LGPD.
                  </label>
                </div>

                <div className="pt-2">
                  <StarBorder as="button" type="submit" color="hsl(224, 47%, 42%)" speed="8s" className="w-full">
                    Enviar minha candidatura
                  </StarBorder>
                </div>
              </form>
              </BorderBeamCard>
            )}
              </FadeIn>
            )}
          </AnimatePresence>
        </motion.div>
      </section>

      <div className="h-8" aria-hidden />

      {/* CTA FINAL */}
      <section className="py-20 sm:py-24 bg-white">
        <FadeIn className="max-w-3xl mx-auto px-5 sm:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-semibold text-[#08080C] mb-4 leading-tight">
            Janelas de núcleo fundacional não ficam abertas para sempre.
          </h2>
          <p className="text-[#6B7280] mb-8 leading-relaxed">
            Se você tem histórico, vibecoding, marketing e ambição de partnership na AdzHub, envie sua candidatura.
          </p>
          <StarBorder type="button" onClick={openApplication} color="hsl(224, 47%, 42%)" speed="8s">
            Quero fazer parte
          </StarBorder>
        </FadeIn>
      </section>

      <Footer showCta={false} />

      <div className="pointer-events-none fixed inset-x-0 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-50 flex justify-center px-4 md:hidden">
        <button
          type="button"
          onClick={openApplication}
          className="pointer-events-auto inline-flex h-14 items-center justify-center gap-3 rounded-full bg-[#37489d] pl-4 pr-7 text-base font-semibold text-white shadow-[0_10px_30px_-8px_rgba(55,72,157,0.55)] transition-colors active:bg-[#2f3d86]"
        >
          <ColorOrb dimension="28px" tones={ADZ_ORB_TONES} />
          Quero me candidatar
        </button>
      </div>
    </div>
  );
}
