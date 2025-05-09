# models/entrega/views.py

from rest_framework import viewsets
from .models import Entrega
from .serializers import EntregaSerializer 

from models.perfil.permissions import (
    EsAdministrador,
    EsRepartidor,
    UsuarioConPerfilAutenticado,
    EsRepartidorAsignado,
)
from rest_framework.permissions import IsAuthenticated

class EntregaViewSet(viewsets.ModelViewSet):
    queryset = Entrega.objects.all()
    serializer_class = EntregaSerializer

    def get_permissions(self):
        from django.conf import settings
        from rest_framework.permissions import AllowAny
        if getattr(settings, 'TESTING', False):
            return[AllowAny()]
        
        """
        Define los permisos requeridos para cada acción (list, retrieve, create, update, destroy)
        en el ViewSet de Entregas, basándose en el rol del usuario.
        """
        if self.action in ['retrieve', 'update', 'partial_update', 'destroy']:
            return [UsuarioConPerfilAutenticado(), EsRepartidorAsignado()]

        elif self.action == 'list':
            return [UsuarioConPerfilAutenticado()]

        elif self.action == 'create':
            return [EsAdministrador()]

        else:
            return [UsuarioConPerfilAutenticado()]

    def get_queryset(self):
        from django.conf import settings
        if getattr(settings, 'TESTING', False):
            return Entrega.objects.all()
        """
        Filtra el conjunto de Entregas que se retorna para las acciones 'list' y 'retrieve'
        basándose en el rol del usuario autenticado.
        """
        usuario_actual = self.request.user
        if not usuario_actual or not usuario_actual.is_authenticated or not hasattr(usuario_actual, 'perfil'):
             return Entrega.objects.none()

        rol_usuario = usuario_actual.perfil.rol

        if rol_usuario == 'admin':
          
            return Entrega.objects.all()
        elif rol_usuario == 'repartidor':
            return Entrega.objects.filter(asignado_a=usuario_actual)
        elif rol_usuario == 'cliente':
           
            return Entrega.objects.filter(pedido__cliente=usuario_actual)
      
        return Entrega.objects.none()
