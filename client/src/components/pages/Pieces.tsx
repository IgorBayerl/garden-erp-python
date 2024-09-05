import { useCreatePiece, useGetPieces, useUpdatePiece } from "@/api/pieces";
import { Button } from "@/components/ui/button";
import ErrorState from "@/components/layout/ErrorState";
import SkeletonLoader from "@/components/layout/SkeletonLoader";
import PiecesList from "@/components/organisms/PiecesList";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import PieceForm from "@/components/organisms/PieceForm";
import { useRef, useState } from "react";
import { Piece } from "@/api/types";
import { X, Plus } from "lucide-react";


export default function PiecesPage() {
  const { data: pieces, isLoading, isError } = useGetPieces();

  const createPieceMutation = useCreatePiece();
  const updatePieceMutation = useUpdatePiece();
  const [selectedPiece, setSelectedPiece] = useState<Piece | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const formRef = useRef<{ resetForm: () => void }>(null);

  const handleCreatePiece = (newPiece: Omit<Piece, "id">) => {
    createPieceMutation.mutate(newPiece, {
      onSuccess: () => {
        formRef.current?.resetForm();
        setSelectedPiece(null);
      },
    });
  };

  const handleUpdatePiece = (updatedPiece: Omit<Piece, "id">) => {
    if (selectedPiece) {
      updatePieceMutation.mutate({ ...selectedPiece, ...updatedPiece });
    }
  };

  const handleSelectPiece = (piece: Piece) => {
    setSelectedPiece(piece);
    setIsPanelOpen(true);
  };

  const handleNewItem = () => {
    setSelectedPiece(null);
    setIsPanelOpen(true);
    formRef.current?.resetForm();
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false); // Close the panel
    setSelectedPiece(null); // Deselect any selected piece
  };


  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 min-h-screen max-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Peças</h1>
        <Button onClick={handleNewItem}><Plus className="h-4 w-4 mr-2" />Adicionar novo item</Button>
      </div>

      {isLoading && (
        <div>
          <SkeletonLoader />
        </div>
      )}

      {isError && (
        <div className="flex-1">
          <ErrorState />
        </div>
      )}

      {!isLoading && !isError && pieces && pieces.length > 0 && (
        <div className="flex flex-1 overflow-hidden">
          <ResizablePanelGroup direction="horizontal" className="flex-grow">
            <ResizablePanel minSize={32} className="flex flex-col overflow-hidden">
              <div className="flex flex-1 flex-col rounded-lg border border-dashed shadow-sm overflow-hidden">
                <ScrollArea className="h-full">
                  <PiecesList pieces={pieces} onSelectPiece={handleSelectPiece} />
                </ScrollArea>
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle className="m-4" />
            {isPanelOpen && (
              <>
                <ResizablePanel minSize={32} defaultSize={32} className="flex flex-col overflow-hidden">
                  <ScrollArea className="h-full">
                    <Button variant="ghost" onClick={handleClosePanel}>
                      <X className="h-4 w-4" />
                    </Button>
                    <PieceForm
                      ref={formRef}
                      onSubmit={selectedPiece ? handleUpdatePiece : handleCreatePiece}
                      initialValues={selectedPiece || undefined}
                      isEditing={!!selectedPiece}
                    />
                  </ScrollArea>
                </ResizablePanel>
              </>
            )}
          </ResizablePanelGroup>
        </div>
      )}

      {!isLoading && !isError && pieces && pieces.length === 0 && (
        <ErrorNoPieces addPiece={handleNewItem} />
      )}
    </main>
  );
}



interface ErrorNoPiecesProps {
  addPiece?: () => void;
}

function ErrorNoPieces({ addPiece }: ErrorNoPiecesProps) {
  return (
    <div
      className="flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed shadow-sm"
    >
      <div className="flex flex-col items-center gap-1 text-center">
        <h3 className="text-2xl font-bold tracking-tight">
          Nenhuma peça cadastrada ainda
        </h3>
        <p className="text-sm text-muted-foreground">
          Comece adicionando algumas peças no sistema.
        </p>
        <Button onClick={addPiece} className="mt-4">
          Add Piece
        </Button>
      </div>
    </div>
  )
}
