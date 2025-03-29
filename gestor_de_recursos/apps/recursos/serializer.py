from rest_framework import serializers
from apps.recursos.models import Recurso
class RecursoSerializer(serializers.ModelSerializer):  # Para serializar un modelo completo
    class Meta:
        model = Recurso
        fields = ['nombre', 'descripcion', 'tipo', 'cantidad_total', 'cantidad_disponible']
