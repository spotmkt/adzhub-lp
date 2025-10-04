import * as React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { HelmetProvider } from "react-helmet-async";
import { Layout } from "@/components/Layout";
import Index from "./pages/Index";
import Chat from "./pages/Chat";
import History from "./pages/History";
import Content from "./pages/Content";
import Apps from "./pages/Apps";
import Settings from "./pages/Settings";
import ContentGeneratorSettings from "./pages/ContentGeneratorSettings";
import Landing from "./pages/Landing";
import BlogList from "./pages/BlogList";
import BlogPost from "./pages/BlogPost";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

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
                {/* Landing and Blog routes without Layout */}
                <Route path="/landing" element={<Landing />} />
                <Route path="/blog" element={<BlogList />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/auth" element={<Auth />} />
                
                {/* App routes with Layout */}
                <Route path="/" element={<Layout><Index /></Layout>} />
                <Route path="/chat" element={<Layout><Chat /></Layout>} />
                <Route path="/history" element={<Layout><History /></Layout>} />
                <Route path="/content" element={<Layout><Content /></Layout>} />
                <Route path="/apps" element={<Layout><Apps /></Layout>} />
                <Route path="/settings" element={<Layout><Settings /></Layout>} />
                <Route path="/content-generator-settings" element={<Layout><ContentGeneratorSettings /></Layout>} />
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