import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ComboboxProduct } from "@/components/organisms/ComboboxProduct";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Product } from "@/api/types";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { useGetProducts } from "@/api/products";
import { CalculateOrderRequest, useCalculateOrderBySize } from "@/api/orders";
import ErrorState from "@/components/layout/ErrorState";
import SkeletonLoader from "@/components/layout/SkeletonLoader";
import OrderBySizeTable from "../organisms/OrderBySizeTable";
import { Printer } from "lucide-react";
import { useLocalStorage } from 'usehooks-ts'
import { useReactToPrint } from "react-to-print";

export default function OrdersPage() {
  const { data: products, isLoading, isError } = useGetProducts();
  const [selectedProduct, setSelectedProduct] = useLocalStorage<Product | null>('order-product',null);
  const [quantity, setQuantity] = useLocalStorage<number>('order-quantity', 1);
  const [order, setOrder] = useLocalStorage<{ product: Product; quantity: number }[]>('order', []);
  const { mutate: calculateOrder, data: orderResponse, isPending: isCalculating, isError: isCalculationError } = useCalculateOrderBySize();

  const tableRef = useRef<HTMLDivElement>(null);

  const addProductToOrder = () => {
    if (selectedProduct && quantity > 0) {
      setOrder([...order, { product: selectedProduct, quantity }]);
      // setSelectedProduct(null);
      // setQuantity(1);
    }
  };

  const handlePrint = useReactToPrint({
    content: () => tableRef.current,
    documentTitle: "OrderBySizeTable",
    onBeforeGetContent: () => {
      // Inject custom styles for printing
      const styleElement = document.createElement("style");
      styleElement.innerHTML = `
        @media print {
          body {
            margin: 0 -90px; /* Adjust margin as needed */
            scale: 75%; /* Scale down font size */
          }
        }
      `;
      document.head.appendChild(styleElement);
    },
    onAfterPrint: () => {},
  });




  const removeProductFromOrder = (index: number) => {
    setOrder(order.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const orderRequest: CalculateOrderRequest = {
      order: "desc", // or 'asc', depending on your needs
      plank_size: 3000,
      sort_by: ["z", "y", "x"],
      products: order.map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity,
      })),
    };
    calculateOrder(orderRequest);
  }, [order, calculateOrder]);


  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 min-h-screen max-h-screen">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Ordens de produção</h1>
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
                      <Label htmlFor="product">Produto</Label>
                      <ComboboxProduct
                        list={products}
                        selectedProduct={selectedProduct}
                        setSelectedProduct={setSelectedProduct}
                      />
                    </div>
                    <div className="flex flex-col flex-1">
                      <Label htmlFor="quantity">Quantidade</Label>
                      <Input
                        id="quantity"
                        type="number"
                        value={quantity}
                        min={1}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                      />
                    </div>
                    <Button onClick={addProductToOrder} className="self-end">
                      Adicionar
                    </Button>
                  </div>
                  <ScrollArea className="h-full ">
                    {order.length > 0 && (
                      <ul className="list-disc pb-10 ">
                        {order.map((item, index) => (
                          <li key={index} className="flex items-center gap-2">
                            {item.quantity} x {item.product.name}
                            <Button onClick={() => removeProductFromOrder(index)} className="ml-2">
                              Remover
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
          <ResizablePanel minSize={60} className="flex flex-col overflow-hidden">
            <div className="m-4 h-full">
              <div className="flex items-center gap-4 justify-between">
                <h2 className="text-lg font-semibold">Ordem de produção</h2>
                <Button onClick={handlePrint} className="mt-4">
                  <Printer className="h-4 w-4" />
                </Button>
              </div>
              <ScrollArea className="h-full">
                {isCalculating && <p>Calculando...</p>}
                {isCalculationError && <p>Erro ao calcular a ordem</p>}
                <div ref={tableRef}>
                  {orderResponse && <OrderBySizeTable data={orderResponse} />}
                </div>
              </ScrollArea>
              
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </main>
  );
}
