FROM node:18

# Establecer el directorio de trabajo en el contenedor
WORKDIR /app

# Copiar los archivos de configuración de dependencias
COPY package*.json ./

# Instalar dependencias con soporte para esbuild
RUN npm install --legacy-peer-deps --platform=linux/amd64 || npm install --force

# Copiar el resto del código
COPY . .

# Exponer el puerto para Vite
EXPOSE 5173

# Comando para iniciar la aplicación
CMD ["npm", "run", "dev"]

