import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const CampaignsIndex = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">Campanhas WhatsApp</h1>
          <p className="text-muted-foreground">
            Crie e gerencie suas campanhas de WhatsApp
          </p>
        </div>

        <Card className="p-8">
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Criar Nova Campanha</h2>
            <p className="text-muted-foreground">
              Configure sua campanha de disparo em massa via WhatsApp
            </p>
            <Button 
              size="lg" 
              onClick={() => navigate('/campaigns/dashboard')}
            >
              Começar
            </Button>
          </div>
        </Card>

        <div className="text-center">
          <Button 
            variant="outline" 
            onClick={() => navigate('/campaigns/dashboard')}
          >
            Ver Dashboard de Campanhas
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CampaignsIndex;
