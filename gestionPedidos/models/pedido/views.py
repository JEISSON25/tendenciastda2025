from django.shortcuts import render

from .models import Pedido
from rest_framework import  viewsets
from .serializers import PedidoSerializer

class PedidoViewSet(viewsets.ModelViewSet):
    queryset = Pedido.objects.all()
    serializer_class = PedidoSerializer
    
    
