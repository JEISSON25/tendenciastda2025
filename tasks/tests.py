from django.test import TestCase
from django.contrib.auth.models import User
from .models import Proyecto, Tarea
from rest_framework.test import APIClient

class TareaTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='1234')
        self.proyecto = Proyecto.objects.create(nombre='Test', usuario=self.user)
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_crear_tarea(self):
        data = {
            'titulo': 'Tarea 1',
            'descripcion': 'desc',
            'fecha_vencimiento': '2099-01-01T12:00:00Z',
            'prioridad': 'M',
            'estado': 'P',
            'proyecto': self.proyecto.id
        }
        response = self.client.post('/api/tareas/', data, format='json')
        self.assertEqual(response.status_code, 201)