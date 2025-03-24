from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.views import ProyectoViewSet, TareaViewSet
 
router = DefaultRouter()
router.register(r'proyectos', ProyectoViewSet)
router.register(r'tareas', TareaViewSet)
 
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]