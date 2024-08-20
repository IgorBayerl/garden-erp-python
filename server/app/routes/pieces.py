from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
from app import db
from app.models import Piece, ProductPiece, Product
from app.schemas import PieceSchema

pieces_bp = Blueprint('pieces', __name__)

# PIECES
@pieces_bp.route('/pieces', methods=['POST'])
def add_piece():
    """
    Add a new piece to the database.

    The request should include the details of the piece in JSON format.
    The schema validation ensures that all required fields are present and correctly formatted.

    Returns:
        JSON response with a success message and the ID of the piece if it is added successfully,
        or a JSON response with validation error messages and a 400 status code if validation fails.
    """
    schema = PieceSchema()
    try:
        data = schema.load(request.json)
    except ValidationError as err:
        return jsonify(err.messages), 400
    
    piece = Piece(**data)
    db.session.add(piece)
    db.session.commit()  # This will assign the ID to the piece

    return jsonify({'message': 'Piece added successfully', 'id': piece.id})



@pieces_bp.route('/pieces', methods=['GET'])
def get_pieces():
    """
    Get a list of all pieces in the database.

    Returns:
        JSON response containing a list of all pieces.
    """
    pieces = Piece.query.all()
    piece_schema = PieceSchema(many=True)
    result = piece_schema.dump(pieces)
    return jsonify(result)

@pieces_bp.route('/pieces/<int:id>', methods=['GET'])
def get_piece_by_id(id):
    """
    Get a specific piece by its ID.

    Returns:
        JSON response containing the details of the piece if found,
        or a JSON response with an error message if the piece is not found.
    """
    piece = Piece.query.get(id)
    if not piece:
        return jsonify({'message': 'Piece not found'}), 404
    
    piece_schema = PieceSchema()
    result = piece_schema.dump(piece)
    return jsonify(result)


@pieces_bp.route('/pieces/<int:id>', methods=['PUT'])
def update_piece(id):
    """
    Update an existing piece in the database.

    The request should include the details of the piece in JSON format.
    The schema validation ensures that all required fields are present and correctly formatted.

    Returns:
        JSON response with a success message if the piece is updated successfully,
        or a JSON response with validation error messages and a 400 status code if validation fails.
    """
    schema = PieceSchema()
    piece = Piece.query.get(id)
    if not piece:
        return jsonify({'message': 'Piece not found'}), 404

    try:
        data = schema.load(request.json, partial=True)  # Allow partial updates
    except ValidationError as err:
        return jsonify(err.messages), 400

    for key, value in data.items():
        setattr(piece, key, value)

    db.session.commit()
    return jsonify({'message': 'Piece updated successfully'})


@pieces_bp.route('/pieces/<int:id>', methods=['DELETE'])
def delete_piece(id):
    """
    Attempt to delete a piece from the database by its ID.

    If there are products related to this piece, the deletion is blocked, and a list of related products is returned.

    Returns:
        JSON response with an error message and a list of related products if the piece cannot be deleted,
        or a JSON response with a success message if the piece is deleted successfully.
    """
    piece = Piece.query.get(id)
    if not piece:
        return jsonify({'message': 'Piece not found'}), 404

    # Check if there are any related products
    related_product_pieces = ProductPiece.query.filter_by(piece_id=id).all()

    if related_product_pieces:
        # There are related products, return an error with a list of those products
        related_products = []
        for product_piece in related_product_pieces:
            product = Product.query.get(product_piece.product_id)
            if product:
                related_products.append({
                    'product_id': product.id,
                    'product_name': product.name,
                    'quantity': product_piece.quantity
                })

        return jsonify({
            'message': 'Cannot delete piece because it is related to existing products.',
            'related_products': related_products
        }), 400

    # If no related products, proceed to delete the piece
    db.session.delete(piece)
    db.session.commit()
    return jsonify({'message': 'Piece deleted successfully'})


# PIECES END