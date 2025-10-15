import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Edit2, Save, X, Users, Calendar, Tag, Database } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { parseMetadata, formatMetadataValue, getMetadataValue } from '../utils/fixMetadataFormat';

interface ContactList {
  id: string;
  list_name: string;
  total_contacts: number;
  identifier_type: string;
  identifier_column: string;
  metadata_columns: string[];
  created_at: string;
  updated_at: string;
}

interface Contact {
  id: string;
  identifier: string;
  metadata: Record<string, any>;
  created_at: string;
}

interface ContactListDetailsDialogProps {
  list: ContactList | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateName: (listId: string, newName: string) => void;
}

export const ContactListDetailsDialog = ({
  list,
  open,
  onOpenChange,
  onUpdateName,
}: ContactListDetailsDialogProps) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalContacts, setTotalContacts] = useState(0);
  const itemsPerPage = 50;

  useEffect(() => {
    if (list) {
      setEditedName(list.list_name);
      fetchContacts();
    }
  }, [list, currentPage]);

  const fetchContacts = async () => {
    if (!list) return;

    try {
      setLoading(true);
      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;

      const { data, error, count } = await supabase
        .from('contacts')
        .select('*', { count: 'exact' })
        .eq('list_id', list.id)
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;

      const typedContacts = (data || []).map(contact => ({
        ...contact,
        metadata: contact.metadata as Record<string, any>
      }));

      setContacts(typedContacts);
      setTotalContacts(count || 0);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro ao carregar contatos',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveName = () => {
    if (!list || !editedName.trim()) return;
    onUpdateName(list.id, editedName.trim());
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedName(list?.list_name || '');
    setIsEditing(false);
  };

  const totalPages = Math.ceil(totalContacts / itemsPerPage);

  if (!list) return null;

  const identifierTypeLabel = {
    email: 'E-mail',
    phone: 'Telefone',
    cpf: 'CPF',
    other: 'Outro',
  }[list.identifier_type] || list.identifier_type;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] w-full max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            {isEditing ? (
              <div className="flex items-center gap-2 flex-1">
                <Input
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="max-w-md"
                  autoFocus
                />
                <Button size="sm" onClick={handleSaveName}>
                  <Save className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span>{list.list_name}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </DialogTitle>
          <DialogDescription>
            Detalhes e contatos da base
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
          {/* Informações da Base */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Total de Contatos</Label>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold">{list.total_contacts.toLocaleString('pt-BR')}</span>
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Tipo de Identificador</Label>
              <Badge variant="secondary">
                <Tag className="h-3 w-3 mr-1" />
                {identifierTypeLabel}
              </Badge>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Criada em</Label>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {format(new Date(list.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Coluna Identificadora</Label>
              <Badge variant="outline">{list.identifier_column}</Badge>
            </div>
          </div>

          {/* Campos de Metadata */}
          {list.metadata_columns.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm">Campos Adicionais</Label>
              <div className="flex flex-wrap gap-2">
                {list.metadata_columns.map((col) => (
                  <Badge key={col} variant="secondary">
                    {col}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Tabela de Contatos */}
          <div className="space-y-2">
            <Label className="text-sm">Contatos ({totalContacts})</Label>
            <div className="rounded-md border overflow-hidden">
              <div className="overflow-x-auto overflow-y-auto max-h-[400px]">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                  </div>
                ) : (
                  <Table>
                    <TableHeader className="sticky top-0 bg-background z-10 shadow-sm">
                      <TableRow>
                        <TableHead className="min-w-[180px] bg-background">
                          <div className="py-1 text-xs font-semibold">
                            {list.identifier_column}
                          </div>
                        </TableHead>
                        {list.metadata_columns.map((col) => (
                          <TableHead key={col} className="min-w-[180px] bg-background">
                            <div className="py-1 text-xs font-semibold line-clamp-2" title={col}>
                              {col}
                            </div>
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {contacts.map((contact) => {
                        const parsedMetadata = parseMetadata(contact.metadata, list.metadata_columns);
                        
                        return (
                          <TableRow key={contact.id}>
                            <TableCell className="font-medium">
                              <div className="max-w-[180px] truncate" title={contact.identifier}>
                                {contact.identifier}
                              </div>
                            </TableCell>
                            {list.metadata_columns.map((col) => {
                              const value = getMetadataValue(parsedMetadata, col);
                              const formattedValue = formatMetadataValue(value);
                              return (
                                <TableCell key={col}>
                                  <div 
                                    className="max-w-[180px] truncate text-sm"
                                    title={formattedValue}
                                  >
                                    {formattedValue}
                                  </div>
                                </TableCell>
                              );
                            })}
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </div>
            </div>
          </div>

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 pb-2">
              <p className="text-sm text-muted-foreground">
                Página {currentPage} de {totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Anterior
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Próxima
                </Button>
              </div>
            </div>
          )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
