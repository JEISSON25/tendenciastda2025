from rest_framework import serializers
from .models import PerfilUsuario
from django.contrib.auth.models import User

class PerfilUsuarioSerializer(serializers.ModelSerializer):
    username = serializers.CharField(read_only=True, source='usuario.username')
    email = serializers.EmailField(read_only=True, source='usuario.email')
    usuario_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), source='usuario', write_only=True)

    class Meta:
        model = PerfilUsuario
        fields = ['id', 'usuario_id', 'username', 'email', 'rol', 'telefono']