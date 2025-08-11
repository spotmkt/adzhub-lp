import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';

interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

interface ClientSelectorProps {
  onClientSelect: (client: Client) => void;
}

export const ClientSelector = ({ onClientSelect }: ClientSelectorProps) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      // Get current user - for now we'll handle the case where auth isn't implemented yet
      const { data: { user } } = await supabase.auth.getUser();
      
      let query = supabase.from('clients').select('*').order('name');
      
      // If user is authenticated, filter by user_id, otherwise get all (temporary for migration)
      if (user) {
        query = query.eq('user_id', user.id);
      }
      
      const { data, error } = await query;

      if (error) {
        console.error('Error fetching clients:', error);
        return;
      }

      setClients(data || []);
    } catch (error) {
      console.error('Failed to fetch clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectClient = () => {
    const selectedClient = clients.find(client => client.id === selectedClientId);
    if (selectedClient) {
      onClientSelect(selectedClient);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Selecione o Cliente</h1>
          <p className="text-muted-foreground">
            Escolha um cliente para iniciar o atendimento
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="client-select" className="text-sm font-medium">
              Cliente
            </label>
            <Select value={selectedClientId} onValueChange={setSelectedClientId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um cliente..." />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{client.name}</span>
                      {client.email && (
                        <span className="text-xs text-muted-foreground">{client.email}</span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={handleSelectClient}
            disabled={!selectedClientId || loading}
            className="w-full"
          >
            {loading ? 'Carregando...' : 'Iniciar Atendimento'}
          </Button>
        </div>
      </div>
    </div>
  );
};