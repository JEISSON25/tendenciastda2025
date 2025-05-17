from apps.peticiones.models import SolicitudRecurso
from rest_framework import serializers
from django.contrib.auth.models import User


class PeticionSerializer(serializers.ModelSerializer):
    class Meta:
        model = SolicitudRecurso
        fields = '__all__'
        extra_kwargs = {
            'usuario': {'required': False},  # se asigna automáticamente
        }