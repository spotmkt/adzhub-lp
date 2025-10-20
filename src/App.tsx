import * as React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { HelmetProvider } from "react-helmet-async";
import Landing from "./pages/Landing";
import BlogList from "./pages/BlogList";
import BlogPost from "./pages/BlogPost";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import FinestraLanding from "./pages/FinestraLanding";
import Pricing from "./pages/Pricing";

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

function App(): React.ReactElement {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <BrowserRouter>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <Routes>
                {/* Landing page routes */}
                <Route path="/" element={<FinestraLanding />} />
                <Route path="/landing" element={<Landing />} />
                <Route path="/blog" element={<BlogList />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </TooltipProvider>
          </ThemeProvider>
        </BrowserRouter>
      </HelmetProvider>
    </QueryClientProvider>
  );
}

export default App;