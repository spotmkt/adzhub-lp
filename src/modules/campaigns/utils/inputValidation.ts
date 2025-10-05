// Validação de inputs do usuário
import { z } from 'zod';

export const phoneSchema = z.string()
  .trim()
  .min(10, 'Telefone deve ter pelo menos 10 dígitos')
  .max(15, 'Telefone deve ter no máximo 15 dígitos')
  .regex(/^[0-9+\s()-]+$/, 'Telefone contém caracteres inválidos');

export const messageSchema = z.string()
  .trim()
  .min(1, 'Mensagem não pode estar vazia')
  .max(4096, 'Mensagem muito longa (máximo 4096 caracteres)');

export const campaignNameSchema = z.string()
  .trim()
  .min(1, 'Nome da campanha é obrigatório')
  .max(100, 'Nome muito longo (máximo 100 caracteres)');

export const validatePhone = (phone: string): boolean => {
  try {
    phoneSchema.parse(phone);
    return true;
  } catch {
    return false;
  }
};

export const validateMessage = (message: string): boolean => {
  try {
    messageSchema.parse(message);
    return true;
  } catch {
    return false;
  }
};

export const sanitizeInput = (input: string): string => {
  return input
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .trim();
};
