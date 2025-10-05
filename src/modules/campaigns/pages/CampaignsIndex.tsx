import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Database, Upload, Image, MessageSquare, Calendar, Send, FileUp, ClipboardPaste } from 'lucide-react';
import { useCampaignsAuth } from '../contexts/CampaignsAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { ImageTemplateSelectorV2 } from '../components/ImageTemplateSelectorV2';
import { MessageTemplateSelectorV2 } from '../components/MessageTemplateSelectorV2';
import RichTextEditor from '../components/RichTextEditor';
import ColumnMappingModal from '../components/ColumnMappingModal';
import SummaryScreen from '../components/SummaryScreen';
import { readFile, extractMappedData } from '../utils/fileReader';
import { format } from 'date-fns';

export interface FormData {
  instanceName: string;
  csvFile: File | null;
  csvLines: number;
  imageFile: File | null;
  imageUrl: string;
  message: string;
  data_agendamento: Date;
  dispatchType: 'instant' | 'scheduled';
  campaignName?: string;
  selectedImageTemplate?: any;
  columnMapping?: { nameColumn: string; phoneColumn: string; mode: 'simple' | 'advanced'; selectedColumns?: string[] };
  mappedData?: any[];
  isScheduled?: boolean;
  editingCampaignId?: string;
}

