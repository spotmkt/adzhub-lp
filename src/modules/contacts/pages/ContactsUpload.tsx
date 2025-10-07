import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Upload, Shield, Lock, FileText, AlertTriangle, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ContactsUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [lgpdConsent, setLgpdConsent] = useState(false);
  const [dataUsageConsent, setDataUsageConsent] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validar tipo de arquivo
      const validTypes = [
        'text/csv',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ];
      
      if (!validTypes.includes(selectedFile.type) && 
          !selectedFile.name.endsWith('.csv') && 
          !selectedFile.name.endsWith('.xlsx') &&
          !selectedFile.name.endsWith('.xls')) {
        toast({
          variant: 'destructive',
          title: 'Formato inválido',
          description: 'Por favor, envie um arquivo CSV ou Excel (.xlsx, .xls)',
        });
        return;
      }

      // Validar tamanho (máximo 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (selectedFile.size > maxSize) {
        toast({
          variant: 'destructive',
          title: 'Arquivo muito grande',
          description: 'O arquivo deve ter no máximo 10MB',
        });
        return;
      }

      setFile(selectedFile);
      toast({
        title: 'Arquivo selecionado',
        description: `${selectedFile.name} (${(selectedFile.size / 1024).toFixed(2)} KB)`,
      });
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        variant: 'destructive',
        title: 'Nenhum arquivo selecionado',
        description: 'Por favor, selecione um arquivo para processar',
      });
      return;
    }

    if (!lgpdConsent || !dataUsageConsent) {
      toast({
        variant: 'destructive',
        title: 'Consentimento necessário',
        description: 'Você deve aceitar os termos de uso e proteção de dados para continuar',
      });
      return;
    }

    toast({
      title: 'Processamento iniciado',
      description: 'Enviando base de contatos para processamento...',
    });

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('lgpdConsent', String(lgpdConsent));
      formData.append('dataUsageConsent', String(dataUsageConsent));

      const response = await fetch('https://n8n-n8n.ascl7r.easypanel.host/webhook/62ce4693-eb7a-4911-8de2-0da9e0273cbe', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Erro ao processar arquivo');
      }

      toast({
        title: 'Sucesso!',
        description: 'Base de contatos processada com sucesso',
      });

      // Limpar formulário
      setFile(null);
      setLgpdConsent(false);
      setDataUsageConsent(false);
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro no processamento',
        description: 'Não foi possível processar a base de contatos. Tente novamente.',
      });
    }
  };

  return (
    <div className="h-full p-6 bg-background overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Bases de Contatos</h1>
          <p className="text-muted-foreground">
            Processe e gerencie suas bases de contatos com total segurança e conformidade com a LGPD
          </p>
        </div>

        {/* LGPD Information Alert */}
        <Alert className="border-primary/50 bg-primary/5">
          <Shield className="h-4 w-4 text-primary" />
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-semibold text-foreground">Proteção de Dados Pessoais (LGPD)</p>
              <p className="text-sm">
                Este sistema está em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018). 
                Seus dados são processados com segurança e você mantém total controle sobre eles.
              </p>
            </div>
          </AlertDescription>
        </Alert>

        {/* Upload Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload de Base de Contatos
            </CardTitle>
            <CardDescription>
              Envie um arquivo CSV ou Excel contendo sua base de contatos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* File Input */}
            <div className="space-y-2">
              <Label htmlFor="file-upload">Selecione o arquivo</Label>
              <div className="flex items-center gap-4">
                <input
                  id="file-upload"
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('file-upload')?.click()}
                  className="w-full sm:w-auto"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Escolher arquivo
                </Button>
                {file && (
                  <span className="text-sm text-muted-foreground truncate">
                    {file.name}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Formatos aceitos: CSV, XLSX, XLS (máximo 10MB)
              </p>
            </div>

            {/* Data Security Info */}
            <Alert>
              <Lock className="h-4 w-4" />
              <AlertDescription className="text-sm">
                <p className="font-semibold mb-1">Segurança dos Dados</p>
                <ul className="text-xs space-y-1 list-disc list-inside">
                  <li>Os dados são criptografados durante o upload</li>
                  <li>Processamento realizado em ambiente seguro</li>
                  <li>Nenhum dado é compartilhado com terceiros</li>
                  <li>Você pode solicitar a exclusão a qualquer momento</li>
                </ul>
              </AlertDescription>
            </Alert>

            {/* LGPD Consents */}
            <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
              <p className="text-sm font-semibold flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-primary" />
                Consentimentos Necessários (LGPD)
              </p>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="lgpd-consent"
                    checked={lgpdConsent}
                    onCheckedChange={(checked) => setLgpdConsent(checked as boolean)}
                  />
                  <div className="space-y-1">
                    <Label
                      htmlFor="lgpd-consent"
                      className="text-sm font-normal cursor-pointer leading-tight"
                    >
                      Declaro que possuo consentimento válido dos titulares dos dados para 
                      processamento desta base de contatos, conforme exigido pela LGPD
                    </Label>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="data-usage-consent"
                    checked={dataUsageConsent}
                    onCheckedChange={(checked) => setDataUsageConsent(checked as boolean)}
                  />
                  <div className="space-y-1">
                    <Label
                      htmlFor="data-usage-consent"
                      className="text-sm font-normal cursor-pointer leading-tight"
                    >
                      Concordo com o processamento dos dados exclusivamente para as finalidades 
                      informadas aos titulares, garantindo seus direitos de acesso, correção e 
                      exclusão
                    </Label>
                  </div>
                </div>
              </div>
            </div>

            {/* Information Box */}
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription className="text-sm">
                <p className="font-semibold mb-1">Direitos dos Titulares</p>
                <p className="text-xs">
                  De acordo com a LGPD, os titulares dos dados têm direito à confirmação, 
                  acesso, correção, anonimização, bloqueio, eliminação, portabilidade, 
                  informação sobre compartilhamento, revogação do consentimento e oposição ao tratamento.
                </p>
              </AlertDescription>
            </Alert>

            {/* Upload Button */}
            <Button
              onClick={handleUpload}
              disabled={!file || !lgpdConsent || !dataUsageConsent}
              className="w-full"
              size="lg"
            >
              <Upload className="h-4 w-4 mr-2" />
              Processar Base de Contatos
            </Button>
          </CardContent>
        </Card>

        {/* Footer Information */}
        <Card className="border-muted">
          <CardContent className="pt-6">
            <div className="space-y-3 text-sm text-muted-foreground">
              <p className="font-semibold text-foreground">Como funciona o processamento:</p>
              <ol className="list-decimal list-inside space-y-1 text-xs">
                <li>Você faz o upload da sua base de contatos (CSV ou Excel)</li>
                <li>O sistema valida e limpa os dados automaticamente</li>
                <li>Os dados são armazenados com criptografia</li>
                <li>Você pode visualizar, editar ou excluir os dados a qualquer momento</li>
                <li>Registros de auditoria são mantidos conforme exigido pela LGPD</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContactsUpload;
