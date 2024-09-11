import React, { useRef } from 'react';
import { useParseCsvProduct } from '@/api/pieces';  // Import your new hook
import { ProductPiece } from '@/api/types';  // Import the Piece type
import { toast } from 'sonner';
import { Button } from '../ui/button'; // Assuming you have a Button component
import { FileSpreadsheet } from 'lucide-react';

interface CsvUploadParseProps {
  setPieces: (pieces: ProductPiece[]) => void;
}

const CsvUploadParse: React.FC<CsvUploadParseProps> = ({ setPieces }) => {
  const parseCsvMutation = useParseCsvProduct();
  const fileInputRef = useRef<HTMLInputElement | null>(null); // Use ref to access the file input

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];

      const formData = new FormData();
      formData.append('file', selectedFile);

      // Trigger the upload automatically when a file is selected
      parseCsvMutation.mutate(formData, {
        onSuccess: (pieces: ProductPiece[]) => {
          setPieces(pieces);
          toast.success('CSV processado com sucesso');
          if (fileInputRef.current) {
            fileInputRef.current.value = ''; // Clear input on success
          }
        },
        onError: () => {
          toast.error('Erro ao processar o CSV.');
          if (fileInputRef.current) {
            fileInputRef.current.value = ''; // Clear input on failure
          }
        },
      });
    }
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Trigger the hidden input on button click
    }
  };

  return (
    <div>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        ref={fileInputRef}
        className='hidden'
      />
      <Button type="button" variant="outline" onClick={handleClick}>
        <FileSpreadsheet className="h-4 w-4 mr-2" /> Importar
      </Button>
    </div>
  );
};

export default CsvUploadParse;
