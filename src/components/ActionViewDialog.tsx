import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActionCard {
  id: string;
  title: string;
  description: string;
  briefing?: string;
  date: string;
  priority?: 'high' | 'medium' | 'low';
  category?: string;
}

interface ActionViewDialogProps {
  action: ActionCard | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ActionViewDialog = ({ action, open, onOpenChange }: ActionViewDialogProps) => {
  if (!action) return null;

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return 'bg-destructive text-destructive-foreground';
      case 'medium': return 'bg-primary text-primary-foreground';
      case 'low': return 'bg-secondary text-secondary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="text-xl">{action.title}</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-6">
            {/* Header info */}
            <div className="flex flex-wrap items-center gap-2">
              {action.category && (
                <Badge variant="outline" className="text-xs">
                  {action.category}
                </Badge>
              )}
              {action.priority && (
                <Badge className={cn("text-xs", getPriorityColor(action.priority))}>
                  {action.priority}
                </Badge>
              )}
              <div className="flex items-center text-xs text-muted-foreground">
                <Calendar className="h-3 w-3 mr-1" />
                <span>{action.date}</span>
              </div>
            </div>

            {/* Description */}
            {action.description && (
              <div>
                <h4 className="font-semibold text-sm mb-2 text-foreground">
                  Descrição:
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {action.description}
                </p>
              </div>
            )}
            
            {/* Briefing */}
            {action.briefing && (
              <div>
                <h4 className="font-semibold text-sm mb-2 text-foreground">
                  Briefing:
                </h4>
                <div className="bg-muted rounded-lg p-4 max-h-96 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm text-foreground font-mono">
                    {action.briefing}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};