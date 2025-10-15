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
      aa_gestoratrafego_chats: {
        Row: {
          id: number
          message: Json
          session_id: string
        }
        Insert: {
          id?: number
          message: Json
          session_id: string
        }
        Update: {
          id?: number
          message?: Json
          session_id?: string
        }
        Relationships: []
      }
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
          user_id: string | null
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
          user_id?: string | null
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
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "actions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_actions_client"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      agenda_events: {
        Row: {
          agenda_type: Database["public"]["Enums"]["agenda_type"]
          all_day: boolean | null
          client_id: string | null
          color: string | null
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          is_recurring: boolean | null
          linked_resource_id: string | null
          linked_resource_type: string | null
          metadata: Json | null
          parent_event_id: string | null
          recurrence_end_date: string | null
          recurrence_frequency:
            | Database["public"]["Enums"]["recurrence_frequency"]
            | null
          recurrence_interval: number | null
          start_date: string
          status: Database["public"]["Enums"]["event_status"]
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          agenda_type?: Database["public"]["Enums"]["agenda_type"]
          all_day?: boolean | null
          client_id?: string | null
          color?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          is_recurring?: boolean | null
          linked_resource_id?: string | null
          linked_resource_type?: string | null
          metadata?: Json | null
          parent_event_id?: string | null
          recurrence_end_date?: string | null
          recurrence_frequency?:
            | Database["public"]["Enums"]["recurrence_frequency"]
            | null
          recurrence_interval?: number | null
          start_date: string
          status?: Database["public"]["Enums"]["event_status"]
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          agenda_type?: Database["public"]["Enums"]["agenda_type"]
          all_day?: boolean | null
          client_id?: string | null
          color?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          is_recurring?: boolean | null
          linked_resource_id?: string | null
          linked_resource_type?: string | null
          metadata?: Json | null
          parent_event_id?: string | null
          recurrence_end_date?: string | null
          recurrence_frequency?:
            | Database["public"]["Enums"]["recurrence_frequency"]
            | null
          recurrence_interval?: number | null
          start_date?: string
          status?: Database["public"]["Enums"]["event_status"]
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agenda_events_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agenda_events_parent_event_id_fkey"
            columns: ["parent_event_id"]
            isOneToOne: false
            referencedRelation: "agenda_events"
            referencedColumns: ["id"]
          },
        ]
      }
      app_configurations: {
        Row: {
          app_id: number
          app_name: string
          created_at: string | null
          id: string
          input_form: Json | null
          output_template: Json | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          app_id: number
          app_name: string
          created_at?: string | null
          id?: string
          input_form?: Json | null
          output_template?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          app_id?: number
          app_name?: string
          created_at?: string | null
          id?: string
          input_form?: Json | null
          output_template?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
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
        Row: {
          autor: string | null
          canal: string | null
          categoria: string | null
          client_id: string
          created_at: string
          data_publicacao: string
          descricao: string | null
          id: string
          status: string | null
          titulo: string
          updated_at: string
        }
        Insert: {
          autor?: string | null
          canal?: string | null
          categoria?: string | null
          client_id: string
          created_at?: string
          data_publicacao: string
          descricao?: string | null
          id?: string
          status?: string | null
          titulo: string
          updated_at?: string
        }
        Update: {
          autor?: string | null
          canal?: string | null
          categoria?: string | null
          client_id?: string
          created_at?: string
          data_publicacao?: string
          descricao?: string | null
          id?: string
          status?: string | null
          titulo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_calendar_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_clients: {
        Row: {
          client: string | null
          client_id: string | null
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
          client_id?: string | null
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
          client_id?: string | null
          created_at?: string
          direcionamento?: string | null
          id?: number
          plataform?: string | null
          sitemap?: string | null
          "tom de voz"?: string | null
          último_post?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_clients_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author_avatar: string | null
          author_name: string | null
          canonical_url: string | null
          category: string | null
          content: string
          created_at: string
          excerpt: string | null
          featured_image: string | null
          h1_heading: string | null
          id: string
          is_featured: boolean | null
          meta_description: string | null
          meta_keywords: string[] | null
          meta_title: string | null
          og_description: string | null
          og_image: string | null
          og_title: string | null
          published_at: string | null
          reading_time: number | null
          schema_data: Json | null
          schema_type: string | null
          slug: string
          status: string | null
          tags: string[] | null
          title: string
          twitter_description: string | null
          twitter_image: string | null
          twitter_title: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          author_avatar?: string | null
          author_name?: string | null
          canonical_url?: string | null
          category?: string | null
          content: string
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          h1_heading?: string | null
          id?: string
          is_featured?: boolean | null
          meta_description?: string | null
          meta_keywords?: string[] | null
          meta_title?: string | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          published_at?: string | null
          reading_time?: number | null
          schema_data?: Json | null
          schema_type?: string | null
          slug: string
          status?: string | null
          tags?: string[] | null
          title: string
          twitter_description?: string | null
          twitter_image?: string | null
          twitter_title?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          author_avatar?: string | null
          author_name?: string | null
          canonical_url?: string | null
          category?: string | null
          content?: string
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          h1_heading?: string | null
          id?: string
          is_featured?: boolean | null
          meta_description?: string | null
          meta_keywords?: string[] | null
          meta_title?: string | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          published_at?: string | null
          reading_time?: number | null
          schema_data?: Json | null
          schema_type?: string | null
          slug?: string
          status?: string | null
          tags?: string[] | null
          title?: string
          twitter_description?: string | null
          twitter_image?: string | null
          twitter_title?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      campaign_recipients: {
        Row: {
          campaign_id: string
          created_at: string
          id: string
          metadata: Json | null
          name: string | null
          phone: string
          scheduler: string | null
          status: string
          updated_at: string
        }
        Insert: {
          campaign_id: string
          created_at?: string
          id?: string
          metadata?: Json | null
          name?: string | null
          phone: string
          scheduler?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          campaign_id?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          name?: string | null
          phone?: string
          scheduler?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaign_recipients_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_responses: {
        Row: {
          created_at: string
          id: string
          is_valid_response: boolean | null
          message_content: string | null
          phone: string
          received_at: string
          recipient_id: string
          response_time: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_valid_response?: boolean | null
          message_content?: string | null
          phone: string
          received_at: string
          recipient_id: string
          response_time?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          is_valid_response?: boolean | null
          message_content?: string | null
          phone?: string
          received_at?: string
          recipient_id?: string
          response_time?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "campaign_responses_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "campaign_recipients"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          completed_at: string | null
          created_at: string
          has_image: boolean | null
          id: string
          image_template_id: string | null
          image_url: string | null
          instance_id: string | null
          instance_label: string
          mapping_mode: string | null
          message_content: string
          name: string
          scheduled_for: string | null
          started_at: string | null
          status: string
          template_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          has_image?: boolean | null
          id?: string
          image_template_id?: string | null
          image_url?: string | null
          instance_id?: string | null
          instance_label: string
          mapping_mode?: string | null
          message_content: string
          name: string
          scheduled_for?: string | null
          started_at?: string | null
          status?: string
          template_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          has_image?: boolean | null
          id?: string
          image_template_id?: string | null
          image_url?: string | null
          instance_id?: string | null
          instance_label?: string
          mapping_mode?: string | null
          message_content?: string
          name?: string
          scheduled_for?: string | null
          started_at?: string | null
          status?: string
          template_id?: string | null
          updated_at?: string
          user_id?: string
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
      cimp_insights: {
        Row: {
          ad_id: string
          ad_name: string | null
          add_carrinho: number | null
          adset_id: string
          adset_name: string | null
          alcance: number | null
          buscas: number | null
          campaign_id: string
          campaign_name: string | null
          cliques_link: number | null
          cliques_link_unicos: number | null
          cliques_totais: number | null
          comentarios: number | null
          compartilhamentos: number | null
          compras: number | null
          connect_rate: number | null
          cpc_link: number | null
          created_at: string | null
          ctr_link: number | null
          curtidas: number | null
          date_start: string | null
          date_stop: string | null
          dt: string
          engajamento_total: number | null
          impressoes: number | null
          inicio_checkout: number | null
          leads: number | null
          leads_pixel: number | null
          objetivo: string | null
          page_view: number | null
          play_video: number | null
          salvamentos: number | null
          tempo_medio_video: number | null
          thruplays: number | null
          updated_at: string | null
          valor_gasto: number | null
          video_p75: number | null
          visitas_perfil: number | null
          visualizacoes_video: number | null
        }
        Insert: {
          ad_id: string
          ad_name?: string | null
          add_carrinho?: number | null
          adset_id: string
          adset_name?: string | null
          alcance?: number | null
          buscas?: number | null
          campaign_id: string
          campaign_name?: string | null
          cliques_link?: number | null
          cliques_link_unicos?: number | null
          cliques_totais?: number | null
          comentarios?: number | null
          compartilhamentos?: number | null
          compras?: number | null
          connect_rate?: number | null
          cpc_link?: number | null
          created_at?: string | null
          ctr_link?: number | null
          curtidas?: number | null
          date_start?: string | null
          date_stop?: string | null
          dt: string
          engajamento_total?: number | null
          impressoes?: number | null
          inicio_checkout?: number | null
          leads?: number | null
          leads_pixel?: number | null
          objetivo?: string | null
          page_view?: number | null
          play_video?: number | null
          salvamentos?: number | null
          tempo_medio_video?: number | null
          thruplays?: number | null
          updated_at?: string | null
          valor_gasto?: number | null
          video_p75?: number | null
          visitas_perfil?: number | null
          visualizacoes_video?: number | null
        }
        Update: {
          ad_id?: string
          ad_name?: string | null
          add_carrinho?: number | null
          adset_id?: string
          adset_name?: string | null
          alcance?: number | null
          buscas?: number | null
          campaign_id?: string
          campaign_name?: string | null
          cliques_link?: number | null
          cliques_link_unicos?: number | null
          cliques_totais?: number | null
          comentarios?: number | null
          compartilhamentos?: number | null
          compras?: number | null
          connect_rate?: number | null
          cpc_link?: number | null
          created_at?: string | null
          ctr_link?: number | null
          curtidas?: number | null
          date_start?: string | null
          date_stop?: string | null
          dt?: string
          engajamento_total?: number | null
          impressoes?: number | null
          inicio_checkout?: number | null
          leads?: number | null
          leads_pixel?: number | null
          objetivo?: string | null
          page_view?: number | null
          play_video?: number | null
          salvamentos?: number | null
          tempo_medio_video?: number | null
          thruplays?: number | null
          updated_at?: string | null
          valor_gasto?: number | null
          video_p75?: number | null
          visitas_perfil?: number | null
          visualizacoes_video?: number | null
        }
        Relationships: []
      }
      client_profiles: {
        Row: {
          canais_habilitados: Json | null
          client_id: string
          created_at: string
          direcionamento: string | null
          frequencia_publicacao: string | null
          id: string
          plataforma: string | null
          sitemap: string | null
          tom_voz: string | null
          tom_voz_detalhes: string | null
          updated_at: string
        }
        Insert: {
          canais_habilitados?: Json | null
          client_id: string
          created_at?: string
          direcionamento?: string | null
          frequencia_publicacao?: string | null
          id?: string
          plataforma?: string | null
          sitemap?: string | null
          tom_voz?: string | null
          tom_voz_detalhes?: string | null
          updated_at?: string
        }
        Update: {
          canais_habilitados?: Json | null
          client_id?: string
          created_at?: string
          direcionamento?: string | null
          frequencia_publicacao?: string | null
          id?: string
          plataforma?: string | null
          sitemap?: string | null
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
          primary_color: string | null
          profile_photo_url: string | null
          secondary_colors: Json | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          primary_color?: string | null
          profile_photo_url?: string | null
          secondary_colors?: Json | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          primary_color?: string | null
          profile_photo_url?: string | null
          secondary_colors?: Json | null
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
          user_id: string | null
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
          user_id?: string | null
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
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "content_assets_content_idea_id_fkey"
            columns: ["content_idea_id"]
            isOneToOne: false
            referencedRelation: "content_ideas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_content_assets_client"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_content_assets_idea"
            columns: ["content_idea_id"]
            isOneToOne: false
            referencedRelation: "content_ideas"
            referencedColumns: ["id"]
          },
        ]
      }
      content_ideas: {
        Row: {
          alternatives: Json | null
          categoria: string | null
          client_id: string
          created_at: string
          descricao: string | null
          excluded_matches: Json | null
          id: string
          primary_keyword: string | null
          prioridade: string | null
          proposed_theme: string | null
          reason: string | null
          search_intent: string | null
          secondary_keywords: Json | null
          slug: string | null
          status: string | null
          title_suggestion: string | null
          titulo: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          alternatives?: Json | null
          categoria?: string | null
          client_id: string
          created_at?: string
          descricao?: string | null
          excluded_matches?: Json | null
          id?: string
          primary_keyword?: string | null
          prioridade?: string | null
          proposed_theme?: string | null
          reason?: string | null
          search_intent?: string | null
          secondary_keywords?: Json | null
          slug?: string | null
          status?: string | null
          title_suggestion?: string | null
          titulo: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          alternatives?: Json | null
          categoria?: string | null
          client_id?: string
          created_at?: string
          descricao?: string | null
          excluded_matches?: Json | null
          id?: string
          primary_keyword?: string | null
          prioridade?: string | null
          proposed_theme?: string | null
          reason?: string | null
          search_intent?: string | null
          secondary_keywords?: Json | null
          slug?: string | null
          status?: string | null
          title_suggestion?: string | null
          titulo?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_content_ideas_client"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      image_templates: {
        Row: {
          created_at: string
          id: string
          image_url: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "image_templates_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      instances: {
        Row: {
          created_at: string
          id: string
          instance_id: string
          instance_label: string
          phone_number: string
          profile_image_url: string | null
          status: string
          token: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          instance_id: string
          instance_label: string
          phone_number: string
          profile_image_url?: string | null
          status?: string
          token?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          instance_id?: string
          instance_label?: string
          phone_number?: string
          profile_image_url?: string | null
          status?: string
          token?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "instances_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
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
      message_templates: {
        Row: {
          content: string
          created_at: string
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_templates_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
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
      pending_posts: {
        Row: {
          canal: string
          client_id: string
          conteudo: string
          created_at: string
          id: string
          metadata: Json | null
          scheduled_date: string | null
          status: string
          tipo_postagem: string
          titulo: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          canal: string
          client_id: string
          conteudo: string
          created_at?: string
          id?: string
          metadata?: Json | null
          scheduled_date?: string | null
          status?: string
          tipo_postagem: string
          titulo: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          canal?: string
          client_id?: string
          conteudo?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          scheduled_date?: string | null
          status?: string
          tipo_postagem?: string
          titulo?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_pending_posts_client"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          allowed_instances: string[] | null
          created_at: string
          display_name: string
          profile_image_url: string | null
          updated_at: string
          user_id: string
          username: string
        }
        Insert: {
          allowed_instances?: string[] | null
          created_at?: string
          display_name: string
          profile_image_url?: string | null
          updated_at?: string
          user_id: string
          username: string
        }
        Update: {
          allowed_instances?: string[] | null
          created_at?: string
          display_name?: string
          profile_image_url?: string | null
          updated_at?: string
          user_id?: string
          username?: string
        }
        Relationships: []
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
      task_proposals: {
        Row: {
          card_type: string
          created_at: string
          id: string
          parent_task: Json
          request_id: string
          subtasks: Json
          updated_at: string
        }
        Insert: {
          card_type: string
          created_at?: string
          id?: string
          parent_task: Json
          request_id: string
          subtasks: Json
          updated_at?: string
        }
        Update: {
          card_type?: string
          created_at?: string
          id?: string
          parent_task?: Json
          request_id?: string
          subtasks?: Json
          updated_at?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          assignees: Json | null
          category: string | null
          client_id: string | null
          completed_at: string | null
          content: string | null
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          is_subtask: boolean | null
          metadata: Json | null
          parent_task_id: string | null
          priority: string | null
          start_date: string | null
          status: string
          tags: Json | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          assignees?: Json | null
          category?: string | null
          client_id?: string | null
          completed_at?: string | null
          content?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          is_subtask?: boolean | null
          metadata?: Json | null
          parent_task_id?: string | null
          priority?: string | null
          start_date?: string | null
          status?: string
          tags?: Json | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          assignees?: Json | null
          category?: string | null
          client_id?: string | null
          completed_at?: string | null
          content?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          is_subtask?: boolean | null
          metadata?: Json | null
          parent_task_id?: string | null
          priority?: string | null
          start_date?: string | null
          status?: string
          tags?: Json | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_parent_task_id_fkey"
            columns: ["parent_task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      telcoweb_insights: {
        Row: {
          ad_id: string
          ad_name: string | null
          add_carrinho: number | null
          adset_id: string
          adset_name: string | null
          alcance: number | null
          buscas: number | null
          campaign_id: string
          campaign_name: string | null
          cliques_link: number | null
          cliques_link_unicos: number | null
          cliques_totais: number | null
          comentarios: number | null
          compartilhamentos: number | null
          compras: number | null
          connect_rate: number | null
          cpc_link: number | null
          created_at: string | null
          ctr_link: number | null
          curtidas: number | null
          date_start: string | null
          date_stop: string | null
          dt: string
          engajamento_total: number | null
          impressoes: number | null
          inicio_checkout: number | null
          leads: number | null
          leads_pixel: number | null
          objetivo: string | null
          page_view: number | null
          play_video: number | null
          salvamentos: number | null
          tempo_medio_video: number | null
          thruplays: number | null
          updated_at: string | null
          valor_gasto: number | null
          video_p75: number | null
          visitas_perfil: number | null
          visualizacoes_video: number | null
        }
        Insert: {
          ad_id: string
          ad_name?: string | null
          add_carrinho?: number | null
          adset_id: string
          adset_name?: string | null
          alcance?: number | null
          buscas?: number | null
          campaign_id: string
          campaign_name?: string | null
          cliques_link?: number | null
          cliques_link_unicos?: number | null
          cliques_totais?: number | null
          comentarios?: number | null
          compartilhamentos?: number | null
          compras?: number | null
          connect_rate?: number | null
          cpc_link?: number | null
          created_at?: string | null
          ctr_link?: number | null
          curtidas?: number | null
          date_start?: string | null
          date_stop?: string | null
          dt: string
          engajamento_total?: number | null
          impressoes?: number | null
          inicio_checkout?: number | null
          leads?: number | null
          leads_pixel?: number | null
          objetivo?: string | null
          page_view?: number | null
          play_video?: number | null
          salvamentos?: number | null
          tempo_medio_video?: number | null
          thruplays?: number | null
          updated_at?: string | null
          valor_gasto?: number | null
          video_p75?: number | null
          visitas_perfil?: number | null
          visualizacoes_video?: number | null
        }
        Update: {
          ad_id?: string
          ad_name?: string | null
          add_carrinho?: number | null
          adset_id?: string
          adset_name?: string | null
          alcance?: number | null
          buscas?: number | null
          campaign_id?: string
          campaign_name?: string | null
          cliques_link?: number | null
          cliques_link_unicos?: number | null
          cliques_totais?: number | null
          comentarios?: number | null
          compartilhamentos?: number | null
          compras?: number | null
          connect_rate?: number | null
          cpc_link?: number | null
          created_at?: string | null
          ctr_link?: number | null
          curtidas?: number | null
          date_start?: string | null
          date_stop?: string | null
          dt?: string
          engajamento_total?: number | null
          impressoes?: number | null
          inicio_checkout?: number | null
          leads?: number | null
          leads_pixel?: number | null
          objetivo?: string | null
          page_view?: number | null
          play_video?: number | null
          salvamentos?: number | null
          tempo_medio_video?: number | null
          thruplays?: number | null
          updated_at?: string | null
          valor_gasto?: number | null
          video_p75?: number | null
          visitas_perfil?: number | null
          visualizacoes_video?: number | null
        }
        Relationships: []
      }
      telcoweb_traqueamento: {
        Row: {
          anuncio: string | null
          campanha: string | null
          conjunto: string | null
          created_at: string
          id: number
          instancianome: string
          instanciawpp_id: number
          nomelead: string | null
          origemlead: string | null
          primeiramensagem: string | null
          primeirocontato: string | null
          sourceid: number | null
          telefonelead: number | null
          ultimocontato: string | null
          urlanuncio: string | null
        }
        Insert: {
          anuncio?: string | null
          campanha?: string | null
          conjunto?: string | null
          created_at?: string
          id?: number
          instancianome: string
          instanciawpp_id: number
          nomelead?: string | null
          origemlead?: string | null
          primeiramensagem?: string | null
          primeirocontato?: string | null
          sourceid?: number | null
          telefonelead?: number | null
          ultimocontato?: string | null
          urlanuncio?: string | null
        }
        Update: {
          anuncio?: string | null
          campanha?: string | null
          conjunto?: string | null
          created_at?: string
          id?: number
          instancianome?: string
          instanciawpp_id?: number
          nomelead?: string | null
          origemlead?: string | null
          primeiramensagem?: string | null
          primeirocontato?: string | null
          sourceid?: number | null
          telefonelead?: number | null
          ultimocontato?: string | null
          urlanuncio?: string | null
        }
        Relationships: []
      }
      theme_research_history: {
        Row: {
          bookmarks: number | null
          client_id: string | null
          comments: number | null
          content_type: string | null
          content_url: string | null
          created_at: string
          filter_value: string | null
          hypothesis: string | null
          id: string
          likes: number | null
          post_id: string | null
          search_type: string | null
          shares: number | null
          song_title: string | null
          stats: Json | null
          theme: string | null
          thumbnail_url: string | null
          title: string | null
          updated_at: string
          user_id: string
          video_url: string | null
          views: number | null
        }
        Insert: {
          bookmarks?: number | null
          client_id?: string | null
          comments?: number | null
          content_type?: string | null
          content_url?: string | null
          created_at?: string
          filter_value?: string | null
          hypothesis?: string | null
          id?: string
          likes?: number | null
          post_id?: string | null
          search_type?: string | null
          shares?: number | null
          song_title?: string | null
          stats?: Json | null
          theme?: string | null
          thumbnail_url?: string | null
          title?: string | null
          updated_at?: string
          user_id: string
          video_url?: string | null
          views?: number | null
        }
        Update: {
          bookmarks?: number | null
          client_id?: string | null
          comments?: number | null
          content_type?: string | null
          content_url?: string | null
          created_at?: string
          filter_value?: string | null
          hypothesis?: string | null
          id?: string
          likes?: number | null
          post_id?: string | null
          search_type?: string | null
          shares?: number | null
          song_title?: string | null
          stats?: Json | null
          theme?: string | null
          thumbnail_url?: string | null
          title?: string | null
          updated_at?: string
          user_id?: string
          video_url?: string | null
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "theme_research_history_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      theme_research_shares: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          share_token: string
          user_id: string
          view_count: number
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          share_token: string
          user_id: string
          view_count?: number
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          share_token?: string
          user_id?: string
          view_count?: number
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
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
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
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
      is_valid_share_token: {
        Args: { _user_id: string }
        Returns: boolean
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
        Returns: unknown
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
      agenda_type: "personal" | "automation"
      app_role: "admin" | "editor" | "viewer"
      event_status: "pending" | "completed" | "cancelled"
      recurrence_frequency:
        | "daily"
        | "weekly"
        | "biweekly"
        | "monthly"
        | "yearly"
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
    Enums: {
      agenda_type: ["personal", "automation"],
      app_role: ["admin", "editor", "viewer"],
      event_status: ["pending", "completed", "cancelled"],
      recurrence_frequency: [
        "daily",
        "weekly",
        "biweekly",
        "monthly",
        "yearly",
      ],
    },
  },
} as const
