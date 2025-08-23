import { Pool } from 'pg';

const pool = new Pool({
  host: import.meta.env.VITE_DB_HOST,
  port: parseInt(import.meta.env.VITE_DB_PORT || '5432'),
  database: import.meta.env.VITE_DB_NAME,
  user: import.meta.env.VITE_DB_USER,
  password: import.meta.env.VITE_DB_PASSWORD,
  ssl: import.meta.env.VITE_DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

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

// Funções para interagir com as tabelas
export const metaAccountsService = {
  async getAll(): Promise<MetaAccount[]> {
    const result = await pool.query('SELECT * FROM public.meta_accounts ORDER BY cliente');
    return result.rows;
  },

  async getByCliente(cliente: string): Promise<MetaAccount | null> {
    const result = await pool.query('SELECT * FROM public.meta_accounts WHERE cliente = $1', [cliente]);
    return result.rows[0] || null;
  },

  async create(account: Omit<MetaAccount, 'id' | 'created_at' | 'updated_at'>): Promise<MetaAccount> {
    const result = await pool.query(
      `INSERT INTO public.meta_accounts (cliente, folder_id, conta_anuncios, ig_id, fb_id, pixel, whatsapp, url_site, ig_username, dominio, dna, hash_video)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING *`,
      [account.cliente, account.folder_id, account.conta_anuncios, account.ig_id, account.fb_id, account.pixel, account.whatsapp, account.url_site, account.ig_username, account.dominio, account.dna, account.hash_video]
    );
    return result.rows[0];
  },

  async update(cliente: string, account: Partial<MetaAccount>): Promise<MetaAccount | null> {
    const setClause = Object.keys(account)
      .filter(key => key !== 'cliente')
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');
    
    const values = Object.values(account).filter((_, index) => Object.keys(account)[index] !== 'cliente');
    
    const result = await pool.query(
      `UPDATE public.meta_accounts SET ${setClause}, updated_at = NOW() WHERE cliente = $1 RETURNING *`,
      [cliente, ...values]
    );
    return result.rows[0] || null;
  }
};

export const benchmarksService = {
  async getByCliente(cliente: string): Promise<Benchmark | null> {
    const result = await pool.query('SELECT * FROM benchmarks WHERE cliente = $1 AND ativo = true ORDER BY created_at DESC LIMIT 1', [cliente]);
    return result.rows[0] || null;
  },

  async getAll(): Promise<Benchmark[]> {
    const result = await pool.query('SELECT * FROM benchmarks WHERE ativo = true ORDER BY cliente, created_at DESC');
    return result.rows;
  }
};

export const clientDataService = {
  async getInsights(cliente: string, startDate?: string, endDate?: string): Promise<ClientInsights[]> {
    let query = `SELECT * FROM ${cliente}_insights`;
    const params: any[] = [];
    
    if (startDate && endDate) {
      query += ' WHERE dt BETWEEN $1 AND $2';
      params.push(startDate, endDate);
    }
    
    query += ' ORDER BY dt DESC';
    
    const result = await pool.query(query, params);
    return result.rows;
  },

  async getTraqueamento(cliente: string, startDate?: string, endDate?: string): Promise<ClientTraqueamento[]> {
    let query = `SELECT * FROM ${cliente}_traqueamento`;
    const params: any[] = [];
    
    if (startDate && endDate) {
      query += ' WHERE created_at BETWEEN $1 AND $2';
      params.push(startDate, endDate);
    }
    
    query += ' ORDER BY created_at DESC';
    
    const result = await pool.query(query, params);
    return result.rows;
  },

  async getMaterializedView(cliente: string): Promise<any[]> {
    const result = await pool.query(`SELECT * FROM mv_${cliente} ORDER BY dt DESC`);
    return result.rows;
  }
};

export { pool };