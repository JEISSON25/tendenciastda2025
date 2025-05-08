from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from tasks import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from tasks.views import tareas_vencidas
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions

# Definición del esquema de la API para la documentación Swagger
schema_view = get_schema_view(
   openapi.Info(
      title="API de Gestión de Proyectos",
      default_version='v1',
      description="Documentación de la API para gestión de proyectos y tareas.",
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'proyectos', views.ProyectoViewSet, basename='proyecto')
router.register(r'tareas', views.TareaViewSet)

# Definición de la lista 'urlpatterns'
urlpatterns = [
    path('admin/', admin.site.urls),  # Ruta para el admin de Django
    path('api/', include(router.urls)),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/tareas-vencidas/', tareas_vencidas, name='tareas_vencidas'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
]

# Si deseas agregar más rutas más adelante, puedes hacerlo con:
# urlpatterns += [
#     path('otra-ruta/', otra_vista, name='otra_vista'),
# ]
