# gestionPedidos/models/notificacion.py
from django.db import models
from django.contrib.auth.models import User

class Notificacion(models.Model):
    TIPO_NOTIFICACION = [
        ('pedido_creado', 'Pedido Creado'),
        ('pedido_actualizado', 'Pedido Actualizado'),
        ('entrega_asignada', 'Entrega Asignada'),
        ('entrega_actualizada', 'Entrega Actualizada'),
        ('otro', 'Otro'),
    ]
    usuario_destino = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notificaciones')
    tipo = models.CharField(max_length=50, choices=TIPO_NOTIFICACION)
    asunto = models.CharField(max_length=255)
    mensaje = models.TextField()
    fecha_envio = models.DateTimeField(auto_now_add=True)
    enviado = models.BooleanField(default=False)  
    

    def __str__(self):
        return f"Notificación a {self.usuario_destino.username} - {self.tipo} ({self.fecha_envio})"