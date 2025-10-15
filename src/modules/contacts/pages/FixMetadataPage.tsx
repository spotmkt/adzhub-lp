import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, CheckCircle, Database, Loader2 } from 'lucide-react';
import { parseMetadata } from '../utils/fixMetadataFormat';

const FixMetadataPage = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{
    total: number;
    fixed: number;
    errors: number;
  } | null>(null);

  const fixMetadata = async () => {
    setLoading(true);
    setResults(null);

    try {
      // 1. Buscar todas as listas para ter os metadata_columns
      const { data: lists, error: listsError } = await supabase
        .from('contact_lists')
        .select('id, metadata_columns');

      if (listsError) throw listsError;

      let totalFixed = 0;
      let totalErrors = 0;
      let totalProcessed = 0;

      // 2. Para cada lista, buscar e corrigir os contatos
      for (const list of lists || []) {
        const metadataColumns = list.metadata_columns as string[];

        // Buscar contatos dessa lista
        const { data: contacts, error: contactsError } = await supabase
          .from('contacts')
          .select('id, metadata')
          .eq('list_id', list.id);

        if (contactsError) {
          console.error(`Erro ao buscar contatos da lista ${list.id}:`, contactsError);
          totalErrors++;
          continue;
        }

        // Processar cada contato
        for (const contact of contacts || []) {
          totalProcessed++;

          // Verificar se metadata precisa de correção
          const currentMetadata = contact.metadata;
          
          // Se já é um objeto válido, pular
          if (
            currentMetadata &&
            typeof currentMetadata === 'object' &&
            !Array.isArray(currentMetadata) &&
            !('metadata' in currentMetadata) // Não tem estrutura aninhada
          ) {
            continue;
          }

          // Tentar parsear e corrigir
          try {
            const fixedMetadata = parseMetadata(currentMetadata, metadataColumns);

            // Atualizar no banco
            const { error: updateError } = await supabase
              .from('contacts')
              .update({ metadata: fixedMetadata })
              .eq('id', contact.id);

            if (updateError) {
              console.error(`Erro ao atualizar contato ${contact.id}:`, updateError);
              totalErrors++;
            } else {
              totalFixed++;
            }
          } catch (error) {
            console.error(`Erro ao processar contato ${contact.id}:`, error);
            totalErrors++;
          }
        }
      }

      setResults({
        total: totalProcessed,
        fixed: totalFixed,
        errors: totalErrors,
      });

      toast({
        title: 'Migração concluída',
        description: `${totalFixed} contatos foram corrigidos de ${totalProcessed} processados.`,
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro na migração',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Corrigir Formato de Metadata</h1>
        <p className="text-muted-foreground mt-1">
          Ferramenta de migração para corrigir dados de metadata salvos incorretamente
        </p>
      </div>

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Atenção:</strong> Esta ferramenta deve ser usada apenas uma vez para corrigir
          dados históricos que foram salvos com formato incorreto. Certifique-se de que o workflow
          do n8n está configurado corretamente antes de executar.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Migração de Dados
          </CardTitle>
          <CardDescription>
            Este processo irá:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Buscar todos os contatos com metadata em formato incorreto</li>
              <li>Converter strings CSV para objetos JSON</li>
              <li>Corrigir estruturas aninhadas incorretas</li>
              <li>Atualizar os registros no banco de dados</li>
            </ul>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={fixMetadata}
            disabled={loading}
            size="lg"
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processando...
              </>
            ) : (
              <>
                <Database className="mr-2 h-4 w-4" />
                Iniciar Migração
              </>
            )}
          </Button>

          {results && (
            <Alert className="border-green-500">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertDescription>
                <div className="space-y-2">
                  <p className="font-semibold">Migração concluída!</p>
                  <div className="text-sm space-y-1">
                    <p>Total de contatos processados: {results.total}</p>
                    <p className="text-green-600">✓ Contatos corrigidos: {results.fixed}</p>
                    {results.errors > 0 && (
                      <p className="text-red-600">✗ Erros encontrados: {results.errors}</p>
                    )}
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Próximos Passos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <h4 className="font-medium">1. Verificar configuração do n8n</h4>
            <p className="text-sm text-muted-foreground">
              Certifique-se de que o node "Insert Contacts" está configurado para enviar metadata
              como objeto JSON, não como string.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">2. Testar novo upload</h4>
            <p className="text-sm text-muted-foreground">
              Faça um novo upload de teste para garantir que os dados estão sendo salvos
              corretamente.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">3. Verificar visualização</h4>
            <p className="text-sm text-muted-foreground">
              Acesse "Bases de Contatos" e verifique se os dados de metadata estão sendo exibidos
              corretamente nas colunas.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FixMetadataPage;
