import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CSVPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  csvData: string[][];
}

const CSVPreviewModal = ({ isOpen, onClose, csvData }: CSVPreviewModalProps) => {
  if (!csvData || csvData.length === 0) {
    return null;
  }

  const headers = csvData[0] || [];
  const rows = csvData.slice(1);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-dark-primary">
            Prévia do Arquivo CSV
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[60vh] w-full rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-orange-50">
                {headers.map((header, index) => (
                  <TableHead key={index} className="font-semibold text-dark-primary">
                    {header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, rowIndex) => (
                <TableRow key={rowIndex} className="hover:bg-gray-50">
                  {row.map((cell, cellIndex) => (
                    <TableCell key={cellIndex} className="text-sm">
                      {cell}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
        
        <div className="text-sm text-gray-600 mt-4">
          <strong>Total:</strong> {rows.length} linhas de dados (excluindo cabeçalho)
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CSVPreviewModal;
