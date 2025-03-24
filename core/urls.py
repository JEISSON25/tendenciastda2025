from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from tasks import views

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'proyectos', views.ProyectoViewSet)
router.register(r'tareas', views.TareaViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]