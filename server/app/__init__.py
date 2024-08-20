from flask import Flask
from app.db import db, migrate
from app.models import Product, Piece  # Import your models here

def create_app():
    app = Flask(__name__)
    app.config.from_object('app.config.Config')

    db.init_app(app)
    migrate.init_app(app, db)

    # Import blueprints and other necessary components
    from app.routes.pieces import pieces_bp
    from app.routes.products import products_bp
    from app.routes.orders import orders_bp

    app.register_blueprint(pieces_bp)
    app.register_blueprint(products_bp)
    app.register_blueprint(orders_bp)

    # Subtle usage of models to avoid unused import warnings
    _ = Product, Piece

    return app
