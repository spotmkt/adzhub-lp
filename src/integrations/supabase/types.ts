export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      action_history: {
        Row: {
          action_date: string
          action_id: string
          action_type: string
          briefing: string | null
          category: string | null
          client_id: string | null
          created_at: string
          description: string | null
          id: string
          original_date: string | null
          priority: string | null
          title: string
          updated_at: string
        }
        Insert: {
          action_date?: string
          action_id: string
          action_type: string
          briefing?: string | null
          category?: string | null
          client_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          original_date?: string | null
          priority?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          action_date?: string
          action_id?: string
          action_type?: string
          briefing?: string | null
          category?: string | null
          client_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          original_date?: string | null
          priority?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "action_history_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      actions: {
        Row: {
          briefing: string | null
          category: string | null
          client_id: string | null
          created_at: string
          date: string
          description: string | null
          id: string
          priority: string | null
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          briefing?: string | null
          category?: string | null
          client_id?: string | null
          created_at?: string
          date: string
          description?: string | null
          id?: string
          priority?: string | null
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          briefing?: string | null
          category?: string | null
          client_id?: string | null
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          priority?: string | null
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "actions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      benchmarks: {
        Row: {
          alcance: number | null
          ativo: boolean | null
          cliente: string | null
          cliques_link: number | null
          compras: number | null
          connect_rate: number | null
          cpc_link: number | null
          cpl_wpp: number | null
          cpm: number | null
          ctr_link: number | null
          custo_compra: number | null
          custo_engajamento: number | null
          custo_lead: number | null
          custo_page_view: number | null
          custo_thruplay: number | null
          data_atualizacao: string | null
          dias_analisados: number | null
          engajamento_total: number | null
          fonte: string | null
          frequencia: number | null
          id: number
          impressoes: number | null
          leads: number | null
          leads_whatsapp: number | null
          nicho: string | null
          page_view: number | null
          periodo_referencia: string | null
          subnicho: string | null
          tempo_medio_video: number | null
          thruplays: number | null
          valor_gasto: number | null
        }
        Insert: {
          alcance?: number | null
          ativo?: boolean | null
          cliente?: string | null
          cliques_link?: number | null
          compras?: number | null
          connect_rate?: number | null
          cpc_link?: number | null
          cpl_wpp?: number | null
          cpm?: number | null
          ctr_link?: number | null
          custo_compra?: number | null
          custo_engajamento?: number | null
          custo_lead?: number | null
          custo_page_view?: number | null
          custo_thruplay?: number | null
          data_atualizacao?: string | null
          dias_analisados?: number | null
          engajamento_total?: number | null
          fonte?: string | null
          frequencia?: number | null
          id?: number
          impressoes?: number | null
          leads?: number | null
          leads_whatsapp?: number | null
          nicho?: string | null
          page_view?: number | null
          periodo_referencia?: string | null
          subnicho?: string | null
          tempo_medio_video?: number | null
          thruplays?: number | null
          valor_gasto?: number | null
        }
        Update: {
          alcance?: number | null
          ativo?: boolean | null
          cliente?: string | null
          cliques_link?: number | null
          compras?: number | null
          connect_rate?: number | null
          cpc_link?: number | null
          cpl_wpp?: number | null
          cpm?: number | null
          ctr_link?: number | null
          custo_compra?: number | null
          custo_engajamento?: number | null
          custo_lead?: number | null
          custo_page_view?: number | null
          custo_thruplay?: number | null
          data_atualizacao?: string | null
          dias_analisados?: number | null
          engajamento_total?: number | null
          fonte?: string | null
          frequencia?: number | null
          id?: number
          impressoes?: number | null
          leads?: number | null
          leads_whatsapp?: number | null
          nicho?: string | null
          page_view?: number | null
          periodo_referencia?: string | null
          subnicho?: string | null
          tempo_medio_video?: number | null
          thruplays?: number | null
          valor_gasto?: number | null
        }
        Relationships: []
      }
      blog_calendar: {
        Row: {}
        Insert: {}
        Update: {}
        Relationships: []
      }
      blog_clients: {
        Row: {
          client: string | null
          created_at: string
          direcionamento: string | null
          id: number
          plataform: string | null
          sitemap: string | null
          "tom de voz": string | null
          último_post: string | null
        }
        Insert: {
          client?: string | null
          created_at?: string
          direcionamento?: string | null
          id?: number
          plataform?: string | null
          sitemap?: string | null
          "tom de voz"?: string | null
          último_post?: string | null
        }
        Update: {
          client?: string | null
          created_at?: string
          direcionamento?: string | null
          id?: number
          plataform?: string | null
          sitemap?: string | null
          "tom de voz"?: string | null
          último_post?: string | null
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          client_id: string
          content: string
          created_at: string
          id: string
          sender: string
          timestamp: string
          user_id: string | null
        }
        Insert: {
          client_id: string
          content: string
          created_at?: string
          id?: string
          sender: string
          timestamp?: string
          user_id?: string | null
        }
        Update: {
          client_id?: string
          content?: string
          created_at?: string
          id?: string
          sender?: string
          timestamp?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      client_profiles: {
        Row: {
          canais_habilitados: Json | null
          client_id: string
          created_at: string
          frequencia_publicacao: string | null
          id: string
          tom_voz: string | null
          tom_voz_detalhes: string | null
          updated_at: string
        }
        Insert: {
          canais_habilitados?: Json | null
          client_id: string
          created_at?: string
          frequencia_publicacao?: string | null
          id?: string
          tom_voz?: string | null
          tom_voz_detalhes?: string | null
          updated_at?: string
        }
        Update: {
          canais_habilitados?: Json | null
          client_id?: string
          created_at?: string
          frequencia_publicacao?: string | null
          id?: string
          tom_voz?: string | null
          tom_voz_detalhes?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      clients: {
        Row: {
          created_at: string
          email: string | null
          id: string
          name: string
          phone: string | null
          profile_photo_url: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          profile_photo_url?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          profile_photo_url?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      content_assets: {
        Row: {
          canal: string
          client_id: string
          content_idea_id: string
          conteudo: string | null
          created_at: string
          data_publicacao: string | null
          id: string
          status_publicacao: string | null
          tipo_conteudo: string
          titulo: string | null
          updated_at: string
          url_asset: string | null
        }
        Insert: {
          canal: string
          client_id: string
          content_idea_id: string
          conteudo?: string | null
          created_at?: string
          data_publicacao?: string | null
          id?: string
          status_publicacao?: string | null
          tipo_conteudo: string
          titulo?: string | null
          updated_at?: string
          url_asset?: string | null
        }
        Update: {
          canal?: string
          client_id?: string
          content_idea_id?: string
          conteudo?: string | null
          created_at?: string
          data_publicacao?: string | null
          id?: string
          status_publicacao?: string | null
          tipo_conteudo?: string
          titulo?: string | null
          updated_at?: string
          url_asset?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "content_assets_content_idea_id_fkey"
            columns: ["content_idea_id"]
            isOneToOne: false
            referencedRelation: "content_ideas"
            referencedColumns: ["id"]
          },
        ]
      }
      content_ideas: {
        Row: {
          categoria: string | null
          client_id: string
          created_at: string
          descricao: string | null
          id: string
          prioridade: string | null
          status: string | null
          titulo: string
          updated_at: string
        }
        Insert: {
          categoria?: string | null
          client_id: string
          created_at?: string
          descricao?: string | null
          id?: string
          prioridade?: string | null
          status?: string | null
          titulo: string
          updated_at?: string
        }
        Update: {
          categoria?: string | null
          client_id?: string
          created_at?: string
          descricao?: string | null
          id?: string
          prioridade?: string | null
          status?: string | null
          titulo?: string
          updated_at?: string
        }
        Relationships: []
      }
      mapa_solucao: {
        Row: {
          client_id: string
          content: string
          created_at: string
          embedding: string | null
          id: string
          metadata: Json | null
          updated_at: string
        }
        Insert: {
          client_id: string
          content: string
          created_at?: string
          embedding?: string | null
          id?: string
          metadata?: Json | null
          updated_at?: string
        }
        Update: {
          client_id?: string
          content?: string
          created_at?: string
          embedding?: string | null
          id?: string
          metadata?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mapa_solucao_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      meta_accounts: {
        Row: {
          campaign_id: string | null
          client_id: string | null
          cliente: string
          conta_anuncios: string
          created_at: string | null
          dna: Json | null
          dominio: string | null
          fb_id: string | null
          folder_id: string | null
          hash_video: string | null
          id: number
          ig_id: string | null
          ig_username: string | null
          pixel: string | null
          updated_at: string | null
          url_site: string | null
          whatsapp: string | null
        }
        Insert: {
          campaign_id?: string | null
          client_id?: string | null
          cliente: string
          conta_anuncios: string
          created_at?: string | null
          dna?: Json | null
          dominio?: string | null
          fb_id?: string | null
          folder_id?: string | null
          hash_video?: string | null
          id?: number
          ig_id?: string | null
          ig_username?: string | null
          pixel?: string | null
          updated_at?: string | null
          url_site?: string | null
          whatsapp?: string | null
        }
        Update: {
          campaign_id?: string | null
          client_id?: string | null
          cliente?: string
          conta_anuncios?: string
          created_at?: string | null
          dna?: Json | null
          dominio?: string | null
          fb_id?: string | null
          folder_id?: string | null
          hash_video?: string | null
          id?: number
          ig_id?: string | null
          ig_username?: string | null
          pixel?: string | null
          updated_at?: string | null
          url_site?: string | null
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "meta_accounts_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      startbenchmark: {
        Row: {
          ad_id: string | null
          adset_id: string | null
          alcance: number | null
          campaign_id: string | null
          cliente: string | null
          cliques_link: number | null
          compras: number | null
          connect_rate: number | null
          cpc_link: number | null
          cpl_wpp: number | null
          created_at: string | null
          ctr_link: number | null
          dt: string | null
          engajamento_total: number | null
          impressoes: number | null
          leads: number | null
          leads_whatsapp: number | null
          objetivo: string | null
          page_view: number | null
          tempo_medio_video: number | null
          thruplays: number | null
          valor_gasto: number | null
        }
        Insert: {
          ad_id?: string | null
          adset_id?: string | null
          alcance?: number | null
          campaign_id?: string | null
          cliente?: string | null
          cliques_link?: number | null
          compras?: number | null
          connect_rate?: number | null
          cpc_link?: number | null
          cpl_wpp?: number | null
          created_at?: string | null
          ctr_link?: number | null
          dt?: string | null
          engajamento_total?: number | null
          impressoes?: number | null
          leads?: number | null
          leads_whatsapp?: number | null
          objetivo?: string | null
          page_view?: number | null
          tempo_medio_video?: number | null
          thruplays?: number | null
          valor_gasto?: number | null
        }
        Update: {
          ad_id?: string | null
          adset_id?: string | null
          alcance?: number | null
          campaign_id?: string | null
          cliente?: string | null
          cliques_link?: number | null
          compras?: number | null
          connect_rate?: number | null
          cpc_link?: number | null
          cpl_wpp?: number | null
          created_at?: string | null
          ctr_link?: number | null
          dt?: string | null
          engajamento_total?: number | null
          impressoes?: number | null
          leads?: number | null
          leads_whatsapp?: number | null
          objetivo?: string | null
          page_view?: number | null
          tempo_medio_video?: number | null
          thruplays?: number | null
          valor_gasto?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: string
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
