#!/bin/bash
set -e

# Crear directorio db si no existe
mkdir -p /var/www/html/db

# Ajustar permisos del directorio db para www-data
chown -R www-data:www-data /var/www/html/db
chmod -R 755 /var/www/html/db

# Crear directorio uploads si no existe y ajustar permisos
mkdir -p /var/www/html/api/uploads
chown -R www-data:www-data /var/www/html/api/uploads
chmod -R 755 /var/www/html/api/uploads

# Ejecutar el comando original de Apache
exec apache2-foreground
