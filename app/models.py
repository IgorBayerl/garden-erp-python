from . import db

class Piece(db.Model):
    __tablename__ = 'pieces'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    sizeX = db.Column(db.Integer, nullable=False)
    sizeY = db.Column(db.Integer, nullable=False)
    sizeZ = db.Column(db.Integer, nullable=False)
    product_pieces = db.relationship("ProductPiece", back_populates="piece")

class Product(db.Model):
    __tablename__ = 'products'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    product_pieces = db.relationship("ProductPiece", back_populates="product")

class ProductPiece(db.Model):
    __tablename__ = 'product_pieces'
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    piece_id = db.Column(db.Integer, db.ForeignKey('pieces.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    product = db.relationship("Product", back_populates="product_pieces")
    piece = db.relationship("Piece", back_populates="product_pieces")
