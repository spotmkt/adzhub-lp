import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Send, Database } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { FormData } from '../pages/CampaignsIndex';
import { useCampaignsAuth } from '../contexts/CampaignsAuthContext';
import { supabase } from '@/integrations/supabase/client';

interface UploadFormProps {
  onSubmit: (data: FormData) => void;
  initialData?: FormData;
  isEditing?: boolean;
}

const UploadForm = ({ onSubmit, initialData, isEditing = false }: UploadFormProps) => {
  const { user } = useCampaignsAuth();
  const [instances, setInstances] = useState<Array<{ value: string; label: string }>>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchInstances = async () => {
      if (!user?.id) return;
      
      const { data } = await supabase
        .from('instances')
        .select('instance_label')
        .eq('user_id', user.id);

      if (data) {
        setInstances(data.map(i => ({ value: i.instance_label, label: i.instance_label })));
      }
    };
    fetchInstances();
  }, [user?.id]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nova Campanha</CardTitle>
        <CardDescription>Componente em desenvolvimento - funcionalidades serão adicionadas gradualmente</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Instâncias Disponíveis
            </Label>
            <p className="text-sm text-muted-foreground mt-2">
              {instances.length} instância(s) encontrada(s)
            </p>
          </div>
          <Button onClick={() => toast({ title: "Em desenvolvimento", description: "Funcionalidade completa será adicionada em breve" })}>
            <Send className="mr-2 h-4 w-4" />
            Criar Campanha
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UploadForm;
