import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import { Settings as SettingsIcon, Zap, AlertCircle } from 'lucide-react';

interface ClientProfile {
  id: string;
  client_id: string;
  tom_voz: string;
  tom_voz_detalhes: string;
  frequencia_publicacao: string;
  canais_habilitados: {
    linkedin: boolean;
    instagram: boolean;
    facebook: boolean;
    twitter: boolean;
    youtube: boolean;
    tiktok: boolean;
  };
}

const Settings = () => {
  const [profile, setProfile] = useState<ClientProfile | null>(null);
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const tomVozOptions = [
    { value: 'profissional', label: 'Profissional' },
    { value: 'casual', label: 'Casual' },
    { value: 'amigavel', label: 'Amigável' },
    { value: 'autorativo', label: 'Autoritativo' },
    { value: 'inspirador', label: 'Inspirador' },
    { value: 'humoristico', label: 'Humorístico' },
  ];

  const frequenciaOptions = [
    { value: 'diaria', label: 'Diária' },
    { value: 'alternada', label: 'Em dias alternados' },
    { value: 'semanal', label: 'Semanal' },
    { value: 'quinzenal', label: 'Quinzenal' },
    { value: 'mensal', label: 'Mensal' },
  ];

  const canaisDisponiveis = [
    { key: 'linkedin', label: 'LinkedIn', icon: '💼' },
    { key: 'instagram', label: 'Instagram', icon: '📸' },
    { key: 'facebook', label: 'Facebook', icon: '👥' },
    { key: 'twitter', label: 'Twitter/X', icon: '🐦' },
    { key: 'youtube', label: 'YouTube', icon: '📺' },
    { key: 'tiktok', label: 'TikTok', icon: '🎵' },
  ];

  useEffect(() => {
    const clientId = localStorage.getItem('selectedClientId');
    if (clientId) {
      // Validate clientId is a valid UUID
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (uuidRegex.test(clientId)) {
        setSelectedClient(clientId);
        fetchClientProfile(clientId);
      } else {
        console.error('Invalid UUID format:', clientId);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const fetchClientProfile = async (clientId: string) => {
    try {
      const { data, error } = await supabase
        .from('client_profiles')
        .select('*')
        .eq('client_id', clientId)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setProfile({
          ...data,
          canais_habilitados: data.canais_habilitados as {
            linkedin: boolean;
            instagram: boolean;
            facebook: boolean;
            twitter: boolean;
            youtube: boolean;
            tiktok: boolean;
          }
        } as ClientProfile);
      } else {
        // Create default profile if doesn't exist
        const defaultProfile = {
          client_id: clientId,
          tom_voz: 'profissional',
          tom_voz_detalhes: '',
          frequencia_publicacao: 'diaria',
          canais_habilitados: {
            linkedin: false,
            instagram: false,
            facebook: false,
            twitter: false,
            youtube: false,
            tiktok: false,
          },
        };

        const { data: newData, error: createError } = await supabase
          .from('client_profiles')
          .insert([defaultProfile])
          .select()
          .single();

        if (createError) throw createError;
        setProfile({
          ...newData,
          canais_habilitados: newData.canais_habilitados as {
            linkedin: boolean;
            instagram: boolean;
            facebook: boolean;
            twitter: boolean;
            youtube: boolean;
            tiktok: boolean;
          }
        } as ClientProfile);
      }
    } catch (error) {
      console.error('Error fetching client profile:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as configurações do cliente.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!profile) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('client_profiles')
        .update({
          tom_voz: profile.tom_voz,
          tom_voz_detalhes: profile.tom_voz_detalhes,
          frequencia_publicacao: profile.frequencia_publicacao,
          canais_habilitados: profile.canais_habilitados,
        })
        .eq('id', profile.id);

      if (error) throw error;

      toast({
        title: 'Sucesso',
        description: 'Configurações salvas com sucesso!',
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar as configurações.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const updateProfile = (updates: Partial<ClientProfile>) => {
    if (profile) {
      setProfile({ ...profile, ...updates });
    }
  };

  const toggleCanal = (canal: string) => {
    if (profile) {
      updateProfile({
        canais_habilitados: {
          ...profile.canais_habilitados,
          [canal]: !profile.canais_habilitados[canal as keyof typeof profile.canais_habilitados],
        },
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando configurações...</p>
        </div>
      </div>
    );
  }

  if (!selectedClient) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nenhum cliente selecionado</h3>
          <p className="text-muted-foreground">
            Selecione um cliente no topo da página para configurar suas opções.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full p-6 bg-background overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Configurações</h1>
        </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="general">
            <SettingsIcon className="h-4 w-4 mr-2" />
            Geral
          </TabsTrigger>
          <TabsTrigger value="automation">
            <Zap className="h-4 w-4 mr-2" />
            Automação de Conteúdo
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Gerais</CardTitle>
              <CardDescription>
                Configurações básicas da plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                As configurações gerais serão implementadas em futuras versões.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automation" className="space-y-6">
          {profile && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Tom de Voz</CardTitle>
                  <CardDescription>
                    Configure como a IA deve se comunicar e criar conteúdo
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="tom-voz">Estilo de Comunicação</Label>
                    <Select
                      value={profile.tom_voz}
                      onValueChange={(value) => updateProfile({ tom_voz: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tom de voz" />
                      </SelectTrigger>
                      <SelectContent>
                        {tomVozOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tom-voz-detalhes">Detalhes Adicionais</Label>
                    <Textarea
                      id="tom-voz-detalhes"
                      placeholder="Descreva características específicas do tom de voz, palavras-chave, estilo de escrita, etc."
                      value={profile.tom_voz_detalhes}
                      onChange={(e) => updateProfile({ tom_voz_detalhes: e.target.value })}
                      className="min-h-[100px]"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Frequência de Publicação</CardTitle>
                  <CardDescription>
                    Com que frequência a IA deve gerar novos conteúdos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="frequencia">Frequência</Label>
                    <Select
                      value={profile.frequencia_publicacao}
                      onValueChange={(value) => updateProfile({ frequencia_publicacao: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a frequência" />
                      </SelectTrigger>
                      <SelectContent>
                        {frequenciaOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Canais Habilitados</CardTitle>
                  <CardDescription>
                    Selecione em quais canais a IA deve gerar conteúdo
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {canaisDisponiveis.map((canal) => (
                      <div
                        key={canal.key}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{canal.icon}</span>
                          <span className="font-medium">{canal.label}</span>
                        </div>
                        <Switch
                          checked={profile.canais_habilitados[canal.key as keyof typeof profile.canais_habilitados]}
                          onCheckedChange={() => toggleCanal(canal.key)}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button onClick={handleSaveProfile} disabled={saving}>
                  {saving ? 'Salvando...' : 'Salvar Configurações'}
                </Button>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
};

export default Settings;