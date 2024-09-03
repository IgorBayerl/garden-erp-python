import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ComboboxProduct } from "@/components/organisms/TempComboboxProduct";
import { Product } from "@/api/types";

const products: Product[] = [
  {
    id: 1, 
    name: "Product X",
    product_pieces: []
  },
  {
    id: 2, 
    name: "Product Y",
    product_pieces: []
  },
  {
    id: 3, 
    name: "Product Z",
    product_pieces: []
  },
];

export default function OrdersPage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [order, setOrder] = useState<{ product: Product; quantity: number }[]>([]);

  const addProductToOrder = () => {
    if (selectedProduct && quantity > 0) {
      setOrder([...order, { product: selectedProduct, quantity }]);
      setSelectedProduct(null);
      setQuantity(1);
    }
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Orders</h1>
      </div>
      <div
        className="flex flex-col gap-4 rounded-lg border border-dashed shadow-sm p-4"
        x-chunk="dashboard-02-chunk-1"
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="flex flex-col flex-1">
              <Label htmlFor="product">Product</Label>
              <ComboboxProduct
                list={products}
                selectedProduct={selectedProduct}
                setSelectedProduct={setSelectedProduct}
              />
            </div>
            <div className="flex flex-col flex-1">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                value={quantity}
                min={1}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            </div>
            <Button onClick={addProductToOrder} className="self-end">
              Add to Order
            </Button>
          </div>
          {order.length > 0 && (
            <div className="mt-4">
              <h2 className="text-lg font-semibold">Order Summary</h2>
              <ul className="list-disc pl-6">
                {order.map((item, index) => (
                  <li key={index}>
                    {item.quantity} x {item.product.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
