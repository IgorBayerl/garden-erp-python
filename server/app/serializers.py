import base64
from rest_framework import serializers
from app.models import Piece, Product, ProductPiece
from django.core.files.base import ContentFile


class PieceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Piece
        fields = ['id', 'name', 'sizeX', 'sizeY', 'sizeZ']

class ProductPieceSerializer(serializers.ModelSerializer):
    piece = PieceSerializer()  # Use the PieceSerializer to dynamically create pieces

    class Meta:
        model = ProductPiece
        fields = ['piece', 'quantity']


class ProductSerializer(serializers.ModelSerializer):
    product_pieces = ProductPieceSerializer(many=True)
    image = serializers.CharField(required=False, allow_null=True)  # Image will be sent as Base64 string

    class Meta:
        model = Product
        fields = ['id', 'name', 'image', 'product_pieces']
    
    def to_representation(self, instance):
        """Override to_representation to modify image URL"""
        representation = super().to_representation(instance)

        # Add /media/ prefix if the image field exists and is not already a full URL
        if representation.get('image'):
            if not representation['image'].startswith('/media/'):
                representation['image'] = f'/media/{representation["image"]}'

        return representation

    def create(self, validated_data):
        product_pieces_data = validated_data.pop('product_pieces')
        image_base64 = validated_data.pop('image', None)  # Get the Base64 image

        # Create the product object
        product = Product.objects.create(**validated_data)

        # Convert Base64 image to image file, if exists
        if image_base64:
            format, imgstr = image_base64.split(';base64,')
            ext = format.split('/')[-1]  # Get the file extension
            product.image.save(f"{product.name}.{ext}", ContentFile(base64.b64decode(imgstr)), save=True)

        # Create related pieces and product-pieces
        for product_piece_data in product_pieces_data:
            piece_data = product_piece_data.pop('piece')
            piece, _ = Piece.objects.get_or_create(**piece_data)
            ProductPiece.objects.create(product=product, piece=piece, quantity=product_piece_data['quantity'])

        return product

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        image_base64 = validated_data.get('image', None)

        # Handle image update with Base64
        if image_base64:
            format, imgstr = image_base64.split(';base64,')
            ext = format.split('/')[-1]
            instance.image.save(f"{instance.name}.{ext}", ContentFile(base64.b64decode(imgstr)), save=True)

        instance.save()

        ProductPiece.objects.filter(product=instance).delete()

        product_pieces_data = validated_data.pop('product_pieces')
        for product_piece_data in product_pieces_data:
            piece_data = product_piece_data.pop('piece')
            piece, _ = Piece.objects.get_or_create(**piece_data)
            ProductPiece.objects.create(product=instance, piece=piece, quantity=product_piece_data['quantity'])

        return instance
