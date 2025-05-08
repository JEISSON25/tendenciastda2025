from rest_framework import serializers
from .models import Pedido
from ..itemPedido.serializers import ItemPedidoSerializer

class PedidoSerializer(serializers.ModelSerializer):
    items = ItemPedidoSerializer(many=True, read_only=True)

    class Meta:
        model = Pedido
        fields = ['id', 'cliente', 'fecha_pedido', 'estado', 'direccion_envio', 'monto_total', 'items']