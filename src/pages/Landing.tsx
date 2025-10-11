import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check, Zap, Target, BarChart3, Users, Clock, Shield, Sparkles, Star, Play, Plus, ChevronRight, ArrowRight } from 'lucide-react';
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
      <main className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-br from-[hsl(var(--hero-gradient-start))] via-[hsl(var(--hero-gradient-mid))] to-[hsl(var(--hero-gradient-end))]">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto text-center space-y-8 relative">
            {/* Floating Tags */}
            <div className="absolute -left-12 top-0 hidden lg:flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-900 rounded-full text-sm font-medium shadow-lg transform -rotate-6">
              <span>📊</span>
              <span>Finance</span>
            </div>
            <div className="absolute -right-12 top-8 hidden lg:flex items-center gap-2 px-4 py-2 bg-rose-100 text-rose-900 rounded-full text-sm font-medium shadow-lg transform rotate-6">
              <span>💼</span>
              <span>Business</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground">
              Make Your Money
              <br />
              Work Harder
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Initiating a business venture may appear overwhelming, yet our forte lies in simplifying the entire process for you.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button 
                size="lg" 
                asChild
                className="h-12 px-8 bg-foreground text-background hover:bg-foreground/90 rounded-full font-medium"
              >
                <Link to="/auth">
                  Get Started Free
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                asChild
                className="h-12 px-8 bg-transparent border-2 border-foreground text-foreground hover:bg-foreground/5 rounded-full font-medium"
              >
                <Link to="/auth" className="flex items-center gap-2">
                  <Play className="w-4 h-4" />
                  Watch A Demo
                </Link>
              </Button>
            </div>

            {/* Trustpilot Badge */}
            <div className="flex items-center justify-center gap-2 pt-2">
              <Star className="w-5 h-5 fill-red-500 text-red-500" />
              <span className="font-semibold text-foreground">Trustpilot</span>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-red-500 text-red-500" />
                ))}
              </div>
              <span className="text-sm text-muted-foreground font-medium">3800+ 5 Stars</span>
            </div>
          </div>

          {/* Dashboard Mockup */}
          <div className="max-w-6xl mx-auto mt-16">
            <div className="relative">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/50">
                <div className="aspect-[16/10] bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <BarChart3 className="w-24 h-24 mx-auto text-primary/40" />
                    <p className="text-lg text-muted-foreground font-medium">Dashboard Preview</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Social Proof Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <p className="text-center text-sm font-medium text-muted-foreground mb-12">
              Loved by 25 million+ users
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center opacity-50">
              {/* Logo Placeholders */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-muted"></div>
                <span className="text-lg font-semibold text-muted-foreground">Circooles</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-muted"></div>
                <span className="text-lg font-semibold text-muted-foreground">Quotient</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-muted transform rotate-45"></div>
                <span className="text-lg font-semibold text-muted-foreground">Hourglass</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-muted"></div>
                <span className="text-lg font-semibold text-muted-foreground">Command+R</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-muted"></div>
                <span className="text-lg font-semibold text-muted-foreground">Catalog</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-muted"></div>
                <span className="text-lg font-semibold text-muted-foreground">Layers</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Manage Money Wisely Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-16 gap-6">
              <div className="max-w-2xl">
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
                  Manage
                  <br />
                  Money Wisely
                </h2>
                <p className="text-base text-muted-foreground">
                  Master the Art of Financial Management: Strategies and Tools to Optimize Your Budget, Build Wealth, and Secure a Stable Financial Future
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <Button 
                  size="lg"
                  className="h-12 px-8 bg-foreground text-background hover:bg-foreground/90 rounded-full"
                  asChild
                >
                  <Link to="/auth">Get Started Free</Link>
                </Button>
                <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Explore More About Us
                </button>
              </div>
            </div>

            {/* Cards Grid */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Expanse Statistic Card */}
              <Card className="border-border bg-card overflow-hidden">
                <CardContent className="p-8">
                  <div className="flex items-start justify-between mb-8">
                    <Button 
                      variant="outline" 
                      className="rounded-full border-2 border-primary text-primary hover:bg-primary/10"
                    >
                      Learn More
                    </Button>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Bar chart</span>
                      <BarChart3 className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="mb-8">
                    <h3 className="text-2xl font-bold mb-4">Expanse Statistic</h3>
                    <div className="flex gap-2 mb-8">
                      {/* Chart Circles - representing Jan to May */}
                      <div className="flex-1 flex flex-col items-center gap-2">
                        <div className="flex flex-col gap-2">
                          <div className="w-12 h-12 rounded-full bg-orange-200"></div>
                          <div className="w-12 h-12 rounded-full bg-orange-400"></div>
                        </div>
                        <span className="text-xs text-muted-foreground">Jan</span>
                      </div>
                      <div className="flex-1 flex flex-col items-center gap-2">
                        <div className="flex flex-col gap-2">
                          <div className="w-12 h-12 rounded-full bg-orange-200"></div>
                          <div className="w-12 h-12 rounded-full bg-orange-400"></div>
                        </div>
                        <span className="text-xs text-muted-foreground">Feb</span>
                      </div>
                      <div className="flex-1 flex flex-col items-center gap-2">
                        <div className="relative">
                          <div className="flex flex-col gap-2">
                            <div className="w-12 h-12 rounded-full bg-orange-200"></div>
                            <div className="w-16 h-16 rounded-full bg-orange-400"></div>
                          </div>
                          {/* Tooltip */}
                          <div className="absolute -top-20 left-1/2 -translate-x-1/2 bg-orange-100 rounded-2xl p-3 shadow-lg whitespace-nowrap z-10">
                            <div className="text-xs mb-1 flex items-center gap-1">
                              <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                              Current Income
                            </div>
                            <div className="text-lg font-bold">73,901</div>
                            <div className="text-xs mt-1 flex items-center gap-1">
                              <div className="w-2 h-2 rounded-full bg-orange-600"></div>
                              Current Expences
                            </div>
                            <div className="text-lg font-bold">98,032</div>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">Mar</span>
                      </div>
                      <div className="flex-1 flex flex-col items-center gap-2">
                        <div className="flex flex-col gap-2">
                          <div className="w-12 h-12 rounded-full bg-orange-200"></div>
                          <div className="w-14 h-14 rounded-full bg-orange-400"></div>
                        </div>
                        <span className="text-xs text-muted-foreground">Apr</span>
                      </div>
                      <div className="flex-1 flex flex-col items-center gap-2">
                        <div className="flex flex-col gap-2">
                          <div className="w-12 h-12 rounded-full bg-orange-200"></div>
                          <div className="w-14 h-14 rounded-full bg-orange-400"></div>
                        </div>
                        <span className="text-xs text-muted-foreground">May</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-border pt-6">
                    <h4 className="text-xl font-bold mb-2">Manage Your Money Wisely</h4>
                    <p className="text-sm text-muted-foreground">Master the Art of Financial Management</p>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Transfer Card */}
              <Card className="border-border bg-card">
                <CardContent className="p-8">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold mb-4">Quick Transfer</h3>
                    <div className="flex gap-2 mb-6">
                      <button className="px-4 py-2 rounded-full bg-foreground text-background text-sm font-medium">
                        All
                      </button>
                      <button className="px-4 py-2 rounded-full text-foreground text-sm font-medium hover:bg-muted">
                        Contacts
                      </button>
                    </div>
                  </div>

                  <div className="mb-8">
                    <div className="flex items-center gap-4 mb-8">
                      <button className="flex flex-col items-center gap-2 group">
                        <div className="w-16 h-16 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center group-hover:border-primary transition-colors">
                          <Plus className="w-6 h-6 text-muted-foreground group-hover:text-primary" />
                        </div>
                        <span className="text-xs text-muted-foreground">Add New</span>
                      </button>
                      <button className="flex flex-col items-center gap-2">
                        <div className="w-16 h-16 rounded-full bg-muted"></div>
                        <span className="text-xs text-muted-foreground">Albert Sky</span>
                      </button>
                      <button className="flex flex-col items-center gap-2">
                        <div className="w-16 h-16 rounded-full bg-muted"></div>
                        <span className="text-xs text-muted-foreground">Edwer San</span>
                      </button>
                      <button className="flex flex-col items-center gap-2">
                        <div className="w-16 h-16 rounded-full bg-muted"></div>
                        <span className="text-xs text-muted-foreground">Erwan Why</span>
                      </button>
                      <button className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80">
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-6 bg-muted/30 rounded-2xl">
                    <div className="text-4xl font-bold">$349<span className="text-muted-foreground">.00</span></div>
                    <Button 
                      className="h-12 px-8 bg-red-400 hover:bg-red-500 text-white rounded-full"
                    >
                      Send
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

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
