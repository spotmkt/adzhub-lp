import * as React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { HelmetProvider } from "react-helmet-async";
import BlogList from "./pages/BlogList";
import BlogPost from "./pages/BlogPost";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import FinestraLanding from "./pages/FinestraLanding";
import AdzHubLanding from "./pages/AdzHubLanding";
import Pricing from "./pages/Pricing";
import AdzChatLanding from "./pages/AdzChatLanding";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import { WaitlistDialogProvider } from "@/components/WaitlistDialogProvider";

// Create QueryClient outside of component to avoid recreation on each render
// Updated to fix caching issue
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App(): React.ReactElement {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <BrowserRouter>
          <WaitlistDialogProvider>
            <ScrollToTop />
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <Routes>
                  {/* Landing page routes */}
                  <Route path="/" element={<AdzHubLanding />} />
                  <Route path="/seo" element={<FinestraLanding />} />
                  <Route path="/conteudo" element={<Navigate to="/seo" replace />} />
                  <Route path="/chat" element={<AdzChatLanding />} />
                  <Route path="/blog" element={<BlogList />} />
                  <Route path="/blog/:slug" element={<BlogPost />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/termos" element={<Terms />} />
                  <Route path="/privacidade" element={<Privacy />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </TooltipProvider>
            </ThemeProvider>
          </WaitlistDialogProvider>
        </BrowserRouter>
      </HelmetProvider>
    </QueryClientProvider>
  );
}

export default App;