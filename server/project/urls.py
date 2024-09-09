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
from django.urls import path, re_path
from app.views.pieces import PieceView
from app.views.products import ProductView, CSVUploadView
from app.views.orders import calculate_order_by_size, calculate_order_by_product
from app.views.client import IndexView
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),

    # Pieces
    path('api/pieces/', PieceView.as_view(), name='pieces_list_create'),  # For GET (list) and POST (create)
    path('api/pieces/<int:id>/', PieceView.as_view(), name='pieces_detail_update_delete'),

    # Products  
    path('api/products/', ProductView.as_view(), name='products_list_create'),  # For GET (list) and POST (create)
    path('api/products/<int:id>/', ProductView.as_view(), name='products_detail_update_delete'),  # For GET (retrieve), PUT (update), and DELETE (delete)
    path('api/products/upload-csv/', CSVUploadView.as_view(), name='csv-upload'),

    # Orders
    path('api/orders/calculate_order_by_size/', calculate_order_by_size, name='calculate_order_by_size'),
    path('api/orders/calculate_order_by_product/', calculate_order_by_product, name='calculate_order_by_product'),
    
    # Serve media files at /media/
] + static('/media/', document_root=settings.MEDIA_ROOT) + [

    # If is not anything else, render the Client (this should be at the bottom)
    re_path(r'^.*$', IndexView.as_view(), name='index'),
]
