from flask import Blueprint, request, jsonify
from app.models import Product

orders_bp = Blueprint('orders', __name__)

@orders_bp.route('/orders/calculate_order_by_size', methods=['POST'])
def calculate_order_by_size():
    """
    Calculate the required pieces based on the provided product quantities and group by size.

    The request body should include:
    - `order`: The order in which to sort the results. Can be "asc" or "desc". Defaults to "asc".
    - `sort_by`: A list specifying the order of dimensions to sort by, e.g., ["x", "y", "z"].
    - `products`: A list of products with `product_id` and `quantity`.

    Returns:
        JSON response with the calculated pieces grouped by size and sorted according to the specified criteria,
        or a JSON response with an error message and a 400 status code if the request is invalid.
    """
    data = request.json
    order = data.get('order', 'asc')  # Default to 'asc' if not provided
    sort_by = data.get('sort_by', ['x', 'y', 'z'])  # Default sort by ['x', 'y', 'z'] if not provided

    if 'products' not in data:
        return jsonify({'message': 'Invalid request, products field is required'}), 400
    
    pieces_by_size = {}

    for item in data['products']:
        product_id = item.get('product_id')
        quantity = item.get('quantity')
        if not product_id or not quantity:
            return jsonify({'message': 'Invalid product data'}), 400
        
        product = Product.query.get(product_id)
        if not product:
            return jsonify({'message': f'Product with id {product_id} not found'}), 404
        
        for product_piece in product.product_pieces:
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

    # Function to dynamically sort based on specified dimensions
    def sort_function(item):
        return tuple(item[key] for key in sort_by)

    # Sort and return response based on size and order
    response = sorted(pieces_by_size.values(), key=sort_function, reverse=reverse)

    return jsonify(response)


@orders_bp.route('/orders/calculate_order_by_product', methods=['POST'])
def calculate_order_by_product():
    """
    Calculate the required pieces based on the provided product quantities and group by product.

    The request body should include:
    - `order`: The order in which to sort the results. Can be "asc" or "desc". Defaults to "asc".
    - `products`: A list of products with `product_id` and `quantity`.

    Returns:
        JSON response with the calculated pieces grouped by product and sorted by product name
        in the specified order (asc or desc), or a JSON response with an error message and a 400 status code if the request is invalid.
    """
    data = request.json
    order = data.get('order', 'asc')  # Default to 'asc' if not provided

    if 'products' not in data:
        return jsonify({'message': 'Invalid request, products field is required'}), 400
    
    pieces_by_product = {}

    for item in data['products']:
        product_id = item.get('product_id')
        quantity = item.get('quantity')
        if not product_id or not quantity:
            return jsonify({'message': 'Invalid product data'}), 400
        
        product = Product.query.get(product_id)
        if not product:
            return jsonify({'message': f'Product with id {product_id} not found'}), 404
        
        for product_piece in product.product_pieces:
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

    # Determine sort order
    reverse = True if order == 'desc' else False

    # Sort products by their names and return the response
    response = sorted(pieces_by_product.values(), key=lambda x: x['product'], reverse=reverse)

    return jsonify(response)
