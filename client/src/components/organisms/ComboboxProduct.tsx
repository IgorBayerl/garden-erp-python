import { Product } from "@/api/types";
import { Combobox } from "@/components/ui/combobox";

interface ComboboxProductProps {
  list: Product[];
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
}

export function ComboboxProduct({
  list,
  selectedProduct,
  setSelectedProduct,
}: ComboboxProductProps) {
  return (
    <Combobox
      list={list}
      selectedItem={selectedProduct}
      setSelectedItem={setSelectedProduct}
      placeholder="Selecione um produto..."
      displayValue={(product) => product.name}
    />
  );
}
