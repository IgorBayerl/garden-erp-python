import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCreateProduct, useGetProducts, useUpdateProduct } from "@/api/products";
import { Button } from "@/components/ui/button";
import ErrorState from "@/components/layout/ErrorState";
import SkeletonLoader from "@/components/layout/SkeletonLoader";
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
  const [isSheetOpen, setIsSheetOpen] = useState(false); // Control Sheet visibility

  const handleCreateProduct = (newProduct: Omit<Product, 'id'>) => {
    createProductMutation.mutate(newProduct, {
      onSuccess: () => {
        formRef.current?.resetForm();
        setSelectedProduct(null);
        setIsSheetOpen(false); // Close sheet after success
      },
    });
  };

  const handleUpdateProduct = (updatedProduct: Omit<Product, 'id'>) => {
    const requestData = {
      id: selectedProduct?.id || 0,
      ...updatedProduct,
    };
    updateProductMutation.mutate(requestData, {
      onSuccess: () => {
        formRef.current?.resetForm();
        setSelectedProduct(null);
        setIsSheetOpen(false); // Close sheet after success
      },
    });
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct({ ...product, id: product.id });
    setIsSheetOpen(true); // Open sheet when editing
  };

  const handleNewItem = () => {
    setSelectedProduct(null);
    formRef.current?.resetForm();
    setIsSheetOpen(true); // Open sheet when adding new product
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
          <ProductTable products={products} onSelectProduct={handleSelectProduct} />
        </div>
      )}

      {/* Sheet component for form */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="right" className="w-fit md:max-w-none flex flex-col" >
          <SheetHeader>
            <SheetTitle className="text-xl p-1">{selectedProduct ? "Editar Produto" : "Adicionar Produto"}</SheetTitle>
          </SheetHeader>
          <div className="w-full h-full max-w-[850px] flex flex-col overflow-hidden">
            <ProductForm
              ref={formRef}
              onSubmit={selectedProduct ? handleUpdateProduct : handleCreateProduct}
              initialValues={selectedProduct || undefined}
              isEditing={!!selectedProduct}
            />
          </div>
        </SheetContent>
      </Sheet>
    </main>
  );
}
