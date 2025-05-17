from django.core.management.base import BaseCommand
from django.utils.timezone import now
from tasks.models import Tarea
from django.core.mail import send_mail

class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        tareas = Tarea.objects.filter(fecha_vencimiento__date=now().date())
        for tarea in tareas:
            if tarea.usuario and tarea.usuario.email:
                send_mail(
                    'Tarea próxima a vencer',
                    f'Tu tarea "{tarea.titulo}" vence hoy.',
                    'admin@tusistema.com',
                    [tarea.usuario.email],
                    fail_silently=True
                )