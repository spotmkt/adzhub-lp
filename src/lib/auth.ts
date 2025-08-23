export interface User {
  id: string;
  email: string;
  created_at?: Date;
}

export interface AuthResponse {
  user?: User;
  token?: string;
  error?: string;
}

// Simulação de autenticação para desenvolvimento local
// Em produção, isso seria conectado a uma API backend
export const signUp = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Verificar se usuário já existe no localStorage
    const existingUsers = JSON.parse(localStorage.getItem('app_users') || '[]');
    const userExists = existingUsers.find((u: any) => u.email === email);
    
    if (userExists) {
      return { error: 'Usuário já existe' };
    }

    // Criar novo usuário
    const newUser: User = {
      id: Date.now().toString(),
      email,
      created_at: new Date()
    };

    // Salvar usuário (em produção seria hasheada a senha)
    existingUsers.push({ ...newUser, password });
    localStorage.setItem('app_users', JSON.stringify(existingUsers));

    // Gerar token simples (em produção seria JWT real)
    const token = btoa(JSON.stringify({ userId: newUser.id, email: newUser.email }));

    return { user: newUser, token };
  } catch (error) {
    console.error('Error signing up:', error);
    return { error: 'Erro ao criar conta' };
  }
};

export const signIn = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Buscar usuários salvos
    const existingUsers = JSON.parse(localStorage.getItem('app_users') || '[]');
    const user = existingUsers.find((u: any) => u.email === email && u.password === password);

    if (!user) {
      return { error: 'Email ou senha incorretos' };
    }

    // Gerar token
    const token = btoa(JSON.stringify({ userId: user.id, email: user.email }));

    return { 
      user: { id: user.id, email: user.email, created_at: user.created_at }, 
      token 
    };
  } catch (error) {
    console.error('Error signing in:', error);
    return { error: 'Erro ao fazer login' };
  }
};

export const verifyToken = (token: string): { userId: string; email: string } | null => {
  try {
    const decoded = JSON.parse(atob(token));
    return { userId: decoded.userId, email: decoded.email };
  } catch (error) {
    return null;
  }
};