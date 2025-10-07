import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Info } from 'lucide-react';
import { useState, useEffect } from 'react';

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
  const [selectedColumns, setSelectedColumns] = useState<Set<string>>(new Set());

  // Initialize all columns as selected when dialog opens
  useEffect(() => {
    if (open && columns.length > 0) {
      setSelectedColumns(new Set(columns));
    }
  }, [open, columns]);

  const toggleColumn = (column: string) => {
    const newSelected = new Set(selectedColumns);
    if (newSelected.has(column)) {
      newSelected.delete(column);
    } else {
      newSelected.add(column);
    }
    setSelectedColumns(newSelected);
  };

  const availableMetadataColumns = columns.filter(col => col !== identifierColumn);

  const handleConfirm = () => {
    if (!identifierColumn) {
      return;
    }

    const metadataColumns = columns.filter(col => 
      col !== identifierColumn && selectedColumns.has(col)
    );

    onConfirm({
      identifierColumn,
      identifierType,
      metadataColumns,
    });
  };

  const handleClose = () => {
    setIdentifierColumn('');
    setIdentifierType('phone');
    setSelectedColumns(new Set());
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="text-2xl font-semibold">Mapeamento de Colunas</DialogTitle>
          <DialogDescription className="text-base mt-2">
            Configure como os dados do arquivo <span className="font-semibold text-foreground">{fileName}</span> devem ser interpretados
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-6 space-y-6">
          {/* Alert informativo */}
          <Alert className="bg-muted/50 border-muted-foreground/20">
            <Info className="h-5 w-5 text-muted-foreground" />
            <AlertDescription className="text-sm ml-2 leading-relaxed">
              Selecione qual coluna contém o identificador principal (telefone ou e-mail). 
              As demais colunas serão enviadas como metadados adicionais.
            </AlertDescription>
          </Alert>

          {/* Campos de configuração */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tipo de Identificador */}
            <div className="space-y-3">
              <Label htmlFor="identifier-type" className="text-base font-medium">
                Tipo de Identificador *
              </Label>
              <Select value={identifierType} onValueChange={(value: 'phone' | 'email') => setIdentifierType(value)}>
                <SelectTrigger id="identifier-type" className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="phone">Telefone</SelectItem>
                  <SelectItem value="email">E-mail</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Coluna Identificadora */}
            <div className="space-y-3">
              <Label htmlFor="identifier-column" className="text-base font-medium">
                Coluna do Identificador ({identifierType === 'phone' ? 'Telefone' : 'E-mail'}) *
              </Label>
              <Select value={identifierColumn} onValueChange={setIdentifierColumn}>
                <SelectTrigger id="identifier-column" className="h-11">
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
          </div>

          {/* Seleção de colunas para metadados */}
          {identifierColumn && availableMetadataColumns.length > 0 && (
            <div className="space-y-3">
              <Label className="text-base font-medium">
                Selecione as colunas que deseja processar como metadados
              </Label>
              <div className="border rounded-lg p-4 bg-muted/30 space-y-3 max-h-48 overflow-y-auto">
                {availableMetadataColumns.map((column) => (
                  <div key={column} className="flex items-center space-x-3">
                    <Checkbox
                      id={`col-${column}`}
                      checked={selectedColumns.has(column)}
                      onCheckedChange={() => toggleColumn(column)}
                    />
                    <label
                      htmlFor={`col-${column}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {column}
                    </label>
                  </div>
                ))}
              </div>
              <Alert className="bg-primary/5 border-primary/30">
                <Info className="h-5 w-5 text-primary" />
                <AlertDescription className="ml-2">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">{availableMetadataColumns.filter(col => selectedColumns.has(col)).length}</span> de <span className="font-semibold text-foreground">{availableMetadataColumns.length}</span> colunas selecionadas
                  </p>
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* Preview dos dados */}
          {previewData.length > 0 && (
            <div className="space-y-3">
              <Label className="text-base font-medium">Preview dos Dados (primeiras 5 linhas)</Label>
              <div className="border rounded-lg overflow-hidden bg-card shadow-sm">
                <div className="overflow-x-auto max-h-80">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/70 sticky top-0 z-10">
                      <tr>
                        {columns.map((column) => (
                          <th
                            key={column}
                            className="px-4 py-3 text-left font-semibold text-foreground border-b whitespace-nowrap"
                          >
                            <div className="flex items-center gap-2">
                              {column}
                              {column === identifierColumn && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                                  ID
                                </span>
                              )}
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {previewData.slice(0, 5).map((row, rowIndex) => (
                        <tr key={rowIndex} className="hover:bg-muted/30 transition-colors">
                          {row.map((cell, cellIndex) => (
                            <td
                              key={cellIndex}
                              className="px-4 py-3 text-muted-foreground whitespace-nowrap"
                            >
                              {cell || <span className="text-muted-foreground/50">-</span>}
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
        </div>

        <DialogFooter className="pt-4 border-t">
          <Button variant="outline" onClick={handleClose} className="min-w-[100px]">
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={!identifierColumn} className="min-w-[180px]">
            Confirmar Mapeamento
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
