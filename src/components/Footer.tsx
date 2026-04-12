import { Link, useLocation } from "react-router-dom";
import adzHubLogo from "@/assets/adzhub-logo-final.png";
import { useWaitlistDialog } from "@/components/WaitlistDialogProvider";

export function Footer() {
  const location = useLocation();
  const { openWaitlist } = useWaitlistDialog();

  const handleLogoClick = () => {
    if (location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  return (
    <footer className="bg-white rounded-t-[40px] pt-24 pb-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-24 gap-8">
          <h2 className="text-4xl md:text-6xl lg:text-[80px] font-medium leading-[100%] tracking-tight text-[#37489d]">
            Vamos começar?
          </h2>
          <div className="w-full lg:w-[469px]">
            <p className="text-lg text-[#6B7280] mb-6">
              Planejamento, execução e evolução contínua do marketing em uma única plataforma. Ideal para donos de PMEs que
              querem estrutura sem fragmentar fornecedores.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3">
              <button
                type="button"
                onClick={openWaitlist}
                className="inline-flex h-11 items-center justify-center rounded-xl bg-[#37489d] px-8 py-2 font-medium text-white hover:bg-[#37489d]/90 transition-colors"
              >
                Começar grátis
              </button>
              <a
                href="https://app.adzhub.com.br"
                className="inline-flex h-11 items-center justify-center rounded-xl border border-[#37489d]/25 bg-white px-8 py-2 font-medium text-[#37489d] hover:bg-[#37489d]/5 transition-colors"
              >
                Acessar plataforma
              </a>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-24">
          <div className="lg:col-span-1">
            <Link to="/" onClick={handleLogoClick} className="inline-block mb-4">
              <img src={adzHubLogo} alt="AdzHub" className="h-8 w-auto" />
            </Link>
            <p className="text-sm text-[#6B7280] max-w-sm">
              Plataforma de agência de marketing digital para PMEs que precisam estruturar e escalar o marketing sem
              fragmentar fornecedores.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium text-[#1F2937] mb-6">Serviços</h3>
            <div className="flex flex-col gap-4">
              <Link to="/#trafego-pago" className="text-base text-[#6B7280] hover:text-[#1F2937]">
                Gestão de tráfego pago
              </Link>
              <Link to="/#seo-geo" className="text-base text-[#6B7280] hover:text-[#1F2937]">
                SEO e GEO
              </Link>
              <Link to="/#social-midia" className="text-base text-[#6B7280] hover:text-[#1F2937]">
                Social mídia
              </Link>
              <Link to="/#conteudo-seo" className="text-base text-[#6B7280] hover:text-[#1F2937]">
                Conteúdo e blog
              </Link>
              <Link to="/#servicos" className="text-base text-[#6B7280] hover:text-[#1F2937]">
                Ver todos
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-[#1F2937] mb-6">Plataforma</h3>
            <div className="flex flex-col gap-4">
              <Link to="/chat" className="text-base text-[#6B7280] hover:text-[#1F2937]">
                AdzChat
              </Link>
              <Link to="/conteudo" className="text-base text-[#6B7280] hover:text-[#1F2937]">
                Central de conteúdo
              </Link>
              <Link to="/blog" className="text-base text-[#6B7280] hover:text-[#1F2937]">
                Blog
              </Link>
              <Link to="/pricing" className="text-base text-[#6B7280] hover:text-[#1F2937]">
                Preços
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-[#1F2937] mb-6">Empresa</h3>
            <div className="flex flex-col gap-4">
              <Link to="/#sobre" className="text-base text-[#6B7280] hover:text-[#1F2937]">
                Sobre
              </Link>
              <Link to="/contact" className="text-base text-[#6B7280] hover:text-[#1F2937]">
                Contato
              </Link>
              <a
                href="https://app.adzhub.com.br"
                className="text-base text-[#6B7280] hover:text-[#1F2937]"
              >
                Acessar plataforma
              </a>
              <a href="mailto:contato@adzhub.com.br" className="text-base text-[#6B7280] hover:text-[#1F2937]">
                contato@adzhub.com.br
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-[#6B7280]/20 gap-4 text-center md:text-left">
          <p className="text-sm sm:text-base text-[#1F2937] max-w-xl">
            © 2026 AdzHub. Todos os direitos reservados.
          </p>
          <div className="flex flex-wrap gap-6 sm:gap-8 justify-center">
            <Link to="/privacidade" className="text-sm sm:text-base text-[#1F2937] hover:text-[#08080C]">
              Política de Privacidade
            </Link>
            <Link to="/termos" className="text-sm sm:text-base text-[#1F2937] hover:text-[#08080C]">
              Termos de Uso
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
