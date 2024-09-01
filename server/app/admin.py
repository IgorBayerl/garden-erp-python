from django.contrib import admin
from .models import Piece, Product, ProductPiece  # Import your models

# Register your models here
admin.site.register(Piece)
admin.site.register(Product)
admin.site.register(ProductPiece)
