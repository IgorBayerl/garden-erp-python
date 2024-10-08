from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from app.serializers import ProductSerializer
from app.models import Product, Piece, ProductPiece
from django.db import transaction
from rest_framework.parsers import MultiPartParser

from app.utils.pieces_csv_parser import parse_csv

def register_product_with_pieces(product_name, pieces_data, image_file=None):
    """
    Abstract function to register a product and related pieces in a single transaction.
    - product_name: name of the product.
    - pieces_data: list of dicts with piece information (name, sizeX, sizeY, sizeZ, quantity).
    """
    with transaction.atomic():
        product = Product.objects.create(name=product_name, image=image_file)

        for piece_data in pieces_data:
            # Create or retrieve the piece
            piece, _ = Piece.objects.get_or_create(
                name=piece_data['name'],
                sizeX=piece_data['sizeX'],
                sizeY=piece_data['sizeY'],
                sizeZ=piece_data['sizeZ']
            )
            # Create the relationship between the product and the piece
            ProductPiece.objects.create(
                product=product,
                piece=piece,
                quantity=piece_data['quantity']
            )
    return product


class ProductView(APIView):

    def post(self, request):
        product_serializer = ProductSerializer(data=request.data)
        if product_serializer.is_valid():
            product = product_serializer.save()
            return Response({'message': 'Produto e peças relacionadas adicionados com sucesso', 'product_id': product.id}, status=status.HTTP_201_CREATED)
        return Response(product_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, id=None):
        if id:
            try:
                # Prefetch related ProductPiece and Piece objects to optimize queries
                product = Product.objects.prefetch_related('product_pieces__piece').get(id=id)
            except Product.DoesNotExist:
                return Response({'message': 'Produto não encontrado'}, status=status.HTTP_404_NOT_FOUND)
            serializer = ProductSerializer(product)
        else:
            # Prefetch related ProductPiece and Piece objects and order by '-id' to show latest products first
            products = Product.objects.all().prefetch_related('product_pieces__piece').order_by('-id')
            serializer = ProductSerializer(products, many=True)

        return Response(serializer.data)


    def put(self, request, id):
        try:
            # Prefetch related ProductPiece and Piece objects to optimize queries
            product = Product.objects.prefetch_related('product_pieces__piece').get(id=id)
        except Product.DoesNotExist:
            return Response({'message': 'Produto não encontrado'}, status=status.HTTP_404_NOT_FOUND)

        product_serializer = ProductSerializer(product, data=request.data, partial=True)
        if product_serializer.is_valid():
            product_serializer.save()
            return Response({'message': 'Produto e peças relacionadas atualizados com sucesso'})
        return Response(product_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        try:
            product = Product.objects.get(id=id)
        except Product.DoesNotExist:
            return Response({'message': 'Produto não encontrado'}, status=status.HTTP_404_NOT_FOUND)

        product.delete()
        return Response({'message': 'Produto e peças relacionadas excluídos com sucesso'})

class CSVUploadView(APIView):
    parser_classes = [MultiPartParser]  # Handle multipart form-data for file and image uploads

    def post(self, request):
        # Get the product name from the request data
        product_name = request.data.get('product_name')
        image_file = request.FILES.get('image')  # Get the optional image

        if not product_name:
            return Response({"error": "Nome do produto é obrigatório"}, status=status.HTTP_400_BAD_REQUEST)

        # Handle CSV file upload
        file_obj = request.FILES.get('file')
        if not file_obj or not file_obj.name.endswith('.csv'):
            return Response({"error": "Tipo de arquivo inválido"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Parse the CSV to get the pieces data (using the utility function)
            pieces_data = parse_csv(file_obj)

            # Register the product and pieces via the abstract function
            product = register_product_with_pieces(product_name, pieces_data, image_file)

            return Response({'message': 'CSV processado com sucesso', 'product_id': product.id}, status=status.HTTP_201_CREATED)

        except ValueError as ve:
            return Response({"error": str(ve)}, status=status.HTTP_400_BAD_REQUEST)
        except UnicodeDecodeError:
            return Response({"error": "Failed to decode the file. Please ensure it is encoded correctly."}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
