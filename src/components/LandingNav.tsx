import { useState, useRef, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Menu, X } from "lucide-react";
import adzHubLogo from "@/assets/adzhub-logo-new.svg";

interface LandingNavProps {
  activeSection?: string;
}

const NAV_ITEMS = [
  { id: "home", label: "Home", to: "/" },
  { id: "sobre", label: "Sobre", href: "/#sobre" },
  { id: "como-funciona", label: "Como Funciona", href: "/#como-funciona" },
  { id: "apps", label: "Apps", isDropdown: true },
  { id: "contato", label: "Contato", href: "/#contato" },
] as const;

export const LandingNav = ({ activeSection = "home" }: LandingNavProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const resolveActive = useCallback((): string => {
    if (activeSection === "conteudo" || activeSection === "adzchat") return "apps";
    const path = location.pathname;
    if (path === "/") return activeSection;
    if (path === "/conteudo" || path === "/chat") return "apps";
    return "home";
  }, [activeSection, location.pathname]);

  const [currentActive, setCurrentActive] = useState(resolveActive);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });
  const itemRefs = useRef<Record<string, HTMLElement | null>>({});
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentActive(resolveActive());
  }, [resolveActive]);

  const updateIndicator = useCallback((id: string) => {
    const el = itemRefs.current[id];
    const container = containerRef.current;
    if (el && container) {
      const containerRect = container.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      setIndicator({
        left: elRect.left - containerRect.left,
        width: elRect.width,
      });
    }
  }, []);

  useEffect(() => {
    updateIndicator(currentActive);
  }, [currentActive, updateIndicator]);

  useEffect(() => {
    const handleResize = () => updateIndicator(currentActive);
    window.addEventListener("resize", handleResize);
    const timer = setTimeout(() => updateIndicator(currentActive), 50);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer);
    };
  }, [currentActive, updateIndicator]);

  const handleItemClick = (id: string) => {
    setCurrentActive(id);
  };

  const setRef = (id: string) => (el: HTMLElement | null) => {
    itemRefs.current[id] = el;
  };

  const handleLogoClick = () => {
    setMobileOpen(false);
    if (location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      {/* Gradient blur background */}
      <div
        className="absolute inset-x-0 top-0 pointer-events-none"
        style={{
          height: 'calc(100% + 48px)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          background: 'linear-gradient(to bottom, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0) 100%)',
          maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)',
        }}
      />
      <div className="relative flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-3">
          <Link to="/" onClick={handleLogoClick} className="flex shrink-0">
            <img 
              src={adzHubLogo} 
              alt="Adzhub Logo" 
              className="h-8 w-auto" 
              width="120" 
              height="32"
              loading="eager"
              fetchPriority="high"
            />
          </Link>
        </div>

        {/* Desktop nav */}
        <div
          ref={containerRef}
          className="hidden md:flex items-center gap-1 px-1.5 py-1.5 rounded-full bg-white/40 backdrop-blur-sm border border-gray-200/50 relative"
        >
          {/* Animated indicator */}
          <div
            className="absolute top-1.5 bottom-1.5 rounded-full bg-[hsl(224,47%,42%)] transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
            style={{
              left: indicator.left,
              width: indicator.width,
              opacity: indicator.width > 0 ? 1 : 0,
            }}
          />

          {NAV_ITEMS.map((item) => {
            const isActive = currentActive === item.id;

            if (item.isDropdown) {
              return (
                <DropdownMenu key={item.id}>
                  <DropdownMenuTrigger
                    ref={setRef(item.id)}
                    className={`relative z-10 flex items-center gap-1 px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-300 outline-none ${
                      isActive ? "text-white" : "text-gray-700 hover:text-gray-900"
                    }`}
                    onClick={() => handleItemClick(item.id)}
                  >
                    {item.label}
                    <ChevronDown className="w-3 h-3" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-white z-50 shadow-lg">
                    <DropdownMenuItem asChild>
                      <Link to="/chat" className="cursor-pointer">
                        AdzChat
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/conteudo" className="cursor-pointer">
                        Blog
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            }

            if (item.to) {
              return (
                <Link
                  key={item.id}
                  ref={setRef(item.id)}
                  to={item.to}
                  className={`relative z-10 flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-300 ${
                    isActive ? "text-white" : "text-gray-700 hover:text-gray-900"
                  }`}
                  onClick={() => handleItemClick(item.id)}
                >
                  {item.id === "home" && isActive && (
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                      <path d="M3.29461 7.1756L8.68125 2.95574C9.45692 2.34809 10.5431 2.34809 11.3188 2.95574L16.7054 7.1756C17.3203 7.65731 17.4911 8.37427 17.4997 9.20295C17.5001 9.24787 17.4987 9.29129 17.4953 9.33608C17.4604 9.7957 17.2195 12.6041 16.3291 15.757C16.0145 16.6346 15.2741 17.5 14.2555 17.5H5.74446C4.72592 17.5 3.98558 16.6346 3.67092 15.757C2.78052 12.6041 2.53958 9.79569 2.50473 9.33608C2.50134 9.29129 2.49988 9.24787 2.50034 9.20295C2.5089 8.37427 2.67971 7.65731 3.29461 7.1756Z" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  )}
                  {item.label}
                </Link>
              );
            }

            return (
              <a
                key={item.id}
                ref={setRef(item.id)}
                href={item.href}
                className={`relative z-10 px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-300 whitespace-nowrap ${
                  isActive ? "text-white" : "text-gray-700 hover:text-gray-900"
                }`}
                onClick={() => handleItemClick(item.id)}
              >
                {item.label}
              </a>
            );
          })}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <a href="https://app.adzhub.com.br">
            <button className="px-4 py-1.5 rounded-full border border-[#37489d] text-[#37489d] text-sm hover:bg-[#37489d]/10 transition-colors font-medium">
              Entrar
            </button>
          </a>
          <a href="https://app.adzhub.com.br">
            <button className="px-4 py-1.5 rounded-full bg-[#37489d] text-white text-sm hover:bg-[#37489d]/90 transition-colors font-medium">
              Começar Grátis
            </button>
          </a>
        </div>

        <button
          className="md:hidden p-2 text-gray-700"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl px-6 py-4 space-y-3">
          <Link 
            to="/" 
            className="block py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            onClick={() => setMobileOpen(false)}
          >
            Home
          </Link>
          <a 
            href="/#sobre" 
            className="block py-2 text-sm text-gray-700 hover:text-gray-900"
            onClick={() => setMobileOpen(false)}
          >
            Sobre
          </a>
          <a 
            href="/#como-funciona" 
            className="block py-2 text-sm text-gray-700 hover:text-gray-900"
            onClick={() => setMobileOpen(false)}
          >
            Como Funciona
          </a>
          <Link 
            to="/chat" 
            className="block py-2 text-sm text-gray-700 hover:text-gray-900"
            onClick={() => setMobileOpen(false)}
          >
            AdzChat
          </Link>
          <Link 
            to="/conteudo" 
            className="block py-2 text-sm text-gray-700 hover:text-gray-900"
            onClick={() => setMobileOpen(false)}
          >
            Blog
          </Link>
          <Link 
            to="/pricing" 
            className="block py-2 text-sm text-gray-700 hover:text-gray-900"
            onClick={() => setMobileOpen(false)}
          >
            Preços
          </Link>
          <a 
            href="/#contato" 
            className="block py-2 text-sm text-gray-700 hover:text-gray-900"
            onClick={() => setMobileOpen(false)}
          >
            Contato
          </a>
          <div className="pt-3 border-t border-gray-200 flex flex-col gap-2">
            <a href="https://app.adzhub.com.br" className="block">
              <button className="w-full px-4 py-2 rounded-full border border-[#37489d] text-[#37489d] text-sm hover:bg-[#37489d]/10 transition-colors font-medium">
                Entrar
              </button>
            </a>
            <a href="https://app.adzhub.com.br" className="block">
              <button className="w-full px-4 py-2 rounded-full bg-[#37489d] text-white text-sm hover:bg-[#37489d]/90 transition-colors font-medium">
                Começar Grátis
              </button>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};
