import { useCreateProduct, useGetProducts, useUpdateProduct } from "@/api/products";
import { Button } from "@/components/ui/button";
import ErrorState from "@/components/layout/ErrorState";
import SkeletonLoader from "@/components/layout/SkeletonLoader";
import ProductList from "@/components/organisms/ProductList";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import ProductForm from "@/components/organisms/ProductForm";
import { useRef, useState } from "react";
import { PostProduct, Product } from "@/api/types";
import { Plus } from "lucide-react";
import { convertToPostProduct } from "@/lib/utils"; // Import the utility function
import ProductAddCsv from "../organisms/ProductAddCsv";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

export default function ProductsPage() {
  const { data: products, isLoading: productsLoading, isError: productsError } = useGetProducts();

  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
  const [selectedProduct, setSelectedProduct] = useState<PostProduct | null>(null); // Use PostProduct including id for updates
  const formRef = useRef<{ resetForm: () => void }>(null);

  const handleCreateProduct = (newProduct: Omit<PostProduct, 'id'>) => {
    createProductMutation.mutate(newProduct, {
      onSuccess: () => {
        formRef.current?.resetForm();
        setSelectedProduct(null);
      },
    });
  };

  const handleUpdateProduct = (updatedProduct: Omit<PostProduct, 'id'>) => {
    const requestData = {
      id: selectedProduct?.id || 0,
      ...updatedProduct,
    }
    updateProductMutation.mutate(requestData, {
      onSuccess: () => {
        formRef.current?.resetForm();
        setSelectedProduct(null);
      },
    });
  };

  const handleSelectProduct = (product: Product) => {
    const postProduct = convertToPostProduct(product);
    setSelectedProduct({ ...postProduct, id: product.id }); // Include the id for updates
  };

  const handleNewItem = () => {
    setSelectedProduct(null);
    formRef.current?.resetForm();
  };

  const isLoadingState = productsLoading;
  const isErrorState = productsError;

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 min-h-screen max-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Produtos</h1>
        <div className="flex gap-2">
          <Button onClick={handleNewItem}>
            <Plus className="h-4 w-4 mr-2" />Adicionar novo produto
          </Button>
        </div>
      </div>

      {(isLoadingState) && <SkeletonLoader />}
      {(isErrorState) && <ErrorState />}

      {!productsLoading && !productsError && products && (
        <div className="flex flex-1 overflow-hidden">
          <ResizablePanelGroup direction="horizontal" className="flex-grow">
            <ResizablePanel minSize={32} className="flex flex-col overflow-hidden">
              <div className="flex flex-1 flex-col rounded-lg border border-dashed shadow-sm overflow-hidden">
                <ScrollArea className="h-full">
                  <ProductList products={products} onSelectProduct={handleSelectProduct} />
                </ScrollArea>
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle className="m-4" />
            <ResizablePanel
              minSize={32}
              defaultSize={32}
              className="flex flex-col overflow-hidden"
              autoSave="products_view"
            >
              <Tabs defaultValue="import" className="h-full">
                <TabsList>
                  <TabsTrigger disabled={false} value="form">Formulario</TabsTrigger>
                  <TabsTrigger disabled={false} value="import">Importar CSV</TabsTrigger>
                </TabsList>
                <TabsContent value="import">
                  <ProductAddCsv />
                </TabsContent>
                <TabsContent value="form" className="h-full overflow-hidden">
                  <ScrollArea className="h-full">
                    <div className="pb-14">
                      <ProductForm
                        ref={formRef}
                        onSubmit={selectedProduct ? handleUpdateProduct : handleCreateProduct}
                        initialValues={selectedProduct || undefined}
                        isEditing={!!selectedProduct}
                      />
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      )}
    </main>
  );
}
