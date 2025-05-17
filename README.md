Entregable #2 de gestor de recursos Grupo #4

Integrantes
Anderson Valencia Jiménez
Carlos Enrique Guillent Carruyo
Julián David Hernández Quintero
Miguel Ángel Correa Pérez
Marlon Adrián Torralvo Arrieta

Maneras de correr el proyecto

Backend
el backend se desarrolló con el framework django con python como lenguaje principal para la lógica.

para inicar el backend seguir estos pasos:

Inicialmente se crea un entorno virtual llamado entorno, así se definió en el equipo 
python -m venv
Luego de esto, accedemos al backend
cd .\gestor_de_recursos\ y ejecutamos los requeriments 
python -m pip install -r requirements.txt
luego realizamos los cambios requeridos por django
python manage.py makemigrations
python manage.py migrate
python manage.py runserver - para correr el servidor

Frontend 

El frontend se desarrolló con el framework react y se realizaron los cambios pertinentes para correrlo con el comendo run dev
Crear otra instancia de terminal para poder correr el front en paralelo
acceder a la carpeta del front
d .\gestor_de_recursos_fe
npm i - para instalar todas las librerías que se usaron y se definieron globalmente
npm run dev

Disfrutar de la belleza de front que nos hicimos con 3 horas de sueño en una semana laksjdkasjd
