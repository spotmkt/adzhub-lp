import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface CampaignsAuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

const CampaignsAuthContext = createContext<CampaignsAuthContextType>({
  user: null,
  session: null,
  loading: true,
});

export const useCampaignsAuth = () => {
  const context = useContext(CampaignsAuthContext);
  if (!context) {
    throw new Error('useCampaignsAuth must be used within CampaignsAuthProvider');
  }
  return context;
};

export const CampaignsAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <CampaignsAuthContext.Provider value={{ user, session, loading }}>
      {children}
    </CampaignsAuthContext.Provider>
  );
};
