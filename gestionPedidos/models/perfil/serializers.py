from rest_framework import serializers
from .models import PerfilUsuario
from django.contrib.auth.models import UserSerializer # Si quieres detalles del usuario anidados
from django.contrib.auth.models import User

class PerfilUsuarioSerializer(serializers.ModelSerializer):
    usuario = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    
    usuario_detalle = UserSerializer(read_only=True, source='usuario')

    class Meta:
        model = PerfilUsuario
        fields = ['id', 'usuario','usuario_detalle', 'rol', 'telefono']