from rest_framework.viewsets import ModelViewSet

from clients.models import Client
from clients.serializers import ClientDataSerializer


# Create your views here.
class ClientView(ModelViewSet):
    queryset = Client.objects.all()
    serializer_class = ClientDataSerializer