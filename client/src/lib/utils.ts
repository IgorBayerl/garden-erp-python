import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ProductPiece, PostProductPiece, Piece, Product, PostProduct } from '@/api/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));


/**
 * Converts a list of ProductPiece objects to a list of PostProductPiece objects.
 * @param productPieces An array of ProductPiece objects.
 * @returns An array of PostProductPiece objects, where each object contains the piece_id and the quantity.
 */
export const convertToPostProductPieces = (productPieces: ProductPiece[]): PostProductPiece[] => {
  return productPieces.map(p => ({
    piece_id: p.piece.id,
    quantity: p.quantity,
  }));
};


/**
 * Converts a list of PostProductPiece objects to a list of ProductPiece objects.
 * @param postProductPieces An array of PostProductPiece objects.
 * @param allPieces A list of Piece objects.
 * @returns An array of ProductPiece objects, where each object contains the Piece object and the quantity.
 */
export const convertToProductPieces = (
  postProductPieces: PostProductPiece[],
  allPieces: Piece[]
): ProductPiece[] => {
  return postProductPieces.map(p => ({
    piece: allPieces.find(piece => piece.id === p.piece_id) as Piece,
    quantity: p.quantity,
  }));
};

// Convert Product to PostProduct
export const convertToPostProduct = (product: Product): Omit<PostProduct, 'id'> => {
  return {
    name: product.name,
    product_pieces: product.product_pieces.map(p => ({
      piece_id: p.piece.id,
      quantity: p.quantity,
    })),
  };
};

// Convert PostProduct to Product (you might not need this if not converting back)
export const convertToProduct = (postProduct: Omit<PostProduct, 'id'>, pieces: ProductPiece[]): Product => {
  return {
    id: 0, // You would set the ID appropriately based on your needs
    name: postProduct.name,
    product_pieces: postProduct.product_pieces.map(p => ({
      piece: pieces.find(piece => piece.piece.id === p.piece_id)!.piece,
      quantity: p.quantity,
    })),
  };
};