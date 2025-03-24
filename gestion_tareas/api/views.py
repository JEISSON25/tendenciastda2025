from rest_framework import viewsets
from .models import Proyecto, Tarea
from .serializers import ProyectoSerializer, TareaSerializer
from rest_framework.permissions import IsAuthenticated
 
class ProyectoViewSet(viewsets.ModelViewSet):
    queryset = Proyecto.objects.all()
    serializer_class = ProyectoSerializer
    permission_classes = [IsAuthenticated]
 
class TareaViewSet(viewsets.ModelViewSet):
    queryset = Tarea.objects.all()
    serializer_class = TareaSerializer
    permission_classes = [IsAuthenticated]