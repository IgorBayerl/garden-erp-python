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
import OrderBySizeTable from "@/components/organisms/OrderBySizeTable";
import { Printer, Trash, Ellipsis, Save } from "lucide-react";
import { useSessionStorage } from 'usehooks-ts'
import { useReactToPrint } from "react-to-print";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import Image from "../ui/image";

type OrderItem = { product: Product; quantity: number };

export default function OrdersPage() {
  const { data: products, isLoading, isError } = useGetProducts();
  const [selectedProduct, setSelectedProduct] = useSessionStorage<Product | null>('order-product',null);
  const [quantity, setQuantity] = useSessionStorage<number>('order-quantity', 1);
  const [order, setOrder] = useSessionStorage<OrderItem[]>('order', []);
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

  const handleClearOrder = () => {
    setOrder([]);
  };

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

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key.toLowerCase() === 'p') {
        event.preventDefault(); // Prevent default print dialog
        handlePrint(); // Call the print function
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handlePrint]); 

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 min-h-screen max-h-screen">
      <div className="flex justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Ordens de produção</h1>
        <div className="flex gap-2">
          <Button onClick={() => alert('Não implementado')} title="Salvar Ordem de Produção" disabled>
            <Save className="h-4 w-4 mr-2" />Salvar
          </Button>
          <Button onClick={handleClearOrder} title="Limpar Ordem de Produção">
            <Trash className="h-4 w-4 mr-2" />Limpar
          </Button>
          <Button onClick={handlePrint} title="Imprimir ( Ctrl + P )">
            <Printer className="h-4 w-4 mr-2" />Imprimir
          </Button>
        </div>
      </div>
      <div className="flex flex-col flex-grow gap-4 rounded-lg border border-dashed shadow-sm overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="flex-grow">
          <ResizablePanel minSize={32} defaultSize={32} className="flex flex-col overflow-hidden">
            <div className="flex flex-col gap-4 mx-4 overflow-hidden">
              {isLoading && <SkeletonLoader />}
              {isError && <ErrorState />}
              {!isLoading && !isError && products && (
                <div className="flex flex-col overflow-hidden gap-4">
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
                    <Button onClick={addProductToOrder} className="self-end" title="Adicionar">
                      Adicionar
                    </Button>
                  </div>
                  <ScrollArea className="flex flex-col">
                    <div className="flex flex-col gap-2">
                      {order.map((item, index) => (
                        <OrderItem key={index} index={index} item={item} remove={removeProductFromOrder} />
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel minSize={60} className="flex flex-col overflow-hidden">
            <div className="m-4 h-full space-y-2">
              <div className="flex items-center gap-4 justify-between">
                <h2 className="text-lg font-semibold">Ordem de produção</h2>
              </div>
              <ScrollArea className="h-full">
                {isCalculating && <p>Calculando...</p>}
                {isCalculationError && <p>Erro ao calcular a ordem</p>}
                <div className="pb-24 print:pb-0" ref={tableRef}>
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

export interface OrderItemProps {
  index: number;
  item: OrderItem;
  remove: (index: number) => void;
}

export function OrderItem({ item, index, remove }: OrderItemProps) {

  return (
    <Collapsible>
      <Card className="flex flex-col items-start justify-between gap-2 w-full p-2 shadow-sm">
        <div className="flex justify-between w-full">
          <div className="flex gap-2">
            <Image
              src={item.product.image}
              alt={item.product.name}
              className="h-16 w-16 rounded-lg object-scale-down bg-secondary aspect-square"
            />
            <div>
              <h1 className="text-lg font-semibold">{item.product.name}</h1>
              <div className="text-sm text-muted-foreground">{item.quantity}</div>
            </div>
          </div>
          <div className="flex flex-1 justify-end">
            <div className="flex flex-col justify-between items-center h-full">
              <Button 
                onClick={() => remove(index)} 
                variant="ghost" 
                title="Remover da ordem de produção"
              >
                <Trash className="h-4 w-4" />
              </Button>
              <CollapsibleTrigger title="Mostrar Detalhes">
                <Ellipsis className="h-4 w-4" />
              </CollapsibleTrigger>
            </div>
          </div>
        </div>
        <CollapsibleContent className="mt-2 w-full">
          <h2 className="text-sm font-medium">Peças:</h2>
          <ul className="pl-4 mt-1 list-disc">
            {item.product.product_pieces.map((piece) => (
              <li key={`${index}_${piece.piece.id}`} className="text-sm">
                {piece.piece.name}
                <br />
                Qty: {piece.quantity}
                <br />
                Comprimento: {piece.piece.sizeX}
                <br />
                Largura: {piece.piece.sizeY}
                <br />
                Espessura: {piece.piece.sizeZ}
              </li>
            ))}
          </ul>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
