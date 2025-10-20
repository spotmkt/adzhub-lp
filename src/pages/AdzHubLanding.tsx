import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Play, Star, Brain, Target, Users, Sparkles, TrendingUp, Zap, Mail } from "lucide-react";
import adzHubLogo from "@/assets/adzhub-logo-final.png";
import { StarBorder } from "@/components/ui/star-border";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { LandingNav } from "@/components/LandingNav";

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
      <LandingNav activeSection="home" />

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden bg-gradient-to-br from-[#D4EFF4]/30 via-[#F9C7B2]/20 to-[#F9B2D4]/20 rounded-[32px] mx-5 mt-[83px]">
        <div className="relative max-w-5xl mx-auto px-8 z-10">
          <div className="flex flex-col items-center text-center gap-8 max-w-[781px] mx-auto mb-12">
            <h1 className="text-5xl md:text-7xl lg:text-[100px] font-bold leading-[100%] tracking-tight text-[#08080C]">
              <span className="block mb-2">Marketing Inteligente</span>
              <span className="relative inline-block min-w-[280px] md:min-w-[420px] lg:min-w-[600px] text-center h-[1.2em]">
                <span 
                  key={titleNumber}
                  className="absolute left-0 right-0 font-bold text-[#37489d] animate-fade-in"
                >
                  {titles[titleNumber]}
                </span>
              </span>
            </h1>
            <p className="text-lg text-[#08080C] opacity-80 max-w-[566px]">
              A primeira plataforma de Inteligência em Marketing que une IA, metodologia e automação para acelerar o desenvolvimento empresarial
            </p>
          </div>

          <div className="flex items-center justify-center gap-4 mb-6 flex-wrap">
            <a href="#sobre">
              <StarBorder color="hsl(224, 47%, 42%)" speed="8s">
                Conheça a Adzhub
              </StarBorder>
            </a>
            <Link to="/whatsapp">
              <button className="flex items-center gap-2 text-[#37489d] hover:text-[#37489d]/80 transition-colors">
                <Play className="w-5 h-5" />
                Ver Demonstração
              </button>
            </Link>
          </div>

          <div className="flex items-center justify-center gap-5 flex-wrap">
            <div className="flex items-center gap-2 min-h-[28px]">
              <span className="text-lg font-medium text-[#08080C]">
                Empresas atendidas em 3 países
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-[hsl(41,100%,58%)] text-[hsl(41,100%,58%)]" />
                ))}
              </div>
              <span className="text-base font-medium text-[#08080C]">Quase 10 anos de experiência</span>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="pt-8 -mb-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-8">
            <span className="text-[#6B7280] text-lg font-medium">
              Desenvolvido por especialistas.
            </span>
            <br />
            <span className="text-[#08080C] text-lg font-medium">
              Validado por centenas de PMEs.
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-[#08080C] mb-8">
            <div className="flex items-center justify-center">
              <div className="text-center">
                <Brain className="w-10 h-10 mx-auto mb-2 text-[#37489d]" />
                <p className="text-sm font-semibold">IA Integrada</p>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="text-center">
                <Target className="w-10 h-10 mx-auto mb-2 text-[#37489d]" />
                <p className="text-sm font-semibold">Estratégia</p>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="text-center">
                <Zap className="w-10 h-10 mx-auto mb-2 text-[#37489d]" />
                <p className="text-sm font-semibold">Automação</p>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="w-10 h-10 mx-auto mb-2 text-[#37489d]" />
                <p className="text-sm font-semibold">Resultados</p>
              </div>
            </div>
            <div className="flex items-center justify-center col-span-2 md:col-span-1">
              <div className="text-center">
                <Users className="w-10 h-10 mx-auto mb-2 text-[#37489d]" />
                <p className="text-sm font-semibold">Suporte</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative h-64 w-full overflow-hidden [mask-image:radial-gradient(50%_50%,white,transparent)]">
          <div className="absolute inset-0 before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_bottom_center,hsl(224,47%,42%),transparent_70%)] before:opacity-40" />
          <div className="absolute -left-1/2 top-1/2 aspect-[1/0.7] z-10 w-[200%] rounded-[100%] border-t border-[#08080C]/20 bg-white" />
        </div>
      </section>

      {/* O que resolvemos */}
      <section id="sobre" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col lg:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-[649px]">
              <h2 className="text-4xl md:text-6xl lg:text-[72px] font-medium leading-[100%] tracking-tight text-[#08080C] mb-6">
                O marketing não precisa ser complicado
              </h2>
              <p className="text-lg font-medium text-[#6B7280] leading-[170%]">
                Criada a partir de quase uma década de experiência real no mercado, a Adzhub nasceu 
                da vivência com centenas de PMEs que enfrentavam desafios como falta de tempo, alto 
                custo e pouca clareza sobre o retorno das ações de marketing.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <a href="#como-funciona">
                <StarBorder color="hsl(224, 47%, 42%)" speed="8s">
                  Saiba Como Funciona
                </StarBorder>
              </a>
              <p className="text-base font-medium text-[#6B7280] capitalize">
                transforme seu marketing
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-3xl bg-[#F6F6F6] p-8 md:p-14">
              <div className="space-y-6">
                <div className="bg-white rounded-3xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-[#37489d]/10 flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-[#37489d] rotate-180" />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-[#08080C]">Baixo ROI</p>
                      <p className="text-sm text-[#6B7280]">Gastos sem resultados claros</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-3xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-[#37489d]/10 flex items-center justify-center">
                      <Zap className="w-6 h-6 text-[#37489d]" />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-[#08080C]">Perda de Tempo</p>
                      <p className="text-sm text-[#6B7280]">Tarefas manuais e repetitivas</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-[#F6F6F6] p-6">
              <h3 className="text-[28px] font-normal capitalize text-[#08080C] mb-6">Nossa Solução</h3>
              <div className="space-y-4 mb-8">
                <div className="bg-white rounded-2xl p-4">
                  <p className="text-sm font-medium text-[#37489d] mb-1">Metodologia Validada</p>
                  <p className="text-xs text-[#6B7280]">Estratégia comprovada por anos de experiência</p>
                </div>
                <div className="bg-white rounded-2xl p-4">
                  <p className="text-sm font-medium text-[#37489d] mb-1">Automação Inteligente</p>
                  <p className="text-xs text-[#6B7280]">IA cuida das tarefas operacionais</p>
                </div>
                <div className="bg-white rounded-2xl p-4">
                  <p className="text-sm font-medium text-[#37489d] mb-1">Acompanhamento Humano</p>
                  <p className="text-xs text-[#6B7280]">Especialistas garantem o rumo certo</p>
                </div>
              </div>
              <div className="border-t border-[rgba(8,8,12,0.16)] pt-6">
                <Link to="/whatsapp">
                  <RainbowButton>
                    Começar Agora
                  </RainbowButton>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Reasons Section - Os 3 Pilares */}
      <section id="como-funciona" className="py-24 bg-[#F8F8F8] rounded-3xl mx-5">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-16 gap-8">
            <h2 className="text-4xl md:text-6xl lg:text-[72px] font-medium leading-[100%] tracking-tight text-[#08080C] max-w-[600px]">
              Sua agência de bolso
            </h2>
            <p className="text-lg font-medium text-[#6B7280] leading-[150%] max-w-[363px]">
              Com a Adzhub, qualquer empresa pode executar marketing profissional sem grandes equipes ou altos investimentos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl p-6">
              <div className="inline-flex items-center gap-2 px-2 py-1 rounded bg-[hsl(224,47%,42%)]/10 mb-4">
                <div className="w-6 h-6 rounded-full bg-[hsl(224,47%,42%)]"></div>
                <span className="text-base font-medium text-[hsl(224,47%,42%)]">Metodologia</span>
              </div>
              <div className="flex items-center justify-center mb-8 mt-6">
                <Brain className="w-20 h-20 text-[#37489d]" />
              </div>
              <p className="text-lg font-normal text-[#6B7280] leading-[150%]">
                Passo a passo estratégico validado para planejar ações e entender seu público com clareza
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6">
              <div className="inline-flex items-center gap-2 px-2 py-1 rounded bg-[hsl(41,100%,58%)]/10 mb-4">
                <div className="w-6 h-6 rounded-full bg-[hsl(41,100%,58%)]"></div>
                <span className="text-base font-medium text-[hsl(41,100%,58%)]">Automação</span>
              </div>
              <div className="flex items-center justify-center mb-8 mt-6">
                <Sparkles className="w-20 h-20 text-[hsl(41,100%,58%)]" />
              </div>
              <p className="text-lg font-normal text-[#6B7280] leading-[150%]">
                IA cuida das tarefas operacionais e otimiza campanhas para você focar no essencial
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6">
              <div className="inline-flex items-center gap-2 px-2 py-1 rounded bg-[hsl(224,47%,42%)]/10 mb-4">
                <div className="w-6 h-6 rounded-full bg-[hsl(224,47%,42%)]"></div>
                <span className="text-base font-medium text-[hsl(224,47%,42%)]">Suporte</span>
              </div>
              <div className="flex items-center justify-center mb-8 mt-6">
                <Users className="w-20 h-20 text-[#37489d]" />
              </div>
              <p className="text-lg font-normal text-[#6B7280] leading-[150%]">
                Especialistas e consultores ajudam a garantir que tudo siga o rumo certo
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Display Cards Section - WhatsApp App */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl lg:text-[72px] font-medium leading-[100%] tracking-tight text-[#08080C] mb-6">
              Comece simples: WhatsApp
            </h2>
            <p className="text-lg font-medium text-[#6B7280] leading-[170%] max-w-[600px] mx-auto">
              O primeiro produto da Adzhub permite criar e gerenciar campanhas automatizadas de WhatsApp com facilidade
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <SpotlightCard
              className="flex flex-col gap-4 rounded-3xl !bg-white !border-primary/10 shadow-2xl"
              spotlightColor="#6300ff30"
            >
              <div className="text-2xl font-bold flex items-center gap-2">
                <Zap className="text-yellow-500 w-8 h-8" />
                <span className="text-[#08080C]">Campanhas em Massa</span>
              </div>
              <div className="text-[#6B7280]">
                Envie mensagens personalizadas para milhares de contatos simultaneamente de forma segura e eficiente.
              </div>
            </SpotlightCard>

            <SpotlightCard
              className="flex flex-col gap-4 rounded-3xl !bg-white !border-primary/10 shadow-2xl"
              spotlightColor="#ff006630"
            >
              <div className="text-2xl font-bold flex items-center gap-2">
                <Target className="text-yellow-500 w-8 h-8" />
                <span className="text-[#08080C]">Segmentação Inteligente</span>
              </div>
              <div className="text-[#6B7280]">
                Organize contatos e personalize mensagens para cada público com templates e variáveis dinâmicas.
              </div>
            </SpotlightCard>

            <SpotlightCard
              className="flex flex-col gap-4 rounded-3xl !bg-white !border-primary/10 shadow-2xl"
              spotlightColor="#6300ff30"
            >
              <div className="text-2xl font-bold flex items-center gap-2">
                <TrendingUp className="text-yellow-500 w-8 h-8" />
                <span className="text-[#08080C]">Métricas em Tempo Real</span>
              </div>
              <div className="text-[#6B7280]">
                Acompanhe entregas, leituras e respostas com análises detalhadas para otimizar suas campanhas.
              </div>
            </SpotlightCard>
          </div>

          <div className="text-center mt-12">
            <Link to="/whatsapp">
              <StarBorder color="hsl(224, 47%, 42%)" speed="8s">
                Acessar App de Campanhas WhatsApp
              </StarBorder>
            </Link>
          </div>
        </div>
      </section>

      {/* Nosso Propósito */}
      <section className="py-24 bg-[#F8F8F8] rounded-3xl mx-5">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h2 className="text-4xl md:text-6xl lg:text-[72px] font-medium leading-[100%] tracking-tight text-[#08080C] mb-8">
            Empresas mais fortes, economia mais viva
          </h2>
          <p className="text-lg font-medium text-[#6B7280] leading-[170%] mb-12">
            Acreditamos que as PMEs são a base da economia real — geram empregos, movimentam comunidades 
            e transformam o país. Nosso propósito é tornar o marketing uma ferramenta de crescimento e 
            aprendizado empresarial, não apenas de divulgação.
          </p>
          
          <div className="bg-white rounded-3xl p-12 border border-[#08080C]/10">
            <blockquote className="text-2xl md:text-3xl font-medium text-[#08080C] italic">
              "Não somos apenas uma plataforma de marketing. Somos uma aceleradora do 
              desenvolvimento empresarial."
            </blockquote>
          </div>
        </div>
      </section>

      {/* Para investidores e parceiros */}
      <section id="empresas" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl lg:text-[72px] font-medium leading-[100%] tracking-tight text-[#08080C] mb-6">
              Sistema de inteligência em marketing
            </h2>
            <p className="text-lg font-medium text-[#6B7280] leading-[170%] max-w-[700px] mx-auto">
              Construindo a primeira infraestrutura inteligente de marketing para PMEs — um modelo 
              escalável que integra automação, dados e marketplace de serviços
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#F6F6F6] rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-[#08080C] mb-6">Nossa Visão</h3>
              <p className="text-[#6B7280] leading-relaxed mb-6">
                Criamos um ecossistema completo onde PMEs têm acesso a metodologia validada, 
                automação inteligente e suporte especializado — tudo integrado em uma plataforma 
                que evolui com as necessidades do mercado.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-[#08080C]">
                  <div className="w-2 h-2 rounded-full bg-[#37489d]"></div>
                  <span className="text-sm">Modelo SaaS escalável</span>
                </li>
                <li className="flex items-center gap-3 text-[#08080C]">
                  <div className="w-2 h-2 rounded-full bg-[#37489d]"></div>
                  <span className="text-sm">Marketplace de serviços</span>
                </li>
                <li className="flex items-center gap-3 text-[#08080C]">
                  <div className="w-2 h-2 rounded-full bg-[#37489d]"></div>
                  <span className="text-sm">Inteligência de dados</span>
                </li>
              </ul>
            </div>

            <div className="bg-[#F6F6F6] rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-[#08080C] mb-6">Oportunidade</h3>
              <p className="text-[#6B7280] leading-relaxed mb-6">
                Com mais de 17 milhões de PMEs no Brasil e centenas de milhões globalmente, 
                o mercado de marketing digital cresce exponencialmente, mas carece de soluções 
                acessíveis e eficientes.
              </p>
              <div className="space-y-4">
                <div className="bg-white rounded-2xl p-4">
                  <div className="text-4xl font-bold text-[#37489d] mb-1">17M+</div>
                  <div className="text-sm text-[#6B7280]">PMEs no Brasil</div>
                </div>
                <div className="bg-white rounded-2xl p-4">
                  <div className="text-4xl font-bold text-[#37489d] mb-1">90%</div>
                  <div className="text-sm text-[#6B7280]">Sem estratégia estruturada</div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <a href="#contato">
              <button className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#37489d] text-white hover:bg-[#37489d]/90 transition-colors font-medium">
                <Mail className="w-5 h-5" />
                Solicite nossa apresentação
              </button>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contato" className="py-16 bg-[#F8F8F8] border-t border-[#08080C]/10">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <img 
                src={adzHubLogo} 
                alt="Adzhub" 
                className="h-8 w-auto mb-4"
              />
              <p className="text-sm text-[#6B7280] max-w-sm">
                Acelerando o desenvolvimento empresarial através do marketing inteligente.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-[#08080C] mb-4">Produto</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/whatsapp" className="text-sm text-[#6B7280] hover:text-[#08080C] transition-colors">
                    App WhatsApp
                  </Link>
                </li>
                <li>
                  <Link to="/pricing" className="text-sm text-[#6B7280] hover:text-[#08080C] transition-colors">
                    Preços
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-[#08080C] mb-4">Empresa</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#sobre" className="text-sm text-[#6B7280] hover:text-[#08080C] transition-colors">
                    Sobre
                  </a>
                </li>
                <li>
                  <a href="#empresas" className="text-sm text-[#6B7280] hover:text-[#08080C] transition-colors">
                    Para Empresas
                  </a>
                </li>
                <li>
                  <a href="#contato" className="text-sm text-[#6B7280] hover:text-[#08080C] transition-colors">
                    Contato
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-[#08080C]/10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-[#6B7280]">
                © 2025 Adzhub. Todos os direitos reservados.
              </p>
              <div className="flex gap-6">
                <a href="#" className="text-sm text-[#6B7280] hover:text-[#08080C] transition-colors">
                  Privacidade
                </a>
                <a href="#" className="text-sm text-[#6B7280] hover:text-[#08080C] transition-colors">
                  Termos
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
