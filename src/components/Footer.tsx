import { Link, useLocation } from "react-router-dom";
import adzHubLogo from "@/assets/adzhub-logo-final.png";

export function Footer() {
  const location = useLocation();

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
            <p className="text-lg text-[#6B7280] mb-4">
              Comece agora mesmo a gerenciar e operar o marketing da sua empresa pela AdzHub.
            </p>
            <a
              href="https://app.adzhub.com.br"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-[#37489d] px-8 py-2 font-medium text-white hover:bg-[#37489d]/90 transition-colors"
            >
              Começar Grátis
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-24">
          <div className="lg:col-span-1">
            <Link to="/" onClick={handleLogoClick} className="inline-block mb-4">
              <img 
                src={adzHubLogo} 
                alt="AdzHub" 
                className="h-8 w-auto"
              />
            </Link>
            <p className="text-sm text-[#6B7280] max-w-sm">
              Acelerando o desenvolvimento empresarial através do marketing inteligente.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium text-[#1F2937] mb-6">Produto</h3>
            <div className="flex flex-col gap-4">
              <Link to="/chat" className="text-base text-[#6B7280] hover:text-[#1F2937]">AdzChat</Link>
              <Link to="/conteudo" className="text-base text-[#6B7280] hover:text-[#1F2937]">Blog</Link>
              <Link to="/pricing" className="text-base text-[#6B7280] hover:text-[#1F2937]">Preços</Link>
              <Link to="/blog" className="text-base text-[#6B7280] hover:text-[#1F2937]">Blog</Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-[#1F2937] mb-6">Empresa</h3>
            <div className="flex flex-col gap-4">
              <Link to="/#sobre" className="text-base text-[#6B7280] hover:text-[#1F2937]">Sobre</Link>
              <Link to="/contact" className="text-base text-[#6B7280] hover:text-[#1F2937]">Contato</Link>
              <a href="https://app.adzhub.com.br" className="text-base text-[#6B7280] hover:text-[#1F2937]">Acessar Plataforma</a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-[#1F2937] mb-6">Suporte</h3>
            <div className="flex flex-col gap-4">
              <Link to="/contact" className="text-base text-[#6B7280] hover:text-[#1F2937]">Central de Ajuda</Link>
              <a href="mailto:contato@adzhub.com.br" className="text-base text-[#6B7280] hover:text-[#1F2937]">contato@adzhub.com.br</a>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-[#6B7280]/20 gap-4">
          <p className="text-base text-[#1F2937]">© 2025 AdzHub - Marketing Intelligence Platform</p>
          <div className="flex flex-wrap gap-8 justify-center">
            <Link to="/termos" className="text-base text-[#1F2937] hover:text-[#08080C]">Termos</Link>
            <Link to="/privacidade" className="text-base text-center text-[#1F2937] hover:text-[#08080C]">Privacidade</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
