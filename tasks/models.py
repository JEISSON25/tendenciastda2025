from django.db import models
from django.contrib.auth.models import User

class Proyecto(models.Model):
    nombre = models.CharField(max_length=200)
    descripcion = models.TextField(blank=True, null=True)
    usuario = models.ForeignKey(  # <- Esta línea NO debe tener indentación adicional
        User,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nombre

class Tarea(models.Model):
    titulo = models.CharField(max_length=200)
    descripcion = models.TextField(blank=True, null=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_vencimiento = models.DateTimeField()
    prioridad = models.CharField(max_length=1, choices=[('B', 'Baja'), ('M', 'Media'), ('A', 'Alta')])
    estado = models.CharField(max_length=1, choices=[('P', 'Pendiente'), ('E', 'En progreso'), ('C', 'Completada')])
    proyecto = models.ForeignKey(Proyecto, on_delete=models.CASCADE)
    usuario = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )

    def __str__(self):
        return self.titulo