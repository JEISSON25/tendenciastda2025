from django.test import TestCase
from django.contrib.auth.models import User
from .models import Proyecto, Tarea
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse
import datetime

class ModelTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
        self.proyecto = Proyecto.objects.create(
            nombre='Proyecto Test',
            usuario=self.user
        )
        self.tarea = Tarea.objects.create(
            titulo='Tarea Test',
            fecha_vencimiento=datetime.datetime.now() + datetime.timedelta(days=1),
            proyecto=self.proyecto,
            usuario=self.user
        )

    def test_model_creation(self):
        self.assertEqual(Proyecto.objects.count(), 1)
        self.assertEqual(Tarea.objects.count(), 1)

class ViewTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
        self.client.force_authenticate(user=self.user)
        self.proyecto_data = {'nombre': 'Proyecto Test', 'descripcion': 'Descripción'}
        self.response = self.client.post(
            reverse('proyectos-list'),
            self.proyecto_data,
            format="json"
        )

    def test_api_can_create_proyecto(self):
        self.assertEqual(self.response.status_code, status.HTTP_201_CREATED)