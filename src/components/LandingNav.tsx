import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import adzHubLogo from "@/assets/adzhub-logo-white.png";

interface LandingNavProps {
  activeSection?: string;
}

export const LandingNav = ({ activeSection = "home" }: LandingNavProps) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 bg-white/60 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <Link to="/">
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

      <div className="hidden md:flex items-center gap-6 px-3 py-1.5 rounded-full bg-white/40 backdrop-blur-sm border border-gray-200/50">
        <Link 
          to="/" 
          className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            activeSection === "home" 
              ? "bg-[hsl(224,47%,42%)] text-white" 
              : "text-gray-700 hover:text-gray-900"
          }`}
        >
          {activeSection === "home" && (
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <path d="M3.29461 7.1756L8.68125 2.95574C9.45692 2.34809 10.5431 2.34809 11.3188 2.95574L16.7054 7.1756C17.3203 7.65731 17.4911 8.37427 17.4997 9.20295C17.5001 9.24787 17.4987 9.29129 17.4953 9.33608C17.4604 9.7957 17.2195 12.6041 16.3291 15.757C16.0145 16.6346 15.2741 17.5 14.2555 17.5H5.74446C4.72592 17.5 3.98558 16.6346 3.67092 15.757C2.78052 12.6041 2.53958 9.79569 2.50473 9.33608C2.50134 9.29129 2.49988 9.24787 2.50034 9.20295C2.5089 8.37427 2.67971 7.65731 3.29461 7.1756Z" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          )}
          Home
        </Link>
        
        <a href="/#sobre" className="text-gray-700 text-sm hover:text-gray-900 transition-colors">
          Sobre
        </a>
        
        <a href="/#como-funciona" className="text-gray-700 text-sm hover:text-gray-900 transition-colors">
          Como Funciona
        </a>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-1 text-gray-700 text-sm hover:text-gray-900 transition-colors outline-none">
            Apps
            <ChevronDown className="w-3 h-3" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white z-50 shadow-lg">
            <DropdownMenuItem asChild>
              <Link to="/whatsapp" className="cursor-pointer">
                WhatsApp
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <a href="/#contato" className="text-gray-700 text-sm hover:text-gray-900 transition-colors">
          Contato
        </a>
      </div>

      <div className="flex items-center gap-3">
        <Link to="/auth">
          <button className="px-4 py-1.5 rounded-full border border-[#37489d] text-[#37489d] text-sm hover:bg-[#37489d]/10 transition-colors font-medium">
            Entrar
          </button>
        </Link>
        <Link to="/auth">
          <button className="px-4 py-1.5 rounded-full bg-[#37489d] text-white text-sm hover:bg-[#37489d]/90 transition-colors font-medium">
            Começar Grátis
          </button>
        </Link>
      </div>
    </nav>
  );
};
