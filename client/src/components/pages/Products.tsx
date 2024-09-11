import { useCreateProduct, useGetProducts, useUpdateProduct } from "@/api/products";
import { Button } from "@/components/ui/button";
import ErrorState from "@/components/layout/ErrorState";
import SkeletonLoader from "@/components/layout/SkeletonLoader";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { useRef, useState } from "react";
import { Product } from "@/api/types";
import { Plus } from "lucide-react";
import ProductForm from "@/components/organisms/ProductForm";
import ProductTable from "../organisms/ProductsTable";

export default function ProductsPage() {
  const { data: products, isLoading: productsLoading, isError: productsError } = useGetProducts();

  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null); // Use Product including id for updates
  const formRef = useRef<{ resetForm: () => void }>(null);

  const handleCreateProduct = (newProduct: Omit<Product, 'id'>) => {
    console.log('Handle create product');
    createProductMutation.mutate(newProduct, {
      onSuccess: () => {
        formRef.current?.resetForm();
        setSelectedProduct(null);
      },
    });
  };

  const handleUpdateProduct = (updatedProduct: Omit<Product, 'id'>) => {
    console.log('Handle UPDATE product');
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
    setSelectedProduct({ ...product, id: product.id }); // Include the id for updates
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
        <div className="flex flex-col flex-1 overflow-hidden">
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel minSize={32} className="flex flex-col">
              <ProductTable products={products} onSelectProduct={handleSelectProduct} />
            </ResizablePanel>
            <ResizableHandle withHandle className="m-4" />
            <ResizablePanel
              minSize={49}
              defaultSize={60}
              className="flex flex-col"
              autoSave="products_view"
            >
              <ProductForm
                ref={formRef}
                onSubmit={selectedProduct ? handleUpdateProduct : handleCreateProduct}
                initialValues={selectedProduct || undefined}
                isEditing={!!selectedProduct}
              />
              {/* <Tabs defaultValue="import" className="flex flex-col min-h-0 p-1 h-full" onValueChange={setSelectedTab} value={selectedTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger disabled={false} value="form">Formulario</TabsTrigger>
                  <TabsTrigger disabled={false} value="import">Importar CSV</TabsTrigger>
                </TabsList>
                <div className="flex flex-col overflow-hidden h-full">
                  <TabsContent value="import">
                    <ProductAddCsv />
                  </TabsContent>
                  <TabsContent value="form" className="flex flex-col overflow-hidden h-full">
                    <ProductForm
                      ref={formRef}
                      onSubmit={selectedProduct ? handleUpdateProduct : handleCreateProduct}
                      initialValues={selectedProduct || undefined}
                      isEditing={!!selectedProduct}
                    />
                  </TabsContent>
                </div>
              </Tabs> */}
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      )}
    </main>
  );
}
