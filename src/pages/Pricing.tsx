import { lazy, Suspense, useMemo } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { testimonials } from "@/data/finestraData";
import { LandingNav } from "@/components/LandingNav";
import { Footer } from "@/components/Footer";

const TestimonialsColumn = lazy(() =>
  import("@/components/ui/testimonials-columns-1").then((module) => ({
    default: module.TestimonialsColumn,
  }))
);

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

const pricingPlans = [
  {
    name: "Starter",
    price: "R$ 97",
    period: "/mês",
    description: "Perfeito para começar sua jornada",
    features: [
      "Até 10 artigos/mês com IA",
      "1 usuário",
      "Blog integrado",
      "Suporte por email",
      "Templates básicos",
    ],
    cta: "Começar Grátis",
    highlighted: false,
  },
  {
    name: "Professional",
    price: "R$ 297",
    period: "/mês",
    description: "Para equipes que querem crescer",
    features: [
      "Artigos ilimitados com IA",
      "Até 5 usuários",
      "SEO automático",
      "Suporte prioritário",
      "Calendário editorial",
      "Redes sociais integradas",
      "Relatórios avançados",
    ],
    cta: "Começar Agora",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Customizado",
    period: "",
    description: "Soluções personalizadas para grandes empresas",
    features: [
      "Tudo do Professional",
      "Usuários ilimitados",
      "IA com tom de voz personalizado",
      "Suporte 24/7",
      "API de acesso",
      "Integrações avançadas",
      "Gerente de conta dedicado",
      "Treinamento personalizado",
    ],
    cta: "Falar com Vendas",
    highlighted: false,
  },
];

export default function Pricing() {
  const firstColumn = useMemo(
    () => testimonials.slice(0, Math.ceil(testimonials.length / 3)),
    []
  );
  const secondColumn = useMemo(
    () =>
      testimonials.slice(
        Math.ceil(testimonials.length / 3),
        Math.ceil((testimonials.length * 2) / 3)
      ),
    []
  );
  const thirdColumn = useMemo(
    () => testimonials.slice(Math.ceil((testimonials.length * 2) / 3)),
    []
  );

  return (
    <>
      <Helmet>
        <title>Preços - AdzHub | Planos para todos os tamanhos</title>
        <meta
          name="description"
          content="Escolha o plano ideal para sua empresa. Preços transparentes e sem surpresas."
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <LandingNav activeSection="" />

        {/* Pricing Section */}
        <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                Planos que Crescem com Você
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
                Escolha o plano ideal para sua empresa. Sem surpresas, sem taxas escondidas.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {pricingPlans.map((plan, index) => (
                <div
                  key={index}
                  className={`relative rounded-2xl border p-8 transition-all duration-300 hover:shadow-2xl ${
                    plan.highlighted
                      ? "border-primary shadow-xl scale-105 bg-gradient-to-br from-primary/5 to-primary/10"
                      : "border-border bg-card hover:border-primary/50"
                  }`}
                >
                  {plan.highlighted && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-sm font-semibold rounded-full">
                      Mais Popular
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      {plan.description}
                    </p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      {plan.period && (
                        <span className="text-muted-foreground">{plan.period}</span>
                      )}
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <a href="https://app.adzhub.com.br" className="block">
                    {plan.highlighted ? (
                      <RainbowButton className="w-full">{plan.cta}</RainbowButton>
                    ) : (
                      <Button className="w-full" variant="outline">
                        {plan.cta}
                      </Button>
                    )}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                O Que Nossos Clientes Dizem
              </h2>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
                Empresas de todos os tamanhos confiam na AdzHub para suas campanhas
              </p>
            </div>

            <Suspense fallback={<LoadingFallback />}>
              <div className="flex justify-center gap-6 max-h-[738px] overflow-hidden mask-fade [--mask-height:738px]">
                <TestimonialsColumn testimonials={firstColumn} duration={15} />
                <TestimonialsColumn
                  testimonials={secondColumn}
                  className="hidden md:block"
                  duration={19}
                />
                <TestimonialsColumn
                  testimonials={thirdColumn}
                  className="hidden lg:block"
                  duration={17}
                />
              </div>
            </Suspense>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
