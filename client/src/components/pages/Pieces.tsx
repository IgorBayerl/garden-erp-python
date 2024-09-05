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
    setIsPanelOpen(false);
    setSelectedPiece(null);
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

      {!isLoading && !isError && pieces && (
        <div className="flex flex-1 overflow-hidden">
          <ResizablePanelGroup 
            direction="horizontal" 
            className="flex-grow"
            autoSaveId={isPanelOpen ? "pieces_view" : undefined}
          >
            <ResizablePanel minSize={32} className="flex flex-col overflow-hidden">
              <div className="flex flex-1 flex-col rounded-lg border border-dashed shadow-sm overflow-hidden">
                <ScrollArea className="h-full">
                  <PiecesList pieces={pieces} onSelectPiece={handleSelectPiece} />
                </ScrollArea>
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle className="m-4" />

            <ResizablePanel
              minSize={32}
              defaultSize={32}
              className="flex flex-col overflow-hidden relative"
              autoSave="pieces_view"
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
                  <PieceForm
                    ref={formRef}
                    onSubmit={selectedPiece ? handleUpdatePiece : handleCreatePiece}
                    initialValues={selectedPiece || undefined}
                    isEditing={!!selectedPiece}
                  />
                </ScrollArea>
              </div>

              {!isPanelOpen && (
                <div className="absolute inset-0 flex items-center justify-center text-center p-4">
                  <div>
                    <Button onClick={handleNewItem} className="mb-4">
                      <Plus className="h-4 w-4 mr-2" />Adicionar novo item
                    </Button>
                    <p className="text-muted-foreground">Ou selecione um item para editar</p>
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