import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthResponse, signIn, signUp, verifyToken } from '@/lib/auth';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Verificar se há token salvo
        const token = localStorage.getItem('auth_token');
        if (token) {
          const decoded = verifyToken(token);
          if (decoded) {
            setUser({ id: decoded.userId, email: decoded.email });
          } else {
            localStorage.removeItem('auth_token');
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('AuthContext login called with:', email);
      
      const response = await signIn(email, password);
      console.log('SignIn response:', response);
      
      if (response.error) {
        console.log('Login failed with error:', response.error);
        return { success: false, error: response.error };
      }

      if (response.user && response.token) {
        console.log('Login successful, setting user:', response.user);
        setUser(response.user);
        localStorage.setItem('auth_token', response.token);
        return { success: true };
      }

      console.log('Login failed - no user or token in response');
      return { success: false, error: 'Erro desconhecido' };
    } catch (error) {
      console.error('Login catch block error:', error);
      return { success: false, error: 'Erro ao fazer login' };
    }
  };

  const register = async (email: string, password: string) => {
    try {
      const response = await signUp(email, password);
      if (response.error) {
        return { success: false, error: response.error };
      }

      if (response.user && response.token) {
        setUser(response.user);
        localStorage.setItem('auth_token', response.token);
        return { success: true };
      }

      return { success: false, error: 'Erro desconhecido' };
    } catch (error) {
      return { success: false, error: 'Erro ao criar conta' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_token');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};