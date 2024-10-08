# Generated by Django 5.1 on 2024-09-01 14:52

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Piece',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
                ('sizeX', models.IntegerField()),
                ('sizeY', models.IntegerField()),
                ('sizeZ', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='Product',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='ProductPiece',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantity', models.IntegerField()),
                ('piece', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='product_pieces', to='app.piece')),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='product_pieces', to='app.product')),
            ],
        ),
    ]
