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
          created_at?: string
          description?: string | null
          id?: string
          original_date?: string | null
          priority?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      actions: {
        Row: {
          briefing: string | null
          category: string | null
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
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          priority?: string | null
          status?: string | null
          title?: string
          updated_at?: string
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
