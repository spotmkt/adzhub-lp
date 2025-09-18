import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { PhotoUpload } from '@/components/PhotoUpload';
import { toast } from '@/hooks/use-toast';
import { Settings as SettingsIcon, Zap, AlertCircle, Target, Plus, X } from 'lucide-react';
import { SettingsLoadingSkeleton } from '@/components/ui/skeleton-screens';

interface ClientProfile {
  id: string;
  client_id: string;
  tom_voz: string;
  tom_voz_detalhes: string;
  frequencia_publicacao: string;
  sitemap?: string;
  direcionamento?: string;
  plataforma?: string;
  canais_habilitados: {
    linkedin: boolean;
    instagram: boolean;
    facebook: boolean;
    twitter: boolean;
    youtube: boolean;
    tiktok: boolean;
    blog: boolean;
  };
}

interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  profile_photo_url?: string;
  primary_color?: string;
  secondary_colors?: string[];
}

interface MetaAccount {
  id?: number;
  cliente: string;
  conta_anuncios: string;
  ig_id?: string;
  fb_id?: string;
  whatsapp?: string;
  pixel?: string;
  url_site?: string;
  ig_username?: string;
  dominio?: string;
  client_id?: string;
}

const Settings = () => {
  const [profile, setProfile] = useState<ClientProfile | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [metaAccount, setMetaAccount] = useState<MetaAccount | null>(null);
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
    { key: 'blog', label: 'Blog', icon: '📝' },
  ];

  useEffect(() => {
    // Listen for profile changes
    const handleProfileChange = (event: CustomEvent) => {
      console.log('Settings - Received profile change event:', event.detail);
      if (event.detail) {
        const clientId = event.detail.id;
        setSelectedClient(clientId);
        fetchClientData(clientId);
      }
    };

    const handleStorageChange = () => {
      const newClientId = localStorage.getItem('selectedClientId');
      console.log('Settings - Storage changed:', newClientId);
      if (newClientId !== selectedClient) {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (newClientId && uuidRegex.test(newClientId)) {
          setSelectedClient(newClientId);
          fetchClientData(newClientId);
        } else if (!newClientId) {
          setSelectedClient('');
          setClient(null);
          setProfile(null);
        }
      }
    };

    // Initial load
    const clientId = localStorage.getItem('selectedClientId');
    if (clientId) {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (uuidRegex.test(clientId)) {
        console.log('Settings - Initial client load:', clientId);
        setSelectedClient(clientId);
        fetchClientData(clientId);
      } else {
        console.error('Invalid UUID format:', clientId);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }

    // Add event listeners
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('profileChanged', handleProfileChange as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('profileChanged', handleProfileChange as EventListener);
    };
  }, []);

  const fetchClientData = async (clientId: string) => {
    console.log('Settings - Fetching data for client:', clientId);
    setLoading(true);
    
    try {
      // Fetch client data
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('*')
        .eq('id', clientId)
        .single();

      if (clientError) throw clientError;
      
        const newClient = {
        id: clientData.id,
        name: clientData.name,
        email: clientData.email,
        phone: clientData.phone,
        profile_photo_url: clientData.profile_photo_url,
        primary_color: clientData.primary_color || '#3B82F6',
        secondary_colors: Array.isArray(clientData.secondary_colors) 
          ? clientData.secondary_colors.filter(color => typeof color === 'string') as string[]
          : []
      };
      
      console.log('Settings - Loaded client data:', newClient);
      setClient(newClient);

      // Fetch client profile
      const { data, error } = await supabase
        .from('client_profiles')
        .select('*')
        .eq('client_id', clientId)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        const newProfile = {
          ...data,
          canais_habilitados: {
            linkedin: false,
            instagram: false,
            facebook: false,
            twitter: false,
            youtube: false,
            tiktok: false,
            blog: false,
            ...(data.canais_habilitados as any || {})
          }
        } as ClientProfile;
        
        console.log('Settings - Loaded profile data:', newProfile);
        setProfile(newProfile);
      } else {
        // Create default profile if doesn't exist
        console.log('Settings - Creating default profile for client:', clientId);
        const defaultProfile = {
          client_id: clientId,
          tom_voz: 'profissional',
          tom_voz_detalhes: '',
          frequencia_publicacao: 'diaria',
          sitemap: '',
          direcionamento: '',
          plataforma: '',
          canais_habilitados: {
            linkedin: false,
            instagram: false,
            facebook: false,
            twitter: false,
            youtube: false,
            tiktok: false,
            blog: false,
          },
        };

        const { data: newData, error: createError } = await supabase
          .from('client_profiles')
          .insert([defaultProfile])
          .select()
          .single();

        if (createError) throw createError;
        const createdProfile = {
          ...newData,
          canais_habilitados: {
            linkedin: false,
            instagram: false,
            facebook: false,
            twitter: false,
            youtube: false,
            tiktok: false,
            blog: false,
            ...(newData.canais_habilitados as any || {})
          }
        } as ClientProfile;
        
        console.log('Settings - Created profile:', createdProfile);
        setProfile(createdProfile);
      }

      // Fetch meta account data
      const { data: metaData, error: metaError } = await supabase
        .from('meta_accounts')
        .select('*')
        .eq('client_id', clientId)
        .maybeSingle();

      if (metaError) {
        console.error('Error fetching meta account:', metaError);
      }

      if (metaData) {
        const newMetaAccount = {
          id: metaData.id,
          cliente: metaData.cliente,
          conta_anuncios: metaData.conta_anuncios?.replace('act_', '') || '',
          ig_id: metaData.ig_id,
          fb_id: metaData.fb_id,
          whatsapp: metaData.whatsapp,
          pixel: metaData.pixel,
          url_site: metaData.url_site,
          ig_username: metaData.ig_username,
          dominio: metaData.dominio,
          client_id: metaData.client_id
        } as MetaAccount;
        
        console.log('Settings - Loaded meta account data:', newMetaAccount);
        setMetaAccount(newMetaAccount);
      } else {
        // Create default meta account if doesn't exist
        const defaultMetaAccount = {
          cliente: newClient.name,
          conta_anuncios: '',
          client_id: clientId
        } as MetaAccount;
        
        setMetaAccount(defaultMetaAccount);
      }
    } catch (error) {
      console.error('Error fetching client data:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os dados do cliente.',
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
          sitemap: profile.sitemap,
          direcionamento: profile.direcionamento,
          plataforma: profile.plataforma,
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

  const handleSaveClient = async () => {
    if (!client) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('clients')
        .update({
          name: client.name,
          email: client.email,
          phone: client.phone,
          profile_photo_url: client.profile_photo_url,
          primary_color: client.primary_color,
          secondary_colors: client.secondary_colors,
        })
        .eq('id', client.id);

      if (error) throw error;

      toast({
        title: 'Sucesso',
        description: 'Dados da empresa salvos com sucesso!',
      });
    } catch (error) {
      console.error('Error saving client:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar os dados da empresa.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveMeta = async () => {
    if (!metaAccount || !selectedClient) return;

    setSaving(true);
    try {
      // Prepare the account ID with act_ prefix
      const contaAnunciosComPrefixo = metaAccount.conta_anuncios.startsWith('act_') 
        ? metaAccount.conta_anuncios 
        : `act_${metaAccount.conta_anuncios}`;

      if (metaAccount.id) {
        // Update existing record
        const { error } = await supabase
          .from('meta_accounts')
          .update({
            cliente: metaAccount.cliente,
            conta_anuncios: contaAnunciosComPrefixo,
            ig_id: metaAccount.ig_id,
            fb_id: metaAccount.fb_id,
            whatsapp: metaAccount.whatsapp,
            pixel: metaAccount.pixel,
            url_site: metaAccount.url_site,
            ig_username: metaAccount.ig_username,
            dominio: metaAccount.dominio,
          })
          .eq('id', metaAccount.id);

        if (error) throw error;
      } else {
        // Insert new record
        const { error } = await supabase
          .from('meta_accounts')
          .insert([{
            cliente: metaAccount.cliente,
            conta_anuncios: contaAnunciosComPrefixo,
            ig_id: metaAccount.ig_id,
            fb_id: metaAccount.fb_id,
            whatsapp: metaAccount.whatsapp,
            pixel: metaAccount.pixel,
            url_site: metaAccount.url_site,
            ig_username: metaAccount.ig_username,
            dominio: metaAccount.dominio,
            client_id: selectedClient,
          }]);

        if (error) throw error;
      }

      toast({
        title: 'Sucesso',
        description: 'Configurações do Meta salvas com sucesso!',
      });
    } catch (error) {
      console.error('Error saving meta account:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar as configurações do Meta.',
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

  const updateClient = (updates: Partial<Client>) => {
    if (client) {
      setClient({ ...client, ...updates });
    }
  };

  const addSecondaryColor = () => {
    if (client && client.secondary_colors) {
      updateClient({
        secondary_colors: [...client.secondary_colors, '#64748B']
      });
    } else if (client) {
      updateClient({
        secondary_colors: ['#64748B']
      });
    }
  };

  const removeSecondaryColor = (index: number) => {
    if (client && client.secondary_colors) {
      const newColors = client.secondary_colors.filter((_, i) => i !== index);
      updateClient({ secondary_colors: newColors });
    }
  };

  const updateSecondaryColor = (index: number, color: string) => {
    if (client && client.secondary_colors) {
      const newColors = [...client.secondary_colors];
      newColors[index] = color;
      updateClient({ secondary_colors: newColors });
    }
  };

  const updateMetaAccount = (updates: Partial<MetaAccount>) => {
    if (metaAccount) {
      setMetaAccount({ ...metaAccount, ...updates });
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
    return <SettingsLoadingSkeleton />;
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
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">
            <SettingsIcon className="h-4 w-4 mr-2" />
            Geral
          </TabsTrigger>
          <TabsTrigger value="automation">
            <Zap className="h-4 w-4 mr-2" />
            Automação de Conteúdo
          </TabsTrigger>
          <TabsTrigger value="meta">
            <Target className="h-4 w-4 mr-2" />
            Meta
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          {client && (
            <Card>
              <CardHeader>
                <CardTitle>Dados da Empresa</CardTitle>
                <CardDescription>
                  Edite as informações básicas da empresa
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Photo Upload Section */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Foto do Perfil</label>
                  <PhotoUpload
                    currentPhotoUrl={client.profile_photo_url}
                    onPhotoUpdate={(photoUrl) => updateClient({ profile_photo_url: photoUrl })}
                    clientId={client.id}
                    disabled={saving}
                  />
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="company-name">Nome da Empresa</Label>
                    <Input
                      id="company-name"
                      value={client.name}
                      onChange={(e) => updateClient({ name: e.target.value })}
                      placeholder="Digite o nome da empresa"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company-email">Email</Label>
                    <Input
                      id="company-email"
                      type="email"
                      value={client.email || ''}
                      onChange={(e) => updateClient({ email: e.target.value })}
                      placeholder="email@empresa.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company-phone">Telefone</Label>
                    <Input
                      id="company-phone"
                      value={client.phone || ''}
                      onChange={(e) => updateClient({ phone: e.target.value })}
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveClient} disabled={saving}>
                    {saving ? 'Salvando...' : 'Salvar Dados'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {client && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Paleta de Cores ({((client.secondary_colors?.length || 0) + 1)})</CardTitle>
                    <CardDescription>
                      Configure as cores da marca para uso em conteúdos e materiais
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addSecondaryColor}
                    className="flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add new</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wide">
                    Cores da Marca
                  </h3>
                  
                  <div className="grid grid-cols-6 gap-4">
                    {/* Cor Principal */}
                    <div className="flex flex-col items-center space-y-3">
                      <div className="relative group">
                        <input
                          type="color"
                          value={client.primary_color || '#3B82F6'}
                          onChange={(e) => updateClient({ primary_color: e.target.value })}
                          className="w-16 h-16 rounded-full border-4 border-background cursor-pointer shadow-lg opacity-0 absolute inset-0"
                        />
                        <div 
                          className="w-16 h-16 rounded-full shadow-lg border-4 border-background cursor-pointer transition-transform group-hover:scale-105"
                          style={{ backgroundColor: client.primary_color || '#3B82F6' }}
                        />
                        <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-mono text-muted-foreground">
                          {client.primary_color || '#3B82F6'}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">Principal</p>
                      </div>
                    </div>

                    {/* Cores Secundárias */}
                    {client.secondary_colors?.map((color, index) => (
                      <div key={index} className="flex flex-col items-center space-y-3 group/item">
                        <div className="relative group">
                          <input
                            type="color"
                            value={color}
                            onChange={(e) => updateSecondaryColor(index, e.target.value)}
                            className="w-16 h-16 rounded-full border-4 border-background cursor-pointer shadow-lg opacity-0 absolute inset-0"
                          />
                          <div 
                            className="w-16 h-16 rounded-full shadow-lg border-4 border-background cursor-pointer transition-transform group-hover:scale-105"
                            style={{ backgroundColor: color }}
                          />
                          <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
                          
                          {/* Botão de remover */}
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => removeSecondaryColor(index)}
                            className="absolute -top-2 -right-2 w-6 h-6 rounded-full opacity-0 group-hover/item:opacity-100 transition-opacity shadow-lg"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="text-center">
                          <p className="text-xs font-mono text-muted-foreground">
                            {color}
                          </p>
                        </div>
                      </div>
                    ))}

                    {/* Botão Adicionar Cor */}
                    <div className="flex flex-col items-center space-y-3">
                      <button
                        onClick={addSecondaryColor}
                        className="w-16 h-16 rounded-full border-4 border-dashed border-muted-foreground/30 cursor-pointer transition-all hover:border-primary hover:bg-primary/5 flex items-center justify-center group"
                      >
                        <Plus className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                      </button>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Add new</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t">
                  <Button onClick={handleSaveClient} disabled={saving}>
                    {saving ? 'Salvando...' : 'Salvar Paleta'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
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
                  <CardTitle>Configurações de Blog</CardTitle>
                  <CardDescription>
                    Configure as informações específicas para geração de conteúdo do blog
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="sitemap">Sitemap da Empresa</Label>
                    <Input
                      id="sitemap"
                      placeholder="https://exemplo.com/sitemap.xml"
                      value={profile.sitemap || ''}
                      onChange={(e) => updateProfile({ sitemap: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="direcionamento">Direcionamento para Big Ideas</Label>
                    <Textarea
                      id="direcionamento"
                      placeholder="Descreva brevemente como a IA deve direcionar a geração de grandes ideias de conteúdo"
                      value={profile.direcionamento || ''}
                      onChange={(e) => updateProfile({ direcionamento: e.target.value })}
                      className="min-h-[80px]"
                    />
                  </div>

                  {profile.canais_habilitados.blog && (
                    <div className="space-y-2">
                      <Label htmlFor="plataforma">Plataforma de Publicação</Label>
                      <Select
                        value={profile.plataforma || ''}
                        onValueChange={(value) => updateProfile({ plataforma: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a plataforma" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="wordpress">WordPress</SelectItem>
                          <SelectItem value="webflow">Webflow</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
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

        <TabsContent value="meta" className="space-y-6">
          {metaAccount && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Configurações da Conta Meta</CardTitle>
                  <CardDescription>
                    Configure as informações da conta Meta para integração com Facebook e Instagram
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cliente">Cliente</Label>
                      <Input
                        id="cliente"
                        value={metaAccount.cliente}
                        onChange={(e) => updateMetaAccount({ cliente: e.target.value })}
                        placeholder="Nome do cliente"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="conta-anuncios">Conta de Anúncios *</Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-muted-foreground text-sm">act_</span>
                        </div>
                        <Input
                          id="conta-anuncios"
                          value={metaAccount.conta_anuncios.replace('act_', '')}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, '');
                            updateMetaAccount({ conta_anuncios: value });
                          }}
                          placeholder="1428019817701428"
                          className="pl-12"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ig-id">Instagram ID</Label>
                      <Input
                        id="ig-id"
                        value={metaAccount.ig_id || ''}
                        onChange={(e) => updateMetaAccount({ ig_id: e.target.value })}
                        placeholder="ID da conta do Instagram"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fb-id">Facebook ID</Label>
                      <Input
                        id="fb-id"
                        value={metaAccount.fb_id || ''}
                        onChange={(e) => updateMetaAccount({ fb_id: e.target.value })}
                        placeholder="ID da página do Facebook"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="whatsapp">WhatsApp</Label>
                      <Input
                        id="whatsapp"
                        value={metaAccount.whatsapp || ''}
                        onChange={(e) => updateMetaAccount({ whatsapp: e.target.value })}
                        placeholder="Número do WhatsApp"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pixel">Pixel ID</Label>
                      <Input
                        id="pixel"
                        value={metaAccount.pixel || ''}
                        onChange={(e) => updateMetaAccount({ pixel: e.target.value })}
                        placeholder="ID do Pixel do Facebook"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="url-site">URL do Site</Label>
                      <Input
                        id="url-site"
                        value={metaAccount.url_site || ''}
                        onChange={(e) => updateMetaAccount({ url_site: e.target.value })}
                        placeholder="https://exemplo.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ig-username">Username do Instagram</Label>
                      <Input
                        id="ig-username"
                        value={metaAccount.ig_username || ''}
                        onChange={(e) => updateMetaAccount({ ig_username: e.target.value })}
                        placeholder="@username"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="dominio">Domínio</Label>
                      <Input
                        id="dominio"
                        value={metaAccount.dominio || ''}
                        onChange={(e) => updateMetaAccount({ dominio: e.target.value })}
                        placeholder="exemplo.com"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button onClick={handleSaveMeta} disabled={saving}>
                  {saving ? 'Salvando...' : 'Salvar Configurações Meta'}
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