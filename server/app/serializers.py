from rest_framework import serializers
from myapp.models import Piece, Product, ProductPiece

class PieceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Piece
        fields = ['id', 'name', 'sizeX', 'sizeY', 'sizeZ']

class ProductPieceSerializer(serializers.ModelSerializer):
    piece_id = serializers.PrimaryKeyRelatedField(queryset=Piece.objects.all(), source='piece')

    class Meta:
        model = ProductPiece
        fields = ['piece_id', 'quantity']

class ProductSerializer(serializers.ModelSerializer):
    product_pieces = ProductPieceSerializer(many=True)

    class Meta:
        model = Product
        fields = ['id', 'name', 'product_pieces']

    def update(self, instance, validated_data):
        # Update the Product fields
        instance.name = validated_data.get('name', instance.name)
        instance.save()

        # Clear existing product pieces
        ProductPiece.objects.filter(product=instance).delete()

        # Add the new product pieces
        product_pieces_data = validated_data.pop('product_pieces')
        for product_piece_data in product_pieces_data:
            ProductPiece.objects.create(product=instance, **product_piece_data)

        return instance
    
    def create(self, validated_data):
        product_pieces_data = validated_data.pop('product_pieces')
        product = Product.objects.create(**validated_data)

        for product_piece_data in product_pieces_data:
            ProductPiece.objects.create(product=product, **product_piece_data)

        return product
