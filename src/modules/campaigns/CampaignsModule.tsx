// src/modules/campaigns/CampaignsModule.tsx
import { Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { CampaignsAuthProvider } from "./contexts/CampaignsAuthContext";
import CampaignsIndex from "./pages/CampaignsIndex";
import CampaignsDashboard from "./pages/CampaignsDashboard";
import CampaignDetails from "./pages/CampaignDetails";
import NotFound from "./pages/NotFound";

/**
 * CampaignsModule - Módulo independente de gestão de campanhas
 * 
 * Este módulo possui:
 * - Autenticação isolada (email/password + Google OAuth)
 * - Banco de dados Supabase próprio
 * - Gerenciamento completo de campanhas WhatsApp
 * 
 * Rotas internas (todas prefixadas com /campaigns):
 * - /campaigns -> Criar nova campanha
 * - /campaigns/dashboard -> Dashboard de campanhas
 * - /campaigns/campaign/:id -> Detalhes da campanha
 */
const CampaignsModule = () => {
  return (
    <ErrorBoundary>
      <CampaignsAuthProvider>
        <Routes>
          <Route path="/" element={<CampaignsIndex />} />
          <Route path="/dashboard" element={<CampaignsDashboard />} />
          <Route path="/campaign/:id" element={<CampaignDetails />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </CampaignsAuthProvider>
    </ErrorBoundary>
  );
};

export default CampaignsModule;
