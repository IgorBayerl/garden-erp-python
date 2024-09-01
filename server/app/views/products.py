from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from app.models import Product, ProductPiece
from app.serializers import ProductSerializer

@api_view(['POST'])
def add_product_with_pieces(request):
    product_serializer = ProductSerializer(data=request.data)
    if product_serializer.is_valid():
        product = product_serializer.save()
        return Response({'message': 'Product and pieces added successfully', 'product_id': product.id}, status=status.HTTP_201_CREATED)
    return Response(product_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_products(request):
    # Prefetch related ProductPiece and Piece objects
    products = Product.objects.all().prefetch_related('product_pieces__piece')
    
    # Serialize the products with the pre-fetched data
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_product(request, id):
    try:
        product = Product.objects.get(id=id)
    except Product.DoesNotExist:
        return Response({'message': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = ProductSerializer(product)
    return Response(serializer.data)

@api_view(['PUT'])
def update_product(request, id):
    try:
        product = Product.objects.get(id=id)
    except Product.DoesNotExist:
        return Response({'message': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

    product_serializer = ProductSerializer(product, data=request.data, partial=True)
    if product_serializer.is_valid():
        product_serializer.save()
        return Response({'message': 'Product and related pieces updated successfully'})
    return Response(product_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def delete_product(request, id):
    try:
        product = Product.objects.get(id=id)
    except Product.DoesNotExist:
        return Response({'message': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

    product.delete()
    return Response({'message': 'Product and related pieces deleted successfully'})
