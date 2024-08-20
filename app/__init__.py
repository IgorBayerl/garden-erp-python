from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from app.db import db, migrate

from app.routes.pieces import pieces_bp
from app.routes.products import products_bp
from app.routes.orders import orders_bp

db = SQLAlchemy()
migrate = Migrate()

def create_app():
    app = Flask(__name__)
    app.config.from_object('app.config.Config')

    db.init_app(app)
    migrate.init_app(app, db)

    app.register_blueprint(pieces_bp)
    app.register_blueprint(products_bp)
    app.register_blueprint(orders_bp)

    return app
