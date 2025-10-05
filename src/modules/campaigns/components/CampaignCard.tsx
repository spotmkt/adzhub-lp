import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Calendar, MessageSquare, Users, Clock, CheckCircle, XCircle, MoreVertical, Edit2, Copy, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

// Type definition for campaign with metrics
export interface CampaignMetrics {
  total_recipients: number;
  sent_count: number;
  failed_count: number;
}

export interface CampaignWithMetrics {
  id: string;
  name: string;
  status: string;
  instance_label: string;
  message_content?: string;
  scheduled_for?: string;
  completed_at?: string;
  started_at?: string;
  created_at: string;
  metrics?: CampaignMetrics[];
}

interface CampaignCardProps {
  campaign: CampaignWithMetrics;
  onView?: (campaign: CampaignWithMetrics) => void;
  onEdit?: (campaign: CampaignWithMetrics) => void;
  onRename?: (campaign: CampaignWithMetrics, newName: string) => void;
  onDuplicate?: (campaign: CampaignWithMetrics) => void;
  onDelete?: (campaign: CampaignWithMetrics) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'draft': return 'bg-muted text-muted-foreground';
    case 'scheduled': return 'bg-primary/10 text-primary';
    case 'processing': return 'bg-accent text-accent-foreground';
    case 'completed': return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300';
    case 'cancelled': return 'bg-destructive/10 text-destructive';
    default: return 'bg-muted text-muted-foreground';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'draft': return 'Rascunho';
    case 'scheduled': return 'Agendado';
    case 'processing': return 'Processando';
    case 'completed': return 'Concluído';
    case 'cancelled': return 'Cancelado';
    default: return status;
  }
};

export const CampaignCard = React.memo(({ campaign, onView, onEdit, onRename, onDuplicate, onDelete }: CampaignCardProps) => {
  const metrics = campaign.metrics?.[0];
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(campaign.name);

  const handleNameSave = () => {
    if (editName.trim() && editName !== campaign.name && onRename) {
      onRename(campaign, editName.trim());
    }
    setIsEditing(false);
  };

  const handleNameCancel = () => {
    setEditName(campaign.name);
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameSave();
    } else if (e.key === 'Escape') {
      handleNameCancel();
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            {isEditing ? (
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onBlur={handleNameSave}
                onKeyDown={handleKeyPress}
                className="text-lg font-semibold"
                autoFocus
              />
            ) : (
              <CardTitle className="text-lg font-semibold" title={campaign.name}>
                {campaign.name || 'Sem nome'}
              </CardTitle>
            )}
            <CardDescription className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              {campaign.instance_label}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(campaign.status)}>
              {getStatusLabel(campaign.status)}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsEditing(true)}>
                  <Edit2 className="h-4 w-4 mr-2" />
                  Renomear
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDuplicate?.(campaign)}>
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicar
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete?.(campaign)}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Metrics */}
        {metrics && (
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <div>
                <div className="font-medium">{metrics.total_recipients}</div>
                <div className="text-muted-foreground">Total</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              <div>
                <div className="font-medium">{metrics.sent_count}</div>
                <div className="text-muted-foreground">Enviados</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-destructive" />
              <div>
                <div className="font-medium">{metrics.failed_count}</div>
                <div className="text-muted-foreground">Falhas</div>
              </div>
            </div>
          </div>
        )}

        {/* Scheduled/Sent time */}
        {campaign.status === 'scheduled' && campaign.scheduled_for && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            Agendado para {format(new Date(campaign.scheduled_for), 'dd/MM/yyyy HH:mm')}
          </div>
        )}
        
        {campaign.status === 'completed' && (campaign.completed_at || campaign.started_at || campaign.scheduled_for) && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            Enviado em {format(new Date(campaign.completed_at || campaign.started_at || campaign.scheduled_for || ''), 'dd/MM/yyyy HH:mm')}
          </div>
        )}

        {/* Created time */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          Criado em {format(new Date(campaign.created_at), 'dd/MM/yyyy HH:mm')}
        </div>

        {/* Message preview */}
        {campaign.message_content && (
          <div className="text-sm">
            <div className="font-medium mb-1">Mensagem:</div>
            <div className="text-muted-foreground bg-muted p-2 rounded text-xs">
              {campaign.message_content.length > 100 
                ? `${campaign.message_content.substring(0, 100)}...`
                : campaign.message_content
              }
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          {onView && (
            <Button variant="outline" size="sm" onClick={() => onView(campaign)}>
              Ver Detalhes
            </Button>
          )}
          {onEdit && campaign.status === 'draft' && (
            <Button variant="outline" size="sm" onClick={() => onEdit(campaign)}>
              Editar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

CampaignCard.displayName = 'CampaignCard';
