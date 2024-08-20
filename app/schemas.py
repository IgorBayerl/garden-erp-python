from marshmallow import Schema, fields, validate
from marshmallow_sqlalchemy import SQLAlchemySchema, auto_field
from .models import Piece, Product, ProductPiece

class PieceSchema(SQLAlchemySchema):
    class Meta:
        model = Piece
        load_instance = False  # Disable instance loading
    
    id = auto_field(dump_only=True)
    name = fields.String(required=True, validate=validate.Length(min=1))
    sizeX = fields.Integer(required=True)
    sizeY = fields.Integer(required=True)
    sizeZ = fields.Integer(required=True)

class ProductPieceSchema(Schema):
    piece_id = fields.Integer(required=True)
    quantity = fields.Integer(required=True, validate=validate.Range(min=1))
    piece = fields.Nested(PieceSchema)  # Nest the PieceSchema to include piece details

class ProductSchema(SQLAlchemySchema):
    class Meta:
        model = Product
        load_instance = False  # Disable instance loading
    
    id = auto_field(dump_only=True)
    name = fields.String(required=True, validate=validate.Length(min=1))
    product_pieces = fields.List(fields.Nested(ProductPieceSchema))  # Include list of ProductPieceSchema
