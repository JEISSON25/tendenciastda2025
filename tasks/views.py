from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from django.http import HttpResponse
from io import BytesIO
from reportlab.pdfgen import canvas
from datetime import date
from .models import Proyecto, Tarea
from .serializers import ProyectoSerializer, TareaSerializer
from django.shortcuts import render
from django.views.generic import DeleteView
from django.urls import reverse_lazy
from django.shortcuts import get_object_or_404

def proyecto_reportes(request, pk):
    proyecto = get_object_or_404(Proyecto, pk=pk)
    return render(request, 'proyecto_reportes.html', {'proyecto': proyecto})

def index(request):
    return render(request, 'index.html')

class ProyectoDeleteView(DeleteView):
    model = Proyecto
    template_name = 'proyecto_confirm_delete.html'
    success_url = reverse_lazy('proyecto_list')

class ProyectoViewSet(viewsets.ModelViewSet):
    queryset = Proyecto.objects.all()
    serializer_class = ProyectoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return self.queryset
        return self.queryset.filter(usuario=self.request.user)

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)

    @action(detail=True, methods=['get'])
    def reporte_json(self, request, pk=None):
        proyecto = self.get_object()
        tareas = Tarea.objects.filter(proyecto=proyecto)
        data = {
            "proyecto": proyecto.nombre,
            "descripcion": proyecto.descripcion,
            "fecha_creacion": proyecto.fecha_creacion,
            "tareas": [{
                "titulo": t.titulo,
                "descripcion": t.descripcion,
                "fecha_vencimiento": t.fecha_vencimiento,
                "prioridad": t.prioridad,
                "estado": t.estado
            } for t in tareas]
        }
        return Response(data)

    @action(detail=True, methods=['get'])
    def reporte_pdf(self, request, pk=None):
        proyecto = self.get_object()
        tareas = Tarea.objects.filter(proyecto=proyecto)
        buffer = BytesIO()
        p = canvas.Canvas(buffer)
        p.drawString(100, 800, f"Proyecto: {proyecto.nombre}")
        p.drawString(100, 780, f"Descripcion: {proyecto.descripcion}")
        y = 760
        for t in tareas:
            p.drawString(100, y, f"- {t.titulo} | {t.prioridad} | {t.estado}")
            y -= 20
        p.showPage()
        p.save()
        buffer.seek(0)
        return HttpResponse(buffer, content_type='application/pdf')

class TareaViewSet(viewsets.ModelViewSet):
    queryset = Tarea.objects.all()
    serializer_class = TareaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return self.queryset
        return self.queryset.filter(usuario=self.request.user)

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)

@api_view(['GET'])
def tareas_vencidas(request):
    if request.user.is_staff:
        tareas = Tarea.objects.filter(fecha_vencimiento__lt=date.today(), estado='pendiente')
    else:
        tareas = Tarea.objects.filter(usuario=request.user, fecha_vencimiento__lt=date.today(), estado='pendiente')

    data = [{
        "titulo": t.titulo,
        "descripcion": t.descripcion,
        "fecha_vencimiento": t.fecha_vencimiento,
        "prioridad": t.prioridad,
        "estado": t.estado
    } for t in tareas]

    return Response(data)