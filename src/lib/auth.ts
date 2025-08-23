import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from './database';

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

// Função para criar tabela de usuários se não existir
export const initializeAuth = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
  } catch (error) {
    console.error('Error initializing auth table:', error);
  }
};

export const signUp = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    // Verificar se usuário já existe
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return { error: 'Usuário já existe' };
    }

    // Hash da senha
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Inserir usuário
    const result = await pool.query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at',
      [email, passwordHash]
    );

    const user = result.rows[0];
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      import.meta.env.VITE_JWT_SECRET,
      { expiresIn: '24h' }
    );

    return { user, token };
  } catch (error) {
    console.error('Error signing up:', error);
    return { error: 'Erro ao criar conta' };
  }
};

export const signIn = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    // Buscar usuário
    const result = await pool.query(
      'SELECT id, email, password_hash, created_at FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return { error: 'Usuário não encontrado' };
    }

    const user = result.rows[0];

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return { error: 'Senha incorreta' };
    }

    // Gerar token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      import.meta.env.VITE_JWT_SECRET,
      { expiresIn: '24h' }
    );

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
    const decoded = jwt.verify(token, import.meta.env.VITE_JWT_SECRET) as any;
    return { userId: decoded.userId, email: decoded.email };
  } catch (error) {
    return null;
  }
};