from rest_framework import serializers
from .models import Notificacion
from django.contrib.auth.models import UserSerializer
from django.contrib.auth.models import User

class NotificacionSerializer(serializers.ModelSerializer):
    usuario_destino = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    usuario_detalle = UserSerializer(read_only=True, source='usuario_destino')

    class Meta:
        model = Notificacion
        fields = ['id', 'usuario_destino', 'usuario_detalle','tipo', 'asunto', 'mensaje', 'fecha_envio', 'enviado']