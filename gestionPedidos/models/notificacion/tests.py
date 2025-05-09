import pytest
from rest_framework.test import APIClient
from django.urls import reverse
from .models import Notificacion
from django.contrib.auth.models import User

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def crear_usuario_destino():
    user = User.objects.create_user(username='testuser', password='testpassword')
    return user

@pytest.fixture
def crear_notificacion(crear_usuario_destino):
    notificacion = Notificacion.objects.create(
        usuario_destino=crear_usuario_destino,
        tipo='pedido_creado',
        asunto='Nuevo Pedido Creado',
        mensaje='Se ha creado un nuevo pedido.',
        enviado=False
    )
    return notificacion

@pytest.mark.django_db
def test_crear_notificacion(api_client, crear_usuario_destino):
    url = reverse('notificacion-list')
    data = {
        "usuario_destino": crear_usuario_destino.id,
        "tipo": "pedido_actualizado",
        "asunto": "Pedido Actualizado",
        "mensaje": "El estado de su pedido ha cambiado.",
        "enviado": False
    }
    response = api_client.post(url, data, format='json')
    assert response.status_code == 201

@pytest.mark.django_db
def test_listar_notificaciones(api_client):
    url = reverse('notificacion-list')
    response = api_client.get(url)
    assert response.status_code == 200

@pytest.mark.django_db
def test_actualizar_notificacion(api_client, crear_usuario_destino, crear_notificacion):
    url = reverse('notificacion-detail', args=[crear_notificacion.id])
    data = {
        "usuario_destino": crear_usuario_destino.id,
        "tipo": "entrega_asignada",
        "asunto": "Entrega Asignada",
        "mensaje": "Su entrega ha sido asignada.",
        "enviado": True
    }
    response = api_client.put(url, data, format='json')
    assert response.status_code == 200
    assert response.data['tipo'] == data['tipo']

@pytest.mark.django_db
def test_eliminar_notificacion(api_client, crear_notificacion):
    url = reverse('notificacion-detail', args=[crear_notificacion.id])
    response = api_client.delete(url)
    assert response.status_code == 204