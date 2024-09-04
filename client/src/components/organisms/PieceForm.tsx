import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Piece } from '@/api/types';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

interface PieceFormProps {
  onSubmit: (piece: Omit<Piece, 'id'>) => void;
  initialValues?: Piece;
  isEditing?: boolean;
}

const pieceSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  sizeX: z.preprocess((val) => Number(val), z.number().positive('Comprimento deve ser positivo')),
  sizeY: z.preprocess((val) => Number(val), z.number().positive('Largura deve ser positivo')),
  sizeZ: z.preprocess((val) => Number(val), z.number().positive('Espessura deve ser positivo')),
});

type PieceFormValues = z.infer<typeof pieceSchema>;

export default function PieceForm({ onSubmit, initialValues, isEditing }: PieceFormProps) {
  const form = useForm<PieceFormValues>({
    resolver: zodResolver(pieceSchema),
    defaultValues: {
      name: initialValues?.name || '',
      sizeX: initialValues?.sizeX || 1,
      sizeY: initialValues?.sizeY || 1,
      sizeZ: initialValues?.sizeZ || 1,
    },
  });

  const onFormSubmit = (values: PieceFormValues) => {
    onSubmit(values);
  };

  const title = isEditing ? `Editando peça` : 'Adicionar peça';
  const subText = initialValues?.name
  const buttonText = isEditing ? `Atualizar peça` : 'Adicionar peça';

  return (
    <Form {...form}>
      <div>
        <h1 className="text-lg font-semibold md:text-2xl">{title}</h1>
        <h3>{subText}</h3>
      </div>
      <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-8 px-1">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Enter name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sizeX"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Comprimento</FormLabel>
              <FormControl>
                <Input type="number" min={1} placeholder="Comprimento" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sizeY"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Largura</FormLabel>
              <FormControl>
                <Input type="number" min={1} placeholder="Largura" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sizeZ"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Espessura</FormLabel>
              <FormControl>
                <Input type="number" min={1} placeholder="Espessura" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">
          {buttonText}
        </Button>
      </form>
    </Form>
  );
}
