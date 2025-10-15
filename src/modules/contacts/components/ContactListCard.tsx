import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Trash2, Users, Calendar, Tag } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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

interface ContactListCardProps {
  list: ContactList;
  onView: (list: ContactList) => void;
  onDelete: (listId: string) => void;
}

export const ContactListCard = ({ list, onView, onDelete }: ContactListCardProps) => {
  const identifierTypeLabel = {
    email: 'E-mail',
    phone: 'Telefone',
    cpf: 'CPF',
    other: 'Outro',
  }[list.identifier_type] || list.identifier_type;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg truncate">{list.list_name}</CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <Calendar className="h-3 w-3" />
              <span className="text-xs">
                {formatDistanceToNow(new Date(list.created_at), {
                  addSuffix: true,
                  locale: ptBR,
                })}
              </span>
            </CardDescription>
          </div>
          <Badge variant="secondary" className="ml-2 flex-shrink-0">
            <Tag className="h-3 w-3 mr-1" />
            {identifierTypeLabel}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Total de contatos</span>
          </div>
          <span className="font-semibold text-lg">{list.total_contacts.toLocaleString('pt-BR')}</span>
        </div>

        {list.metadata_columns.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground font-medium">Campos Adicionais:</p>
            <div className="flex flex-wrap gap-1">
              {list.metadata_columns.slice(0, 3).map((col) => (
                <Badge key={col} variant="outline" className="text-xs">
                  {col}
                </Badge>
              ))}
              {list.metadata_columns.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{list.metadata_columns.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onView(list)}
          >
            <Eye className="h-4 w-4 mr-1" />
            Visualizar
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(list.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
