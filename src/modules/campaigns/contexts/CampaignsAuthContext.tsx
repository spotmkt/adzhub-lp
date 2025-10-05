import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { migrateLegacyUser, checkForLegacyUserMigration } from '../services/legacyUserMigration';

export interface User {
  id: string;
  username: string;
  displayName: string;
  allowedInstances: string[];
  profileImage?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  signup: (email: string, password: string, displayName: string) => Promise<{ error?: string; requiresVerification?: boolean }>;
  signInWithGoogle: () => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<{ error?: string }>;
  resetPassword: (email: string) => Promise<{ error?: string }>;
  isAuthenticated: boolean;
  loading: boolean;
}

const CampaignsAuthContext = createContext<AuthContextType | undefined>(undefined);

export const CampaignsAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let initialLoadComplete = false;

    // Setup auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, 'has session:', !!session);
        setSession(session);
        if (session?.user) {
          console.log('Loading profile for user:', session.user.id);
          // Use setTimeout to defer async operations
          setTimeout(() => {
            loadUserProfile(session.user);
          }, 0);
        } else {
          setUser(null);
        }
        
        // Only set loading to false if initial load is complete
        if (initialLoadComplete) {
          console.log('Setting loading to false in onAuthStateChange');
          setLoading(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log('Initial session check:', !!session);
      try {
        setSession(session);
        if (session?.user) {
          console.log('Loading profile for existing session user:', session.user.id);
          await loadUserProfile(session.user);
        } else {
          setUser(null);
        }
      } finally {
        initialLoadComplete = true;
        console.log('Setting loading to false in getSession');
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (supabaseUser: SupabaseUser) => {
    console.log('loadUserProfile called for user:', supabaseUser.id);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', supabaseUser.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading profile:', error);
        return;
      }

      if (data) {
        console.log('Profile found, setting user data');
        setUser({
          id: data.user_id,
          username: data.username,
          displayName: data.display_name,
          allowedInstances: data.allowed_instances || [],
          profileImage: data.profile_image_url
        });
      } else {
        console.log('No profile found, creating new profile');
        // Create profile if it doesn't exist for existing auth user
        const username = supabaseUser.email?.split('@')[0] || 'user';
        const displayName = supabaseUser.user_metadata?.display_name || supabaseUser.email?.split('@')[0] || 'Usuário';
        
        try {
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              user_id: supabaseUser.id,
              username: username,
              display_name: displayName,
              allowed_instances: ['dose-efetiva'] // Default instance
            });

          if (!insertError) {
            console.log('Profile created successfully');
            setUser({
              id: supabaseUser.id,
              username: username,
              displayName: displayName,
              allowedInstances: ['dose-efetiva'],
              profileImage: undefined
            });
          }
        } catch (insertError) {
          console.error('Error creating profile:', insertError);
        }

        // Try to migrate legacy user if applicable
        const legacyUsername = await checkForLegacyUserMigration(supabaseUser.email || '');
        if (legacyUsername) {
          setTimeout(() => {
            migrateLegacyUser(legacyUsername, supabaseUser.id);
          }, 1000);
        }
      }
      console.log('loadUserProfile completed');
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const login = async (email: string, password: string): Promise<{ error?: string }> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return { error: error.message };
      }

      return {};
    } catch (error) {
      return { error: 'Erro inesperado durante o login' };
    }
  };

  const signup = async (email: string, password: string, displayName: string): Promise<{ error?: string; requiresVerification?: boolean }> => {
    try {
      // Check if this is a legacy user
      const legacyUsername = await checkForLegacyUserMigration(email);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/campaigns`,
          data: {
            display_name: displayName,
            username: legacyUsername || email.split('@')[0],
            legacy_username: legacyUsername
          }
        }
      });

      if (error) {
        return { error: error.message };
      }

      // If user needs email verification
      if (data.user && !data.session) {
        // Create profile for users requiring email verification
        if (data.user) {
          const username = legacyUsername || email.split('@')[0];
          await supabase
            .from('profiles')
            .insert({
              user_id: data.user.id,
              username: username,
              display_name: displayName,
              allowed_instances: legacyUsername ? [] : ['dose-efetiva'] // Default instance for new users
            });
        }
        return { requiresVerification: true };
      }

      // If user signed up successfully and has a session, try to migrate legacy data
      if (data.user && data.session) {
        const username = legacyUsername || email.split('@')[0];
        
        // Create profile
        await supabase
          .from('profiles')
          .insert({
            user_id: data.user.id,
            username: username,
            display_name: displayName,
            allowed_instances: legacyUsername ? [] : ['dose-efetiva'] // Default instance for new users
          });

        // Migrate legacy data if applicable
        if (legacyUsername) {
          setTimeout(() => {
            migrateLegacyUser(legacyUsername, data.user.id);
          }, 1000);
        }
      }

      return {};
    } catch (error) {
      return { error: 'Erro inesperado durante o cadastro' };
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setUser(null);
      setSession(null);
    }
  };

  const updateUser = async (userData: Partial<User>): Promise<{ error?: string }> => {
    if (!user || !session) {
      return { error: 'Usuário não autenticado' };
    }

    try {
      const updateData: any = {};
      
      if (userData.displayName) updateData.display_name = userData.displayName;
      if (userData.username) updateData.username = userData.username;
      if (userData.profileImage !== undefined) updateData.profile_image_url = userData.profileImage;
      if (userData.allowedInstances) updateData.allowed_instances = userData.allowedInstances;

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('user_id', user.id);

      if (error) {
        return { error: error.message };
      }

      // Update local state and trigger re-render in components
      setUser(prev => prev ? { ...prev, ...userData } : null);
      
      // Force a refresh of the user profile to ensure consistency
      setTimeout(() => {
        loadUserProfile(session!.user);
      }, 100);
      
      return {};
    } catch (error) {
      return { error: 'Erro ao atualizar perfil' };
    }
  };

  const signInWithGoogle = async (): Promise<{ error?: string }> => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/campaigns/dashboard`,
        },
      });
      
      if (error) {
        console.error('Google sign-in error:', error);
        return { error: error.message };
      }
      
      return {};
    } catch (error) {
      console.error('Unexpected Google sign-in error:', error);
      return { error: 'Erro inesperado ao fazer login com Google' };
    }
  };

  const resetPassword = async (email: string): Promise<{ error?: string }> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/campaigns`
      });

      if (error) {
        return { error: error.message };
      }

      return {};
    } catch (error) {
      return { error: 'Erro inesperado ao enviar email de recuperação' };
    }
  };

  const isAuthenticated = !!user && !!session;

  return (
    <CampaignsAuthContext.Provider value={{ 
      user, 
      session, 
      login,
      signup,
      signInWithGoogle,
      logout,
      updateUser,
      resetPassword,
      isAuthenticated, 
      loading 
    }}>
      {children}
    </CampaignsAuthContext.Provider>
  );
};

export const useCampaignsAuth = () => {
  const context = useContext(CampaignsAuthContext);
  if (context === undefined) {
    throw new Error('useCampaignsAuth must be used within CampaignsAuthProvider');
  }
  return context;
};
