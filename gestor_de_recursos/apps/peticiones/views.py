from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from apps.peticiones.models import SolicitudRecurso
from apps.peticiones.serializer import PeticionSerializer

class PeticionViewSet(viewsets.ModelViewSet):
    queryset = SolicitudRecurso.objects.all()
    serializer_class = PeticionSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        recurso = serializer.validated_data.get('recurso')
        if not recurso:
            raise serializers.ValidationError("Recurso no válido o no encontrado.")
        
        serializer.save(usuario=self.request.user)