from django.contrib import admin
from .models import Notificacion

@admin.register(Notificacion)
class NotificacionAdmin(admin.ModelAdmin):
    list_display = ('id', 'usuario_destino', 'tipo', 'asunto', 'fecha_envio', 'enviado')
    list_filter = ('tipo', 'fecha_envio', 'enviado')
    search_fields = ('usuario_destino__username', 'asunto', 'mensaje')
    date_hierarchy = 'fecha_envio'