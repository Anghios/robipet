# Imagen base de PHP con Apache
FROM php:8.2-apache

# Instalar extensiones PHP necesarias para SQLite
RUN apt-get update && apt-get install -y \
    sqlite3 \
    libsqlite3-dev \
    && docker-php-ext-install pdo_sqlite \
    && rm -rf /var/lib/apt/lists/*

# Configurar Apache
RUN a2enmod rewrite
COPY docker/apache.conf /etc/apache2/sites-available/000-default.conf
COPY docker/ports.conf /etc/apache2/ports.conf
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

# Crear directorio para la aplicación
WORKDIR /var/www/html

# Copiar archivos PHP del backend
COPY api/ ./api/

# Copiar archivos compilados de Astro (ya existentes en /dist)
COPY dist/ ./

# Crear directorios para SQLite y uploads, dar permisos
RUN mkdir -p /var/www/html/api && \
    mkdir -p /var/www/html/db && \
    mkdir -p /var/www/html/api/uploads && \
    chown -R www-data:www-data /var/www/html && \
    chmod -R 755 /var/www/html

# Exponer puerto 8081
EXPOSE 8081

CMD ["apache2-foreground"]