from django.contrib import admin
from .models import Usuario

class UsuarioAdmin(admin.ModelAdmin):
    list_display = ('id', 'cedula', 'telefono', 'correo')   


admin.site.register(Usuario, UsuarioAdmin)
