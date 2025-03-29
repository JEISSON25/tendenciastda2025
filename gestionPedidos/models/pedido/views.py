from django.shortcuts import render

from .models import Pedido
from rest_framework import  viewsets
from .serializers import PedidoSerializers  

# Create your views here.
class PedidoViewSet(viewsets.ModelViewSet):
    queryset = Pedido.objects.all()
    serializer_class = PedidoSerializers
    