import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
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
              <div className="text-sm text-muted-foreground hidden sm:block">
                A plataforma completa para gestão de marketing
              </div>
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
                <Link to="/chat">Login</Link>
              </Button>
              <Button asChild className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 hover:opacity-90">
                <Link to="/chat">Criar Conta</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto text-center space-y-8">
            {/* Main Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
              Maximize a produtividade
              <br />
              do seu marketing
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
                className="h-14 px-8 text-lg bg-gradient-to-r from-primary via-purple-500 to-pink-500 hover:opacity-90 shadow-lg hover:shadow-xl transition-all"
              >
                <Link to="/chat">
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
              Confiado pelas principais empresas do Brasil
            </p>
            <div className="flex justify-center items-center gap-12 flex-wrap opacity-50">
              {/* Placeholder for client logos */}
              <div className="h-12 w-32 bg-muted rounded" />
              <div className="h-12 w-32 bg-muted rounded" />
              <div className="h-12 w-32 bg-muted rounded" />
              <div className="h-12 w-32 bg-muted rounded" />
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="p-6 rounded-lg bg-background border border-border">
              <h3 className="text-xl font-semibold mb-3">Geração de Conteúdo</h3>
              <p className="text-muted-foreground">
                IA avançada para criar posts, ideias e estratégias de conteúdo automaticamente.
              </p>
            </div>
            <div className="p-6 rounded-lg bg-background border border-border">
              <h3 className="text-xl font-semibold mb-3">Gestão de Clientes</h3>
              <p className="text-muted-foreground">
                Centralize todos os seus clientes e projetos em um único lugar.
              </p>
            </div>
            <div className="p-6 rounded-lg bg-background border border-border">
              <h3 className="text-xl font-semibold mb-3">Analytics Integrado</h3>
              <p className="text-muted-foreground">
                Dados em tempo real sobre performance de campanhas e conteúdos.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
