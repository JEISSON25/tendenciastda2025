from .models import Usuario

from rest_framework import  serializers

class UsuarioSerializers(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'cedula', 'telefono', 'correo']