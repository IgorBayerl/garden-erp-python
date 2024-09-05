import { Piece } from "@/api/types";
import { Combobox } from "@/components/ui/combobox";

interface ComboboxPieceProps {
  list: Piece[];
  selectedPiece: Piece | null;
  setSelectedPiece: (piece: Piece | null) => void;
}

export function ComboboxPiece({
  list,
  selectedPiece,
  setSelectedPiece,
}: ComboboxPieceProps) {
  return (
    <Combobox
      list={list}
      selectedItem={selectedPiece}
      setSelectedItem={setSelectedPiece}
      placeholder="Selecione uma peça..."
      displayValue={(piece) => piece.name}
    />
  );
}
