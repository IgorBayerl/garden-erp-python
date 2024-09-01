from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from app.models import Product

@api_view(['POST'])
def calculate_order_by_size(request):
    data = request.data
    order = data.get('order', 'asc')  # Default to 'asc' if not provided
    sort_by = data.get('sort_by', ['x', 'y', 'z'])  # Default sort by ['x', 'y', 'z'] if not provided

    if 'products' not in data:
        return Response({'message': 'Invalid request, products field is required'}, status=status.HTTP_400_BAD_REQUEST)

    pieces_by_size = {}

    for item in data['products']:
        product_id = item.get('product_id')
        quantity = item.get('quantity')
        if not product_id or not quantity:
            return Response({'message': 'Invalid product data'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Prefetch related ProductPiece and Piece objects to optimize queries
            product = Product.objects.prefetch_related('product_pieces__piece').get(id=product_id)
        except Product.DoesNotExist:
            return Response({'message': f'Product with id {product_id} not found'}, status=status.HTTP_404_NOT_FOUND)

        for product_piece in product.product_pieces.all():
            piece = product_piece.piece
            size_key = f"{piece.sizeX}x{piece.sizeY}x{piece.sizeZ}"

            if size_key not in pieces_by_size:
                pieces_by_size[size_key] = {
                    'x': piece.sizeX,
                    'y': piece.sizeY,
                    'z': piece.sizeZ,
                    'total_quantity': 0,
                    'details': []
                }
            total_quantity = product_piece.quantity * quantity
            pieces_by_size[size_key]['total_quantity'] += total_quantity
            pieces_by_size[size_key]['details'].append({
                'product': product.name,
                'piece': piece.name,
                'quantity': product_piece.quantity,
                'product_quantity': quantity,
                'total_quantity': total_quantity
            })

    # Determine sort order
    reverse = True if order == 'desc' else False

    def sort_function(item):
        return tuple(item[key] for key in sort_by)

    response = sorted(pieces_by_size.values(), key=sort_function, reverse=reverse)

    return Response(response)

@api_view(['POST'])
def calculate_order_by_product(request):
    data = request.data
    order = data.get('order', 'asc')  # Default to 'asc' if not provided

    if 'products' not in data:
        return Response({'message': 'Invalid request, products field is required'}, status=status.HTTP_400_BAD_REQUEST)

    pieces_by_product = {}

    for item in data['products']:
        product_id = item.get('product_id')
        quantity = item.get('quantity')
        if not product_id or not quantity:
            return Response({'message': 'Invalid product data'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Prefetch related ProductPiece and Piece objects to optimize queries
            product = Product.objects.prefetch_related('product_pieces__piece').get(id=product_id)
        except Product.DoesNotExist:
            return Response({'message': f'Product with id {product_id} not found'}, status=status.HTTP_404_NOT_FOUND)

        for product_piece in product.product_pieces.all():
            piece = product_piece.piece
            product_key = product.name

            if product_key not in pieces_by_product:
                pieces_by_product[product_key] = {
                    'product': product_key,
                    'total_quantity': 0,
                    'pieces': []
                }
            total_quantity = product_piece.quantity * quantity
            pieces_by_product[product_key]['total_quantity'] += total_quantity
            pieces_by_product[product_key]['pieces'].append({
                'piece': piece.name,
                'x': piece.sizeX,
                'y': piece.sizeY,
                'z': piece.sizeZ,
                'quantity': product_piece.quantity,
                'product_quantity': quantity,
                'total_quantity': total_quantity
            })

    reverse = True if order == 'desc' else False

    response = sorted(pieces_by_product.values(), key=lambda x: x['product'], reverse=reverse)

    return Response(response)