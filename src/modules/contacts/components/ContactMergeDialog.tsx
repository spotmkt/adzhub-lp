import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Users, AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ContactList {
  id: string;
  list_name: string;
  total_contacts: number;
  identifier_type: string;
}

interface ContactMergeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedLists: ContactList[];
  onMerge: (targetName: string, strategy: 'union' | 'deduplicate' | 'merge_metadata') => Promise<void>;
  loading: boolean;
}

export const ContactMergeDialog = ({
  open,
  onOpenChange,
  selectedLists,
  onMerge,
  loading
}: ContactMergeDialogProps) => {
  const [targetName, setTargetName] = useState('');
  const [strategy, setStrategy] = useState<'union' | 'deduplicate' | 'merge_metadata'>('deduplicate');

  const totalContacts = selectedLists.reduce((sum, list) => sum + list.total_contacts, 0);
  
  // Estimar duplicatas (aproximação grosseira de 10-15%)
  const estimatedDuplicates = strategy === 'union' ? 0 : Math.round(totalContacts * 0.12);
  const estimatedResult = strategy === 'union' ? totalContacts : totalContacts - estimatedDuplicates;

  const handleMerge = async () => {
    if (!targetName.trim()) {
      return;
    }
    await onMerge(targetName, strategy);
    setTargetName('');
  };

  const getStrategyDescription = (strat: string) => {
    switch (strat) {
      case 'union':
        return 'Mantém todos os contatos, incluindo duplicatas';
      case 'deduplicate':
        return 'Remove contatos duplicados pelo identificador';
      case 'merge_metadata':
        return 'Remove duplicatas E consolida todos os campos de metadata das bases';
      default:
        return '';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Mesclar Bases de Contatos</DialogTitle>
          <DialogDescription>
            Configure como deseja mesclar as bases selecionadas
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Bases Selecionadas */}
          <div>
            <Label className="text-sm font-medium mb-2 block">
              Bases Selecionadas ({selectedLists.length})
            </Label>
            <ScrollArea className="h-32 border rounded-md p-3">
              <div className="space-y-2">
                {selectedLists.map((list) => (
                  <div key={list.id} className="flex items-center justify-between py-1">
                    <span className="text-sm">{list.list_name}</span>
                    <Badge variant="secondary" className="text-xs">
                      <Users className="h-3 w-3 mr-1" />
                      {list.total_contacts.toLocaleString('pt-BR')}
                    </Badge>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Nome da Nova Base */}
          <div>
            <Label htmlFor="target-name">Nome da Nova Base</Label>
            <Input
              id="target-name"
              placeholder="Ex: Base Consolidada 2025"
              value={targetName}
              onChange={(e) => setTargetName(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Estratégia de Mesclagem */}
          <div>
            <Label className="mb-3 block">Estratégia de Mesclagem</Label>
            <RadioGroup value={strategy} onValueChange={(value) => setStrategy(value as any)} disabled={loading}>
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                  <RadioGroupItem value="deduplicate" id="deduplicate" className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="deduplicate" className="font-medium cursor-pointer">
                      Remover Duplicatas (Recomendado)
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      {getStrategyDescription('deduplicate')}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    ~{estimatedResult.toLocaleString('pt-BR')} contatos
                  </Badge>
                </div>

                <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                  <RadioGroupItem value="union" id="union" className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="union" className="font-medium cursor-pointer">
                      Unir Tudo
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      {getStrategyDescription('union')}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {totalContacts.toLocaleString('pt-BR')} contatos
                  </Badge>
                </div>

                <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                  <RadioGroupItem value="merge_metadata" id="merge_metadata" className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="merge_metadata" className="font-medium cursor-pointer">
                      Mesclar Campos
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      {getStrategyDescription('merge_metadata')}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    ~{estimatedResult.toLocaleString('pt-BR')} contatos
                  </Badge>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Info Alert */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              <strong>Total antes:</strong> {totalContacts.toLocaleString('pt-BR')} contatos
              {strategy !== 'union' && (
                <>
                  {' • '}
                  <strong>Estimativa de duplicatas:</strong> ~{estimatedDuplicates.toLocaleString('pt-BR')}
                </>
              )}
              {' • '}
              <strong>Resultado esperado:</strong> ~{estimatedResult.toLocaleString('pt-BR')} contatos
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button 
            onClick={handleMerge} 
            disabled={!targetName.trim() || loading}
            title={!targetName.trim() ? 'Digite um nome para a nova base' : ''}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Mesclar Bases
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
