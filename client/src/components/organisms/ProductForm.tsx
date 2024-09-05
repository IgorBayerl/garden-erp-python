import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Piece, PostProduct, PostProductPiece } from '@/api/types';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { Undo, Save, Plus, Trash2 } from 'lucide-react';
import { ComboboxPiece } from '@/components/organisms/ComboboxPiece';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ProductFormProps {
  onSubmit: (product: Omit<PostProduct, 'id'>) => void;
  initialValues?: PostProduct;
  isEditing?: boolean;
  pieces: Piece[];
}

const productSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  product_pieces: z.array(
    z.object({
      piece_id: z.number(),
      quantity: z.number().min(1, 'Quantidade deve ser pelo menos 1'),
    })
  ).nonempty('Você deve adicionar pelo menos uma peça ao produto'),
});

type ProductFormValues = z.infer<typeof productSchema>;

const ProductForm = forwardRef(({ onSubmit, initialValues, isEditing, pieces }: ProductFormProps, ref) => {
  const [selectedPiece, setSelectedPiece] = useState<Piece | null>(null);
  const [pieceQuantity, setPieceQuantity] = useState<number>(1);
  const [productPieces, setProductPieces] = useState<PostProductPiece[]>(initialValues?.product_pieces || []);

  const form = useForm<ProductFormValues>({
    // resolver: zodResolver(productSchema), // Use the zod schema to validate the form data
    defaultValues: {
      name: initialValues?.name || '',
      product_pieces: initialValues?.product_pieces || [],
    },
  });

  const { reset } = form;

  useImperativeHandle(ref, () => ({
    resetForm: () => reset({
      name: initialValues?.name || '',
      product_pieces: initialValues?.product_pieces || [],
    }),
  }));

  useEffect(() => {
    reset({
      name: initialValues?.name || '',
      product_pieces: initialValues?.product_pieces || [],
    });
    setProductPieces(initialValues?.product_pieces || []);
  }, [initialValues, reset]);

  const title = isEditing ? `Editando produto` : 'Adicionar produto';
  const buttonText = isEditing ? `Atualizar produto` : 'Adicionar produto';

  const onFormSubmit = (values: ProductFormValues) => {
    console.log('Form Submitted:', values);
    onSubmit({
      name: values.name,
      product_pieces: productPieces,
    });
  };

  const handleAddPiece = () => {
    if (selectedPiece && pieceQuantity > 0) {
      setProductPieces([...productPieces, { piece_id: selectedPiece.id, quantity: pieceQuantity }]);
      setSelectedPiece(null);
      setPieceQuantity(1);
    }
  };

  const handleRemovePiece = (index: number) => {
    setProductPieces(productPieces.filter((_, i) => i !== index));
  };

  const handleResetField = (field: keyof ProductFormValues) => {
    console.log(field);
    reset({
      name: initialValues?.name || '',
      product_pieces: initialValues?.product_pieces || [],
    });
  };

  const handleSubmit = (values: ProductFormValues) => {
    console.log('Submitting form:', values);
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <div>
        <h1 className="text-lg font-semibold md:text-2xl px-1">{title}</h1>
      </div>
      <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-8 px-1">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <div className="flex items-center space-x-2">
                <FormControl>
                  <Input title="Nome" placeholder="Nome" {...field} />
                </FormControl>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleResetField('name')}
                  type="button"
                >
                  <Undo className="h-4 w-4" />
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <h2 className="text-lg font-semibold md:text-xl px-1">Peças do Produto</h2>
          <div className="flex items-center gap-4">
            <div className="flex flex-col flex-1">
              <ComboboxPiece
                list={pieces}
                selectedPiece={selectedPiece}
                setSelectedPiece={setSelectedPiece}
              />
            </div>
            <div className="flex flex-col flex-1">
              <Input
                id="piece-quantity"
                type="number"
                value={pieceQuantity}
                min={1}
                onChange={(e) => setPieceQuantity(Number(e.target.value))}
                placeholder="Quantidade"
              />
            </div>
            <Button 
              type="button"
              onClick={handleAddPiece}
              className="self-end" 
              title="Adicionar Peça"
            >
              <Plus className="h-4 w-4 mr-2" />Adicionar
            </Button>
          </div>

          <ScrollArea className="h-full mt-4">
            <div className="flex flex-col gap-2">
              {productPieces.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded">
                  <span>{pieces.find(p => p.id === item.piece_id)?.name} - {item.quantity}</span>
                  <Button 
                    type="button"
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleRemovePiece(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        <div className="flex space-x-2">
          <Button type="submit" onClick={() => handleSubmit(form.getValues())}>
            <Save className="h-4 w-4 mr-2" />{buttonText}
          </Button>
          <Button disabled={!isEditing} variant="outline" onClick={() => reset()}>
            <Undo className="h-4 w-4 mr-2" />Cancelar
          </Button>
        </div>
      </form>
    </Form>
  );
});

export default ProductForm;