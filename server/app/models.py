from django.db import models

class Piece(models.Model):
    name = models.CharField(max_length=50, null=False)
    sizeX = models.IntegerField(null=False)
    sizeY = models.IntegerField(null=False)
    sizeZ = models.IntegerField(null=False)

    def __str__(self):
        return self.name

class Product(models.Model):
    name = models.CharField(max_length=50, null=False)

    def __str__(self):
        return self.name

class ProductPiece(models.Model):
    product = models.ForeignKey(Product, related_name="product_pieces", on_delete=models.CASCADE)
    piece = models.ForeignKey(Piece, related_name="product_pieces", on_delete=models.CASCADE)
    quantity = models.IntegerField(null=False)
