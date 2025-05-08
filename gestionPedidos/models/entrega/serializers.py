from rest_framework import serializers
from .models import Entrega
from ..pedido.models import Pedido
from ..pedido.serializers import PedidoSerializer  
from django.contrib.auth.models import UserSerializer 
from django.contrib.auth.models import User

class EntregaSerializer(serializers.ModelSerializer):
    pedido = serializers.PrimaryKeyRelatedField(queryset=Pedido.objects.all())

    pedido_detalle = PedidoSerializer(read_only=True, source='pedido')
    asignado_a = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), allow_null=True, required=False)
    repartidor_detalle = UserSerializer(read_only=True, source='asignado_a')

    class Meta:
        model = Entrega
        fields = ['id', 'pedido','pedido_detalle', 'asignado_a', 'repartidor_detalle','estado', 'fecha_entrega', 'numero_seguimiento', 'vehiculo', 'disponible']