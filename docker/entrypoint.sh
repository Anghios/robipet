#!/bin/bash
set -e

# Crear directorio db si no existe
mkdir -p /var/www/html/db

# Ajustar permisos del directorio db para www-data
chown -R www-data:www-data /var/www/html/db
chmod -R 755 /var/www/html/db

# Crear directorio uploads dentro del volumen persistente de db
mkdir -p /var/www/html/db/uploads

# Si ya existe un directorio real de uploads (no symlink), mover su contenido al volumen persistente
if [ -d /var/www/html/api/uploads ] && [ ! -L /var/www/html/api/uploads ]; then
    cp -rn /var/www/html/api/uploads/* /var/www/html/db/uploads/ 2>/dev/null || true
    rm -rf /var/www/html/api/uploads
fi

# Crear symlink para que el código PHP siga usando la misma ruta
ln -sfn /var/www/html/db/uploads /var/www/html/api/uploads

# Ajustar permisos
chown -R www-data:www-data /var/www/html/db/uploads
chmod -R 755 /var/www/html/db/uploads

# Ejecutar el comando original de Apache
exec apache2-foreground
