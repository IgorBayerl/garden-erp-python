"""
URL configuration for project project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from app.views.pieces import add_piece, get_pieces, get_piece_by_id, update_piece, delete_piece
from app.views.products import add_product_with_pieces, get_products, get_product, update_product, delete_product
from app.views.orders import calculate_order_by_size, calculate_order_by_product

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Pieces
    path('pieces/add/', add_piece, name='add_piece'),
    path('pieces/<int:id>/', get_piece_by_id, name='get_piece_by_id'),
    path('pieces/', get_pieces, name='get_pieces'),
    path('pieces/<int:id>/', update_piece, name='update_piece'),
    path('pieces/<int:id>/', delete_piece, name='delete_piece'),

    # Products
    path('products/add/', add_product_with_pieces, name='add_product_with_pieces'),
    path('products/<int:id>/', get_product, name='get_product'),
    path('products/', get_products, name='get_products'),
    path('products/<int:id>/', update_product, name='update_product'),
    path('products/<int:id>/', delete_product, name='delete_product'),

    # Orders
    path('orders/calculate_order_by_size/', calculate_order_by_size, name='calculate_order_by_size'),
    path('orders/calculate_order_by_product/', calculate_order_by_product, name='calculate_order_by_product'),
]
