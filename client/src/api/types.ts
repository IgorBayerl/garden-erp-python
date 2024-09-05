export type Piece = {
  id: number;
  name: string;
  sizeX: number;
  sizeY: number;
  sizeZ: number;
};

export type ProductPiece = {
  piece: Piece;
  quantity: number;
};

export type Product = {
  id: number;
  name: string;
  product_pieces: ProductPiece[];
};

export interface RelatedProduct {
  product_id: number;
  product_name: string;
  quantity: number;
}

export interface APIErrorResponse {
  message: string;
}

export interface DeletePieceErrorResponse extends APIErrorResponse {
  related_products: RelatedProduct[];
}
