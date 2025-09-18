import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, Palette } from 'lucide-react';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  children: React.ReactNode;
}

const presetColors = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
  '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#F4D03F',
  '#A569BD', '#5DADE2', '#58D68D', '#F5B041', '#EC7063'
];

const recentColors = [
  '#2563EB', '#7C3AED', '#DC2626', '#059669', '#D97706',
  '#4338CA', '#9333EA', '#B91C1C', '#047857', '#B45309'
];

export function ColorPicker({ color, onChange, children }: ColorPickerProps) {
  const [inputColor, setInputColor] = useState(color);
  const [isOpen, setIsOpen] = useState(false);

  const handleColorChange = (newColor: string) => {
    setInputColor(newColor);
    onChange(newColor);
  };

  const handleInputChange = (value: string) => {
    setInputColor(value);
    if (value.match(/^#[0-9A-Fa-f]{6}$/)) {
      onChange(value);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" side="bottom" align="start">
        <div className="p-4 space-y-4">
          <div className="flex items-center space-x-2">
            <Palette className="h-4 w-4" />
            <Label className="text-sm font-medium">Seletor de Cor</Label>
          </div>

          <Tabs defaultValue="solid" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="solid">Cor Sólida</TabsTrigger>
              <TabsTrigger value="presets">Predefinidas</TabsTrigger>
            </TabsList>
            
            <TabsContent value="solid" className="space-y-4">
              {/* Color Picker Area */}
              <div className="relative">
                <div 
                  className="w-full h-32 rounded-lg border-2 border-border cursor-crosshair relative overflow-hidden"
                  style={{
                    background: `linear-gradient(to right, white, ${inputColor}), linear-gradient(to bottom, transparent, black)`
                  }}
                >
                  <input
                    type="color"
                    value={inputColor}
                    onChange={(e) => handleColorChange(e.target.value)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-crosshair"
                  />
                </div>
              </div>

              {/* Hue Slider */}
              <div className="relative">
                <div className="w-full h-3 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-cyan-500 via-blue-500 via-purple-500 to-red-500 cursor-pointer">
                  <input
                    type="range"
                    min="0"
                    max="360"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => {
                      const hue = e.target.value;
                      const hslColor = `hsl(${hue}, 70%, 50%)`;
                      // Convert HSL to HEX (simplified)
                      const tempDiv = document.createElement('div');
                      tempDiv.style.color = hslColor;
                      document.body.appendChild(tempDiv);
                      const computedColor = getComputedStyle(tempDiv).color;
                      document.body.removeChild(tempDiv);
                      // This is a simplified approach, you might want to use a proper color conversion library
                    }}
                  />
                </div>
              </div>

              {/* Color Input */}
              <div className="flex items-center space-x-2">
                <div 
                  className="w-8 h-8 rounded border-2 border-border flex-shrink-0"
                  style={{ backgroundColor: inputColor }}
                />
                <Input
                  value={inputColor}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder="#000000"
                  className="font-mono text-sm"
                  maxLength={7}
                />
                <Button
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="flex-shrink-0"
                >
                  <Check className="h-4 w-4" />
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="presets" className="space-y-4">
              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                    Cores Populares
                  </Label>
                  <div className="grid grid-cols-10 gap-1 mt-2">
                    {presetColors.map((presetColor, index) => (
                      <button
                        key={index}
                        className="w-6 h-6 rounded border border-border hover:scale-110 transition-transform"
                        style={{ backgroundColor: presetColor }}
                        onClick={() => {
                          handleColorChange(presetColor);
                          setIsOpen(false);
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                    Usadas Recentemente
                  </Label>
                  <div className="grid grid-cols-10 gap-1 mt-2">
                    {recentColors.map((recentColor, index) => (
                      <button
                        key={index}
                        className="w-6 h-6 rounded border border-border hover:scale-110 transition-transform"
                        style={{ backgroundColor: recentColor }}
                        onClick={() => {
                          handleColorChange(recentColor);
                          setIsOpen(false);
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </PopoverContent>
    </Popover>
  );
}