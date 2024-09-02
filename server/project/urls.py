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
from app.views.pieces import PieceView
from app.views.products import ProductView
from app.views.orders import calculate_order_by_size, calculate_order_by_product

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Pieces
    path('pieces/', PieceView.as_view(), name='pieces_list_create'),  # For GET (list) and POST (create)
    path('pieces/<int:id>/', PieceView.as_view(), name='pieces_detail_update_delete'),

    # Products
    path('products/', ProductView.as_view(), name='products_list_create'),  # For GET (list) and POST (create)
    path('products/<int:id>/', ProductView.as_view(), name='products_detail_update_delete'),  # For GET (retrieve), PUT (update), and DELETE (delete)

    # Orders
    path('orders/calculate_order_by_size/', calculate_order_by_size, name='calculate_order_by_size'),
    path('orders/calculate_order_by_product/', calculate_order_by_product, name='calculate_order_by_product'),
]
