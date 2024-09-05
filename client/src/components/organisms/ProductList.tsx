import { Product } from "@/api/types";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useDeleteProduct } from "@/api/products";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ProductListProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export default function ProductList({ products, onSelectProduct }: ProductListProps) {
  const deleteProductMutation = useDeleteProduct();

  const handleDeleteProduct = (id: number) => {
    deleteProductMutation.mutate(id);
  };

  return (
    <ul className="w-full">
      {products.map((product, index) => (
        <li
          key={product.id}
          className={cn(
            "p-4 border-2 border-transparent flex justify-between items-center",
            index % 2 === 0 ? "bg-gray-100" : "bg-white"
          )}
        >
          <div>
            <h2 className="text-lg font-semibold">{product.name}</h2>
            <p>
              Peças:
              {product.product_pieces.map((productPiece) => (
                <span key={productPiece.piece.id} className="block">
                  {productPiece.piece.name} (Qty: {productPiece.quantity})
                </span>
              ))}
            </p>
          </div>
          <div className="flex space-x-2">
            <Link to="#">
              <Button onClick={() => onSelectProduct(product)} className="ml-4">
                Editar
              </Button>
            </Link>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Deletar</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação não pode ser desfeita. Você tem certeza que deseja excluir
                    o produto "{product.name}"?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleDeleteProduct(product.id)}>
                    Deletar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </li>
      ))}
    </ul>
  );
}
