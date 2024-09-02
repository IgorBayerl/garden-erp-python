from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from app.models import Piece, ProductPiece
from app.serializers import PieceSerializer

class PieceView(APIView):

    def post(self, request):
        serializer = PieceSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Piece added successfully', 'id': serializer.data['id']}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, id=None):
        if id:
            try:
                piece = Piece.objects.get(id=id)
            except Piece.DoesNotExist:
                return Response({'message': 'Piece not found'}, status=status.HTTP_404_NOT_FOUND)
            serializer = PieceSerializer(piece)
        else:
            pieces = Piece.objects.all()
            serializer = PieceSerializer(pieces, many=True)
        
        return Response(serializer.data)

    def put(self, request, id):
        try:
            piece = Piece.objects.get(id=id)
        except Piece.DoesNotExist:
            return Response({'message': 'Piece not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = PieceSerializer(piece, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Piece updated successfully'})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        try:
            piece = Piece.objects.get(id=id)
        except Piece.DoesNotExist:
            return Response({'message': 'Piece not found'}, status=status.HTTP_404_NOT_FOUND)

        # Optional: Check for related products before deletion
        related_product_pieces = ProductPiece.objects.filter(piece_id=id)
        if related_product_pieces.exists():
            related_products = [
                {
                    'product_id': pp.product.id,
                    'product_name': pp.product.name,
                    'quantity': pp.quantity
                } for pp in related_product_pieces
            ]
            return Response({
                'message': 'Cannot delete piece because it is related to existing products.',
                'related_products': related_products
            }, status=status.HTTP_400_BAD_REQUEST)

        piece.delete()
        return Response({'message': 'Piece deleted successfully'})
