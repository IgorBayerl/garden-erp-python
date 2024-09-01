from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from app.models import Piece, ProductPiece
from app.serializers import PieceSerializer

@api_view(['POST'])
def add_piece(request):
    serializer = PieceSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'Piece added successfully', 'id': serializer.data['id']}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_pieces(request):
    pieces = Piece.objects.all()
    serializer = PieceSerializer(pieces, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_piece_by_id(request, id):
    try:
        piece = Piece.objects.get(id=id)
    except Piece.DoesNotExist:
        return Response({'message': 'Piece not found'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = PieceSerializer(piece)
    return Response(serializer.data)

@api_view(['PUT'])
def update_piece(request, id):
    try:
        piece = Piece.objects.get(id=id)
    except Piece.DoesNotExist:
        return Response({'message': 'Piece not found'}, status=status.HTTP_404_NOT_FOUND)

    serializer = PieceSerializer(piece, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'Piece updated successfully'})
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def delete_piece(request, id):
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
