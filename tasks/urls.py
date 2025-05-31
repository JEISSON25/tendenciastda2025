from django.urls import path
from . import views
from . import web_views

urlpatterns = [
    path('', views.index, name='index'),
    # Login y logout
    path('login/', web_views.login_view, name='login'),
    path('logout/', web_views.logout_view, name='logout'),

    # Tareas
    path('tareas/', web_views.tarea_list, name='tarea_list'),
    path('tareas/crear/', web_views.tarea_create, name='tarea_create'),
    path('tareas/<int:pk>/', web_views.tarea_detail, name='tarea_detail'),
    path('tareas/<int:pk>/editar/', web_views.tarea_update, name='tarea_update'),
    path('tareas/<int:pk>/eliminar/', web_views.tarea_delete, name='tarea_delete'),

    # Proyectos
    path('proyectos/', web_views.proyecto_list, name='proyecto_list'),
    path('proyectos/crear/', web_views.proyecto_create, name='proyecto_create'),
    path('proyectos/<int:pk>/', web_views.proyecto_detail, name='proyecto_detail'),
    path('proyectos/<int:pk>/editar/', web_views.proyecto_update, name='proyecto_update'),
    # path('proyectos/<int:pk>/eliminar/', web_views.proyecto_delete, name='proyecto_delete'),
    path('proyectos/<int:pk>/eliminar/', views.ProyectoDeleteView.as_view(), name='proyecto_delete'),

    path('proyectos/<int:pk>/reportes/', views.proyecto_reportes, name='proyecto_reportes'),
]