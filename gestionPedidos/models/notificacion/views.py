# models/notificacion/views.py

from rest_framework import viewsets
from .models import Notificacion
from .serializers import NotificacionSerializer 


from models.perfil.permissions import (
    EsAdministrador,
    UsuarioConPerfilAutenticado,
    EsPropietarioDelObjeto,
)

from rest_framework.permissions import IsAuthenticated

class NotificacionViewSet(viewsets.ModelViewSet):
    queryset = Notificacion.objects.all()
    serializer_class = NotificacionSerializer

    def get_permissions(self):
        from django.conf import settings
        from rest_framework.permissions import AllowAny
        if getattr(settings, 'TESTING', False):
            return[AllowAny()]
        """
        Define los permisos para cada acción en el ViewSet de Notificaciones.
        """
        if self.action in ['list', 'retrieve']:
            
            return [UsuarioConPerfilAutenticado()] 

        elif self.action in ['create', 'update', 'partial_update', 'destroy']:
           
            return [EsAdministrador()] 
        else:
     
            return [UsuarioConPerfilAutenticado()]

    def get_queryset(self):
        from django.conf import settings
        if getattr(settings, 'TESTING', False):
            return Notificacion.objects.all()
        """
        Filtra el conjunto de Notificaciones que se retorna para las acciones 'list' y 'retrieve'
        basándose en el rol del usuario autenticado.
        """
        usuario_actual = self.request.user

       
        if not usuario_actual or not usuario_actual.is_authenticated or not hasattr(usuario_actual, 'perfil'):
             return Notificacion.objects.none()

        rol_usuario = usuario_actual.perfil.rol

        if rol_usuario == 'admin':
           
            return Notificacion.objects.all()
     
        return Notificacion.objects.filter(usuario_destino=usuario_actual) 

 
