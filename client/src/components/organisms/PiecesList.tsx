import { Piece } from "@/api/types";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom"; 
import { Button } from "@/components/ui/button";

interface PieceListProps {
  pieces: Piece[];
}

export default function PieceList({ pieces }: PieceListProps) {
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
              Dimensions: {piece.sizeX}x{piece.sizeY}x{piece.sizeZ}
            </p>
          </div>
          <Link to="#">
            <Button
              className="ml-4"
            >
              Edit
            </Button>
          </Link>
        </li>
      ))}
    </ul>
  );
}
