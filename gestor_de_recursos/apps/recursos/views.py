from django.shortcuts import render
from rest_framework import  viewsets
from apps.recursos.models import Recurso
from apps.recursos.serializer import RecursoSerializer
# recursos/views.py
class RecursoViewSet(viewsets.ModelViewSet):
    queryset = Recurso.objects.all()
    serializer_class = RecursoSerializer