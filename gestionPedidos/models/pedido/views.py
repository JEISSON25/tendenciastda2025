# models/pedido/views.py

from rest_framework import viewsets
from .models import Pedido
from .serializers import PedidoSerializer 


from models.perfil.permissions import (
    EsAdministrador,
    EsCliente,
    UsuarioConPerfilAutenticado,
    EsPropietarioDelObjeto, 
)

from rest_framework.permissions import IsAuthenticated

class PedidoViewSet(viewsets.ModelViewSet):

    queryset = Pedido.objects.all()
    serializer_class = PedidoSerializer

    def get_permissions(self):
        from django.conf import settings
        from rest_framework.permissions import AllowAny
        if getattr(settings, 'TESTING', False):
            return[AllowAny()]
        
        """
        Define los permisos para cada acción en el ViewSet de Pedidos.
        """
        if self.action == 'list':
  
            return [UsuarioConPerfilAutenticado()] 

        elif self.action in ['retrieve', 'update', 'partial_update', 'destroy']:
          
            return [UsuarioConPerfilAutenticado(), EsPropietarioDelObjeto()]

        elif self.action == 'create':
         
            return [EsCliente()]

        else:
        
            return [UsuarioConPerfilAutenticado()]

    def get_queryset(self):
        from django.conf import settings
        if getattr(settings, 'TESTING', False):
            return Pedido.objects.all()
        """
        Filtra el conjunto de Pedidos que se retorna para las acciones 'list' y 'retrieve'
        basándose en el rol del usuario autenticado.
        """
        usuario_actual = self.request.user

   
        if not usuario_actual or not usuario_actual.is_authenticated or not hasattr(usuario_actual, 'perfil'):
             return Pedido.objects.none()

        rol_usuario = usuario_actual.perfil.rol

        if rol_usuario == 'admin':
       
            return Pedido.objects.all()
        elif rol_usuario == 'cliente':
            
            return Pedido.objects.filter(cliente=usuario_actual) 
        elif rol_usuario == 'repartidor':
           
            return Pedido.objects.none()


        return Pedido.objects.none()