const CampaignsIndex = () => {
  const { user, isAuthenticated } = useCampaignsAuth();
  const { toast } = useToast();
  const [showSummary, setShowSummary] = useState(false);

  // Form state
  const [instances, setInstances] = useState<any[]>([]);
  const [selectedInstance, setSelectedInstance] = useState<string>('');
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [pastedData, setPastedData] = useState<string>('');
  const [uploadMethod, setUploadMethod] = useState<'file' | 'paste'>('file');
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [csvLines, setCsvLines] = useState<number>(0);
  const [columnMapping, setColumnMapping] = useState<any>(null);
  const [showMappingModal, setShowMappingModal] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [selectedImageTemplate, setSelectedImageTemplate] = useState<any>(null);
  const [message, setMessage] = useState<string>('');
  const [dispatchType, setDispatchType] = useState<'instant' | 'scheduled'>('instant');
  const [scheduledDate, setScheduledDate] = useState<string>('');
  const [scheduledTime, setScheduledTime] = useState<string>('');
  const [mappedData, setMappedData] = useState<any[]>([]);

  // Fetch instances
  useEffect(() => {
    const fetchInstances = async () => {
      if (!user?.id) return;

      const { data, error } = await (supabase as any)
        .from('instances')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'connected');

      if (error) {
        console.error('Erro ao buscar instâncias:', error);
        toast({
          title: 'Erro ao carregar instâncias',
          description: 'Não foi possível carregar as instâncias disponíveis',
          variant: 'destructive'
        });
        return;
      }

      setInstances(data || []);
    };

    fetchInstances();
  }, [user, toast]);

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const fileData = await readFile(file);
      setCsvFile(file);
      setCsvData(fileData.data);
      setCsvHeaders(fileData.headers);
      setCsvLines(fileData.totalLines);
      setShowMappingModal(true);
    } catch (error: any) {
      toast({
        title: 'Erro ao processar arquivo',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  // Handle pasted data
  const handlePasteData = async () => {
    if (!pastedData.trim()) {
      toast({
        title: 'Dados vazios',
        description: 'Cole os dados do Excel/Sheets antes de continuar',
        variant: 'destructive'
      });
      return;
    }

    try {
      // Convert pasted data to CSV format
      const lines = pastedData.trim().split('\n');
      const data = lines.map(line => line.split('\t'));
      
      setCsvData(data);
      setCsvHeaders(data[0]);
      setCsvLines(data.length - 1);
      setShowMappingModal(true);
    } catch (error: any) {
      toast({
        title: 'Erro ao processar dados',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  // Handle column mapping confirmation
  const handleMappingConfirm = (mapping: any) => {
    setColumnMapping(mapping);
    
    try {
      const mapped = extractMappedData(
        csvData,
        mapping.nameColumn,
        mapping.phoneColumn,
        mapping.selectedColumns
      );
      setMappedData(mapped);
      toast({
        title: 'Mapeamento confirmado',
        description: `${mapped.length} contatos processados com sucesso`
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao processar dados',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  // Handle template selection
  const handleSelectTemplate = (content: string) => {
    setMessage(content);
  };

  // Handle form submission
  const handleContinue = () => {
    // Validation
    if (!selectedInstance) {
      toast({
        title: 'Instância não selecionada',
        description: 'Selecione uma instância para continuar',
        variant: 'destructive'
      });
      return;
    }

    if (!csvFile && !pastedData) {
      toast({
        title: 'Contatos não carregados',
        description: 'Faça upload de um arquivo CSV ou cole os dados',
        variant: 'destructive'
      });
      return;
    }

    if (!columnMapping) {
      toast({
        title: 'Mapeamento não configurado',
        description: 'Configure o mapeamento das colunas',
        variant: 'destructive'
      });
      return;
    }

    if (!message.trim()) {
      toast({
        title: 'Mensagem vazia',
        description: 'Digite uma mensagem para enviar',
        variant: 'destructive'
      });
      return;
    }

    if (dispatchType === 'scheduled' && (!scheduledDate || !scheduledTime)) {
      toast({
        title: 'Data/hora não informada',
        description: 'Informe a data e hora do agendamento',
        variant: 'destructive'
      });
      return;
    }

    setShowSummary(true);
  };

  const getFormData = (): FormData => {
    const scheduledDateTime = dispatchType === 'scheduled' && scheduledDate && scheduledTime
      ? new Date(`${scheduledDate}T${scheduledTime}`)
      : new Date();

    return {
      instanceName: selectedInstance,
      csvFile,
      csvLines,
      imageFile: null,
      imageUrl: selectedImageUrl || '',
      message,
      data_agendamento: scheduledDateTime,
      dispatchType,
      selectedImageTemplate,
      columnMapping,
      mappedData
    };
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Por favor, faça login para acessar as campanhas.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showSummary) {
    return <SummaryScreen formData={getFormData()} onBack={() => setShowSummary(false)} />;
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img 
              src="/lovable-uploads/acd49d0d-27bb-409a-a755-9e6bb75616fa.png" 
              alt="Adz Hub Logo" 
              className="w-10 h-10 object-contain"
            />
            <h1 className="text-3xl font-bold text-foreground">Nova Campanha WhatsApp</h1>
          </div>
          <p className="text-muted-foreground">
            Configure todos os detalhes da sua campanha de disparo em massa
          </p>
        </div>

        <Card className="shadow-lg">
          <CardContent className="p-6 space-y-6">
            {/* Instance Selection */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 font-semibold">
                <Database className="h-4 w-4 text-primary" />
                Selecionar Instância *
              </Label>
              <Select value={selectedInstance} onValueChange={setSelectedInstance}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Escolha uma instância conectada" />
                </SelectTrigger>
                <SelectContent>
                  {instances.map((instance) => (
                    <SelectItem key={instance.id} value={instance.instance_label}>
                      {instance.instance_label} - {instance.phone_number}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* CSV Upload / Paste */}
            <div className="space-y-4">
              <Label className="flex items-center gap-2 font-semibold">
                <Upload className="h-4 w-4 text-primary" />
                Carregar Contatos *
              </Label>
              
              <RadioGroup value={uploadMethod} onValueChange={(v: any) => setUploadMethod(v)} className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="file" id="file" />
                  <Label htmlFor="file" className="cursor-pointer flex items-center gap-2">
                    <FileUp className="h-4 w-4" />
                    Upload de Arquivo
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="paste" id="paste" />
                  <Label htmlFor="paste" className="cursor-pointer flex items-center gap-2">
                    <ClipboardPaste className="h-4 w-4" />
                    Colar Dados
                  </Label>
                </div>
              </RadioGroup>

              {uploadMethod === 'file' ? (
                <div className="space-y-2">
                  <Input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileUpload}
                    className="cursor-pointer"
                  />
                  {csvFile && (
                    <p className="text-sm text-muted-foreground">
                      Arquivo carregado: {csvFile.name} ({csvLines} linhas)
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <textarea
                    value={pastedData}
                    onChange={(e) => setPastedData(e.target.value)}
                    placeholder="Cole aqui os dados do Excel/Sheets (Ctrl+V)&#10;&#10;Nome    Telefone&#10;João    11999999999&#10;Maria   11988888888"
                    className="w-full min-h-32 p-3 border rounded-md resize-none font-mono text-sm"
                  />
                  <Button onClick={handlePasteData} variant="outline" size="sm">
                    Processar Dados Colados
                  </Button>
                  {csvData.length > 0 && (
                    <p className="text-sm text-muted-foreground">
                      {csvLines} linhas processadas
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Column Mapping Info */}
            {columnMapping && (
              <div className="p-4 bg-primary/10 border-primary/20 border rounded-lg">
                <p className="text-sm font-medium">
                  Mapeamento configurado: Telefone: <strong>{columnMapping.phoneColumn}</strong>
                  {columnMapping.nameColumn && `, Nome: ${columnMapping.nameColumn}`}
                </p>
              </div>
            )}

            {/* Image Template Selector */}
            <ImageTemplateSelectorV2
              selectedImageUrl={selectedImageUrl}
              selectedImageTemplate={selectedImageTemplate}
              onSelectImage={(url, template) => {
                setSelectedImageUrl(url);
                setSelectedImageTemplate(template);
              }}
            />

            {/* Message Template Selector */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 font-semibold">
                <MessageSquare className="h-4 w-4 text-primary" />
                Usar Template de Mensagem (Opcional)
              </Label>
              <MessageTemplateSelectorV2 onSelectTemplate={handleSelectTemplate} />
            </div>

            {/* Message Editor */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 font-semibold">
                <MessageSquare className="h-4 w-4 text-primary" />
                Mensagem do Disparo *
              </Label>
              <RichTextEditor
                value={message}
                onChange={setMessage}
                placeholder="Digite sua mensagem aqui... Use {nome} para personalizar"
              />
            </div>

            {/* Dispatch Type */}
            <div className="space-y-4">
              <Label className="flex items-center gap-2 font-semibold">
                <Send className="h-4 w-4 text-primary" />
                Tipo de Disparo
              </Label>
              
              <RadioGroup value={dispatchType} onValueChange={(v: any) => setDispatchType(v)} className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-accent">
                  <RadioGroupItem value="instant" id="instant" />
                  <Label htmlFor="instant" className="cursor-pointer flex-1">
                    <div className="font-medium">Disparar Agora</div>
                    <div className="text-xs text-muted-foreground">Envio imediato</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-accent">
                  <RadioGroupItem value="scheduled" id="scheduled" />
                  <Label htmlFor="scheduled" className="cursor-pointer flex-1">
                    <div className="font-medium">Agendar Disparo</div>
                    <div className="text-xs text-muted-foreground">Programar envio</div>
                  </Label>
                </div>
              </RadioGroup>

              {dispatchType === 'scheduled' && (
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="scheduled-date">Data</Label>
                    <Input
                      id="scheduled-date"
                      type="date"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      min={format(new Date(), 'yyyy-MM-dd')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="scheduled-time">Hora</Label>
                    <Input
                      id="scheduled-time"
                      type="time"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleContinue}
              className="w-full h-12 text-lg font-semibold bg-green-600 hover:bg-green-700 text-white"
            >
              <Send className="h-5 w-5 mr-2" />
              Continuar para Resumo
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Column Mapping Modal */}
      <ColumnMappingModal
        isOpen={showMappingModal}
        onClose={() => setShowMappingModal(false)}
        onConfirm={handleMappingConfirm}
        columns={csvHeaders}
        fileName={csvFile?.name || 'Dados Colados'}
        totalLines={csvLines}
        previewData={csvData}
      />
    </div>
  );
};

export default CampaignsIndex;
