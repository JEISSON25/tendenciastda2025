from rest_framework import viewsets, permissions
from .models import Tarea, Proyecto
from .serializers import TareaSerializer, ProyectoSerializer, UserSerializer
from django.contrib.auth.models import User
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from .permissions import IsAdminOrReadOnly
from django.http import HttpResponse
from reportlab.pdfgen import canvas
from io import BytesIO
from rest_framework.decorators import action
from rest_framework.decorators import api_view
from rest_framework.response import Response
from datetime import datetime

@api_view(['GET'])
def tareas_vencidas(request):
    tareas = Tarea.objects.filter(fecha_vencimiento__lt=datetime.now(), usuario=request.user)
    serializer = TareaSerializer(tareas, many=True)
    return Response(serializer.data)


    @action(detail=True, methods=['get'])
    def pdf(self, request, pk=None):
        proyecto = self.get_object()
        buffer = BytesIO()
        p = canvas.Canvas(buffer)
        p.drawString(100, 800, f"Proyecto: {proyecto.nombre}")
        p.drawString(100, 780, f"Descripción: {proyecto.descripcion or 'N/A'}")
        p.drawString(100, 760, f"Creado: {proyecto.fecha_creacion.strftime('%Y-%m-%d')}")
        p.showPage()
        p.save()
        buffer.seek(0)
        return HttpResponse(buffer, as_attachment=True, content_type='application/pdf')


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class ProyectoViewSet(viewsets.ModelViewSet):
    queryset = Proyecto.objects.all() 
    serializer_class = ProyectoSerializer
    permission_classes = [IsAdminOrReadOnly]
    
    def get_queryset(self):
        return self.queryset.filter(usuario=self.request.user)

class TareaViewSet(viewsets.ModelViewSet):
    queryset = Tarea.objects.all()  
    serializer_class = TareaSerializer

    def get_queryset(self):
        return self.queryset.filter(usuario=self.request.user)

