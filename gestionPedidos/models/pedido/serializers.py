from .models import Pedido

from rest_framework import  serializers

class PedidoSerializers(serializers.ModelSerializer):
    class Meta:
        model = Pedido
        fields = ['id', 'fecha_creacion', 'direccion', 'descripcion', 'precio_total', 'estado']