import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Piece } from '@/api/types';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { forwardRef, useEffect, useImperativeHandle, useMemo } from 'react';
import { Undo, Save } from 'lucide-react';

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

const PieceForm = forwardRef(({ onSubmit, initialValues, isEditing }: PieceFormProps, ref) => {
  
  const defaultValues = useMemo(() => ({
    name: initialValues?.name || '',
    sizeX: initialValues?.sizeX || 0,
    sizeY: initialValues?.sizeY || 0,
    sizeZ: initialValues?.sizeZ || 0,
  }), [initialValues]);

  const form = useForm<PieceFormValues>({
    resolver: zodResolver(pieceSchema),
    defaultValues: defaultValues,
  });

  const { reset, setValue } = form;

  useImperativeHandle(ref, () => ({
    resetForm: () => reset(defaultValues),
  }));

  // When initial values change, reset form to default values
  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, initialValues, reset]);

  const title = isEditing ? `Editando peça` : 'Adicionar peça';
  const buttonText = isEditing ? `Atualizar peça` : 'Adicionar peça';

  const onFormSubmit = (values: PieceFormValues) => {
    onSubmit(values);
  };

  const handleResetField = (field: keyof PieceFormValues) => {
    setValue(field, initialValues ? initialValues[field] : '');
  };

  return (
    <Form {...form}>
      <div>
        <h1 className="text-lg font-semibold md:text-xl px-1 pt-6">{title}</h1>
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
                  tabIndex={-1}
                >
                  <Undo className="h-4 w-4" />
                </Button>
              </div>
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
              <div className="flex items-center space-x-2">
                <FormControl>
                  <Input type="number" title="Comprimento" placeholder="Comprimento" {...field} />
                </FormControl>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleResetField('sizeX')}
                  type="button"
                  tabIndex={-1}
                >
                  <Undo className="h-4 w-4" />
                </Button>
              </div>
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
              <div className="flex items-center space-x-2">
                <FormControl>
                  <Input type="number" title="Largura" placeholder="Largura" {...field} />
                </FormControl>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleResetField('sizeY')}
                  type="button"
                  tabIndex={-1}
                >
                  <Undo className="h-4 w-4" />
                </Button>
              </div>
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
              <div className="flex items-center space-x-2">
                <FormControl>
                  <Input type="number" title="Espessura" placeholder="Espessura" {...field} />
                </FormControl>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleResetField('sizeZ')}
                  type="button"
                  tabIndex={-1}
                >
                  <Undo className="h-4 w-4" />
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex space-x-2">
          <Button type="submit">
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

export default PieceForm;