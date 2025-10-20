import { Play, Bell, User, TrendingUp, Zap, Users, Target, MessageSquare, BarChart3, Lightbulb, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import adzhubLogo from "@/assets/adzhub-logo-final.png";

const AdzHubLanding = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-4 z-50 mx-auto max-w-7xl px-4">
        <div className="glass-nav rounded-full p-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <a href="#" className="flex items-center gap-2 pl-4">
                <img src={adzhubLogo} alt="Adzhub" className="h-8 w-auto" loading="eager" fetchPriority="high" />
              </a>
              <nav className="hidden lg:flex items-center bg-muted/50 rounded-full">
                <a href="#sobre" className="py-2 px-5 text-muted-foreground hover:text-foreground font-medium transition-colors">Sobre</a>
                <a href="#como-funciona" className="py-2 px-5 text-muted-foreground hover:text-foreground font-medium transition-colors">Como Funciona</a>
                <a href="#empresas" className="py-2 px-5 text-muted-foreground hover:text-foreground font-medium transition-colors">Para Empresas</a>
                <a href="#contato" className="py-2 px-5 text-muted-foreground hover:text-foreground font-medium transition-colors">Contato</a>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <Button asChild variant="default" className="rounded-full">
                <a href="/whatsapp">Acessar App WhatsApp</a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 pt-24 pb-16">
        <section className="text-center max-w-5xl mx-auto mb-32">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter mb-8 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Acelerando o desenvolvimento empresarial através do marketing inteligente
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
            A Adzhub é uma plataforma que une inteligência artificial, metodologia e automação para ajudar pequenas e médias empresas a planejar, executar e medir o marketing de forma simples, acessível e eficiente.
          </p>
          <div className="flex justify-center items-center gap-4 flex-wrap">
            <Button size="lg" className="rounded-full" asChild>
              <a href="#sobre">Conheça a Adzhub</a>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full" asChild>
              <a href="/whatsapp" className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Acessar App WhatsApp
              </a>
            </Button>
          </div>
        </section>

        {/* Dor que resolvemos */}
        <section id="sobre" className="mb-32 max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-6">
            O marketing não precisa ser complicado.
          </h2>
          <p className="text-lg text-muted-foreground text-center max-w-3xl mx-auto mb-16">
            Milhões de pequenas empresas perdem tempo e dinheiro com ações de marketing desconectadas e sem resultado.
            Falta método, integração e clareza. A Adzhub nasceu para mudar isso — transformando o marketing em um processo inteligente, previsível e conectado à realidade do negócio.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-card border border-border rounded-2xl p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-destructive" />
              </div>
              <h3 className="font-semibold mb-2">Baixo retorno sobre investimento</h3>
            </div>
            
            <div className="bg-card border border-border rounded-2xl p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-destructive" />
              </div>
              <h3 className="font-semibold mb-2">Falta de integração entre ferramentas</h3>
            </div>
            
            <div className="bg-card border border-border rounded-2xl p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-destructive" />
              </div>
              <h3 className="font-semibold mb-2">Perda de tempo com tarefas manuais</h3>
            </div>
            
            <div className="bg-card border border-border rounded-2xl p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-6 h-6 text-destructive" />
              </div>
              <h3 className="font-semibold mb-2">Ausência de estratégia e acompanhamento</h3>
            </div>
          </div>
        </section>

        {/* O que fazemos */}
        <section id="como-funciona" className="mb-32 max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-6">
            Sua agência de bolso.
          </h2>
          <p className="text-lg text-muted-foreground text-center max-w-3xl mx-auto mb-16">
            Com a Adzhub, qualquer empresa pode executar marketing de forma profissional — sem precisar de grandes equipes ou altos investimentos.
            A plataforma combina três pilares que trabalham juntos para gerar resultados reais:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-8">
              <div className="w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                <Lightbulb className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Metodologia validada</h3>
              <p className="text-muted-foreground">
                Um passo a passo estratégico para planejar ações e entender seu público.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 rounded-2xl p-8">
              <div className="w-14 h-14 bg-purple-500/20 rounded-full flex items-center justify-center mb-4">
                <Zap className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Automação inteligente</h3>
              <p className="text-muted-foreground">
                A IA cuida das tarefas operacionais e otimiza suas campanhas.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20 rounded-2xl p-8">
              <div className="w-14 h-14 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                <Users className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Acompanhamento humano</h3>
              <p className="text-muted-foreground">
                Especialistas e consultores ajudam a garantir que tudo siga o rumo certo.
              </p>
            </div>
          </div>
        </section>

        {/* Soluções iniciais */}
        <section className="mb-32 max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/30 rounded-3xl p-12 text-center">
            <MessageSquare className="w-16 h-16 text-green-600 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Comece de forma simples: campanhas inteligentes no WhatsApp
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              O primeiro produto da Adzhub permite que empresas criem e gerenciem campanhas automatizadas de WhatsApp com facilidade — para divulgar produtos, manter relacionamento e aumentar vendas.
            </p>
            <Button size="lg" className="rounded-full bg-green-600 hover:bg-green-700" asChild>
              <a href="/whatsapp" className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Acessar o App de Campanhas WhatsApp
              </a>
            </Button>
          </div>
        </section>

        {/* Nosso propósito */}
        <section className="mb-32 max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-6">
            Empresas mais fortes, economia mais viva.
          </h2>
          <p className="text-lg text-muted-foreground text-center max-w-3xl mx-auto mb-8">
            Acreditamos que as pequenas e médias empresas são a base da economia real — geram empregos, movimentam comunidades e transformam o país.
            Nosso propósito é tornar o marketing uma ferramenta de crescimento e aprendizado empresarial, e não apenas de divulgação.
          </p>
          <blockquote className="text-2xl md:text-3xl font-bold text-center italic border-l-4 border-primary pl-6 py-4 max-w-3xl mx-auto">
            "Não somos apenas uma plataforma de marketing. Somos uma aceleradora do desenvolvimento empresarial."
          </blockquote>
        </section>

        {/* Para investidores */}
        <section id="empresas" className="mb-32 max-w-5xl mx-auto">
          <div className="bg-card border border-border rounded-3xl p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">
              Transformando o marketing em um sistema de inteligência.
            </h2>
            <p className="text-lg text-muted-foreground text-center max-w-3xl mx-auto mb-8">
              A Adzhub está construindo a primeira infraestrutura inteligente de marketing para PMEs — um modelo escalável que integra automação, dados e marketplace de serviços.
              Buscamos parceiros estratégicos e investidores que acreditam no poder da tecnologia para impulsionar o empreendedorismo.
            </p>
            <div className="flex justify-center">
              <Button size="lg" variant="outline" className="rounded-full" asChild>
                <a href="#contato" className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Solicite a apresentação da nossa Tese
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer id="contato" className="bg-muted/30 border-t border-border py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <img src={adzhubLogo} alt="Adzhub" className="h-8 w-auto mb-4" />
              <p className="text-muted-foreground text-sm">
                Acelerando o desenvolvimento empresarial através do marketing inteligente.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Links Rápidos</h3>
              <ul className="space-y-2">
                <li><a href="#sobre" className="text-muted-foreground hover:text-foreground transition-colors">Sobre</a></li>
                <li><a href="#como-funciona" className="text-muted-foreground hover:text-foreground transition-colors">Como Funciona</a></li>
                <li><a href="#empresas" className="text-muted-foreground hover:text-foreground transition-colors">Para Empresas</a></li>
                <li><a href="/whatsapp" className="text-muted-foreground hover:text-foreground transition-colors">App WhatsApp</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Contato</h3>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>contato@adzhub.com.br</li>
                <li>São Paulo, Brasil</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border pt-8 text-center text-muted-foreground text-sm">
            <p>© 2025 Adzhub. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AdzHubLanding;
