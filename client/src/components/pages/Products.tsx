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
import { X, Plus } from "lucide-react";
import { convertToPostProduct } from "@/lib/utils"; // Import the utility function
import { useGetPieces } from "@/api/pieces";

export default function ProductsPage() {
  const { data: products, isLoading: productsLoading, isError: productsError } = useGetProducts();
  const { data: pieces, isLoading: piecesLoading, isError: piecesError } = useGetPieces();

  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
  const [selectedProduct, setSelectedProduct] = useState<PostProduct | null>(null); // Use PostProduct including id for updates
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const formRef = useRef<{ resetForm: () => void }>(null);

  const handleCreateProduct = (newProduct: Omit<PostProduct, 'id'>) => {
    createProductMutation.mutate(newProduct, {
      onSuccess: () => {
        formRef.current?.resetForm();
        setSelectedProduct(null);
      },
    });
  };

  const handleSubmit = (product: Omit<PostProduct, 'id'> | PostProduct) => {
    if ('id' in product) {
      // If the product has an id, it means we're updating
      handleUpdateProduct(product as PostProduct);
    } else {
      // Otherwise, we're creating a new product
      handleCreateProduct(product);
    }
  };
  

  const handleUpdateProduct = (updatedProduct: PostProduct) => {
    updateProductMutation.mutate(updatedProduct, {
      onSuccess: () => {
        formRef.current?.resetForm();
        setSelectedProduct(null);
      },
    });
  };

  const handleSelectProduct = (product: Product) => {
    const postProduct = convertToPostProduct(product);
    setSelectedProduct({ ...postProduct, id: product.id }); // Include the id for updates
    setIsPanelOpen(true);
  };

  const handleNewItem = () => {
    setSelectedProduct(null);
    setIsPanelOpen(true);
    formRef.current?.resetForm();
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
    setSelectedProduct(null);
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 min-h-screen max-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Produtos</h1>
        <Button onClick={handleNewItem}>
          <Plus className="h-4 w-4 mr-2" />Adicionar novo produto
        </Button>
      </div>

      {(productsLoading || piecesLoading) && <SkeletonLoader />}
      {(productsError || piecesError) && <ErrorState />}

      {!productsLoading && !productsError && products && pieces && (
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
              className="flex flex-col overflow-hidden relative"
              autoSave="products_view"
            >
              <div
                className={`transition-all duration-150 ease-in-out absolute inset-0 ${
                  isPanelOpen ? "translate-x-0 opacity-100 visible" : "translate-x-full opacity-0 invisible"
                } flex flex-col h-full`}
              >
                <Button variant="ghost" onClick={handleClosePanel}>
                  <X className="h-4 w-4" />
                </Button>
                <ScrollArea className="h-full">
                  <ProductForm
                    ref={formRef}
                    onSubmit={handleSubmit}
                    initialValues={selectedProduct || undefined}
                    isEditing={!!selectedProduct}
                    pieces={pieces}  // Pass the fetched pieces to the ProductForm
                  />
                </ScrollArea>
              </div>

              {!isPanelOpen && (
                <div className="absolute inset-0 flex items-center justify-center text-center p-4">
                  <div>
                    <Button onClick={handleNewItem} className="mb-4">
                      <Plus className="h-4 w-4 mr-2" />Adicionar novo produto
                    </Button>
                    <p className="text-muted-foreground">Ou selecione um produto para editar</p>
                  </div>
                </div>
              )}
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      )}
    </main>
  );
}
