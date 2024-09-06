import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import StyledDropzone from '@/components/organisms/StyledDropzone';
import { useUploadCsvProduct } from '@/api/products';

const productSchema = z.object({
  productName: z.string().min(1, 'Product name is required'),
  file: z.instanceof(File).optional(), // Optional until a file is selected
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function ProductAddCsv() {
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
  });

  const uploadCsvMutation = useUploadCsvProduct();

  const onSubmit = (data: ProductFormValues) => {
    if (!selectedFile) {
      alert('Please select a CSV file.');
      return;
    }

    const formData = new FormData();
    formData.append('product_name', data.productName);
    formData.append('file', selectedFile);

    uploadCsvMutation.mutate(formData, {
      onSuccess: () => {
        // Clear the form inputs after a successful submission
        reset(); // Reset the form fields (product name)
        setSelectedFile(undefined); // Clear the selected file
      }
    });
  };

  return (
    <div className="pt-6 px-1 space-y-6">
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

        {/* CSV File Upload Dropzone */}
        <div className="space-y-2">
          <StyledDropzone setFiles={(files) => {
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
