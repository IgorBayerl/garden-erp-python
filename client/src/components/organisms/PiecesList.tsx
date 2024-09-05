import { Piece } from "@/api/types";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useDeletePiece } from "@/api/pieces";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface PieceListProps {
  pieces: Piece[];
  onSelectPiece: (piece: Piece) => void;
}

export default function PieceList({ pieces, onSelectPiece }: PieceListProps) {
  const deletePieceMutation = useDeletePiece();

  const handleDeletePiece = (id: number) => {
    deletePieceMutation.mutate(id);
  };

  return (
    <ul className="w-full">
      {pieces.map((piece, index) => (
        <li
          key={piece.id}
          className={cn(
            "p-4 border-2 border-transparent flex justify-between items-center",
            index % 2 === 0 ? "bg-gray-100" : "bg-white"
          )}
        >
          <div>
            <h2 className="text-lg font-semibold">{piece.name}</h2>
            <p>
              Dimensões: <strong>{piece.sizeX}</strong> x <strong>{piece.sizeY}</strong> x <strong>{piece.sizeZ}</strong>
            </p>
          </div>
          <div className="flex space-x-2">
            <Link to="#">
              <Button onClick={() => onSelectPiece(piece)} className="ml-4">
                Editar
              </Button>
            </Link>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Deletar</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação não pode ser desfeita. Você tem certeza que deseja excluir
                    a peça "{piece.name}"?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleDeletePiece(piece.id)}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </li>
      ))}
    </ul>
  );
}
