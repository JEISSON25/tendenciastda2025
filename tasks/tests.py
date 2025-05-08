from rest_framework.test import APIClient, TestCase
from django.contrib.auth.models import User
from .models import Proyecto

class JWTAuthTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='jwtuser', password='12345678')
    
    def test_obtain_token(self):
        response = self.client.post('/api/token/', {'username': 'jwtuser', 'password': '12345678'})
        self.assertEqual(response.status_code, 200)
        self.assertIn('access', response.data)

class PDFReportTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='pdfuser', password='123456')
        self.client.force_authenticate(user=self.user)
        self.proyecto = Proyecto.objects.create(nombre='PDF Proyecto', usuario=self.user)

    def test_pdf_generation(self):
        response = self.client.get(f'/api/proyectos/{self.proyecto.id}/pdf/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response['Content-Type'], 'application/pdf')
