from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
from app import db
from app.models import Piece, Product, ProductPiece
from app.schemas import PieceSchema, ProductSchema, ProductPieceSchema
from datetime import datetime

products_bp = Blueprint('products', __name__)

# PRODUCTS
@products_bp.route('/products', methods=['POST'])
def add_product_with_pieces():
    """
    Add a new product along with its associated pieces to the database.

    The request should include the details of the product and the pieces in JSON format.
    The schema validation ensures that all required fields are present and correctly formatted.

    Returns:
        JSON response with a success message and the product ID if the product is added successfully,
        or a JSON response with validation error messages and a 400 status code if validation fails.
    """
    product_schema = ProductSchema()
    product_piece_schema = ProductPieceSchema()

    try:
        # Load and validate product data
        product_data = product_schema.load(request.json.get('product'))

        # Load and validate product pieces data without product_id
        raw_pieces = request.json.get('pieces')
        product_pieces_data = []
        for raw_piece in raw_pieces:
            piece_data = product_piece_schema.load(raw_piece)
            product_pieces_data.append(piece_data)

    except ValidationError as err:
        return jsonify(err.messages), 400

    # Start a transaction
    try:
        with db.session.begin():
            # Create and add the product
            product = Product(**product_data)
            db.session.add(product)
            db.session.flush()  # Flush to get the product ID for the product_pieces

            # Create and add each product piece with the now available product_id
            for piece_data in product_pieces_data:
                piece_data['product_id'] = product.id  # Assign the product_id from the newly created product
                product_piece = ProductPiece(**piece_data)
                db.session.add(product_piece)

            db.session.commit()

        return jsonify({'message': 'Product and pieces added successfully', 'product_id': product.id})

    except Exception as e:
        db.session.rollback()  # Rollback the transaction if anything goes wrong
        return jsonify({'message': 'Failed to add product and pieces', 'error': str(e)}), 500

@products_bp.route('/products', methods=['GET'])
def get_products():
    """
    Get a list of all products in the database, including their associated pieces.

    Returns:
        JSON response containing a list of all products and their pieces.
    """
    products = Product.query.all()
    product_schema = ProductSchema(many=True)
    result = product_schema.dump(products)
    return jsonify(result)

@products_bp.route('/products/<int:id>', methods=['GET'])
def get_product(id):
    """
    Get a specific product by its ID, including its associated pieces.

    Returns:
        JSON response containing the details of the product and its pieces if found,
        or a JSON response with an error message if the product is not found.
    """
    product = Product.query.get(id)
    if not product:
        return jsonify({'message': 'Product not found'}), 404
    
    product_schema = ProductSchema()
    result = product_schema.dump(product)
    return jsonify(result)


@products_bp.route('/products/<int:id>', methods=['PUT'])
def update_product(id):
    """
    Update an existing product in the database along with its related pieces.

    The request should include the details of the product and its pieces in JSON format.
    The schema validation ensures that all required fields are present and correctly formatted.

    Returns:
        JSON response with a success message if the product and its pieces are updated successfully,
        or a JSON response with validation error messages and a 400 status code if validation fails.
    """
    product_schema = ProductSchema()
    product_piece_schema = ProductPieceSchema(many=True)
    product = Product.query.get(id)

    if not product:
        return jsonify({'message': 'Product not found'}), 404

    try:
        # Load and validate the product data
        product_data = product_schema.load(request.json.get('product'), partial=True)  # Allow partial updates
        # Load and validate the product pieces data
        product_pieces_data = product_piece_schema.load(request.json.get('pieces'))
    except ValidationError as err:
        return jsonify(err.messages), 400

    # Update the product fields
    for key, value in product_data.items():
        setattr(product, key, value)

    # Delete existing related pieces
    ProductPiece.query.filter_by(product_id=product.id).delete()

    # Reconstruct the related pieces
    for piece_data in product_pieces_data:
        piece_data['product_id'] = product.id  # Ensure the product_id is correctly set
        product_piece = ProductPiece(**piece_data)
        db.session.add(product_piece)

    db.session.commit()
    return jsonify({'message': 'Product and related pieces updated successfully'})


@products_bp.route('/products/<int:id>', methods=['DELETE'])
def delete_product(id):
    """
    Delete a product and its related ProductPiece entries from the database by its ID.

    Returns:
        JSON response with a success message if the product and its related pieces are deleted,
        or a JSON response with an error message if the product is not found.
    """
    product = Product.query.get(id)
    if not product:
        return jsonify({'message': 'Product not found'}), 404

    try:
        # Delete all related ProductPiece entries
        ProductPiece.query.filter_by(product_id=product.id).delete()

        # Delete the product itself
        db.session.delete(product)
        db.session.commit()

        return jsonify({'message': 'Product and related pieces deleted successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Failed to delete product and related pieces', 'error': str(e)}), 500



# PRODUCT END