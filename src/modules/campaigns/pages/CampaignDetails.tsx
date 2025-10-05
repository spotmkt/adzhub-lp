import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const CampaignDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/campaigns/dashboard')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        <Card className="p-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Detalhes da Campanha
          </h1>
          <p className="text-muted-foreground">
            ID da Campanha: {id}
          </p>
        </Card>
      </div>
    </div>
  );
};

export default CampaignDetails;
