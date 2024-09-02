export type Piece = {
  id: number;
  name: string;
  sizeX: number;
  sizeY: number;
  sizeZ: number;
};

export type ProductPiece = {
  piece_id: number;
  quantity: number;
};

export type Product = {
  id: number;
  name: string;
  product_pieces: ProductPiece[];
};
