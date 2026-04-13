import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle, Database, Upload, Image, MessageSquare, Send, Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useCampaignsAuth } from '../contexts/CampaignsAuthContext';
import { logDispatch } from '../services/dispatchLogger';
import type { FormData } from '../pages/CampaignsIndex';
import { truncateFileName } from '../services/imageUpload';
import { supabase } from '@/integrations/supabase/client';
import { encryptData, encryptJSON } from '../services/encryption';
import adzhubMark from '@/assets/adzhub-logo-final.png';

interface SummaryScreenProps {
  formData: FormData;
  onBack: () => void;
}

const SummaryScreen = ({ formData, onBack }: SummaryScreenProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>('');
  const { toast } = useToast();
  const { user } = useCampaignsAuth();
  const isEditing = !!(formData as any).editingCampaignId;

  useEffect(() => {
    if (formData.imageFile) {
      const url = URL.createObjectURL(formData.imageFile);
      setImagePreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else if (formData.imageUrl) {
      setImagePreviewUrl(formData.imageUrl);
    }
  }, [formData.imageFile, formData.imageUrl]);

  const handleConfirmAndSend = async () => {
    setIsLoading(true);
    
    try {
      if (!user?.id) {
        throw new Error('Usuário não autenticado');
      }

      // Buscar o instance_id da instância
      const { data: instanceData, error: instanceError } = await supabase
        .from('instances')
        .select('instance_id')
        .eq('instance_label', formData.instanceName)
        .eq('user_id', user.id)
        .single();

      if (instanceError) {
        console.error('Erro ao buscar instância:', instanceError);
        throw new Error('Falha ao buscar dados da instância');
      }

      let campaignId: string;
      
      if (isEditing && (formData as any).editingCampaignId) {
        // Atualizar campanha existente
        const hasImage = !!(formData.imageUrl && formData.imageUrl.trim());
        const { error: updateError } = await (supabase as any)
          .from('campaigns')
          .update({
            instance_label: formData.instanceName.toLowerCase(),
            message_content: formData.message,
            image_url: formData.imageUrl || null,
            has_image: hasImage,
            scheduled_for: formData.data_agendamento?.toISOString() || null,
            status: formData.dispatchType === 'scheduled' ? 'scheduled' : 'processing',
            mapping_mode: formData.columnMapping?.mode || null
          })
          .eq('id', (formData as any).editingCampaignId);

        if (updateError) throw updateError;
        
        campaignId = (formData as any).editingCampaignId;
        
        // Limpar recipients antigos antes de inserir novos
        await (supabase as any)
          .from('campaign_recipients')
          .delete()
          .eq('campaign_id', campaignId);
      } else {
        // Criar nova campanha
        console.log('🖼️ Debug imageUrl antes do logDispatch:', formData.imageUrl);
        campaignId = await logDispatch(
          user.id, 
          formData, 
          undefined, 
          undefined, 
          formData.imageUrl,
          instanceData.instance_id,
          formData.columnMapping?.mode
        );
        
        if (!campaignId) {
          throw new Error('Falha ao criar campanha no Supabase');
        }
      }

      // Criar os recipients da campanha usando criptografia client-side
      if (formData.mappedData && formData.mappedData.length > 0) {
        try {
          console.log('🔐 Criptografando recipients no cliente...');
          
          // Criptografar dados de cada recipient no cliente
          const encryptedRecipients = await Promise.all(
            formData.mappedData.map(async (item) => ({
              name_encrypted: await encryptData(item.name),
              phone_encrypted: await encryptData(item.phone),
              metadata_encrypted: await encryptJSON(item.metadata || {}),
              status: 'pending',
              scheduler: formData.data_agendamento?.toISOString() || new Date().toISOString(),
            }))
          );

          console.log(`✅ ${encryptedRecipients.length} recipients criptografados`);

          // Inserir recipients criptografados usando RPC v2
          const { error: recipientsError } = await supabase.rpc('insert_encrypted_recipients_v2', {
            p_campaign_id: campaignId,
            p_recipients: encryptedRecipients
          });

          if (recipientsError) {
            console.error('Erro ao criar recipients:', recipientsError);
            throw new Error('Falha ao criar recipients da campanha');
          }

          console.log(`${formData.mappedData.length} recipients criados (criptografados) para a campanha ${campaignId}`);

          // Buscar os recipients inseridos para criar campaign_responses
          const { data: insertedRecipients, error: fetchError } = await supabase
            .from('campaign_recipients')
            .select('id, phone')
            .eq('campaign_id', campaignId);

          if (fetchError) {
            console.error('Erro ao buscar recipients inseridos:', fetchError);
            throw new Error('Falha ao buscar recipients criados');
          }

          // Criar as linhas de resposta vazias para todos os tipos de disparo
          if (insertedRecipients && insertedRecipients.length > 0) {
            const responseEntries = insertedRecipients.map((recipient: any) => ({
              recipient_id: recipient.id,
              phone: recipient.phone,
              message_content: '', // Inicialmente vazio, será preenchido quando receber resposta
              received_at: new Date().toISOString(),
              response_time: 0,
              is_valid_response: false
            }));

            const { error: responsesError } = await supabase
              .from('campaign_responses')
              .insert(responseEntries);

            if (responsesError) {
              console.error('Erro ao criar campaign_responses:', responsesError);
              // Não interrompe o processo, apenas loga o erro
            } else {
              console.log(`${responseEntries.length} linhas de resposta criadas na campaign_responses`);
            }
          }
        } catch (error) {
          console.error('Erro ao processar CSV para recipients:', error);
          throw new Error('Falha ao processar arquivo CSV');
        }
      }

      // Preparar dados estruturados para o n8n usando FormData
      const formDataPayload = new FormData();
      
      // Criar payload completo da campanha no formato que o n8n espera
      const campaignPayload = {
        id: campaignId,
        user_id: user.id,
        name: formData.campaignName || `Campanha ${formData.instanceName.toLowerCase()}`,
        instance_label: formData.instanceName.toLowerCase(),
        message_content: formData.message,
        template_id: null,
        status: formData.dispatchType === 'scheduled' ? 'scheduled' : 'processing',
        scheduled_for: formData.data_agendamento?.toISOString() || new Date().toISOString(),
        started_at: null,
        completed_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        image_url: formData.imageUrl || null,
        instance_id: instanceData.instance_id || null,
        mapping_mode: formData.columnMapping?.mode || null,
        has_image: !!(formData.imageUrl && formData.imageUrl.trim()),
        image_template_id: formData.selectedImageTemplate?.id || null
      };

      // Adicionar payload da campanha como JSON
      formDataPayload.append('campaign_data', JSON.stringify([campaignPayload]));
      
      // Manter campos individuais para compatibilidade
      formDataPayload.append('campaign_id', campaignId);
      formDataPayload.append('user_id', user.id);
      formDataPayload.append('campaign_name', formData.campaignName || `Campanha ${formData.instanceName.toLowerCase()} - ${new Date().toLocaleDateString()}`);
      formDataPayload.append('instance_name', formData.instanceName.toLowerCase());
      formDataPayload.append('instance_id', instanceData.instance_id || '');
      formDataPayload.append('message_content', formData.message);
      formDataPayload.append('is_scheduled', (formData.dispatchType === 'scheduled').toString());
      formDataPayload.append('csv_lines', formData.csvLines.toString());
      formDataPayload.append('timestamp', new Date().toISOString());

      // Adicionar informações do mapeamento de colunas
      if (formData.columnMapping) {
        formDataPayload.append('mapping_mode', formData.columnMapping.mode);
        formDataPayload.append('name_column', formData.columnMapping.nameColumn || '');
        formDataPayload.append('phone_column', formData.columnMapping.phoneColumn);
        
        if (formData.columnMapping.mode === 'advanced' && formData.columnMapping.selectedColumns) {
          formDataPayload.append('selected_columns', JSON.stringify(formData.columnMapping.selectedColumns));
        }
      }

      // Adicionar dados dos recipients estruturados
      if (formData.mappedData) {
        formDataPayload.append('recipients_data', JSON.stringify(formData.mappedData));
      }

      // Adicionar campos opcionais apenas se existirem
      if (formData.imageUrl) {
        console.log('🖼️ Adicionando image_url ao payload:', formData.imageUrl);
        formDataPayload.append('image_url', formData.imageUrl);
      } else {
        console.log('⚠️ Nenhuma imageUrl encontrada no formData');
      }

      if (formData.data_agendamento) {
        formDataPayload.append('scheduled_for', formData.data_agendamento.toISOString());
      }

      // Se há arquivo CSV, incluir como arquivo binário
      if (formData.csvFile) {
        formDataPayload.append('csvFile', formData.csvFile, formData.csvFile.name);
        console.log("Arquivo CSV adicionado como binário:", formData.csvFile.name);
      }

      // Preparar dados para enviar à edge function (apenas para disparos instantâneos)
      if (formData.dispatchType === 'instant') {
        console.log("Enviando para edge function de disparo instantâneo");
        
        // Converter FormData para objeto para enviar como JSON
        const campaignData: any = {
          campaign_id: campaignId,
          user_id: user.id,
          campaign_name: formData.campaignName || `Campanha ${formData.instanceName.toLowerCase()} - ${new Date().toLocaleDateString()}`,
          instance_name: formData.instanceName.toLowerCase(),
          instance_id: instanceData.instance_id || '',
          message_content: formData.message,
          is_scheduled: false,
          csv_lines: formData.csvLines,
          timestamp: new Date().toISOString(),
          campaign_data: JSON.stringify([campaignPayload]),
        };

        // Adicionar informações do mapeamento
        if (formData.columnMapping) {
          campaignData.mapping_mode = formData.columnMapping.mode;
          campaignData.name_column = formData.columnMapping.nameColumn || '';
          campaignData.phone_column = formData.columnMapping.phoneColumn;
          
          if (formData.columnMapping.mode === 'advanced' && formData.columnMapping.selectedColumns) {
            campaignData.selected_columns = JSON.stringify(formData.columnMapping.selectedColumns);
          }
        }

        // Adicionar dados dos recipients
        if (formData.mappedData) {
          campaignData.recipients_data = JSON.stringify(formData.mappedData);
        }

        // Adicionar URL da imagem se existir
        if (formData.imageUrl) {
          console.log('🖼️ Adicionando image_url ao payload:', formData.imageUrl);
          campaignData.image_url = formData.imageUrl;
        }

        const { data, error } = await supabase.functions.invoke('dispatch-campaign', {
          body: campaignData,
        });
        
        if (error) {
          console.error("Erro ao enviar para edge function:", error);
          throw error;
        }
        
        console.log("Requisição enviada com sucesso para a edge function:", data);
      } else {
        // Para disparo agendado, apenas salva no banco (webhook não é executado)
        console.log("Disparo agendado - apenas salvando no banco de dados, sem executar webhook");
      }

      setIsSuccess(true);
      toast({
        title: formData.dispatchType === 'scheduled' ? "Campanha agendada!" : "Campanha enviada!",
        description: formData.dispatchType === 'scheduled'
          ? `A campanha foi agendada para ${format(formData.data_agendamento!, "PPP 'às' HH:mm")}.`
          : "A campanha foi criada e enviada para processamento no n8n.",
      });
    } catch (error) {
      console.error('Erro ao enviar webhook:', error);
      
      let errorMessage = "Houve um problema ao processar sua solicitação. Tente novamente.";
      
      if (error instanceof Error) {
        if (error.message.includes('500')) {
          errorMessage = "Erro interno do servidor. Verifique se o webhook está configurado corretamente.";
        } else if (error.message.includes('404')) {
          errorMessage = "Webhook não encontrado. Verifique a URL do webhook.";
        } else if (error.message.includes('Failed to fetch')) {
          errorMessage = "Erro de conexão. Verifique sua internet e tente novamente.";
        }
      }
      
      toast({
        title: "Erro ao enviar campanha",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-2xl border-0 bg-card text-center">
            <CardContent className="pt-8 pb-8">
              <div className="mb-6">
                <CheckCircle className="h-16 w-16 text-primary mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">
                  {formData.dispatchType === 'scheduled' ? 'Campanha Agendada com Sucesso!' : 'Campanha Enviada com Sucesso!'}
                </h2>
                <p className="text-muted-foreground">
                  {formData.dispatchType === 'scheduled'
                    ? `Sua campanha foi agendada para ${format(formData.data_agendamento!, "PPP 'às' HH:mm")}.`
                    : 'Sua campanha foi processada e está sendo executada.'
                  }
                </p>
              </div>
              <Button 
                onClick={onBack}
                className="bg-green-600 hover:bg-green-700"
              >
                Nova Campanha
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-12 h-12 bg-card rounded-full flex items-center justify-center shadow-lg">
                <img src={adzhubMark} alt="AdzHub" className="w-8 h-8 object-contain" />
              </div>
              <h1 className="text-3xl font-bold">
                {isEditing ? 'Atualizar Campanha' : 'Resumo da Campanha'}
              </h1>
            </div>
            <p className="text-muted-foreground">
              Revise as informações antes de confirmar o disparo
            </p>
          </div>
        </div>

        <Card className="shadow-2xl border-0 bg-card backdrop-blur-sm">
          <CardHeader className="text-center pb-6 bg-primary text-primary-foreground rounded-t-lg">
            <CardTitle className="flex items-center justify-center gap-2 text-xl">
              <CheckCircle className="h-5 w-5" />
              Confirmação dos Dados
            </CardTitle>
            <CardDescription className="text-primary-foreground/90">
              Verifique se todas as informações estão corretas
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6 p-8">
            <div className="grid gap-4">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/10 border border-primary/20">
                <Database className="h-5 w-5 text-primary mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold">Nome da Instância</h3>
                  <p className="text-muted-foreground">{formData.instanceName}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/10 border border-primary/20">
                <Upload className="h-5 w-5 text-primary mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold">Arquivo CSV</h3>
                  <p className="text-muted-foreground" title={formData.csvFile?.name}>
                    {formData.csvFile?.name ? truncateFileName(formData.csvFile.name) : 'Dados colados do Excel/Sheets'}
                  </p>
                  <Badge className="mt-1">
                    {formData.csvLines} linhas identificadas
                  </Badge>
                </div>
              </div>

              {formData.columnMapping && (
                <div className="flex items-start gap-3 p-4 rounded-lg bg-accent/50 border border-accent">
                  <Database className="h-5 w-5 text-accent-foreground mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-semibold">Mapeamento de Colunas</h3>
                    <div className="space-y-1 text-sm text-muted-foreground mt-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {formData.columnMapping.mode === 'simple' ? 'Modo Simples' : 'Modo Avançado'}
                        </Badge>
                      </div>
                      <div>
                        {formData.columnMapping.nameColumn && `Nome: ${formData.columnMapping.nameColumn} | `}
                        Telefone: <strong>{formData.columnMapping.phoneColumn}</strong>
                      </div>
                      {formData.columnMapping.mode === 'advanced' && formData.columnMapping.selectedColumns && (
                        <div>
                          Colunas extras: <strong>{formData.columnMapping.selectedColumns.length}</strong>
                          {formData.columnMapping.selectedColumns.length > 0 && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {formData.columnMapping.selectedColumns
                                .filter(col => col !== formData.columnMapping.phoneColumn && col !== formData.columnMapping.nameColumn)
                                .slice(0, 3)
                                .join(', ')}
                              {formData.columnMapping.selectedColumns.length > 3 && '...'}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/10 border border-primary/20">
                <Image className="h-5 w-5 text-primary mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold">Imagem do Disparo (Opcional)</h3>
                  {imagePreviewUrl ? (
                    <>
                      <p className="text-muted-foreground mb-2" title={formData.imageFile?.name}>
                        {formData.imageFile?.name ? truncateFileName(formData.imageFile.name) : formData.imageUrl ? 'Template selecionado' : ''}
                      </p>
                      <div className="mt-2">
                        <img 
                          src={imagePreviewUrl} 
                          alt="Prévia da imagem" 
                          className="max-w-full h-32 object-cover rounded-lg border-2 border-primary/20"
                        />
                      </div>
                    </>
                  ) : (
                    <p className="text-muted-foreground italic">Nenhuma imagem selecionada</p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/10 border border-primary/20">
                <MessageSquare className="h-5 w-5 text-primary mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold">Mensagem do Disparo</h3>
                  <div className="mt-2 p-3 bg-muted rounded border-2 border-primary/20 text-foreground whitespace-pre-wrap">
                    {formData.message}
                  </div>
                </div>
              </div>

              {formData.dispatchType === 'scheduled' && formData.data_agendamento && (
                <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-100 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                  <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-semibold">Agendamento</h3>
                    <p className="text-muted-foreground flex items-center gap-2 mt-1">
                      <Clock className="h-4 w-4" />
                      {format(formData.data_agendamento, "PPP 'às' HH:mm")}
                    </p>
                    <Badge className="mt-2 bg-blue-600">
                      Disparo Agendado
                    </Badge>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-border">
              <Button 
                onClick={handleConfirmAndSend}
                disabled={isLoading}
                className="w-full h-12 text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl bg-green-600 hover:bg-green-700"
              >
                {isLoading ? (
                  "Enviando..."
                ) : (
                  <>
                    {isEditing ? (
                      <>
                        <Send className="h-5 w-5 mr-2" />
                        Confirmar Atualização
                      </>
                    ) : formData.dispatchType === 'scheduled' ? (
                      <>
                        <Clock className="h-5 w-5 mr-2" />
                        Confirmar Agendamento
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5 mr-2" />
                        Confirmar e Disparar
                      </>
                    )}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SummaryScreen;
