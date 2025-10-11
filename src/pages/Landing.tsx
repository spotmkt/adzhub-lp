import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check, Zap, Target, BarChart3, Users, Clock, Shield, Sparkles } from 'lucide-react';
import adzhubLogo from '@/assets/adzhub-logo-final.png';

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <img src={adzhubLogo} alt="AdzHub" className="h-8 w-auto" />
            </Link>

            {/* Navigation Buttons */}
            <div className="flex items-center gap-3">
              <Button variant="ghost" asChild>
                <Link to="/blog">Blog</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link to="/contact">Contato</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/auth">Login</Link>
              </Button>
              <Button asChild className="bg-primary hover:bg-primary/90">
                <Link to="/auth">Criar Conta</Link>
              </Button>
            </div>
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
                className="h-14 px-8 text-lg bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all"
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
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Tudo que você precisa em um só lugar
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Ferramentas poderosas para otimizar cada etapa do seu processo de marketing
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="border-border hover:border-primary/50 transition-colors">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Geração de Conteúdo com IA</h3>
                <p className="text-muted-foreground">
                  Crie posts, ideias e estratégias de conteúdo automaticamente com IA avançada.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border hover:border-primary/50 transition-colors">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Gestão de Clientes</h3>
                <p className="text-muted-foreground">
                  Centralize todos os seus clientes e projetos em um único lugar organizado.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border hover:border-primary/50 transition-colors">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Analytics Integrado</h3>
                <p className="text-muted-foreground">
                  Dados em tempo real sobre performance de campanhas e conteúdos.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border hover:border-primary/50 transition-colors">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Calendário Editorial</h3>
                <p className="text-muted-foreground">
                  Planeje e organize suas publicações com visão completa do calendário.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border hover:border-primary/50 transition-colors">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Automação de Tarefas</h3>
                <p className="text-muted-foreground">
                  Automatize processos repetitivos e foque no que realmente importa.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border hover:border-primary/50 transition-colors">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Segurança e Privacidade</h3>
                <p className="text-muted-foreground">
                  Seus dados protegidos com criptografia de nível empresarial.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Por que escolher a AdzHub?
              </h2>
              <p className="text-lg text-muted-foreground">
                Recursos que fazem a diferença no seu dia a dia
              </p>
            </div>

            <div className="space-y-6">
              {[
                'Economize até 80% do tempo em criação de conteúdo',
                'Gerencie múltiplos clientes de forma eficiente',
                'Acesso a insights e analytics em tempo real',
                'Interface intuitiva e fácil de usar',
                'Suporte prioritário em português',
                'Atualizações constantes e novas funcionalidades',
              ].map((benefit, index) => (
                <div key={index} className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-lg">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-3xl sm:text-4xl font-bold">
              Pronto para transformar seu marketing?
            </h2>
            <p className="text-xl text-muted-foreground">
              Junte-se a centenas de profissionais que já estão usando a AdzHub
            </p>
            <Button 
              size="lg" 
              asChild
              className="h-14 px-8 text-lg bg-primary hover:bg-primary/90"
            >
              <Link to="/auth">
                Começar gratuitamente →
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-background">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <img src={adzhubLogo} alt="AdzHub" className="h-8 w-auto mb-4" />
              <p className="text-sm text-muted-foreground">
                A plataforma completa para gestão de marketing digital
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/chat" className="hover:text-foreground">Recursos</Link></li>
                <li><Link to="/blog" className="hover:text-foreground">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/contact" className="hover:text-foreground">Contato</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/contact" className="hover:text-foreground">Privacidade</Link></li>
                <li><Link to="/contact" className="hover:text-foreground">Termos</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>© 2025 AdzHub. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
