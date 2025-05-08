"""
URL configuration for gestionPedidos project.

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
from django.urls import path, include
from models.pedido.views import PedidoViewSet
from models.entrega.views import EntregaViewSet
from models.itemPedido.views import ItemPedidoViewSet
from models.notificacion.views import NotificacionViewSet
from models.perfil.views import PerfilUsuarioViewSet
from models.producto.views import ProductoViewSet


from rest_framework import routers
router = routers.DefaultRouter()
router.register(r'entregas', EntregaViewSet, basename='entrega')
router.register(r'items-pedido', ItemPedidoViewSet, basename='itempedido')
router.register(r'notificaciones', NotificacionViewSet, basename='notificacion')
router.register(r'pedidos', PedidoViewSet, basename='pedido')
router.register(r'perfiles', PerfilUsuarioViewSet, basename='perfilusuario')
router.register(r'productos', ProductoViewSet, basename='producto')


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api-auth/', include('rest_framework.urls'))
    
]
