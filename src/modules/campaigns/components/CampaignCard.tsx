import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MoreVertical, 
  Eye, 
  Edit, 
  Copy, 
  Trash2, 
  FileText,
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  XCircle,
  Loader2,
  Image as ImageIcon
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface CampaignCardProps {
  campaign: any;
  onView: (campaign: any) => void;
  onEdit: (campaign: any) => void;
  onRename: (campaign: any, newName: string) => void;
  onDuplicate: (campaign: any) => void;
  onDelete: (campaign: any) => void;
}

export const CampaignCard: React.FC<CampaignCardProps> = ({
  campaign,
  onView,
  onEdit,
  onRename,
  onDuplicate,
  onDelete,
}) => {
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [newName, setNewName] = useState(campaign.name);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { label: 'Rascunho', variant: 'secondary' as const, icon: FileText },
      scheduled: { label: 'Agendada', variant: 'default' as const, icon: Calendar },
      processing: { label: 'Enviando', variant: 'default' as const, icon: Loader2 },
      completed: { label: 'Concluída', variant: 'default' as const, icon: CheckCircle2 },
      cancelled: { label: 'Cancelada', variant: 'destructive' as const, icon: XCircle },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className={`h-3 w-3 ${status === 'processing' ? 'animate-spin' : ''}`} />
        {config.label}
      </Badge>
    );
  };

  const handleRename = () => {
    onRename(campaign, newName);
    setRenameDialogOpen(false);
  };

  const getCampaignDate = () => {
    if (campaign.status === 'completed' && campaign.completed_at) {
      return format(new Date(campaign.completed_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
    } else if (campaign.status === 'scheduled' && campaign.scheduled_for) {
      return format(new Date(campaign.scheduled_for), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
    } else {
      return format(new Date(campaign.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
    }
  };

  const recipientsCount = campaign.recipients?.length || 0;
  const sentCount = campaign.recipients?.filter((r: any) => r.status === 'sent').length || 0;
  const failedCount = campaign.recipients?.filter((r: any) => r.status === 'failed').length || 0;

  return (
    <>
      <Card className="hover:shadow-lg transition-all duration-200 group">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0 pr-2">
              <CardTitle className="text-lg truncate mb-2">
                {campaign.name}
              </CardTitle>
              {getStatusBadge(campaign.status)}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onView(campaign)}>
                  <Eye className="h-4 w-4 mr-2" />
                  Ver Detalhes
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(campaign)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setRenameDialogOpen(true)}>
                  <FileText className="h-4 w-4 mr-2" />
                  Renomear
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDuplicate(campaign)}>
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicar
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => onDelete(campaign)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-2" />
            {getCampaignDate()}
          </div>

          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="h-4 w-4 mr-2" />
            {recipientsCount} destinatários
            {campaign.status === 'completed' && (
              <span className="ml-2">
                ({sentCount} enviados, {failedCount} falhas)
              </span>
            )}
          </div>

          {campaign.has_image && (
            <div className="flex items-center text-sm text-muted-foreground">
              <ImageIcon className="h-4 w-4 mr-2" />
              Com imagem
            </div>
          )}

          <div className="pt-2">
            <p className="text-sm text-muted-foreground line-clamp-2">
              {campaign.message_content || 'Sem mensagem'}
            </p>
          </div>

          <Button 
            variant="outline" 
            size="sm" 
            className="w-full mt-2"
            onClick={() => onView(campaign)}
          >
            <Eye className="h-4 w-4 mr-2" />
            Ver Detalhes
          </Button>
        </CardContent>
      </Card>

      {/* Rename Dialog */}
      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Renomear Campanha</DialogTitle>
            <DialogDescription>
              Digite o novo nome para a campanha
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Campanha</Label>
              <Input
                id="name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Digite o novo nome..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleRename}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
