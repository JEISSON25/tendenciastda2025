from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import login, logout
from django.contrib.auth.decorators import login_required
from .models import Tarea, Proyecto
from .forms import TareaForm, ProyectoForm

def login_view(request):
    if request.user.is_authenticated:
        return redirect('tarea_list')
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            login(request, form.get_user())
            return redirect('tarea_list')
    else:
        form = AuthenticationForm()
    return render(request, 'login.html', {'form': form})

def logout_view(request):
    logout(request)
    return redirect('login')

# TAREAS
@login_required
def tarea_list(request):
    tareas = Tarea.objects.filter(usuario=request.user)
    return render(request, 'tarea_list.html', {'tareas': tareas})

@login_required
def tarea_detail(request, pk):
    tarea = get_object_or_404(Tarea, pk=pk, usuario=request.user)
    return render(request, 'tarea_detail.html', {'tarea': tarea})

@login_required
def tarea_create(request):
    if request.method == 'POST':
        form = TareaForm(request.POST)
        if form.is_valid():
            tarea = form.save(commit=False)
            tarea.usuario = request.user
            tarea.save()
            return redirect('tarea_list')
    else:
        form = TareaForm()
    return render(request, 'tarea_form.html', {'form': form, 'form_title': 'Crear Tarea'})

@login_required
def tarea_update(request, pk):
    tarea = get_object_or_404(Tarea, pk=pk, usuario=request.user)
    if request.method == 'POST':
        form = TareaForm(request.POST, instance=tarea)
        if form.is_valid():
            form.save()
            return redirect('tarea_list')
    else:
        form = TareaForm(instance=tarea)
    return render(request, 'tarea_form.html', {'form': form, 'form_title': 'Editar Tarea'})

@login_required
def tarea_delete(request, pk):
    tarea = get_object_or_404(Tarea, pk=pk, usuario=request.user)
    if request.method == 'POST':
        tarea.delete()
        return redirect('tarea_list')
    return render(request, 'tarea_confirm_delete.html', {'tarea': tarea})

# PROYECTOS
@login_required
def proyecto_list(request):
    proyectos = Proyecto.objects.filter(usuario=request.user)
    return render(request, 'proyecto_list.html', {'proyectos': proyectos})

@login_required
def proyecto_detail(request, pk):
    proyecto = get_object_or_404(Proyecto, pk=pk, usuario=request.user)
    return render(request, 'proyecto_detail.html', {'proyecto': proyecto})

@login_required
def proyecto_create(request):
    if request.method == 'POST':
        form = ProyectoForm(request.POST)
        if form.is_valid():
            proyecto = form.save(commit=False)
            proyecto.usuario = request.user
            proyecto.save()
            return redirect('proyecto_list')
    else:
        form = ProyectoForm()
    return render(request, 'proyecto_form.html', {'form': form, 'form_title': 'Crear Proyecto'})

@login_required
def proyecto_update(request, pk):
    proyecto = get_object_or_404(Proyecto, pk=pk, usuario=request.user)
    if request.method == 'POST':
        form = ProyectoForm(request.POST, instance=proyecto)
        if form.is_valid():
            form.save()
            return redirect('proyecto_list')
    else:
        form = ProyectoForm(instance=proyecto)
    return render(request, 'proyecto_form.html', {'form': form, 'form_title': 'Editar Proyecto'})

@login_required
def proyecto_delete(request, pk):
    proyecto = get_object_or_404(Proyecto, pk=pk, usuario=request.user)
    if request.method == 'POST':
        proyecto.delete()
        return redirect('proyecto_list')
    return render(request, 'proyecto_confirm_delete.html', {'proyecto': proyecto})