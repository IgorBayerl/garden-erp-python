from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from app.models import Piece, ProductPiece
from app.serializers import PieceSerializer
from rest_framework.parsers import MultiPartParser
from django.views.decorators.csrf import csrf_exempt

from app.utils.pieces_csv_parser import parse_csv

class PieceView(APIView):

    def post(self, request):
        serializer = PieceSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Peça adicionada com sucesso', 'id': serializer.data['id']}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, id=None):
        if id:
            try:
                piece = Piece.objects.get(id=id)
            except Piece.DoesNotExist:
                return Response({'message': 'Peça não encontrada'}, status=status.HTTP_404_NOT_FOUND)
            serializer = PieceSerializer(piece)
        else:
            pieces = Piece.objects.all()
            serializer = PieceSerializer(pieces, many=True)
        
        return Response(serializer.data)

    def put(self, request, id):
        try:
            piece = Piece.objects.get(id=id)
        except Piece.DoesNotExist:
            return Response({'message': 'Peça não encontrada'}, status=status.HTTP_404_NOT_FOUND)

        serializer = PieceSerializer(piece, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Peça atualizada com sucesso'})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        try:
            piece = Piece.objects.get(id=id)
        except Piece.DoesNotExist:
            return Response({'message': 'Peça não encontrada'}, status=status.HTTP_404_NOT_FOUND)

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
                'message': 'Não é possível excluir peça pois está relacionada a produtos existentes.',
                'related_products': related_products
            }, status=status.HTTP_400_BAD_REQUEST)

        piece.delete()
        return Response({'message': 'Peça excluída com sucesso'})


class CSVParseView(APIView):
    parser_classes = [MultiPartParser]  # Handle multipart form-data for file and image uploads

    @csrf_exempt
    def post(self, request):
        # Handle CSV file upload
        file_obj = request.FILES.get('file')
        if not file_obj or not file_obj.name.endswith('.csv'):
            return Response({"error": "Tipo de arquivo inválido"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            list_of_pieces = parse_csv(file_obj)

            piece_data_response = []
            for piece in list_of_pieces:
                piece_details = {
                    'id': 0,   # Piece id
                    'name': piece['name'],   # Piece name
                    'sizeX': piece['sizeX'],  # Comprimento
                    'sizeY': piece['sizeY'],  # Largura
                    'sizeZ': piece['sizeZ'],  # Espessura
                }
                piece_data = {
                    'quantity': piece['quantity'],  # Quantity
                    'piece': piece_details
                }

                piece_data_response.append(piece_data)

            # Return the parsed pieces data (without saving to DB)
            return Response({'pieces': piece_data_response}, status=status.HTTP_200_OK)

        except ValueError as ve:
            return Response({"error": str(ve)}, status=status.HTTP_400_BAD_REQUEST)
        except UnicodeDecodeError:
            return Response({"error": "Failed to decode the file. Please ensure it is encoded correctly."}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
