from django.shortcuts import render

from rest_framework import viewsets
from .models import ItemPedido
from .serializers import ItemPedidoSerializer

class ItemPedidoViewSet(viewsets.ModelViewSet):
    queryset = ItemPedido.objects.all()
    serializer_class = ItemPedidoSerializer