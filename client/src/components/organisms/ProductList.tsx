import { Product } from "@/api/types";

interface ProductListProps {
  products: Product[];
}

export default function ProductList({ products }: ProductListProps) {
  return (
    <ul className="w-full max-w-md space-y-4 p-4">
      {products.map((product) => (
        <li key={product.id} className="p-4 border rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold">{product.name}</h2>
          {product.product_pieces && product.product_pieces.length > 0 ? (
            <ul className="mt-2 list-disc pl-5 space-y-1">
              {product.product_pieces.map((pp) => (
                <li key={pp.piece_id}>
                  Piece ID: {pp.piece_id} - Quantity: {pp.quantity}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              No pieces associated
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}
