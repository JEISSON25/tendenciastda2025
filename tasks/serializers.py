from rest_framework import serializers
from .models import Tarea, Proyecto
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class ProyectoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Proyecto
        fields = '__all__'
        extra_kwargs = {
            'usuario': {'required': False},  # Hace el campo opcional
            'descripcion': {'required': False, 'allow_blank': True}
        }

class TareaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tarea
        fields = '__all__'