import { useGetPieces } from "@/api/pieces";
import { Button } from "@/components/ui/button";
import ErrorState from "@/components/layout/ErrorState";
import SkeletonLoader from "@/components/layout/SkeletonLoader";
import PiecesList from "@/components/organisms/PiecesList";
import { ScrollArea } from "../ui/scroll-area";

export default function PiecesPage() {
  const { data: pieces, isLoading, isError } = useGetPieces();

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 min-h-screen max-h-screen">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Pieces</h1>
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
        <div
          className="flex flex-1 flex-col rounded-lg border border-dashed shadow-sm overflow-hidden"
        >
          <ScrollArea className="h-full ">
            <PiecesList pieces={pieces} />
          </ScrollArea>
        </div>
      )}

      {!isLoading && !isError && pieces && pieces.length === 0 && (
        <div
          className="flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed shadow-sm"
          x-chunk="dashboard-02-chunk-1"
        >
          <div className="flex flex-col items-center gap-1 text-center">
            <h3 className="text-2xl font-bold tracking-tight">
              You have no pieces
            </h3>
            <p className="text-sm text-muted-foreground">
              Start by adding some pieces to your collection.
            </p>
            <Button className="mt-4">Add Piece</Button>
          </div>
        </div>
      )}
    </main>
  );
}
