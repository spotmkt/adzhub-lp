import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LandingNav } from '@/components/LandingNav';
import { Footer } from '@/components/Footer';

const contactFieldClassName =
  "border border-[#C9B8A4]/70 bg-[#FAF6EF] text-[#08080C] placeholder:text-[#6B7280]/80 shadow-sm focus-visible:border-[#37489d]/45 focus-visible:ring-[#37489d]/25";

export default function Contact() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-white">
      <LandingNav />

      <main className="pt-[83px] py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-[#08080C]">Entre em Contato</h1>
              <p className="text-xl text-[#6B7280]">
                Fale com o time da AdzHub sobre planos, serviços na plataforma ou suporte — retornamos o mais breve
                possível.
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              <Card id="contato" className="scroll-mt-28">
                <CardHeader>
                  <CardTitle>Envie sua mensagem</CardTitle>
                  <CardDescription>
                    Preencha o formulário abaixo e entraremos em contato em breve.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nome</Label>
                        <Input id="name" placeholder="Seu nome" required className={contactFieldClassName} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="seu@email.com" required className={contactFieldClassName} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <Input id="phone" type="tel" placeholder="(11) 99999-9999" className={contactFieldClassName} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Assunto</Label>
                      <Input id="subject" placeholder="Sobre o que você gostaria de falar?" required className={contactFieldClassName} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Mensagem</Label>
                      <Textarea
                        id="message"
                        placeholder="Conte-nos mais detalhes..."
                        rows={6}
                        required
                        className={contactFieldClassName}
                      />
                    </div>

                    <Button type="submit" size="lg" className="w-full">
                      Enviar Mensagem
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
