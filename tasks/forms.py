from django import forms
from .models import Tarea, Proyecto

class TareaForm(forms.ModelForm):
    class Meta:
        model = Tarea
        exclude = ['usuario']

class ProyectoForm(forms.ModelForm):
    class Meta:
        model = Proyecto
        exclude = ['usuario']