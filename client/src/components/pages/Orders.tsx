import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ComboboxProduct } from "@/components/organisms/ComboboxProduct";
import { ScrollArea } from "@/components/ui/scroll-area"
import { Product } from "@/api/types";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { useGetProducts } from "@/api/products";
import { CalculateOrderRequest, useCalculateOrderBySize } from "@/api/orders";
import ErrorState from "@/components/layout/ErrorState";
import SkeletonLoader from "@/components/layout/SkeletonLoader";
import OrderBySizeTable from "../organisms/OrderBySizeTable";

export default function OrdersPage() {
  const { data: products, isLoading, isError } = useGetProducts();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [order, setOrder] = useState<{ product: Product; quantity: number }[]>([]);
  const { mutate: calculateOrder, data: orderResponse, isPending: isCalculating, isError: isCalculationError } = useCalculateOrderBySize();

  const addProductToOrder = () => {
    if (selectedProduct && quantity > 0) {
      setOrder([...order, { product: selectedProduct, quantity }]);
      // setSelectedProduct(null);
      setQuantity(1);
    }
  };

  const removeProductFromOrder = (index: number) => {
    setOrder(order.filter((_, i) => i !== index));
  };

  useEffect(() => {
    if (order.length > 0) {
      const orderRequest: CalculateOrderRequest = {
        order: 'desc', // or 'desc', depending on your needs
        sort_by: ['z', 'y', 'x'],
        products: order.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
        })),
      };
      calculateOrder(orderRequest);
    }
  }, [order, calculateOrder]);

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 min-h-screen max-h-screen">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Orders</h1>
      </div>
      <div className="flex flex-col flex-grow gap-4 rounded-lg border border-dashed shadow-sm overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="flex-grow">
          <ResizablePanel minSize={32} defaultSize={32} className="flex flex-col overflow-hidden">
            <div className="flex flex-col gap-4 m-4 h-full">
              {isLoading && <SkeletonLoader />}
              {isError && <ErrorState />}
              {!isLoading && !isError && products && (
                <>
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
                  <ScrollArea className="h-full ">
                    {order.length > 0 && (
                      <ul className="list-disc pb-10 ">
                        {order.map((item, index) => (
                          <li key={index} className="flex items-center gap-2">
                            {item.quantity} x {item.product.name}
                            <Button onClick={() => removeProductFromOrder(index)} className="ml-2">
                              Remove
                            </Button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </ScrollArea>
                </>
              )}
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel minSize={32} className="flex flex-col overflow-hidden">
            <div className="m-4 h-full">
              <h2 className="text-lg font-semibold">Order Calculation Result</h2>
              <ScrollArea className="h-full">
                {isCalculating && <p>Calculating...</p>}
                {isCalculationError && <p>Error calculating order</p>}
                {orderResponse && (
                  <OrderBySizeTable data={orderResponse} />
                  // <pre className="bg-gray-100 rounded pb-14 p-2">
                  //   <div>
                  //   {JSON.stringify(orderResponse, null, 2)}
                  //   </div>
                  // </pre>
                )}
              </ScrollArea>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </main>
  );
}
