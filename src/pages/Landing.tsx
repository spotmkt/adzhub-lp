import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check, Zap, Target, BarChart3, Users, Clock, Shield, Sparkles, Home } from 'lucide-react';
import adzhubLogo from '@/assets/adzhub-logo-final.png';

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/50 bg-background">
        <div className="container mx-auto flex h-20 items-center justify-between px-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img src={adzhubLogo} alt="AdzHub" className="h-10 w-10" />
            <span className="text-2xl font-medium">AdzHub</span>
          </Link>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-8 rounded-full border border-border bg-card px-6 py-2">
            <Link 
              to="/" 
              className="flex items-center gap-2 rounded-full bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Home className="h-4 w-4" />
              Home
            </Link>
            <Link to="/blog" className="text-sm text-foreground/90 transition-colors hover:text-foreground">
              Blog
            </Link>
            <Link to="/contact" className="text-sm text-foreground/90 transition-colors hover:text-foreground">
              Contato
            </Link>
            <Link to="/auth" className="text-sm text-foreground/90 transition-colors hover:text-foreground">
              Login
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-border px-3 py-1">
              <div className="h-4 w-4 rounded-full bg-primary" />
              <span className="text-xs">PRO</span>
            </div>
            <Button size="lg" asChild className="rounded-full">
              <Link to="/auth">Criar Conta</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Powered by AI</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
              TOP 1 no mundo em Campanhas de Whatsapp
              <br />
              <span className="text-primary">do seu marketing</span>
            </h1>

            {/* Subheading */}
            <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Substitua mais de 20 ferramentas com uma plataforma convergente de gestão criativa e automação.
            </p>

            {/* CTA Button */}
            <div className="flex flex-col items-center gap-4 pt-4">
              <Button 
                size="lg" 
                asChild
                className="h-14 px-8 text-lg rounded-full shadow-lg hover:shadow-xl transition-all"
              >
                <Link to="/auth">
                  Começar Agora. É GRÁTIS →
                </Link>
              </Button>
              <p className="text-sm text-muted-foreground">
                Gratuito para sempre. Sem cartão de crédito.
              </p>
            </div>
          </div>
        </div>

        {/* Trust Section */}
        <div className="mt-32">
          <div className="container mx-auto px-6">
            <p className="text-center text-muted-foreground mb-12">
              Confiado por agências e empresas inovadoras
            </p>
          </div>
        </div>
      </main>

      {/* Features Grid */}
      <section className="py-32 border-t border-border/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Tudo que você precisa em um só lugar
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Ferramentas poderosas para otimizar cada etapa do seu processo de marketing
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="group border-border/50 bg-card/50 backdrop-blur transition-all hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10">
              <CardContent className="p-6">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                  <Zap className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Geração de Conteúdo com IA</h3>
                <p className="text-base text-muted-foreground">
                  Crie posts, ideias e estratégias de conteúdo automaticamente com IA avançada.
                </p>
              </CardContent>
            </Card>

            <Card className="group border-border/50 bg-card/50 backdrop-blur transition-all hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10">
              <CardContent className="p-6">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                  <Users className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Gestão de Clientes</h3>
                <p className="text-base text-muted-foreground">
                  Centralize todos os seus clientes e projetos em um único lugar organizado.
                </p>
              </CardContent>
            </Card>

            <Card className="group border-border/50 bg-card/50 backdrop-blur transition-all hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10">
              <CardContent className="p-6">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                  <BarChart3 className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Analytics Integrado</h3>
                <p className="text-base text-muted-foreground">
                  Dados em tempo real sobre performance de campanhas e conteúdos.
                </p>
              </CardContent>
            </Card>

            <Card className="group border-border/50 bg-card/50 backdrop-blur transition-all hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10">
              <CardContent className="p-6">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                  <Target className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Calendário Editorial</h3>
                <p className="text-base text-muted-foreground">
                  Planeje e organize suas publicações com visão completa do calendário.
                </p>
              </CardContent>
            </Card>

            <Card className="group border-border/50 bg-card/50 backdrop-blur transition-all hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10">
              <CardContent className="p-6">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                  <Clock className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Automação de Tarefas</h3>
                <p className="text-base text-muted-foreground">
                  Automatize processos repetitivos e foque no que realmente importa.
                </p>
              </CardContent>
            </Card>

            <Card className="group border-border/50 bg-card/50 backdrop-blur transition-all hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10">
              <CardContent className="p-6">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                  <Shield className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Segurança e Privacidade</h3>
                <p className="text-base text-muted-foreground">
                  Seus dados protegidos com criptografia de nível empresarial.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-32 border-t border-border/50 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold mb-6">
                Por que escolher a AdzHub?
              </h2>
              <p className="text-xl text-muted-foreground">
                Recursos que fazem a diferença no seu dia a dia
              </p>
            </div>

            <div className="space-y-8">
              {[
                'Economize até 80% do tempo em criação de conteúdo',
                'Gerencie múltiplos clientes de forma eficiente',
                'Acesso a insights e analytics em tempo real',
                'Interface intuitiva e fácil de usar',
                'Suporte prioritário em português',
                'Atualizações constantes e novas funcionalidades',
              ].map((benefit, index) => (
                <div key={index} className="flex items-start gap-6">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-xl">{benefit}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-4xl sm:text-5xl font-bold">
              Pronto para transformar seu marketing?
            </h2>
            <p className="text-xl text-muted-foreground">
              Junte-se a centenas de profissionais que já estão usando a AdzHub
            </p>
            <Button 
              size="lg" 
              asChild
              className="h-14 px-8 text-lg rounded-full"
            >
              <Link to="/auth">
                Começar gratuitamente →
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-16 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <img src={adzhubLogo} alt="AdzHub" className="h-8 w-8" />
                <span className="text-xl font-medium">AdzHub</span>
              </div>
              <p className="text-base text-muted-foreground">
                A plataforma completa para gestão de marketing digital
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-6">Produto</h4>
              <ul className="space-y-3 text-base text-muted-foreground">
                <li><Link to="/chat" className="hover:text-foreground transition-colors">Recursos</Link></li>
                <li><Link to="/blog" className="hover:text-foreground transition-colors">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-6">Empresa</h4>
              <ul className="space-y-3 text-base text-muted-foreground">
                <li><Link to="/contact" className="hover:text-foreground transition-colors">Contato</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-6">Legal</h4>
              <ul className="space-y-3 text-base text-muted-foreground">
                <li><Link to="/contact" className="hover:text-foreground transition-colors">Privacidade</Link></li>
                <li><Link to="/contact" className="hover:text-foreground transition-colors">Termos</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/50 pt-8 text-center text-base text-muted-foreground">
            <p>© 2025 AdzHub. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}