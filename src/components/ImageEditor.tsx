import { useEffect, useRef, useState } from 'react';
import { Canvas as FabricCanvas, FabricImage, Rect } from 'fabric';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Crop, RotateCcw, Download, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ImageEditorProps {
  imageFile: File;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (croppedBlob: Blob) => void;
}

export const ImageEditor = ({ imageFile, open, onOpenChange, onSave }: ImageEditorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [cropArea, setCropArea] = useState<Rect | null>(null);
  const [originalImage, setOriginalImage] = useState<FabricImage | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !open || !imageFile) return;

    console.log('ImageEditor - Initializing canvas with image:', imageFile.name);

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 400,
      height: 400,
      backgroundColor: '#f8f9fa',
    });

    // Initialize the canvas first
    setFabricCanvas(canvas);

    // Small delay to ensure canvas is properly initialized
    setTimeout(() => {
      loadImageToCanvas(canvas, imageFile);
    }, 100);

    return () => {
      console.log('ImageEditor - Disposing canvas');
      canvas.dispose();
    };
  }, [open, imageFile]);

  const loadImageToCanvas = async (canvas: FabricCanvas, file: File) => {
    console.log('ImageEditor - Loading image to canvas:', file.name);
    
    try {
      const imageUrl = URL.createObjectURL(file);
      console.log('ImageEditor - Created blob URL:', imageUrl);
      
      const img = new Image();
      
      img.onload = () => {
        console.log('ImageEditor - Image loaded successfully, dimensions:', img.width, 'x', img.height);
        
        try {
          const fabricImg = new FabricImage(img, {
            left: 0,
            top: 0,
            selectable: false, // Make the image non-selectable so only crop area can be moved
          });
          
          const canvasWidth = canvas.width || 400;
          const canvasHeight = canvas.height || 400;
          const imageWidth = fabricImg.width || 1;
          const imageHeight = fabricImg.height || 1;
          
          console.log('ImageEditor - Canvas size:', canvasWidth, 'x', canvasHeight);
          console.log('ImageEditor - Image size:', imageWidth, 'x', imageHeight);
          
          const scaleX = canvasWidth / imageWidth;
          const scaleY = canvasHeight / imageHeight;
          const scale = Math.min(scaleX, scaleY);
          
          console.log('ImageEditor - Calculated scale:', scale);
          
          fabricImg.scale(scale);
          fabricImg.set({
            left: (canvasWidth - imageWidth * scale) / 2,
            top: (canvasHeight - imageHeight * scale) / 2
          });
          
          canvas.add(fabricImg);
          setOriginalImage(fabricImg);
          
          console.log('ImageEditor - Added image to canvas');
          
          // Add crop area (square crop for profile photos)
          const cropSize = Math.min(canvasWidth, canvasHeight) * 0.7;
          const crop = new Rect({
            left: (canvasWidth - cropSize) / 2,
            top: (canvasHeight - cropSize) / 2,
            width: cropSize,
            height: cropSize,
            fill: 'transparent',
            stroke: '#3b82f6',
            strokeWidth: 2,
            strokeDashArray: [5, 5],
            selectable: true,
            hasControls: true,
            hasBorders: true,
            lockRotation: true,
            cornerSize: 12,
            transparentCorners: false,
            cornerColor: '#3b82f6',
            borderColor: '#3b82f6',
          });
          
          canvas.add(crop);
          setCropArea(crop);
          
          console.log('ImageEditor - Added crop area');
          
          canvas.renderAll();
          console.log('ImageEditor - Canvas rendered');
          
        } catch (fabricError) {
          console.error('ImageEditor - Error creating FabricImage:', fabricError);
          toast({
            title: 'Erro',
            description: 'Erro ao processar a imagem no editor.',
            variant: 'destructive',
          });
        } finally {
          URL.revokeObjectURL(imageUrl);
        }
      };
      
      img.onerror = (error) => {
        console.error('ImageEditor - Error loading image:', error);
        toast({
          title: 'Erro',
          description: 'Erro ao carregar a imagem para edição.',
          variant: 'destructive',
        });
        URL.revokeObjectURL(imageUrl);
      };
      
      img.src = imageUrl;
    } catch (error) {
      console.error('ImageEditor - Error in loadImageToCanvas:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao carregar a imagem para edição.',
        variant: 'destructive',
      });
    }
  };

  const handleRotate = () => {
    if (originalImage) {
      const currentAngle = originalImage.angle || 0;
      originalImage.rotate(currentAngle + 90);
      fabricCanvas?.renderAll();
    }
  };

  const handleReset = () => {
    if (fabricCanvas && originalImage) {
      fabricCanvas.clear();
      loadImageToCanvas(fabricCanvas, imageFile);
    }
  };

  const handleSave = async () => {
    if (!fabricCanvas || !cropArea || !originalImage) return;

    try {
      // Get crop area bounds
      const cropBounds = cropArea.getBoundingRect();
      
      // Create a temporary canvas for cropping
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      
      if (!tempCtx) throw new Error('Could not get canvas context');
      
      // Set final image size (square for profile photos)
      const finalSize = 300;
      tempCanvas.width = finalSize;
      tempCanvas.height = finalSize;
      
      // Get the main canvas as image data
      const canvasDataUrl = fabricCanvas.toDataURL({
        format: 'png',
        quality: 1,
        multiplier: 1,
      });
      
      const mainImg = new Image();
      mainImg.onload = () => {
        // Calculate scale factors
        const scaleX = mainImg.width / (fabricCanvas.width || 400);
        const scaleY = mainImg.height / (fabricCanvas.height || 400);
        
        // Draw cropped area to temp canvas
        tempCtx.drawImage(
          mainImg,
          cropBounds.left * scaleX,
          cropBounds.top * scaleY,
          cropBounds.width * scaleX,
          cropBounds.height * scaleY,
          0,
          0,
          finalSize,
          finalSize
        );
        
        // Convert to blob
        tempCanvas.toBlob((blob) => {
          if (blob) {
            onSave(blob);
            onOpenChange(false);
            toast({
              title: 'Sucesso',
              description: 'Imagem editada com sucesso!',
            });
          }
        }, 'image/jpeg', 0.9);
      };
      
      mainImg.src = canvasDataUrl;
    } catch (error) {
      console.error('Error saving cropped image:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao salvar a imagem editada.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crop className="h-5 w-5" />
            Editor de Imagem
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="relative border-2 border-dashed border-border rounded-lg overflow-hidden">
            <canvas 
              ref={canvasRef} 
              className="max-w-full"
            />
          </div>
          
          <div className="text-sm text-muted-foreground text-center">
            Mova e redimensione a área de corte azul para enquadrar sua imagem
          </div>
          
          <div className="flex justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRotate}
              title="Girar 90°"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              title="Resetar"
            >
              <X className="h-4 w-4" />
            </Button>
            
            <Button
              onClick={handleSave}
              size="sm"
              className="flex-1"
            >
              <Download className="h-4 w-4 mr-2" />
              Salvar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};