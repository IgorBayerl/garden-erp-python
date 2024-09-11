import { useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { cn } from '@/lib/utils';
import { FileText } from 'lucide-react'; // CSV icon

interface StyledDropzoneProps {
  id: string;
  setFiles: (files: File[]) => void;
  selectedFile?: File;
}

export default function StyledDropzone({ id, setFiles, selectedFile }: StyledDropzoneProps) {
  const {
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    accept: { 'text/csv': [] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => setFiles(acceptedFiles), // Set files on drop
  });

  const baseClasses = 'flex flex-1 flex-col items-center p-5 border-2 border-dashed rounded-md bg-gray-100 text-gray-400 outline-none transition duration-200';
  const focusedClasses = 'border-blue-500';
  const acceptClasses = 'border-green-400';
  const rejectClasses = 'border-red-400';

  const combinedClasses = useMemo(() => {
    return cn(
      baseClasses,
      isFocused && focusedClasses,
      isDragAccept && acceptClasses,
      isDragReject && rejectClasses
    );
  }, [isFocused, isDragAccept, isDragReject]);

  return (
    <div className="container">
      <div {...getRootProps({ className: combinedClasses })}>
        <input {...getInputProps()} id={id} />	

        {/* Display the selected file, otherwise show default message */}
        {selectedFile ? (
          <div className="flex flex-col items-center">
            <FileText className="h-12 w-12 text-green-400" /> {/* CSV icon */}
            <p className="mt-2 text-gray-600">{selectedFile.name}</p> {/* File name */}
            <p className="text-sm text-gray-500">{(selectedFile.size / 1024).toFixed(2)} KB</p> {/* File size */}
          </div>
        ) : (
          <p className='text-center'>Arraste e solte um arquivo CSV aqui, ou clique para selecionar um arquivo</p>
        )}
      </div>
    </div>
  );
}
