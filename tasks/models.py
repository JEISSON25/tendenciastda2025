from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class Proyecto(models.Model):
    nombre = models.CharField(max_length=200)
    descripcion = models.TextField(blank=True, null=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.nombre

class Tarea(models.Model):
    PRIORIDAD_CHOICES = [
        ('B', 'Baja'),
        ('M', 'Media'),
        ('A', 'Alta'),
    ]
    
    ESTADO_CHOICES = [
        ('P', 'Pendiente'),
        ('E', 'En progreso'),
        ('C', 'Completada'),
    ]

    titulo = models.CharField(max_length=200)
    descripcion = models.TextField(blank=True, null=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_vencimiento = models.DateTimeField()
    prioridad = models.CharField(max_length=1, choices=PRIORIDAD_CHOICES, default='M')
    estado = models.CharField(max_length=1, choices=ESTADO_CHOICES, default='P')
    proyecto = models.ForeignKey(Proyecto, on_delete=models.CASCADE, related_name='tareas')
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.titulo