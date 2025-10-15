import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Search, Database, Wrench } from 'lucide-react';
import { ContactListCard } from '../components/ContactListCard';
import { ContactListDetailsDialog } from '../components/ContactListDetailsDialog';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ContactList {
  id: string;
  list_name: string;
  total_contacts: number;
  identifier_type: string;
  identifier_column: string;
  metadata_columns: string[];
  created_at: string;
  updated_at: string;
  job_id: string;
}

interface ContactJob {
  id: string;
  status: string;
  processed_contacts: number;
  total_contacts: number;
}

const ContactsLists = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [lists, setLists] = useState<ContactList[]>([]);
  const [filteredLists, setFilteredLists] = useState<ContactList[]>([]);
  const [jobs, setJobs] = useState<Record<string, ContactJob>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedList, setSelectedList] = useState<ContactList | null>(null);

  useEffect(() => {
    fetchLists();
    
    // Configurar realtime para atualizar jobs
    const channel = supabase
      .channel('contact_jobs_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'contact_upload_jobs'
        },
        () => {
          fetchJobs();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredLists(lists);
    } else {
      const filtered = lists.filter(list =>
        list.list_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredLists(filtered);
    }
  }, [searchTerm, lists]);

  const fetchLists = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('contact_lists')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const typedData = (data || []).map(list => ({
        ...list,
        metadata_columns: list.metadata_columns as string[]
      }));

      setLists(typedData);
      setFilteredLists(typedData);
      
      // Buscar jobs após carregar listas
      await fetchJobs();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro ao carregar bases',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_upload_jobs')
        .select('id, status, processed_contacts, total_contacts');

      if (error) throw error;

      const jobsMap: Record<string, ContactJob> = {};
      (data || []).forEach((job) => {
        jobsMap[job.id] = job;
      });

      setJobs(jobsMap);
    } catch (error: any) {
      console.error('Erro ao carregar jobs:', error);
    }
  };

  const handleDeleteList = async (listId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta base? Todos os contatos serão removidos.')) {
      return;
    }

    try {
      // Primeiro, deletar todos os contatos da lista
      const { error: contactsError } = await supabase
        .from('contacts')
        .delete()
        .eq('list_id', listId);

      if (contactsError) throw contactsError;

      // Depois, deletar a lista
      const { error: listError } = await supabase
        .from('contact_lists')
        .delete()
        .eq('id', listId);

      if (listError) throw listError;

      toast({
        title: 'Base excluída',
        description: 'A base de contatos foi excluída com sucesso.',
      });

      fetchLists();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro ao excluir base',
        description: error.message,
      });
    }
  };

  const handleUpdateListName = async (listId: string, newName: string) => {
    try {
      const { error } = await supabase
        .from('contact_lists')
        .update({ list_name: newName })
        .eq('id', listId);

      if (error) throw error;

      toast({
        title: 'Base atualizada',
        description: 'O nome da base foi atualizado com sucesso.',
      });

      fetchLists();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro ao atualizar base',
        description: error.message,
      });
    }
  };

  return (
    <ScrollArea className="h-screen">
      <div className="container mx-auto p-6 space-y-6 pb-20">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold">Bases de Contatos</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie suas bases de contatos importadas
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/apps/contacts/fix-metadata')}>
              <Wrench className="mr-2 h-4 w-4" />
              Corrigir Metadata
            </Button>
            <Button onClick={() => navigate('/apps/contacts/upload')}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Base
            </Button>
          </div>
        </div>

      <Alert>
        <AlertDescription className="text-sm">
          <strong>Dados não aparecem?</strong> Se os campos de metadata aparecem como "-", pode ser
          que os dados foram salvos incorretamente. Use a ferramenta "Corrigir Metadata" para resolver.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Pesquisar Bases</CardTitle>
          <CardDescription>
            Filtre suas bases de contatos por nome
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar por nome da base..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : filteredLists.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Database className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-muted-foreground">
              {searchTerm ? 'Nenhuma base encontrada' : 'Nenhuma base de contatos'}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {searchTerm
                ? 'Tente ajustar sua pesquisa'
                : 'Importe sua primeira base de contatos para começar'}
            </p>
            {!searchTerm && (
              <Button
                onClick={() => navigate('/apps/contacts/upload')}
                className="mt-4"
              >
                <Plus className="mr-2 h-4 w-4" />
                Importar Base
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredLists.map((list) => (
            <ContactListCard
              key={list.id}
              list={list}
              job={jobs[list.job_id]}
              onView={(list) => setSelectedList(list)}
              onDelete={handleDeleteList}
            />
          ))}
        </div>
      )}

        <ContactListDetailsDialog
          list={selectedList}
          open={!!selectedList}
          onOpenChange={(open) => !open && setSelectedList(null)}
          onUpdateName={handleUpdateListName}
        />
      </div>
    </ScrollArea>
  );
};

export default ContactsLists;
