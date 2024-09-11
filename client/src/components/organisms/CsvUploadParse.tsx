import React, { useState } from 'react';
import { useParseCsvProduct } from '@/api/pieces';  // Import your new hook
import { ProductPiece } from '@/api/types';  // Import the Piece type
import { toast } from 'sonner';
import { Button } from '../ui/button';

// Define the component prop types
interface CsvUploadParseProps {
  setPieces: (pieces: ProductPiece[]) => void;
}

const CsvUploadParse: React.FC<CsvUploadParseProps> = ({ setPieces }) => {
  const [file, setFile] = useState<File | null>(null);
  const parseCsvMutation = useParseCsvProduct();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (file) {
      const formData = new FormData();
      formData.append('file', file); 
      parseCsvMutation.mutate(formData, {
        onSuccess: (pieces: ProductPiece[]) => {
          setPieces(pieces); 
          toast.success('CSV processado com sucesso');
        },
        onError: () => {
          toast.error('Erro ao processar o CSV.');
        },
      });
    } else {
      toast.error('Por favor, selecione um arquivo CSV.');
    }
  };

  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <Button type='button' onClick={handleUpload} disabled={parseCsvMutation.isPending}>
        {parseCsvMutation.isPending ? 'Processando...' : 'Enviar CSV'}
      </Button>
    </div>
  );
};

export default CsvUploadParse;
