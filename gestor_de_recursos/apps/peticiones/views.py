from django.shortcuts import render
from rest_framework import  viewsets
from apps.peticiones.models import SolicitudRecurso
from apps.peticiones.serializer import PeticionSerializer
# Create your views here.
class PeticionViewSet(viewsets.ModelViewSet):
    queryset = SolicitudRecurso.objects.all()
    serializer_class = PeticionSerializer