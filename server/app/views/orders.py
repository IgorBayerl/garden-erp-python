from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from app.models import Product
import math

@api_view(['POST'])
def calculate_order_by_size(request):
    data = request.data
    order = data.get('order', 'desc')  # Default to 'desc' if not provided
    plank_size = data.get('plank_size', 3000)  # Default to 3000 if not provided

    if 'products' not in data:
        return Response({'message': 'Invalid request, products field is required'}, status=status.HTTP_400_BAD_REQUEST)

    if plank_size is None:
        return Response({'message': 'Invalid request, plank_size is required'}, status=status.HTTP_400_BAD_REQUEST)

    pieces_by_size_group = {}
    requested_products = []

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

        total_product_quantity = 0
        total_pieces = len(product.product_pieces.all())

        for product_piece in product.product_pieces.all():
            piece = product_piece.piece
            # Group by sizeY and sizeZ (ignoring sizeX)
            group_key = f"{piece.sizeY}x{piece.sizeZ}"

            if group_key not in pieces_by_size_group:
                pieces_by_size_group[group_key] = {
                    'y': piece.sizeY,
                    'z': piece.sizeZ,
                    'planks_needed_size_sum': 0,  # Sum total plank size first
                    'planks_needed': 0,  # Final rounded planks_needed after summing
                    'item_count': 0,  # Initialize the count for pieces in the group
                    'details': [],
                }

            total_quantity = product_piece.quantity * quantity

            # Sum the total size for the planks in the group without rounding yet
            pieces_by_size_group[group_key]['planks_needed_size_sum'] += piece.sizeX * total_quantity

            # Check if a detail with the same sizeX already exists in the group
            existing_detail = next((d for d in pieces_by_size_group[group_key]['details'] if d['x'] == piece.sizeX), None)

            if existing_detail:
                # If the sizeX exists, update the total quantity and add the new product detail
                existing_detail['total_quantity'] += total_quantity
                existing_detail['details'].append({
                    'product': product.name,
                    'piece': piece.name,
                    'quantity': product_piece.quantity,
                    'product_quantity': quantity,
                    'total_quantity': total_quantity
                })
                # Increment item_count by the number of new "details" added
                pieces_by_size_group[group_key]['item_count'] += 1
            else:
                # If not, create a new detail for this sizeX and increase the item count
                pieces_by_size_group[group_key]['details'].append({
                    'x': piece.sizeX,
                    'y': piece.sizeY,
                    'z': piece.sizeZ,
                    'total_quantity': total_quantity,
                    'details': [{
                        'product': product.name,
                        'piece': piece.name,
                        'quantity': product_piece.quantity,
                        'product_quantity': quantity,
                        'total_quantity': total_quantity
                    }]
                })
                # Increment the item count for this group by the number of distinct pieces added
                pieces_by_size_group[group_key]['item_count'] += 1

        # Build requested_products details
        requested_products.append({
            'product': product.name,
            'image': product.image.url if product.image else None,
            'total_quantity': quantity, # Value from the request, no calculations needed
            'pieces': total_pieces
        })

    # After calculating all groups, finalize the total planks needed by applying rounding
    for group_key, group_data in pieces_by_size_group.items():
        # Calculate the total planks needed for the group by rounding the total size sum
        group_data['planks_needed'] = math.ceil(group_data['planks_needed_size_sum'] / plank_size)

    # Determine sort order
    reverse = True if order == 'desc' else False

    def sort_function(item):
        return (item['y'], item['z'])  # Sort by 'y' and 'z'

    order_details = sorted(pieces_by_size_group.values(), key=sort_function, reverse=reverse)

    # Final response structure
    response = {
        'requested_products': requested_products,
        'order': order_details
    }

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