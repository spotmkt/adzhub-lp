import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { User, Upload, Save, ArrowLeft, Plus, Wifi, WifiOff, Edit, Trash2, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCampaignsAuth } from '../contexts/CampaignsAuthContext';
import { uploadProfileImage } from '../services/supabaseStorage';
import { supabase } from '@/integrations/supabase/client';
import ImageCropModal from './ImageCropModal';

interface ProfileEditScreenProps {
  onBack: () => void;
}

const ProfileEditScreen = ({ onBack }: ProfileEditScreenProps) => {
  const { user, updateUser } = useCampaignsAuth();
  const { toast } = useToast();
  
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [username, setUsername] = useState(user?.username || '');
  const [profileImage, setProfileImage] = useState(user?.profileImage || '');
  const [newInstance, setNewInstance] = useState('');
  const [newInstancePhone, setNewInstancePhone] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [showNewInstanceModal, setShowNewInstanceModal] = useState(false);
  const [showEditInstanceModal, setShowEditInstanceModal] = useState(false);
  const [editingInstance, setEditingInstance] = useState<any>(null);
  const [editingInstanceId, setEditingInstanceId] = useState<string | null>(null);
  const [editingInstanceName, setEditingInstanceName] = useState('');
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isCreatingInstance, setIsCreatingInstance] = useState(false);
  const [qrTimer, setQrTimer] = useState<number | null>(null);
  const [currentInstanceData, setCurrentInstanceData] = useState<any>(null);
  const [qrTimerInterval, setQrTimerInterval] = useState<NodeJS.Timeout | null>(null);
  const [qrUpdateTimeout, setQrUpdateTimeout] = useState<NodeJS.Timeout | null>(null);

  const [instances, setInstances] = useState<any[]>([]);
  const [isLoadingInstances, setIsLoadingInstances] = useState(true);

  useEffect(() => {
    fetchInstances();
  }, [user?.id]);

  const fetchInstances = async () => {
    if (!user?.id) return;
    
    console.log('fetchInstances chamada - user.id:', user.id);
    setIsLoadingInstances(true);
    try {
      const { data, error } = await supabase
        .from('instances')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      console.log('Resultado da query instances:', { data, error });

      if (error) {
        console.error('Erro ao buscar instâncias:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar as instâncias.",
          variant: "destructive"
        });
      } else {
        setInstances(data || []);
      }
    } catch (error) {
      console.error('Erro ao buscar instâncias:', error);
    } finally {
      setIsLoadingInstances(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Erro no upload",
        description: "Por favor, selecione apenas arquivos de imagem.",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Erro no upload",
        description: "A imagem deve ter no máximo 5MB.",
        variant: "destructive"
      });
      return;
    }

    setSelectedImageFile(file);
    setShowCropModal(true);
  };

  const handleImageCrop = async (croppedFile: File) => {
    setIsUploading(true);
    try {
      const imageUrl = await uploadProfileImage(croppedFile, user.id);
      setProfileImage(imageUrl);
      toast({
        title: "Imagem enviada!",
        description: "Sua foto de perfil foi atualizada com sucesso."
      });
    } catch (error) {
      console.error('Erro no upload:', error);
      toast({
        title: "Erro no upload",
        description: "Não foi possível fazer upload da imagem. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      setSelectedImageFile(null);
    }
  };

  const formatPhoneForStorage = (phone: string) => {
    return phone.replace(/\D/g, '');
  };

  const generateNameId = (username: string) => {
    const randomChars = Math.random().toString(36).substr(2, 5);
    return `${username}-${randomChars}`;
  };

  const handleCreateInstance = async () => {
    if (!newInstance.trim() || !newInstancePhone.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha o nome da instância e o número.",
        variant: "destructive"
      });
      return;
    }

    setIsCreatingInstance(true);
    setQrCode(null);

    try {
      const formattedPhone = formatPhoneForStorage(newInstancePhone);
      
      const { data: existingInstance } = await supabase
        .from('instances')
        .select('instance_label, phone_number')
        .eq('user_id', user.id)
        .eq('phone_number', formattedPhone)
        .single();

      if (existingInstance) {
        toast({
          title: "Instância já existe",
          description: `Uma instância com este número já existe: "${existingInstance.instance_label}"`,
          variant: "destructive"
        });
        setIsCreatingInstance(false);
        return;
      }
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('username')
        .eq('user_id', user.id)
        .single();

      if (!profile?.username) {
        toast({
          title: "Erro",
          description: "Username não encontrado no perfil",
          variant: "destructive",
        });
        setIsCreatingInstance(false);
        return;
      }

      const instance_id = generateNameId(profile.username);
      
      const { data, error } = await supabase
        .from('instances')
        .insert({
          user_id: user.id,
          instance_label: newInstance.trim(),
          phone_number: formattedPhone,
          status: 'disconnected',
          instance_id: instance_id
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao salvar instância:', error);
        toast({
          title: "Erro",
          description: "Não foi possível salvar a instância.",
          variant: "destructive"
        });
        setIsCreatingInstance(false);
        return;
      }

      const webhookUrl = `https://n8n-n8n.ascl7r.easypanel.host/webhook/c0677659-07b3-4c2e-944e-0c7377c65056?name=${encodeURIComponent(newInstance.trim())}&phone=${encodeURIComponent(formattedPhone)}&token=${encodeURIComponent(data.token)}&instance_id=${encodeURIComponent(instance_id)}`;
      
      try {
        const response = await fetch(webhookUrl, {
          method: 'GET'
        });

        if (response.ok) {
          const result = await response.json();
          console.log('Resposta do webhook:', result);
          
          if (result?.success && result?.data?.base64) {
            console.log('QR code encontrado, definindo estado');
            setQrCode(result.data.base64);
            setCurrentInstanceData(data);
            startQrCodeTimer(data.instance_id);
          }
        } else {
          const errorText = await response.text();
          toast({
            title: "Erro no webhook",
            description: `Erro ${response.status}: ${errorText || 'Falha na comunicação com o webhook'}`,
            variant: "destructive",
          });
        }
      } catch (webhookError) {
        console.error('Erro no webhook:', webhookError);
        toast({
          title: "Erro de conexão",
          description: "Não foi possível conectar ao webhook. Verifique sua conexão.",
          variant: "destructive",
        });
      }

      await fetchInstances();

      toast({
        title: "Instância criada!",
        description: "A nova instância foi salva e enviada para configuração."
      });

    } catch (error) {
      console.error('Erro ao criar instância:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar a instância.",
        variant: "destructive"
      });
    } finally {
      setIsCreatingInstance(false);
    }
  };

  const updateQrCode = async (instanceId: string) => {
    try {
      console.log('Atualizando QR code para instance_id:', instanceId);
      const updateWebhookUrl = `https://n8n-n8n.ascl7r.easypanel.host/webhook/c0677659-07b3-4c2e-944e-0c7377z68799?instance_id=${encodeURIComponent(instanceId)}`;
      
      const response = await fetch(updateWebhookUrl, {
        method: 'GET'
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Resposta do webhook de atualização:', result);
        
        if (result?.success && result?.data?.base64) {
          console.log('Novo QR code recebido, atualizando...');
          setQrCode(result.data.base64);
          toast({
            title: "QR Code atualizado!",
            description: "Um novo QR code foi gerado."
          });
        }
      }
    } catch (error) {
      console.error('Erro no webhook de atualização:', error);
    }
  };

  const startQrCodeTimer = (instanceId: string) => {
    if (qrTimerInterval) clearInterval(qrTimerInterval);
    if (qrUpdateTimeout) clearTimeout(qrUpdateTimeout);

    setQrTimer(50);
    const countdown = setInterval(() => {
      setQrTimer(prev => {
        if (prev && prev > 1) {
          return prev - 1;
        } else {
          clearInterval(countdown);
          return null;
        }
      });
    }, 1000);
    setQrTimerInterval(countdown);

    const updateTimer = setTimeout(async () => {
      console.log('Timer de 50s acionado, atualizando QR code...');
      await updateQrCode(instanceId);
      
      if (showNewInstanceModal) {
        console.log('Modal ainda aberto, reiniciando timer...');
        startQrCodeTimer(instanceId);
      }
    }, 50000);
    setQrUpdateTimeout(updateTimer);
  };

  const closeInstanceModal = () => {
    if (qrTimerInterval) clearInterval(qrTimerInterval);
    if (qrUpdateTimeout) clearTimeout(qrUpdateTimeout);
    
    setNewInstance('');
    setNewInstancePhone('');
    setQrCode(null);
    setQrTimer(null);
    setCurrentInstanceData(null);
    setQrTimerInterval(null);
    setQrUpdateTimeout(null);
    setShowNewInstanceModal(false);
  };

  const handleEditInstance = async () => {
    if (!editingInstance || !newInstance.trim() || !newInstancePhone.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha o nome da instância e o número.",
        variant: "destructive"
      });
      return;
    }

    try {
      const formattedPhone = formatPhoneForStorage(newInstancePhone);
      
      const { error } = await supabase
        .from('instances')
        .update({
          instance_label: newInstance.trim(),
          phone_number: formattedPhone,
        })
        .eq('id', editingInstance.id);

      if (error) {
        console.error('Erro ao atualizar instância:', error);
        toast({
          title: "Erro",
          description: "Não foi possível atualizar a instância.",
          variant: "destructive"
        });
        return;
      }

      await fetchInstances();
      
      toast({
        title: "Instância atualizada!",
        description: "A instância foi atualizada com sucesso."
      });

      setNewInstance('');
      setNewInstancePhone('');
      setEditingInstance(null);
      setShowEditInstanceModal(false);
    } catch (error) {
      console.error('Erro ao atualizar instância:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a instância.",
        variant: "destructive"
      });
    }
  };

  const startInlineEdit = (instance: any) => {
    setEditingInstanceId(instance.id);
    setEditingInstanceName(instance.instance_label);
  };

  const cancelInlineEdit = () => {
    setEditingInstanceId(null);
    setEditingInstanceName('');
  };

  const saveInlineEdit = async (instanceId: string) => {
    if (!editingInstanceName.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "O nome da instância não pode estar vazio.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('instances')
        .update({ instance_label: editingInstanceName.trim() })
        .eq('id', instanceId);

      if (error) {
        console.error('Erro ao atualizar nome da instância:', error);
        toast({
          title: "Erro",
          description: "Não foi possível atualizar o nome da instância.",
          variant: "destructive"
        });
        return;
      }

      await fetchInstances();
      setEditingInstanceId(null);
      setEditingInstanceName('');
      
      toast({
        title: "Nome atualizado!",
        description: "O nome da instância foi atualizado com sucesso."
      });
    } catch (error) {
      console.error('Erro ao atualizar nome da instância:', error);
    }
  };

  const handleInstanceAction = async (action: string, instanceId: string) => {
    try {
      const { data: instance, error: fetchError } = await supabase
        .from('instances')
        .select('instance_id, token, instance_label')
        .eq('id', instanceId)
        .single();

      if (fetchError) {
        console.error('Erro ao buscar instância:', fetchError);
        throw fetchError;
      }

      if (action === 'desconectar') {
        if (instance?.instance_id) {
          try {
            const disconnectWebhookUrl = `https://n8n-n8n.ascl7r.easypanel.host/webhook/c0677659-07b3-4c2e-944e-0c7377lk58795?instance_id=${encodeURIComponent(instance.instance_id)}`;
            
            const response = await fetch(disconnectWebhookUrl, {
              method: 'GET'
            });
            
            if (response.ok) {
              await supabase
                .from('instances')
                .update({ status: 'disconnected' })
                .eq('id', instanceId);
              
              await fetchInstances();
              toast({
                title: "Instância desconectada",
                description: "A instância foi desconectada com sucesso."
              });
            }
          } catch (webhookError) {
            console.error('Erro no webhook de desconexão:', webhookError);
          }
        }
      } else if (action === 'excluir') {
        if (instance?.instance_id) {
          try {
            const deleteWebhookUrl = `https://n8n-n8n.ascl7r.easypanel.host/webhook/c0677659-07b3-4c2e-944e-0c7377c65248?instance_id=${encodeURIComponent(instance.instance_id)}`;
            
            await fetch(deleteWebhookUrl, {
              method: 'GET'
            });
          } catch (webhookError) {
            console.error('Erro no webhook de exclusão:', webhookError);
          }
        }

        const { error: deleteError } = await supabase
          .from('instances')
          .delete()
          .eq('id', instanceId);

        if (deleteError) {
          throw deleteError;
        }

        await fetchInstances();
        toast({
          title: "Instância excluída",
          description: "A instância foi removida com sucesso."
        });
      }
    } catch (error) {
      console.error('Erro na ação:', error);
      toast({
        title: "Erro",
        description: "Não foi possível executar a ação.",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!displayName.trim() || !username.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const updatedData = {
        displayName: displayName.trim(),
        username: username.trim(),
        profileImage
      };

      await updateUser(updatedData);

      toast({
        title: "Perfil atualizado!",
        description: "Suas informações foram salvas com sucesso."
      });

    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível atualizar seu perfil. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button
              onClick={onBack}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
            <h1 className="text-2xl font-bold text-dark-primary">Editar Perfil</h1>
          </div>

          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2 text-xl">
                <User className="h-5 w-5" />
                Informações do Perfil
              </CardTitle>
              <CardDescription>
                Atualize suas informações pessoais e foto de perfil
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={profileImage} alt="Foto de perfil" />
                  <AvatarFallback className="text-lg">
                    {displayName ? displayName.charAt(0).toUpperCase() : (user?.username?.charAt(0)?.toUpperCase() || '?')}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex flex-col items-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="profile-upload"
                    disabled={isUploading}
                  />
                  <Label
                    htmlFor="profile-upload"
                    className="cursor-pointer flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
                  >
                    <Upload className="h-4 w-4" />
                    {isUploading ? 'Enviando...' : 'Cortar e Alterar Foto'}
                  </Label>
                  <p className="text-sm text-gray-500 mt-1">
                    JPG, PNG ou GIF até 5MB
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName" className="text-sm font-medium">
                    Nome de Exibição *
                  </Label>
                  <Input
                    id="displayName"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Como você quer ser chamado"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-medium">
                    Nome de Usuário *
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Seu nome de usuário para login"
                    required
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-lg font-semibold">
                      Instâncias WhatsApp
                    </Label>
                     <Dialog open={showNewInstanceModal} onOpenChange={(open) => {
                       if (!open) {
                         closeInstanceModal();
                       } else {
                         setShowNewInstanceModal(true);
                       }
                     }}>
                      <DialogTrigger asChild>
                        <Button size="sm" className="flex items-center gap-2">
                          <Plus className="h-4 w-4" />
                          Nova Instância
                        </Button>
                      </DialogTrigger>
                       <DialogContent>
                         <DialogHeader>
                           <DialogTitle>
                             {qrCode ? 'Escaneie o QR Code' : 'Criar Nova Instância'}
                           </DialogTitle>
                         </DialogHeader>
                         <div className="space-y-4">
                           {!qrCode ? (
                             <>
                               <div>
                                 <Label htmlFor="instanceName">Nome da Instância</Label>
                                 <Input
                                   id="instanceName"
                                   value={newInstance}
                                   onChange={(e) => setNewInstance(e.target.value)}
                                   placeholder="Ex: Vendas, Suporte, etc."
                                   disabled={isCreatingInstance}
                                 />
                               </div>
                               <div>
                                 <Label htmlFor="instancePhone">Número do WhatsApp</Label>
                                 <Input
                                   id="instancePhone"
                                   value={newInstancePhone}
                                   onChange={(e) => setNewInstancePhone(e.target.value)}
                                   placeholder="Ex: +55 31 99999-9999"
                                   disabled={isCreatingInstance}
                                 />
                               </div>
                               <div className="flex gap-2">
                                 <Button 
                                   variant="outline" 
                                   onClick={closeInstanceModal}
                                   className="flex-1"
                                   disabled={isCreatingInstance}
                                 >
                                   Cancelar
                                 </Button>
                                 <Button 
                                   onClick={handleCreateInstance} 
                                   className="flex-1"
                                   disabled={isCreatingInstance}
                                 >
                                   {isCreatingInstance ? 'Criando...' : 'Criar Instância'}
                                 </Button>
                               </div>
                             </>
                           ) : (
                             <>
                                <div className="text-center space-y-4">
                                  <p className="text-sm text-muted-foreground">
                                    Escaneie o QR Code abaixo com o WhatsApp para conectar sua instância:
                                  </p>
                                  {qrTimer && (
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                      <p className="text-sm text-blue-600 font-medium">
                                        QR Code será atualizado em: {qrTimer}s
                                      </p>
                                    </div>
                                  )}
                                  <div className="flex justify-center">
                                     <img 
                                       src={qrCode.startsWith('data:') ? qrCode : `data:image/png;base64,${qrCode}`}
                                       alt="QR Code para conexão WhatsApp"
                                       className="max-w-64 max-h-64 border rounded-lg"
                                     />
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                    Abra o WhatsApp → Menu → Dispositivos conectados → Conectar um dispositivo
                                  </p>
                                </div>
                               <div className="flex gap-2">
                                 <Button 
                                   variant="outline" 
                                   onClick={closeInstanceModal}
                                   className="flex-1"
                                 >
                                   Fechar
                                 </Button>
                               </div>
                             </>
                           )}
                         </div>
                       </DialogContent>
                    </Dialog>
                  </div>

                  <div className="grid gap-4">
                    {isLoadingInstances ? (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">Carregando instâncias...</p>
                      </div>
                    ) : (
                      <>
                         {instances.map((instance) => (
                           <Card key={instance.id} className="shadow-md max-w-sm">
                             <CardContent className="p-4">
                               <div className="flex items-start justify-between mb-4">
                                 <div className="flex items-center gap-3">
                                   <Avatar className="w-12 h-12">
                                     <AvatarImage src={instance.profile_image_url} alt={instance.name} />
                                      <AvatarFallback>
                                        {(instance.instance_label || instance.name)?.charAt(0)?.toUpperCase() || '?'}
                                      </AvatarFallback>
                                   </Avatar>
                                    <div>
                                      <div className="flex items-center gap-2">
                                        {editingInstanceId === instance.id ? (
                                          <div className="flex items-center gap-1">
                                            <Input
                                              value={editingInstanceName}
                                              onChange={(e) => setEditingInstanceName(e.target.value)}
                                              className="h-6 text-sm font-semibold"
                                              autoFocus
                                              onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                  saveInlineEdit(instance.id);
                                                } else if (e.key === 'Escape') {
                                                  cancelInlineEdit();
                                                }
                                              }}
                                            />
                                            <Button
                                              size="sm"
                                              variant="ghost"
                                              className="p-1 h-6 w-6 text-green-600 hover:text-green-700"
                                              onClick={() => saveInlineEdit(instance.id)}
                                            >
                                              <Check className="h-3 w-3" />
                                            </Button>
                                            <Button
                                              size="sm"
                                              variant="ghost"
                                              className="p-1 h-6 w-6 text-red-600 hover:text-red-700"
                                              onClick={cancelInlineEdit}
                                            >
                                              <X className="h-3 w-3" />
                                            </Button>
                                          </div>
                                        ) : (
                                           <>
                                             <h3 className="font-semibold text-base">{instance.instance_label}</h3>
                                             <Button
                                              size="sm"
                                              variant="ghost"
                                              className="p-1 h-6 w-6"
                                              onClick={() => startInlineEdit(instance)}
                                            >
                                              <Edit className="h-3 w-3" />
                                            </Button>
                                          </>
                                        )}
                                      </div>
                                     <p className="text-sm text-muted-foreground">{instance.phone_number}</p>
                                      <Badge 
                                        variant={(instance.status === 'connected' || instance.status === 'Conectado') ? 'default' : 'destructive'}
                                        className="flex items-center gap-1 mt-1 w-fit"
                                      >
                                        {(instance.status === 'connected' || instance.status === 'Conectado') ? (
                                          <Wifi className="h-3 w-3" />
                                        ) : (
                                          <WifiOff className="h-3 w-3" />
                                        )}
                                        {(instance.status === 'connected' || instance.status === 'Conectado') ? 'Conectado' : 'Desconectado'}
                                      </Badge>
                                   </div>
                                 </div>
                                 
                                 <Button
                                   size="sm"
                                   variant="ghost"
                                   className="p-1 h-6 w-6 text-destructive hover:text-destructive hover:bg-destructive/10"
                                   onClick={() => handleInstanceAction('excluir', instance.id)}
                                 >
                                   <Trash2 className="h-4 w-4" />
                                 </Button>
                               </div>

                                <div className="flex gap-2">
                                  {(instance.status === 'disconnected' || instance.status === 'Desconectado') && (
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      className="flex items-center gap-1 text-xs border-green-200 text-green-600 hover:bg-green-50"
                                      onClick={() => {
                                        setCurrentInstanceData(instance);
                                        setQrCode(null);
                                        startQrCodeTimer(instance.instance_id);
                                        updateQrCode(instance.instance_id);
                                        setShowNewInstanceModal(true);
                                      }}
                                    >
                                      <Wifi className="h-3 w-3" />
                                      Conectar
                                    </Button>
                                  )}
                                  
                                  {(instance.status === 'connected' || instance.status === 'Conectado') && (
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      className="flex items-center gap-1 text-xs border-red-200 text-red-600 hover:bg-red-50"
                                      onClick={() => handleInstanceAction('desconectar', instance.id)}
                                    >
                                      <WifiOff className="h-3 w-3" />
                                      Desconectar
                                    </Button>
                                  )}
                                </div>
                             </CardContent>
                           </Card>
                         ))}

                        {Array.from({ length: Math.max(0, 3 - instances.length) }).map((_, index) => (
                          <Card key={`empty-${index}`} className="border-2 border-dashed border-gray-300 hover:border-primary transition-colors">
                            <CardContent className="p-8 text-center">
                              <Dialog open={showNewInstanceModal} onOpenChange={setShowNewInstanceModal}>
                                <DialogTrigger asChild>
                                  <Button variant="ghost" className="flex flex-col items-center gap-2 h-auto p-4">
                                    <Plus className="h-8 w-8 text-gray-400" />
                                    <span className="text-gray-500">Adicionar Nova Instância</span>
                                  </Button>
                                </DialogTrigger>
                              </Dialog>
                            </CardContent>
                          </Card>
                        ))}
                      </>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onBack}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading || isUploading}
                    className="flex-1 flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {isLoading ? 'Salvando...' : 'Salvar Alterações'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {selectedImageFile && (
            <ImageCropModal
              isOpen={showCropModal}
              onClose={() => {
                setShowCropModal(false);
                setSelectedImageFile(null);
              }}
              onCrop={handleImageCrop}
              imageFile={selectedImageFile}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileEditScreen;
