import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const CampaignsDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-foreground">Dashboard de Campanhas</h1>
          <Button onClick={() => navigate('/campaigns')}>
            Nova Campanha
          </Button>
        </div>

        <div className="grid gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Suas Campanhas</h2>
            <p className="text-muted-foreground">
              Nenhuma campanha criada ainda. Clique em "Nova Campanha" para começar.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CampaignsDashboard;
