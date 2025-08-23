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
  created_at?: Date;
  updated_at?: Date;
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
  created_at?: Date;
  updated_at?: Date;
}

export interface ClientInsights {
  id?: number;
  dt: Date;
  ad_id?: string;
  campaign_id?: string;
  adset_id?: string;
  valor_gasto?: number;
  impressoes?: number;
  cliques_link?: number;
  compras?: number;
  leads?: number;
  created_at?: Date;
}

export interface ClientTraqueamento {
  id?: number;
  telefoneLead?: string;
  nomeLead?: string;
  origemLead?: string;
  sourceId?: string;
  urlAnuncio?: string;
  created_at?: Date;
}

// API base URL - será configurada para apontar para suas edge functions
const API_BASE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/postgres-api`;

// Funções para interagir com as APIs (que se conectarão ao PostgreSQL)
export const metaAccountsService = {
  async getAll(): Promise<MetaAccount[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/meta-accounts`);
      if (!response.ok) throw new Error('Failed to fetch accounts');
      return await response.json();
    } catch (error) {
      console.error('Error fetching accounts:', error);
      // Retornar dados mocados para desenvolvimento
      return [
        { 
          cliente: 'housewhey', 
          whatsapp: '+5511999999999',
          url_site: 'https://housewhey.com'
        },
        { 
          cliente: 'cliente_exemplo', 
          whatsapp: '+5511888888888',
          url_site: 'https://exemplo.com'
        }
      ];
    }
  },

  async getByCliente(cliente: string): Promise<MetaAccount | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/meta-accounts/${cliente}`);
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error('Error fetching account:', error);
      return null;
    }
  },

  async create(account: Omit<MetaAccount, 'id' | 'created_at' | 'updated_at'>): Promise<MetaAccount> {
    try {
      const response = await fetch(`${API_BASE_URL}/meta-accounts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(account)
      });
      if (!response.ok) throw new Error('Failed to create account');
      return await response.json();
    } catch (error) {
      console.error('Error creating account:', error);
      throw error;
    }
  },

  async update(cliente: string, account: Partial<MetaAccount>): Promise<MetaAccount | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/meta-accounts/${cliente}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(account)
      });
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error('Error updating account:', error);
      return null;
    }
  }
};

export const benchmarksService = {
  async getByCliente(cliente: string): Promise<Benchmark | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/benchmarks/${cliente}`);
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error('Error fetching benchmark:', error);
      return null;
    }
  },

  async getAll(): Promise<Benchmark[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/benchmarks`);
      if (!response.ok) throw new Error('Failed to fetch benchmarks');
      return await response.json();
    } catch (error) {
      console.error('Error fetching benchmarks:', error);
      return [];
    }
  }
};

export const clientDataService = {
  async getInsights(cliente: string, startDate?: string, endDate?: string): Promise<ClientInsights[]> {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      
      const response = await fetch(`${API_BASE_URL}/clients/${cliente}/insights?${params}`);
      if (!response.ok) throw new Error('Failed to fetch insights');
      return await response.json();
    } catch (error) {
      console.error('Error fetching insights:', error);
      return [];
    }
  },

  async getTraqueamento(cliente: string, startDate?: string, endDate?: string): Promise<ClientTraqueamento[]> {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      
      const response = await fetch(`${API_BASE_URL}/clients/${cliente}/traqueamento?${params}`);
      if (!response.ok) throw new Error('Failed to fetch traqueamento');
      return await response.json();
    } catch (error) {
      console.error('Error fetching traqueamento:', error);
      return [];
    }
  },

  async getMaterializedView(cliente: string): Promise<any[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/clients/${cliente}/materialized-view`);
      if (!response.ok) throw new Error('Failed to fetch materialized view');
      return await response.json();
    } catch (error) {
      console.error('Error fetching materialized view:', error);
      return [];
    }
  }
};