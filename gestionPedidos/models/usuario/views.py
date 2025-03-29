from django.shortcuts import render

from .models import Usuario
from rest_framework import  viewsets
from .serializers import UsuarioSerializers  

# Create your views here.
class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializers