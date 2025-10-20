import { Link } from "react-router-dom";
import { Brain, TrendingUp, Users, Sparkles, Lock, Cpu, Zap, Target, ChevronRight, Mail } from "lucide-react";
import adzHubLogo from "@/assets/adzhub-logo-final.png";
import { StarBorder } from "@/components/ui/star-border";
import { SpotlightCard } from "@/components/ui/spotlight-card";

export default function AdzHubLanding() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header fixo */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="flex items-center gap-3">
          <img 
            src={adzHubLogo} 
            alt="Adzhub Logo" 
            className="h-8 w-auto" 
            width="120" 
            height="32"
            loading="eager"
            fetchPriority="high"
          />
        </div>

        <div className="hidden md:flex items-center gap-6">
          <a href="#sobre" className="text-sm text-foreground/70 hover:text-foreground transition-colors">
            Sobre
          </a>
          <a href="#como-funciona" className="text-sm text-foreground/70 hover:text-foreground transition-colors">
            Como Funciona
          </a>
          <a href="#empresas" className="text-sm text-foreground/70 hover:text-foreground transition-colors">
            Para Empresas
          </a>
          <a href="#contato" className="text-sm text-foreground/70 hover:text-foreground transition-colors">
            Contato
          </a>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/whatsapp">
            <button className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors font-medium">
              Acessar App WhatsApp
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        
        <div className="relative max-w-6xl mx-auto px-6 z-10">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight text-foreground mb-6">
              Acelerando o desenvolvimento empresarial através do{" "}
              <span className="text-primary">marketing inteligente</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
              A Adzhub é a primeira plataforma de Inteligência em Marketing que une inteligência artificial, 
              metodologia e automação para ajudar pequenas e médias empresas a planejar, executar e medir 
              o marketing de forma simples, acessível e eficiente.
            </p>

            <div className="flex items-center justify-center gap-4 flex-wrap">
              <a href="#sobre">
                <StarBorder speed="8s">
                  Conheça a Adzhub
                </StarBorder>
              </a>
              <Link to="/whatsapp">
                <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors font-medium">
                  Acessar App WhatsApp
                  <ChevronRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>

          {/* Imagem ilustrativa */}
          <div className="relative rounded-3xl overflow-hidden bg-muted/30 backdrop-blur-sm border border-border p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-card rounded-2xl p-6 border border-border">
                <Target className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-semibold mb-2">Estratégia</h3>
                <p className="text-sm text-muted-foreground">Planeje com inteligência</p>
              </div>
              <div className="bg-card rounded-2xl p-6 border border-border">
                <Zap className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-semibold mb-2">Execução</h3>
                <p className="text-sm text-muted-foreground">Automatize suas campanhas</p>
              </div>
              <div className="bg-card rounded-2xl p-6 border border-border">
                <TrendingUp className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-semibold mb-2">Resultados</h3>
                <p className="text-sm text-muted-foreground">Meça o que importa</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* A dor que resolvemos */}
      <section id="sobre" className="py-24 bg-muted/30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              O marketing não precisa ser complicado
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Criada a partir de quase uma década de experiência real no mercado de mídia e automação, 
              a Adzhub nasceu da vivência com centenas de PMEs em diferentes países que enfrentavam 
              desafios como falta de tempo, alto custo e pouca clareza sobre o retorno das ações de marketing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <SpotlightCard className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-destructive rotate-180" />
                </div>
                <h3 className="font-semibold mb-2">Baixo retorno sobre investimento</h3>
                <p className="text-sm text-muted-foreground">
                  Gastos sem resultados claros e mensuráveis
                </p>
              </div>
            </SpotlightCard>

            <SpotlightCard className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                  <Cpu className="w-6 h-6 text-destructive" />
                </div>
                <h3 className="font-semibold mb-2">Falta de integração</h3>
                <p className="text-sm text-muted-foreground">
                  Ferramentas desconectadas que não conversam entre si
                </p>
              </div>
            </SpotlightCard>

            <SpotlightCard className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-destructive" />
                </div>
                <h3 className="font-semibold mb-2">Perda de tempo</h3>
                <p className="text-sm text-muted-foreground">
                  Tarefas manuais que consomem recursos valiosos
                </p>
              </div>
            </SpotlightCard>

            <SpotlightCard className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-destructive" />
                </div>
                <h3 className="font-semibold mb-2">Ausência de estratégia</h3>
                <p className="text-sm text-muted-foreground">
                  Ações isoladas sem planejamento nem acompanhamento
                </p>
              </div>
            </SpotlightCard>
          </div>
        </div>
      </section>

      {/* O que fazemos */}
      <section id="como-funciona" className="py-24 bg-background">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Sua agência de bolso
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Com a Adzhub, qualquer empresa pode executar marketing de forma profissional — sem precisar 
              de grandes equipes ou altos investimentos. A plataforma combina três pilares que trabalham 
              juntos para gerar resultados reais:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card rounded-3xl p-8 border border-border hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <Brain className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Metodologia validada</h3>
              <p className="text-muted-foreground leading-relaxed">
                Um passo a passo estratégico desenvolvido ao longo de anos de experiência real com 
                PMEs em diferentes mercados para planejar ações e entender seu público.
              </p>
            </div>

            <div className="bg-card rounded-3xl p-8 border border-border hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Automação inteligente</h3>
              <p className="text-muted-foreground leading-relaxed">
                A inteligência artificial cuida das tarefas operacionais e otimiza suas campanhas, 
                permitindo que você foque no que realmente importa para seu negócio.
              </p>
            </div>

            <div className="bg-card rounded-3xl p-8 border border-border hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Acompanhamento humano</h3>
              <p className="text-muted-foreground leading-relaxed">
                Especialistas e consultores ajudam a garantir que tudo siga o rumo certo, 
                trazendo a experiência necessária para seu crescimento.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Soluções iniciais - WhatsApp */}
      <section className="py-24 bg-primary/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Comece de forma simples: campanhas inteligentes no WhatsApp
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                O primeiro produto da Adzhub permite que empresas criem e gerenciem campanhas 
                automatizadas de WhatsApp com facilidade — para divulgar produtos, manter 
                relacionamento e aumentar vendas.
              </p>
              <Link to="/whatsapp">
                <StarBorder speed="8s">
                  Acessar App de Campanhas WhatsApp
                </StarBorder>
              </Link>
            </div>

            <div className="bg-card rounded-3xl p-8 border border-border">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Campanhas em massa</h4>
                    <p className="text-sm text-muted-foreground">
                      Envie mensagens personalizadas para milhares de contatos simultaneamente
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Lock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Seguro e confiável</h4>
                    <p className="text-sm text-muted-foreground">
                      Criptografia de ponta e respeito às políticas do WhatsApp
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Resultados mensuráveis</h4>
                    <p className="text-sm text-muted-foreground">
                      Acompanhe métricas e otimize suas campanhas em tempo real
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nosso propósito */}
      <section className="py-24 bg-background">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Empresas mais fortes, economia mais viva
          </h2>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Acreditamos que as pequenas e médias empresas são a base da economia real — geram empregos, 
            movimentam comunidades e transformam o país. Nosso propósito é tornar o marketing uma ferramenta 
            de crescimento e aprendizado empresarial, e não apenas de divulgação.
          </p>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 blur-3xl" />
            <blockquote className="relative bg-card rounded-3xl p-12 border border-border">
              <p className="text-2xl md:text-3xl font-medium text-foreground italic">
                "Não somos apenas uma plataforma de marketing. Somos uma aceleradora do 
                desenvolvimento empresarial."
              </p>
            </blockquote>
          </div>
        </div>
      </section>

      {/* Para investidores e parceiros */}
      <section id="empresas" className="py-24 bg-muted/30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Transformando o marketing em um sistema de inteligência
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              A Adzhub está construindo a primeira infraestrutura inteligente de marketing para PMEs — 
              um modelo escalável que integra automação, dados e marketplace de serviços. Buscamos parceiros 
              estratégicos e investidores que acreditam no poder da tecnologia para impulsionar o empreendedorismo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <SpotlightCard className="p-8">
              <h3 className="text-2xl font-bold mb-4">Nossa visão</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Criamos um ecossistema completo onde PMEs têm acesso a metodologia validada, 
                automação inteligente e suporte especializado — tudo integrado em uma única plataforma 
                que evolui continuamente com as necessidades do mercado.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <ChevronRight className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm">Modelo SaaS escalável</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <ChevronRight className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm">Marketplace de serviços</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <ChevronRight className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm">Dados e inteligência de mercado</span>
                </li>
              </ul>
            </SpotlightCard>

            <SpotlightCard className="p-8">
              <h3 className="text-2xl font-bold mb-4">Oportunidade de mercado</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Com mais de 17 milhões de PMEs no Brasil e centenas de milhões globalmente, 
                o mercado de marketing digital para pequenas empresas cresce exponencialmente, 
                mas ainda carece de soluções verdadeiramente acessíveis e eficientes.
              </p>
              <div className="space-y-4">
                <div className="bg-background rounded-2xl p-4">
                  <div className="text-3xl font-bold text-primary mb-1">17M+</div>
                  <div className="text-sm text-muted-foreground">PMEs no Brasil</div>
                </div>
                <div className="bg-background rounded-2xl p-4">
                  <div className="text-3xl font-bold text-primary mb-1">90%</div>
                  <div className="text-sm text-muted-foreground">Sem estratégia de marketing estruturada</div>
                </div>
              </div>
            </SpotlightCard>
          </div>

          <div className="text-center mt-12">
            <a href="#contato">
              <button className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium">
                <Mail className="w-5 h-5" />
                Solicite a apresentação da nossa Tese
              </button>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contato" className="py-16 bg-background border-t border-border">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <img 
                src={adzHubLogo} 
                alt="Adzhub" 
                className="h-8 w-auto mb-4"
              />
              <p className="text-sm text-muted-foreground max-w-sm">
                Acelerando o desenvolvimento empresarial através do marketing inteligente.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Produto</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/whatsapp" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    App WhatsApp
                  </Link>
                </li>
                <li>
                  <Link to="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Preços
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#sobre" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Sobre
                  </a>
                </li>
                <li>
                  <a href="#empresas" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Para Empresas
                  </a>
                </li>
                <li>
                  <a href="#contato" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Contato
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-border">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-muted-foreground">
                © 2025 Adzhub. Todos os direitos reservados.
              </p>
              <div className="flex gap-6">
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Privacidade
                </a>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
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
