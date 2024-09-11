import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Product, ProductPiece } from "@/api/types";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState } from "react";
import { Undo, Save, Plus, Trash } from "lucide-react";
import { convertToBase64, customZodResolver } from "@/lib/utils";
import CsvUploadParse from "./CsvUploadParse";

interface ProductFormProps {
  onSubmit: (product: Omit<Product, "id">) => void;
  initialValues?: Product;
  isEditing?: boolean;
}

const productSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  image: z.instanceof(File).optional(),
  product_pieces: z.array(
    z.object({
      piece: z.object({
        id: z.preprocess((val) => Number(val) || 0, z.number()),
        name: z.string().min(1, "Nome da peça é obrigatório"),
        sizeX: z.preprocess((val) => Number(val), z.number().positive("Comprimento deve ser positivo")),
        sizeY: z.preprocess((val) => Number(val), z.number().positive("Largura deve ser positivo")),
        sizeZ: z.preprocess((val) => Number(val), z.number().positive("Espessura deve ser positivo")),
      }),
      quantity: z.preprocess((val) => Number(val), z.number().positive("Quantidade deve ser positiva")),
    })
  ),
});

type ProductFormValues = z.infer<typeof productSchema>;

const ProductForm = forwardRef(({ onSubmit, initialValues, isEditing }: ProductFormProps, ref) => {
  const [pastedImage, setPastedImage] = useState<File | undefined>(undefined);

  const defaultValues = useMemo(() => ({
    name: initialValues?.name || "",
    image: typeof initialValues?.image === 'string' ? undefined : initialValues?.image,
    product_pieces: initialValues?.product_pieces || [],
  }), [initialValues]);

  const form = useForm<ProductFormValues>({
    resolver: customZodResolver(productSchema),
    defaultValues: defaultValues,
  });

  const { setValue, reset, control } = form

  const handlePaste = (event: React.ClipboardEvent) => {
    const items = event.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith('image')) {
        const imageFile = items[i].getAsFile();
        if (imageFile) {
          setPastedImage(imageFile);
          setValue('image', imageFile);  // Set form value for the image
        }
      }
    }
  };

  const resetValues = useCallback(() => {
    reset(defaultValues);
    setPastedImage(defaultValues.image);
  }, [defaultValues, reset]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPastedImage(file);
      setValue('image', file);  
    }
  };

  useImperativeHandle(ref, () => ({
    resetForm: () => resetValues(),
  }));

  useEffect(() => {
    resetValues()
  }, [initialValues, resetValues]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "product_pieces",  
  });

  const handleAddPiece = () => {
    append({
      piece: { id: 0, name: "", sizeX: 0, sizeY: 0, sizeZ: 0 },  
      quantity: 1,
    })
  }

  const title = isEditing ? "Editando produto" : "Adicionando produto";
  const buttonText = isEditing ? "Salvar produto" : "Adicionar produto";

  const onFormSubmit = async (values: ProductFormValues) => {
    let base64Image: string | undefined = undefined;
  
    if (values.image) {
      base64Image = await convertToBase64(values.image);
    }
  
    const productData: Omit<Product, "id"> = {
      name: values.name,
      image: base64Image, 
      product_pieces: values.product_pieces,
    };
  
    onSubmit(productData);
  };

  const setPiecesValue = (pieces: ProductPiece[]) => {
    form.setValue('product_pieces', pieces);
  };

  return (
    <Form {...form}>
      <h1 className="text-xl font-semibold px-1 ">{title}</h1>
      <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-4 flex flex-col px-1 h-full overflow-hidden ">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="line-clamp-1">Nome do produto</FormLabel>
              <FormControl>
                <Input title="Nome" placeholder="Nome" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image"
          render={() => (
            <FormItem onPaste={handlePaste}>
              <FormLabel className="block text-sm font-medium">Imagem (Colar ou carregar)</FormLabel>
              <div className="border-2 border-dashed rounded-md p-4 h-32 flex items-center justify-center text-center">
                {pastedImage ? (
                  <img
                    src={URL.createObjectURL(pastedImage)}
                    alt="Uploaded or Pasted"
                    className="max-h-full"
                  />
                ) : (
                  <p>
                    Cole uma imagem aqui ou{" "}
                    <button
                      type="button"
                      onClick={() => document.getElementById("image-upload")?.click()}
                      className="text-blue-500 underline text-sm"
                    >
                      selecione do seu computador
                    </button>
                  </p>
                )}
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </FormItem>
          )}
        />
          
        <div className="overflow-hidden flex-grow flex flex-col justify-between gap-2">

          <div className="overflow-hidden flex flex-col ">
            <div className="grid grid-cols-12 gap-4 border-b pb-2 px-1">
              <span className="font-semibold col-span-4">Nome da Peça</span> {/* Larger width for this column */}
              <span className="font-semibold col-span-1">Qtd.</span>
              <span className="font-semibold col-span-2">Comp.</span>
              <span className="font-semibold col-span-2">Larg.</span>
              <span className="font-semibold col-span-2">Esp.</span>
              <span className="font-semibold text-right mr-3 col-span-1">Ações</span> {/* Smaller width for actions */}
            </div>
            <div className="h-full overflow-y-auto min-h-0 px-1">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-12 gap-4 items-center py-2 border-b"
                >
                  {/* Column for 'Nome da Peça' */}
                  <FormField
                    control={form.control}
                    name={`product_pieces.${index}.piece.name`}
                    render={({ field }) => (
                      <FormItem className="col-span-4"> {/* Adjusted width */}
                        <FormControl>
                          <Input {...field} placeholder="Nome da Peça" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Column for 'Quantidade' */}
                  <FormField
                    control={form.control}
                    name={`product_pieces.${index}.quantity`}
                    render={({ field }) => (
                      <FormItem className="col-span-1"> {/* Adjusted width */}
                        <FormControl>
                          <Input type="number" {...field} placeholder="Quantidade" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Column for 'Comprimento' */}
                  <FormField
                    control={form.control}
                    name={`product_pieces.${index}.piece.sizeX`}
                    render={({ field }) => (
                      <FormItem className="col-span-2"> {/* Adjusted width */}
                        <FormControl>
                          <Input type="number" {...field} placeholder="Comprimento" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Column for 'Largura' */}
                  <FormField
                    control={form.control}
                    name={`product_pieces.${index}.piece.sizeY`}
                    render={({ field }) => (
                      <FormItem className="col-span-2"> {/* Adjusted width */}
                        <FormControl>
                          <Input type="number" {...field} placeholder="Largura" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Column for 'Espessura' */}
                  <FormField
                    control={form.control}
                    name={`product_pieces.${index}.piece.sizeZ`}
                    render={({ field }) => (
                      <FormItem className="col-span-2"> {/* Adjusted width */}
                        <FormControl>
                          <Input type="number" {...field} placeholder="Espessura" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Column for 'Ações' */}
                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    onClick={() => remove(index)}  // Remove the piece from the list
                    className="text-red-500 col-span-1"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          <div className="flex space-x-2 justify-between">
            <div className="space-x-2">
              <Button type="submit">
                <Save className="h-4 w-4 mr-2" />{buttonText}
              </Button>
              <Button disabled={!isEditing} variant="outline" onClick={resetValues} type="button">
                <Undo className="h-4 w-4 mr-2" />Cancelar
              </Button>
            </div>
            <div className="flex space-x-2">
              <CsvUploadParse setPieces={setPiecesValue} />
              <Button
                type="button"
                onClick={handleAddPiece}
              >
                <Plus className="h-4 w-4 mr-2" />Adicionar Peça
              </Button>
            </div>
          </div>
        </div>

      </form>
    </Form>
  );
});

export default ProductForm;
