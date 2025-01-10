# Imagen base ligera para Python
FROM python:3.10-slim

# Crear y definir el directorio de trabajo en el contenedor
WORKDIR /app

# Copiar archivo de dependencias
COPY requirements.txt .

# Instalar las dependencias
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el código de la aplicación
COPY . .

# Configurar variables de entorno requeridas por Flask
ENV FLASK_APP=app.py
ENV FLASK_ENV=development

# Exponer el puerto usado por la API
EXPOSE 5000

# Comando para ejecutar la aplicación
CMD ["flask", "run", "--host=0.0.0.0", "--port=5000"]

