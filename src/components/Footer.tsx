import { Link, useLocation } from "react-router-dom";
import adzHubLogo from "@/assets/adzhub-logo-new.svg";
import { useWaitlistDialog } from "@/components/WaitlistDialogProvider";

const SOCIAL_LINKS = [
  {
    label: "Instagram AdzHub",
    href: "https://www.instagram.com/adzhub_/",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden>
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    label: "AdzHub Podcast no Spotify",
    href: "https://open.spotify.com/show/5Dnw3lZNbXQPSlljcukoC7?si=2d2d186c4f8a4ef2",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden>
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.402.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
      </svg>
    ),
  },
] as const;

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
              <img
                src={adzHubLogo}
                alt="AdzHub"
                className="h-8 w-auto"
                width={120}
                height={32}
                loading="lazy"
              />
            </Link>
            <p className="text-sm text-[#6B7280] max-w-sm mb-5">
              Plataforma de agência de marketing digital para PMEs que precisam estruturar e escalar o marketing sem
              fragmentar fornecedores.
            </p>
            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map(({ label, href, icon }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#08080C]/10 text-[#37489d] hover:bg-[#37489d]/5 hover:border-[#37489d]/25 transition-colors"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-[#1F2937] mb-6">Serviços</h3>
            <div className="flex flex-col gap-4">
              <Link to="/#trafego-pago" className="text-base text-[#6B7280] hover:text-[#1F2937]">
                Gestão de tráfego pago
              </Link>
              <Link to="/seo" className="text-base text-[#6B7280] hover:text-[#1F2937]">
                SEO e GEO
              </Link>
              <Link to="/#social-midia" className="text-base text-[#6B7280] hover:text-[#1F2937]">
                Social mídia
              </Link>
              <Link to="/#dashboard-crm" className="text-base text-[#6B7280] hover:text-[#1F2937]">
                Dashboard e CRM
              </Link>
              <Link to="/#servicos" className="text-base text-[#6B7280] hover:text-[#1F2937]">
                Ver todos
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-[#1F2937] mb-6">Plataforma</h3>
            <div className="flex flex-col gap-4">
              <span className="text-base text-[#6B7280]">
                AdzChat <span className="text-[#9CA3AF] font-normal">em breve</span>
              </span>
              <Link to="/blog" className="text-base text-[#6B7280] hover:text-[#1F2937]">
                Blog
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
              <a href="mailto:team@adzhub.com.br" className="text-base text-[#6B7280] hover:text-[#1F2937]">
                team@adzhub.com.br
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
