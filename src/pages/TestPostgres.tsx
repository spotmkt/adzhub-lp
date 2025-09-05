import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Database, Table, Users } from 'lucide-react';

const TestPostgres = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testConnection = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('https://xciubsogktecqcgafwaa.supabase.co/functions/v1/test-postgres');
      const data = await response.json();
      
      if (data.success) {
        setResult(data);
      } else {
        setError(data.message || 'Erro desconhecido');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Teste PostgreSQL</h1>
          <p className="text-muted-foreground">
            Consulta os clientes registrados no PostgreSQL externo
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Conexão PostgreSQL
            </CardTitle>
            <CardDescription>
              Teste a conexão com o banco PostgreSQL externo e visualize os dados dos clientes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={testConnection} disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Conectando...
                </>
              ) : (
                <>
                  <Database className="mr-2 h-4 w-4" />
                  Testar Conexão
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {result && (
          <div className="space-y-4">
            <Alert>
              <AlertDescription className="text-green-600 font-medium">
                ✅ {result.message}
              </AlertDescription>
            </Alert>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Table className="h-5 w-5" />
                  Tabelas Disponíveis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {result.tables?.map((table: any, index: number) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                      <Table className="h-4 w-4" />
                      <span className="font-mono text-sm">{table.table_name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Clientes Meta Accounts ({result.meta_accounts?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {result.meta_accounts && result.meta_accounts.length > 0 ? (
                  <div className="space-y-3">
                    {result.meta_accounts.map((account: any, index: number) => (
                      <div key={index} className="p-4 border rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-lg">{account.cliente}</h3>
                          <span className="text-xs text-muted-foreground">
                            ID: {account.id}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">WhatsApp:</span> {account.whatsapp || 'N/A'}
                          </div>
                          <div>
                            <span className="font-medium">Site:</span> {account.url_site || 'N/A'}
                          </div>
                          <div>
                            <span className="font-medium">Instagram:</span> {account.ig_username || 'N/A'}
                          </div>
                          <div>
                            <span className="font-medium">Domínio:</span> {account.dominio || 'N/A'}
                          </div>
                        </div>
                        {account.created_at && (
                          <div className="text-xs text-muted-foreground">
                            Criado em: {new Date(account.created_at).toLocaleDateString('pt-BR')}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4" />
                    <p>Nenhum cliente encontrado na tabela meta_accounts</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestPostgres;