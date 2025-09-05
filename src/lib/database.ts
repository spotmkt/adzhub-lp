import { supabase } from '@/integrations/supabase/client';

// Interfaces para as tabelas existentes
export interface MetaAccount {
  id?: number;
  cliente: string;
  folder_id?: string;
  conta_anuncios?: string;
  ig_id?: string;
  fb_id?: string;
  pixel?: string;
  whatsapp?: string;
  url_site?: string;
  ig_username?: string;
  dominio?: string;
  dna?: any; // JSON
  hash_video?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Benchmark {
  id?: number;
  cliente: string;
  nicho?: string;
  subnicho?: string;
  valor_gasto?: number;
  cpm?: number;
  cpc_link?: number;
  cpl_wpp?: number;
  custo_lead?: number;
  periodo_referencia?: string;
  ativo?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ClientInsights {
  id?: number;
  dt: string;
  ad_id?: string;
  campaign_id?: string;
  adset_id?: string;
  valor_gasto?: number;
  impressoes?: number;
  cliques_link?: number;
  compras?: number;
  leads?: number;
  created_at?: string;
}

export interface ClientTraqueamento {
  id?: number;
  telefoneLead?: string;
  nomeLead?: string;
  origemLead?: string;
  sourceId?: string;
  urlAnuncio?: string;
  created_at?: string;
}

// Funções para interagir com os dados locais do Supabase
export const metaAccountsService = {
  async getAll(): Promise<MetaAccount[]> {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Converter dados da tabela clients para o formato MetaAccount
      return data.map(client => ({
        cliente: client.name,
        whatsapp: client.phone || '',
        url_site: client.email || '', // usando email como url_site temporariamente
        folder_id: '',
        conta_anuncios: '',
        ig_id: '',
        fb_id: '',
        pixel: '',
        ig_username: '',
        dominio: '',
        dna: '',
        hash_video: '',
        created_at: client.created_at,
        updated_at: client.updated_at
      }));
    } catch (error) {
      console.error('Error fetching accounts:', error);
      return [];
    }
  },

  async getByCliente(cliente: string): Promise<MetaAccount | null> {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('name', cliente)
        .single();
      
      if (error) throw error;
      
      // Converter dados da tabela clients para o formato MetaAccount
      return {
        cliente: data.name,
        whatsapp: data.phone || '',
        url_site: data.email || '', // usando email como url_site temporariamente
        folder_id: '',
        conta_anuncios: '',
        ig_id: '',
        fb_id: '',
        pixel: '',
        ig_username: '',
        dominio: '',
        dna: '',
        hash_video: '',
        created_at: data.created_at,
        updated_at: data.updated_at
      };
    } catch (error) {
      console.error('Error fetching account:', error);
      return null;
    }
  },

  async create(account: Omit<MetaAccount, 'id' | 'created_at' | 'updated_at'>): Promise<MetaAccount> {
    try {
      const { data, error } = await supabase
        .from('clients')
        .insert({
          name: account.cliente,
          phone: account.whatsapp,
          email: account.url_site // usando url_site como email temporariamente
        })
        .select()
        .single();
      
      if (error) throw error;
      
      return {
        ...account,
        created_at: data.created_at,
        updated_at: data.updated_at
      };
    } catch (error) {
      console.error('Error creating account:', error);
      throw error;
    }
  },

  async update(cliente: string, account: Partial<MetaAccount>): Promise<MetaAccount | null> {
    try {
      const { data, error } = await supabase
        .from('clients')
        .update({
          name: account.cliente,
          phone: account.whatsapp,
          email: account.url_site
        })
        .eq('name', cliente)
        .select()
        .single();
      
      if (error) throw error;
      
      return {
        cliente: data.name,
        whatsapp: data.phone || '',
        url_site: data.email || '',
        folder_id: '',
        conta_anuncios: '',
        ig_id: '',
        fb_id: '',
        pixel: '',
        ig_username: '',
        dominio: '',
        dna: '',
        hash_video: '',
        created_at: data.created_at,
        updated_at: data.updated_at
      };
    } catch (error) {
      console.error('Error updating account:', error);
      return null;
    }
  }
};

export const benchmarksService = {
  async getByCliente(cliente: string): Promise<Benchmark | null> {
    try {
      // Como não há tabela de benchmarks no Supabase local, retorna null por enquanto
      console.log('Benchmark service not implemented for local Supabase');
      return null;
    } catch (error) {
      console.error('Error fetching benchmark:', error);
      return null;
    }
  },

  async getAll(): Promise<Benchmark[]> {
    try {
      // Como não há tabela de benchmarks no Supabase local, retorna array vazio por enquanto
      console.log('Benchmark service not implemented for local Supabase');
      return [];
    } catch (error) {
      console.error('Error fetching benchmarks:', error);
      return [];
    }
  }
};

export const clientDataService = {
  async getInsights(cliente: string, startDate?: string, endDate?: string): Promise<ClientInsights[]> {
    try {
      // Como não há tabelas de insights no Supabase local, retorna array vazio por enquanto
      console.log('Insights service not implemented for local Supabase');
      return [];
    } catch (error) {
      console.error('Error fetching insights:', error);
      return [];
    }
  },

  async getTraqueamento(cliente: string, startDate?: string, endDate?: string): Promise<ClientTraqueamento[]> {
    try {
      // Como não há tabelas de traqueamento no Supabase local, retorna array vazio por enquanto
      console.log('Traqueamento service not implemented for local Supabase');
      return [];
    } catch (error) {
      console.error('Error fetching traqueamento:', error);
      return [];
    }
  },

  async getMaterializedView(cliente: string): Promise<any[]> {
    try {
      // Como não há materialized views no Supabase local, retorna array vazio por enquanto
      console.log('Materialized view service not implemented for local Supabase');
      return [];
    } catch (error) {
      console.error('Error fetching materialized view:', error);
      return [];
    }
  }
};