import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Users, Award, TrendingUp } from "lucide-react";

export default function LandingPageNova() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h2 className="text-2xl font-semibold text-foreground">Finestra</h2>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
                About Us
              </a>
              <a href="#reviews" className="text-muted-foreground hover:text-foreground transition-colors">
                Reviews
              </a>
              <a href="#procedures" className="text-muted-foreground hover:text-foreground transition-colors">
                Procedures
              </a>
              <Button variant="default" size="sm">
                +pro
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-block">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  <CheckCircle2 className="h-4 w-4" />
                  Trusted by thousands
                </span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Finestra
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-xl">
                Transform your experience with our innovative solutions. Join thousands of satisfied customers who trust Finestra for excellence and quality.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="group">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-accent/30 rounded-3xl p-8 backdrop-blur-sm border border-border">
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-card rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-foreground">73,901</p>
                    <p className="text-sm text-muted-foreground mt-1">Active Users</p>
                  </div>
                  
                  <div className="bg-card rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Award className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-foreground">98,032</p>
                    <p className="text-sm text-muted-foreground mt-1">Success Stories</p>
                  </div>
                  
                  <div className="bg-card rounded-2xl p-6 shadow-lg col-span-2">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <p className="text-5xl font-bold text-foreground">89%</p>
                    <p className="text-sm text-muted-foreground mt-2">Satisfaction Rate</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-accent/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              About Us
            </h2>
            <p className="text-lg text-muted-foreground">
              Finestra has been at the forefront of innovation, delivering exceptional solutions that transform businesses and delight customers. Our commitment to excellence drives everything we do.
            </p>
            <Button variant="link" className="text-primary group">
              explore more about us
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </section>

      {/* Procedures Section */}
      <section id="procedures" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Our Procedures
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We follow industry-leading procedures to ensure the highest quality standards in everything we deliver.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Consultation",
                description: "Initial assessment and planning phase to understand your needs"
              },
              {
                title: "Implementation",
                description: "Careful execution of the plan with attention to every detail"
              },
              {
                title: "Follow-up",
                description: "Continuous support and optimization for long-term success"
              }
            ].map((procedure, index) => (
              <div key={index} className="bg-card rounded-2xl p-8 shadow-sm border border-border hover:shadow-lg transition-shadow">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-xl font-bold text-primary">{index + 1}</span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {procedure.title}
                </h3>
                <p className="text-muted-foreground">
                  {procedure.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="py-20 bg-accent/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Customer Reviews
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See what our customers are saying about their experience with Finestra.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "Sarah Johnson",
                role: "Business Owner",
                review: "Finestra exceeded our expectations in every way. The attention to detail and professionalism is outstanding."
              },
              {
                name: "Michael Chen",
                role: "Marketing Director",
                review: "Working with Finestra has been transformative for our business. Highly recommended!"
              },
              {
                name: "Emma Williams",
                role: "Product Manager",
                review: "The results speak for themselves. Finestra delivers on their promises every single time."
              }
            ].map((review, index) => (
              <div key={index} className="bg-card rounded-2xl p-6 shadow-sm border border-border">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-5 w-5 fill-primary" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">{review.review}</p>
                <div>
                  <p className="font-semibold text-foreground">{review.name}</p>
                  <p className="text-sm text-muted-foreground">{review.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary/10 rounded-3xl p-12 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers and experience the Finestra difference today.
            </p>
            <Button size="lg" className="group">
              Start Your Journey
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-muted-foreground">
            © 2024 Copyright By Sansbro - Finestra
          </div>
        </div>
      </footer>
    </div>
  );
}
