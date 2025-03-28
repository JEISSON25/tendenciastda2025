from django.contrib import admin
from .models import Pedido

# Register your models here.

class PedidoAdmin(admin.ModelAdmin):
    list_display = ('id', 'fecha_creacion', 'direccion', 'descripcion', 'precio_total', 'estado')  
    ordering = ('-fecha_creacion',)  


admin.site.register(Pedido, PedidoAdmin)