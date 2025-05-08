from rest_framework import serializers
from .models import Notificacion
from ..perfil.serializers import PerfilUsuarioSerializer
from django.contrib.auth.models import User

class NotificacionSerializer(serializers.ModelSerializer):
    usuario_destino = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    destinatario_detalle = PerfilUsuarioSerializer(read_only=True, source='usuario_destino.profile')

    class Meta:
        model = Notificacion
        fields = ['id', 'usuario_destino', 'destinatario_detalle', 'tipo', 'asunto', 'mensaje', 'fecha_envio', 'enviado']