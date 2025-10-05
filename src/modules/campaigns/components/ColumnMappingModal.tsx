import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { FileText, Users, Phone, User, Settings, Zap } from 'lucide-react';

interface ColumnMappingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCancel?: () => void;
  onConfirm: (mapping: { 
    nameColumn: string; 
    phoneColumn: string; 
    mode: 'simple' | 'advanced';
    selectedColumns?: string[];
  }) => void;
  columns: string[];
  fileName: string;
  totalLines: number;
  previewData: string[][];
}

const ColumnMappingModal = ({ 
  isOpen, 
  onClose, 
  onCancel,
  onConfirm, 
  columns, 
  fileName,
  totalLines,
  previewData 
}: ColumnMappingModalProps) => {
  const [nameColumn, setNameColumn] = useState<string>('');
  const [phoneColumn, setPhoneColumn] = useState<string>('');
  const [mode, setMode] = useState<'simple' | 'advanced'>('simple');
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);

  const handleConfirm = () => {
    if (phoneColumn) {
      const finalSelectedColumns = mode === 'advanced' 
        ? [...new Set([phoneColumn, ...(nameColumn ? [nameColumn] : []), ...selectedColumns])]
        : undefined;
      
      onConfirm({ 
        nameColumn, 
        phoneColumn, 
        mode,
        selectedColumns: finalSelectedColumns
      });
      onClose();
    }
  };

  const handleClose = () => {
    setNameColumn('');
    setPhoneColumn('');
    setMode('simple');
    setSelectedColumns([]);
    if (onCancel) {
      onCancel();
    } else {
      onClose();
    }
  };

  const handleColumnToggle = (column: string, checked: boolean) => {
    if (checked) {
      setSelectedColumns(prev => [...prev, column]);
    } else {
      setSelectedColumns(prev => prev.filter(col => col !== column));
    }
  };

  const getVisibleColumns = () => {
    if (mode === 'simple') {
      return columns.filter(col => col === nameColumn || col === phoneColumn);
    }
    
    const requiredColumns = [phoneColumn, ...(nameColumn ? [nameColumn] : [])];
    return [...new Set([...requiredColumns, ...selectedColumns])];
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" aria-describedby="dialog-description">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold text-dark-primary">
            <FileText className="h-6 w-6 text-orange-primary" />
            Mapeamento das Colunas
          </DialogTitle>
          <p id="dialog-description" className="sr-only">
            Configure como as colunas do arquivo serão mapeadas para nome e telefone dos contatos
          </p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações do arquivo */}
          <Card className="bg-orange-50 border-orange-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-orange-primary" />
                  <span className="font-medium text-dark-primary">{fileName}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{totalLines} linhas encontradas</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Toggle de Modo */}
          <Card className="border-2 border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {mode === 'simple' ? (
                      <Zap className="h-5 w-5 text-green-600" />
                    ) : (
                      <Settings className="h-5 w-5 text-blue-600" />
                    )}
                    <Label className="text-base font-semibold text-dark-primary">
                      {mode === 'simple' ? 'Modo Simples' : 'Modo Avançado'}
                    </Label>
                  </div>
                  <p className="text-sm text-gray-600">
                    {mode === 'simple' 
                      ? 'Mapear apenas Nome e Telefone (compatível com webhook atual)'
                      : 'Mapear todas as colunas desejadas (envio de dados extras)'
                    }
                  </p>
                </div>
                <Switch
                  checked={mode === 'advanced'}
                  onCheckedChange={(checked) => setMode(checked ? 'advanced' : 'simple')}
                />
              </div>
            </CardContent>
          </Card>

          {/* Mapeamento das colunas obrigatórias */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="nameColumn" className="flex items-center gap-2 text-dark-primary font-semibold">
                <User className="h-4 w-4 text-orange-primary" />
                Coluna do Nome (opcional)
              </Label>
              <Select value={nameColumn} onValueChange={setNameColumn}>
                <SelectTrigger id="nameColumn" className="h-12 border-2 border-gray-200 focus:border-orange-primary">
                  <SelectValue placeholder="Selecione a coluna do nome" />
                </SelectTrigger>
                <SelectContent>
                  {columns.map((column, index) => (
                    <SelectItem key={index} value={column}>
                      {column}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneColumn" className="flex items-center gap-2 text-dark-primary font-semibold">
                <Phone className="h-4 w-4 text-orange-primary" />
                Coluna do Telefone *
              </Label>
              <Select value={phoneColumn} onValueChange={setPhoneColumn}>
                <SelectTrigger id="phoneColumn" className="h-12 border-2 border-gray-200 focus:border-orange-primary">
                  <SelectValue placeholder="Selecione a coluna do telefone" />
                </SelectTrigger>
                <SelectContent>
                  {columns.map((column, index) => (
                    <SelectItem key={index} value={column}>
                      {column}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Seleção de colunas adicionais - Modo Avançado */}
          {mode === 'advanced' && (
            <Card className="border-2 border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="space-y-4">
                  <Label className="flex items-center gap-2 text-dark-primary font-semibold">
                    <Settings className="h-4 w-4 text-blue-600" />
                    Colunas Adicionais para Incluir
                  </Label>
                  <div className="grid grid-cols-2 gap-3 max-h-40 overflow-y-auto">
                    {columns
                      .filter(col => col !== phoneColumn && col !== nameColumn)
                      .map((column, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Checkbox
                            id={`column-${index}`}
                            checked={selectedColumns.includes(column)}
                            onCheckedChange={(checked) => handleColumnToggle(column, checked as boolean)}
                          />
                          <Label
                            htmlFor={`column-${index}`}
                            className="text-sm font-medium text-gray-700 cursor-pointer"
                          >
                            {column}
                          </Label>
                        </div>
                      ))}
                  </div>
                  <p className="text-xs text-gray-600">
                    Colunas selecionadas: {selectedColumns.length} + Nome/Telefone = {getVisibleColumns().length} total
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Preview dos dados */}
          {previewData.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-dark-primary">Prévia dos Dados</h3>
              <div className="border rounded-lg overflow-hidden">
                <div className="overflow-x-auto max-h-60">
                  <table className="w-full text-sm">
                    <thead className="bg-orange-50">
                      <tr>
                        {columns.map((column, index) => {
                          const isVisible = getVisibleColumns().includes(column);
                          const isRequired = column === phoneColumn || column === nameColumn;
                          
                          if (mode === 'simple' && !isRequired) return null;
                          
                          return (
                            <th 
                              key={index} 
                              className={`px-4 py-2 text-left font-semibold border-b ${
                                isVisible ? 'text-dark-primary bg-orange-50' : 'text-gray-400 bg-gray-100'
                              }`}
                            >
                              {column}
                              {column === nameColumn && (
                                <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">NOME</span>
                              )}
                              {column === phoneColumn && (
                                <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">TELEFONE</span>
                              )}
                              {mode === 'advanced' && selectedColumns.includes(column) && (
                                <span className="ml-2 text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">EXTRA</span>
                              )}
                            </th>
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.slice(1, 6).map((row, rowIndex) => (
                        <tr key={rowIndex} className="hover:bg-gray-50">
                          {row.map((cell, cellIndex) => {
                            const column = columns[cellIndex];
                            const isVisible = getVisibleColumns().includes(column);
                            const isRequired = column === phoneColumn || column === nameColumn;
                            
                            if (mode === 'simple' && !isRequired) return null;
                            
                            return (
                              <td 
                                key={cellIndex} 
                                className={`px-4 py-2 border-b ${
                                  isVisible ? 'text-gray-700' : 'text-gray-400'
                                }`}
                              >
                                {cell}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              {mode === 'advanced' && (
                <p className="text-xs text-gray-600">
                  💡 No modo avançado, as colunas marcadas como "EXTRA" serão incluídas nos dados enviados para o webhook
                </p>
              )}
            </div>
          )}

          {/* Botões de ação */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="px-6"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleConfirm}
              disabled={!phoneColumn}
              className="px-6 bg-orange-primary hover:bg-orange-600 text-white"
            >
              Confirmar Mapeamento
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ColumnMappingModal;
