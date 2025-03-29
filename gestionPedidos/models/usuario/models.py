from django.db import models

# Create your models here.
from ..pedido.models import Pedido


class  Usuario (models.Model):
    pedido= models.ForeignKey(Pedido, related_name='pedidos', on_delete=models.CASCADE)
    cedula = models.CharField(max_length=15, unique=True) 
    telefono = models.CharField(max_length=15, blank=True, null=True)
    correo = models.EmailField(unique=True)

    def __str__(self):
        return f'{self.cedula} - {self.telefono} -  {self.correo}'

    

