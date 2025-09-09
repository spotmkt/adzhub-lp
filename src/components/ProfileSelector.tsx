import { useState, useEffect } from 'react';
import { Check, ChevronsUpDown, User } from 'lucide-react';
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

interface ProfileSelectorProps {
  onClientSelect?: (client: Client) => void;
}

export const ProfileSelector = ({ onClientSelect }: ProfileSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClients();
    
    // Load saved client from localStorage
    const savedClientId = localStorage.getItem('selectedClientId');
    if (savedClientId) {
      const savedClient = clients.find(c => c.id === savedClientId);
      if (savedClient) {
        setSelectedClient(savedClient);
      }
    }
  }, [clients]);

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching clients:', error);
        return;
      }

      const clientsData: Client[] = data.map(client => ({
        id: client.id,
        name: client.name,
        email: client.email,
        phone: client.phone
      }));

      setClients(clientsData);
    } catch (error) {
      console.error('Failed to fetch clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClientSelect = (client: Client) => {
    setSelectedClient(client);
    localStorage.setItem('selectedClientId', client.id);
    onClientSelect?.(client);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "w-12 h-12 rounded-full transition-all duration-300",
            "hover:bg-nav-item hover:shadow-glow",
            selectedClient && "bg-nav-item-active text-primary-foreground shadow-glow-lg"
          )}
          title={selectedClient ? `Perfil: ${selectedClient.name}` : 'Selecionar Perfil'}
        >
          <User 
            className={cn(
              "h-5 w-5 transition-transform duration-300",
              selectedClient && "scale-110"
            )} 
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0" side="right" align="start">
        <Command>
          <CommandInput 
            placeholder="Pesquisar empresa..." 
            className="h-9" 
          />
          <CommandEmpty>
            {loading ? 'Carregando empresas...' : 'Nenhuma empresa encontrada.'}
          </CommandEmpty>
          <CommandGroup className="max-h-[300px] overflow-auto">
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
  );
};