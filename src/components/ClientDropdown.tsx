import { useState, useEffect } from 'react';
import { Check, ChevronsUpDown, Search, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

interface ClientDropdownProps {
  selectedClient: Client | null;
  onClientSelect: (client: Client) => void;
  onExitChat: () => void;
}

export const ClientDropdown = ({ selectedClient, onClientSelect, onExitChat }: ClientDropdownProps) => {
  const [open, setOpen] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
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

  const handleClientSelect = (client: Client) => {
    onClientSelect(client);
    setOpen(false);
  };

  return (
    <div className="flex items-center gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="min-w-[300px] justify-between bg-card hover:bg-card/80"
          >
            <div className="flex flex-col items-start overflow-hidden">
              <span className="font-medium text-foreground truncate">
                {selectedClient ? `Chat - ${selectedClient.name}` : 'Selecionar Cliente'}
              </span>
              {selectedClient?.email && (
                <span className="text-xs text-muted-foreground truncate">
                  {selectedClient.email}
                </span>
              )}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="start">
          <Command>
            <CommandInput 
              placeholder="Pesquisar cliente..." 
              className="h-9" 
            />
            <CommandEmpty>
              {loading ? 'Carregando clientes...' : 'Nenhum cliente encontrado.'}
            </CommandEmpty>
            <CommandGroup className="max-h-[200px] overflow-auto">
              {clients.map((client) => (
                <CommandItem
                  key={client.id}
                  value={`${client.name} ${client.email || ''}`}
                  onSelect={() => handleClientSelect(client)}
                  className="flex items-center justify-between"
                >
                  <div className="flex flex-col flex-1 overflow-hidden">
                    <span className="font-medium truncate">{client.name}</span>
                    {client.email && (
                      <span className="text-xs text-muted-foreground truncate">
                        {client.email}
                      </span>
                    )}
                    {client.phone && (
                      <span className="text-xs text-muted-foreground truncate">
                        {client.phone}
                      </span>
                    )}
                  </div>
                  <Check
                    className={cn(
                      "ml-2 h-4 w-4 shrink-0",
                      selectedClient?.id === client.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      
      {selectedClient && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onExitChat}
          className="text-muted-foreground hover:text-foreground"
        >
          <ExternalLink className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};