from django.db import models
import os
import uuid

def upload_to(_, filename):
    # Extract file extension
    ext = filename.split('.')[-1]
    # Generate unique filename
    filename = f'{uuid.uuid4()}.{ext}'
    # Return the final file path
    return os.path.join('product_images/', filename)

class Piece(models.Model):
    name = models.CharField(max_length=50, null=False)
    sizeX = models.IntegerField(null=False) # Comprimento
    sizeY = models.IntegerField(null=False) # Largura
    sizeZ = models.IntegerField(null=False) # Espessura

    def __str__(self):
        return self.name

class Product(models.Model):
    name = models.CharField(max_length=50, null=False)
    image = models.ImageField(upload_to=upload_to, null=True, blank=True)

    def __str__(self):
        return self.name

class ProductPiece(models.Model):
    product = models.ForeignKey(Product, related_name="product_pieces", on_delete=models.CASCADE)
    piece = models.ForeignKey(Piece, related_name="product_pieces", on_delete=models.CASCADE)
    quantity = models.IntegerField(null=False)
