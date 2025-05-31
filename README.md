# 🧩 Sistema de Gestión de Reservas

Bienvenido al proyecto de **Gestión de Reservas**. Esta aplicación está dividida en dos partes:

# 📦 **Backend**: construido con Django y Django REST Framework.
- 💻 **Frontend**: construido con Next.js.

---

## 📁 Estructura del proyecto

root/
│
├── back-end-app/ # API REST con Django
│ └── venv/ # Entorno virtual de Python
│
└── front-end-app/ # Aplicación web con Next.js


---

## ⚙️ Requisitos previos

Antes de comenzar, asegúrate de tener instalado:

- [Python 3.10+](https://www.python.org/downloads/)
- [Node.js 18+](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/) (o la base de datos configurada en tu proyecto)
- [Git](https://git-scm.com/)
- [pip](https://pip.pypa.io/) y [venv](https://docs.python.org/3/library/venv.html) para entornos virtuales

---

## 🚀 Levantar el proyecto localmente

### 1️⃣ Backend – Django

### 2️⃣ Activar el Entorno Virtual

1. Abre tu terminal y navega a la carpeta del backend:

```bash
# macOS/Linux
source venv/bin/activate

# Windows
venv\Scripts\activate
```

### 3️⃣ Instalar Dependencias

```bash
pip install -r requirements.txt
```

### 4️⃣ Aplicar Migraciones y Cargar Datos Iniciales

```bash
python manage.py makemigrations
python manage.py migrate
```

### 5️⃣ Crear un Superusuario (Opcional)

Si deseas acceder al **panel de administración de Django**, ejecuta:

```bash
python manage.py createsuperuser
```

### 6️⃣ Ejecutar el Servidor 🚀

```bash
python manage.py runserver
```


Ahora, abre tu navegador y visita:

```
http://127.0.0.1:8000/
```

🎉 ¡Tu aplicación Backend Django está corriendo! 🎈

---

# 💻 Aplicación Frontend – Gestión de Reservas

Bienvenido al proyecto de **Gestión de Reservas** – **Frontend**.  
Esta es una aplicación construida con **Next.js**, encargada de consumir y mostrar los datos del API REST creado con Django.


## ⚙️ Requisitos previos

Antes de comenzar, asegúrate de tener instalado:

- [Node.js 18+](https://nodejs.org/)
- [npm](https://www.npmjs.com/) o [Yarn](https://yarnpkg.com/)
- [Git](https://git-scm.com/)
- Tener levantado el backend en `http://127.0.0.1:8000` si consumes APIs

---

## 🚀 Levantar el proyecto localmente

### 1️⃣ Instalar Dependencias

```bash
cd front-end-app
npm install
npm run dev
```

## ⚙️ USUARIOS DE ACCESO
```json
// ROL DE CLIENTE
{
  "username": "eliza",
  "password": "N7qcajb8"
}

// ROL DE ADMINISTRADOR
{
  "username": "sperezp",
  "password": "N7qcajb8"
}
```


