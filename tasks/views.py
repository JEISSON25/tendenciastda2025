from rest_framework import viewsets, permissions
from .models import Tarea, Proyecto
from .serializers import TareaSerializer, ProyectoSerializer, UserSerializer
from django.contrib.auth.models import User
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class ProyectoViewSet(viewsets.ModelViewSet):
    queryset = Proyecto.objects.all()  # Agrega esta línea
    serializer_class = ProyectoSerializer

    def get_queryset(self):
        return self.queryset.filter(usuario=self.request.user)

class TareaViewSet(viewsets.ModelViewSet):
    queryset = Tarea.objects.all()  # Agrega esta línea
    serializer_class = TareaSerializer

    def get_queryset(self):
        return self.queryset.filter(usuario=self.request.user)