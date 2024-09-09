import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import StyledDropzone from '@/components/organisms/StyledDropzone';
import { useUploadCsvProduct } from '@/api/products';

const productSchema = z.object({
  productName: z.string().min(1, 'Product name is required'),
  file: z.instanceof(File).optional(),
  image: z.instanceof(File).optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function ProductAddCsv() {
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const [pastedImage, setPastedImage] = useState<File | undefined>(undefined); // State for the pasted image
  const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
  });

  const uploadCsvMutation = useUploadCsvProduct();

  // Handle form submission
  const onSubmit = (data: ProductFormValues) => {
    if (!selectedFile) {
      alert('Please select a CSV file.');
      return;
    }

    const formData = new FormData();
    formData.append('product_name', data.productName);
    formData.append('file', selectedFile);
    if (pastedImage) formData.append('image', pastedImage); // Include the pasted image if available

    uploadCsvMutation.mutate(formData, {
      onSuccess: () => {
        reset();
        setSelectedFile(undefined);
        setPastedImage(undefined); // Clear pasted image on success
      }
    });
  };

  // Handle paste event for image
  const handlePaste = (event: React.ClipboardEvent) => {
    const items = event.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith('image')) {
        const imageFile = items[i].getAsFile();
        if (imageFile) {
          setPastedImage(imageFile);
          setValue('image', imageFile); // Set form value for the image
        }
      }
    }
  };

  // Handle image file selection via button
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPastedImage(file);
      setValue('image', file); // Set form value for the image
    }
  };

  return (
    <div className="px-1" onPaste={handlePaste}>
      <h1 className="text-xl font-semibold">Importe um produto CSV</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        
        {/* Product Name Field */}
        <div className="space-y-2">
          <label htmlFor="productName" className="block text-sm font-medium">Nome do produto</label>
          <Input
            id="productName"
            placeholder="Insira o nome do produto"
            {...register('productName')}
          />
          {errors.productName && (
            <p className="text-red-500 text-xs">{errors.productName.message}</p>
          )}
        </div>

        {/* Image Paste/Upload Field */}
        <div className="space-y-2">
          <label htmlFor="image" className="block text-sm font-medium">Imagem (Colar ou carregar)</label>
          <div className="border-2 border-dashed rounded-md p-4 h-32 flex items-center justify-center text-center">
            {pastedImage ? (
              <img
                src={URL.createObjectURL(pastedImage)}
                alt="Uploaded or Pasted"
                className="max-h-full"
              />
            ) : (
              <p>Cole uma imagem aqui ou <button
                  type="button"
                  onClick={() => document.getElementById('image-upload')?.click()}
                  className="text-blue-500 underline text-sm"
                >
                  selecione do seu computador
                </button></p>
            )}
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        </div>

        {/* CSV File Upload Dropzone */}
        <div className="space-y-2">
          <label htmlFor="csv_upload" className="block text-sm font-medium">CSV File</label>
          <StyledDropzone id="csv_upload" setFiles={(files) => {
            setSelectedFile(files[0]);
            setValue('file', files[0]); // Update form state with the file
          }} selectedFile={selectedFile} />
          {errors.file && (
            <p className="text-red-500 text-xs">Selecione um arquivo CSV</p>
          )}
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={uploadCsvMutation.isPending}>
          {uploadCsvMutation.isPending ? 'Processando...' : 'Importar produto'}
        </Button>
      </form>
    </div>
  );
}
