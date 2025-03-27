from django.db import models

# Create your models here.

class  Pedido (models.Model):
    fecha_creacion = models.DateTimeField("Fecha", auto_now_add=True)
    direccion = models.CharField("Direccion", max_length=255)
    descripcion= models.CharField('Descripcion', max_length=300)
    precio_total = models.DecimalField("Total", max_digits=20, decimal_places=2)
    estado = models.CharField("Estado Actual", max_length=20, default='pendiente')

    def __str__(self):
        return f'{self.fecha_creacion} - {self.direccion} -  {self.descripcion} - {self.precio_total} - {self.estado}'

    

