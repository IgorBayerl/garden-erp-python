from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from app.serializers import ProductSerializer
from app.models import Product, Piece, ProductPiece
from django.db import transaction
import pandas as pd
from rest_framework.parsers import MultiPartParser

def register_product_with_pieces(product_name, pieces_data):
    """
    Abstract function to register a product and related pieces in a single transaction.
    - product_name: name of the product.
    - pieces_data: list of dicts with piece information (name, sizeX, sizeY, sizeZ, quantity).
    """
    with transaction.atomic():
        product = Product.objects.create(name=product_name) 

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
            return Response({'message': 'Product and pieces added successfully', 'product_id': product.id}, status=status.HTTP_201_CREATED)
        return Response(product_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, id=None):
        if id:
            try:
                # Prefetch related ProductPiece and Piece objects to optimize queries
                product = Product.objects.prefetch_related('product_pieces__piece').get(id=id)
            except Product.DoesNotExist:
                return Response({'message': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
            serializer = ProductSerializer(product)
        else:
            # Prefetch related ProductPiece and Piece objects to optimize queries
            products = Product.objects.all().prefetch_related('product_pieces__piece')
            serializer = ProductSerializer(products, many=True)
        
        return Response(serializer.data)

    def put(self, request, id):
        try:
            # Prefetch related ProductPiece and Piece objects to optimize queries
            product = Product.objects.prefetch_related('product_pieces__piece').get(id=id)
        except Product.DoesNotExist:
            return Response({'message': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

        product_serializer = ProductSerializer(product, data=request.data, partial=True)
        if product_serializer.is_valid():
            product_serializer.save()
            return Response({'message': 'Product and related pieces updated successfully'})
        return Response(product_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        try:
            product = Product.objects.get(id=id)
        except Product.DoesNotExist:
            return Response({'message': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

        product.delete()
        return Response({'message': 'Product and related pieces deleted successfully'})

class CSVUploadView(APIView):
    parser_classes = [MultiPartParser]  # Only handle multipart file uploads

    def post(self, request):
        # Get the product name from the request data
        product_name = request.data.get('product_name')

        if not product_name:
            return Response({"error": "Product name is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Handle CSV file upload
        file_obj = request.FILES.get('file')
        if not file_obj or not file_obj.name.endswith('.csv'):
            return Response({"error": "Invalid file type"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Parse the CSV file using pandas
            df = pd.read_csv(file_obj, delimiter=',', encoding='utf-8')

            # Validate the necessary columns
            required_columns = ['Peça', 'Comp.', 'Larg.', 'Esp.', 'Qtd.']
            if not all(col in df.columns for col in required_columns):
                return Response({"error": "Missing required columns in CSV"}, status=status.HTTP_400_BAD_REQUEST)

            # Prepare pieces data from CSV
            pieces_data = []
            for _, row in df.iterrows():
                piece_data = {
                    'name': row['Peça'],   # Piece name
                    'sizeX': row['Comp.'],  # Comprimento
                    'sizeY': row['Larg.'],  # Largura
                    'sizeZ': row['Esp.'],   # Espessura
                    'quantity': row['Qtd.']  # Quantity
                }
                pieces_data.append(piece_data)

            # Register the product and pieces via the abstract function
            product = register_product_with_pieces(product_name, pieces_data)

            return Response({'message': 'CSV processed successfully', 'product_id': product.id}, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
