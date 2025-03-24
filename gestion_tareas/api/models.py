from django.contrib.auth.models import User
from django.db import models

class Proyecto(models.Model):
    nombre = models.CharField(max_length=255)
    descripcion = models.TextField()
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.nombre

class Tarea(models.Model):
    nombre = models.CharField(max_length=255)
    descripcion = models.TextField()
    estado = models.CharField(max_length=50, choices=[('pendiente', 'Pendiente'), ('en progreso', 'En Progreso'), ('completado', 'Completado')])
    prioridad = models.IntegerField()
    fecha_vencimiento = models.DateField()
    proyecto = models.ForeignKey(Proyecto, on_delete=models.CASCADE)

    def __str__(self):
        return self.nombre
