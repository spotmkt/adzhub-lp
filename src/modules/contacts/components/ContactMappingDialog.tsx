import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { useState } from 'react';

interface ContactMappingDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (mapping: {
    identifierColumn: string;
    identifierType: 'phone' | 'email';
    metadataColumns: string[];
  }) => void;
  columns: string[];
  previewData: string[][];
  fileName: string;
}

export const ContactMappingDialog = ({
  open,
  onClose,
  onConfirm,
  columns,
  previewData,
  fileName,
}: ContactMappingDialogProps) => {
  const [identifierColumn, setIdentifierColumn] = useState<string>('');
  const [identifierType, setIdentifierType] = useState<'phone' | 'email'>('phone');

  const handleConfirm = () => {
    if (!identifierColumn) {
      return;
    }

    const metadataColumns = columns.filter(col => col !== identifierColumn);

    onConfirm({
      identifierColumn,
      identifierType,
      metadataColumns,
    });
  };

  const handleClose = () => {
    setIdentifierColumn('');
    setIdentifierType('phone');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Mapeamento de Colunas</DialogTitle>
          <DialogDescription>
            Configure como os dados do arquivo <span className="font-semibold">{fileName}</span> devem ser interpretados
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Alert informativo */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="text-sm">
              Selecione qual coluna contém o identificador principal (telefone ou e-mail). 
              As demais colunas serão enviadas como metadados adicionais.
            </AlertDescription>
          </Alert>

          {/* Tipo de Identificador */}
          <div className="space-y-2">
            <Label htmlFor="identifier-type">Tipo de Identificador *</Label>
            <Select value={identifierType} onValueChange={(value: 'phone' | 'email') => setIdentifierType(value)}>
              <SelectTrigger id="identifier-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="phone">Telefone</SelectItem>
                <SelectItem value="email">E-mail</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Coluna Identificadora */}
          <div className="space-y-2">
            <Label htmlFor="identifier-column">
              Coluna do Identificador ({identifierType === 'phone' ? 'Telefone' : 'E-mail'}) *
            </Label>
            <Select value={identifierColumn} onValueChange={setIdentifierColumn}>
              <SelectTrigger id="identifier-column">
                <SelectValue placeholder="Selecione a coluna" />
              </SelectTrigger>
              <SelectContent>
                {columns.map((column) => (
                  <SelectItem key={column} value={column}>
                    {column}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Preview dos dados */}
          {previewData.length > 0 && (
            <div className="space-y-2">
              <Label>Preview dos Dados (primeiras 5 linhas)</Label>
              <div className="border rounded-lg overflow-hidden">
                <div className="overflow-x-auto max-h-64">
                  <table className="w-full text-sm">
                    <thead className="bg-muted sticky top-0">
                      <tr>
                        {columns.map((column) => (
                          <th
                            key={column}
                            className="px-4 py-2 text-left font-semibold border-b"
                          >
                            {column}
                            {column === identifierColumn && (
                              <span className="ml-2 text-xs text-primary">
                                (ID)
                              </span>
                            )}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.slice(0, 5).map((row, rowIndex) => (
                        <tr key={rowIndex} className="border-b last:border-b-0">
                          {row.map((cell, cellIndex) => (
                            <td
                              key={cellIndex}
                              className="px-4 py-2 border-r last:border-r-0"
                            >
                              {cell || '-'}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Informação sobre metadados */}
          {identifierColumn && (
            <Alert className="bg-primary/5 border-primary/20">
              <Info className="h-4 w-4 text-primary" />
              <AlertDescription className="text-sm">
                <p className="font-semibold mb-1">Colunas que serão enviadas como metadados:</p>
                <p className="text-xs">
                  {columns.filter(col => col !== identifierColumn).join(', ') || 'Nenhuma'}
                </p>
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={!identifierColumn}>
            Confirmar Mapeamento
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
