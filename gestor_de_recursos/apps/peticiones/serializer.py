from apps.peticiones.models import SolicitudRecurso
from rest_framework import serializers

class PeticionSerializer(serializers.ModelSerializer):  # Para serializar un modelo completo
    class Meta:
        model = SolicitudRecurso
        fields = ['usuario', 'recurso', 'cantidad_solicitada']