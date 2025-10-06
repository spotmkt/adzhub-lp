import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, RefreshCw, ExternalLink } from 'lucide-react';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';

interface AppOutputWidgetProps {
  appId: number;
  appName: string;
  data: any;
  onAction?: (action: string, data?: any) => void;
}

export const AppOutputWidget = ({ appId, appName, data, onAction }: AppOutputWidgetProps) => {
  // Render different widgets based on app type
  const renderWidget = () => {
    switch (appId) {
      case 10: // Editor de Imagens
        return (
          <Card className="w-full max-w-lg">
            <CardContent className="p-3 space-y-3">
              {data.beforeImage && data.afterImage && (
                <div className="relative w-full max-h-[300px] rounded-lg overflow-hidden">
                  <ReactCompareSlider
                    itemOne={
                      <ReactCompareSliderImage
                        src={data.beforeImage}
                        alt="Imagem original"
                        style={{ objectFit: 'contain', maxHeight: '300px' }}
                      />
                    }
                    itemTwo={
                      <ReactCompareSliderImage
                        src={data.afterImage}
                        alt="Imagem editada"
                        style={{ objectFit: 'contain', maxHeight: '300px' }}
                      />
                    }
                  />
                </div>
              )}

              {data.result && !data.beforeImage && (
                <div className="w-full max-h-[300px] flex items-center justify-center">
                  <img 
                    src={data.result} 
                    alt="Resultado" 
                    className="max-w-full max-h-[300px] object-contain rounded-lg"
                  />
                </div>
              )}

              <div className="flex gap-2 justify-end">
                {data.downloadUrl && (
                  <Button
                    onClick={() => {
                      const a = document.createElement('a');
                      a.href = data.downloadUrl;
                      a.download = data.fileName || 'edited-image.png';
                      a.click();
                    }}
                    variant="outline"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Baixar
                  </Button>
                )}
                <Button
                  onClick={() => onAction?.('regenerate', data)}
                  variant="default"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Gerar Outra
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 2: // Gerador de Conteúdo
        return (
          <Card className="w-full max-w-2xl">
            <CardContent className="p-4 space-y-4">
              <div className="prose prose-sm max-w-none">
                {data.content && <div dangerouslySetInnerHTML={{ __html: data.content }} />}
              </div>
              <div className="flex gap-2 justify-end">
                {data.url && (
                  <Button
                    onClick={() => window.open(data.url, '_blank')}
                    variant="outline"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Ver Completo
                  </Button>
                )}
                <Button
                  onClick={() => onAction?.('regenerate')}
                  variant="default"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Gerar Outro
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      default:
        // Generic widget for other apps
        return (
          <Card className="w-full max-w-2xl">
            <CardContent className="p-4 space-y-4">
              <div className="text-sm">
                {typeof data === 'string' ? (
                  <p>{data}</p>
                ) : (
                  <pre className="bg-muted p-3 rounded-lg overflow-auto">
                    {JSON.stringify(data, null, 2)}
                  </pre>
                )}
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  onClick={() => onAction?.('close')}
                  variant="outline"
                >
                  Fechar
                </Button>
              </div>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="w-full flex justify-center py-4">
      {renderWidget()}
    </div>
  );
};
