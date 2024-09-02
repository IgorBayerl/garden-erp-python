from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from app.models import Product
from app.serializers import ProductSerializer

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
